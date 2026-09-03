/**
 * camera-capture.js — Camera hardware, shutter, and flash
 *
 * Responsibilities:
 *  - Request camera permission (rear-facing first)
 *  - Display live stream in <video> element
 *  - Handle shutter: flash → capture → vibrate → sound
 *  - Camera switching (front/rear)
 *  - Clean teardown of media streams
 */
(() => {
  'use strict';

  /* ─────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────── */
  let _stream       = null;
  let _videoEl      = null;
  let _flashEl      = null;
  let _facingMode   = 'environment'; // default: rear camera
  let _shutterAudio = null;
  let _shutterReady = false;

  /* ─────────────────────────────────────────────
     SHUTTER SOUND
     Inline base64 encoded minimal click sound.
     Generated as a simple oscillator-based WAV via AudioContext
     to avoid needing a file asset.
  ───────────────────────────────────────────── */
  function initShutterSound() {
    try {
      const ctx    = new (window.AudioContext || window.webkitAudioContext)();
      // Mechanical click: short burst of band-limited noise + a body thud
      _shutterAudio = ctx;
      _shutterReady = true;
    } catch (e) {
      _shutterReady = false;
    }
  }

  function playShutterSound() {
    if (!_shutterReady || !_shutterAudio) return;
    try {
      if (_shutterAudio.state === 'suspended') _shutterAudio.resume();

      const ctx = _shutterAudio;
      const t   = ctx.currentTime;

      // ── CLICK 1: Shutter opens (high transient) ──
      const buf1 = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
      const d1   = buf1.getChannelData(0);
      for (let i = 0; i < d1.length; i++) {
        const decay = Math.exp(-i / (ctx.sampleRate * 0.012));
        d1[i] = (Math.random() * 2 - 1) * decay * 0.55;
      }
      const src1 = ctx.createBufferSource();
      src1.buffer = buf1;
      const f1 = ctx.createBiquadFilter();
      f1.type            = 'highpass';
      f1.frequency.value = 3000;
      src1.connect(f1);
      f1.connect(ctx.destination);
      src1.start(t);

      // ── BODY THUD: mechanical body resonance ──
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.connect(env);
      env.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);
      env.gain.setValueAtTime(0.28, t);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.10);
      osc.start(t + 0.006);
      osc.stop(t + 0.12);

      // ── CLICK 2: Shutter closes (quieter, slightly later) ──
      const buf2 = ctx.createBuffer(1, ctx.sampleRate * 0.025, ctx.sampleRate);
      const d2   = buf2.getChannelData(0);
      for (let i = 0; i < d2.length; i++) {
        const decay = Math.exp(-i / (ctx.sampleRate * 0.007));
        d2[i] = (Math.random() * 2 - 1) * decay * 0.30;
      }
      const src2 = ctx.createBufferSource();
      src2.buffer = buf2;
      const f2 = ctx.createBiquadFilter();
      f2.type            = 'bandpass';
      f2.frequency.value = 5000;
      f2.Q.value         = 0.8;
      src2.connect(f2);
      f2.connect(ctx.destination);
      src2.start(t + 0.062);

      // ── FILM ADVANCE whirr (soft, very faint) ──
      const osc2 = ctx.createOscillator();
      const env2 = ctx.createGain();
      osc2.connect(env2);
      env2.connect(ctx.destination);
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(1800, t + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(600, t + 0.22);
      env2.gain.setValueAtTime(0.04, t + 0.08);
      env2.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc2.start(t + 0.08);
      osc2.stop(t + 0.24);

    } catch (e) {
      // Sound is optional — fail silently
    }
  }

  /* ─────────────────────────────────────────────
     CAMERA INIT
  ───────────────────────────────────────────── */
  async function startCamera(videoEl, flashEl) {
    _videoEl = videoEl;
    _flashEl = flashEl;

    // Stop any existing stream
    if (_stream) stopCamera();

    const constraints = {
      video: {
        facingMode: { ideal: _facingMode },
        width:      { ideal: 1920 },
        height:     { ideal: 1080 },
      },
      audio: false,
    };

    _stream         = await navigator.mediaDevices.getUserMedia(constraints);
    _videoEl.srcObject = _stream;
    _videoEl.setAttribute('playsinline', ''); // iOS Safari requires this
    await _videoEl.play();

    initShutterSound();

    return true;
  }

  function stopCamera() {
    if (_stream) {
      _stream.getTracks().forEach(t => t.stop());
      _stream = null;
    }
    if (_videoEl) {
      _videoEl.srcObject = null;
    }
  }

  /* ─────────────────────────────────────────────
     CAMERA SWITCH
  ───────────────────────────────────────────── */
  async function switchCamera() {
    _facingMode = _facingMode === 'environment' ? 'user' : 'environment';
    if (_videoEl) {
      await startCamera(_videoEl, _flashEl);
    }
  }

  /* ─────────────────────────────────────────────
     FLASH ANIMATION
  ───────────────────────────────────────────── */
  function triggerFlash() {
    if (!_flashEl) return;
    _flashEl.classList.remove('flash-active');
    // Force reflow to restart animation
    void _flashEl.offsetWidth;
    _flashEl.classList.add('flash-active');
    setTimeout(() => _flashEl.classList.remove('flash-active'), 280);
  }

  /* ─────────────────────────────────────────────
     VIBRATION
  ───────────────────────────────────────────── */
  function triggerVibration() {
    if ('vibrate' in navigator) {
      navigator.vibrate([30]); // single short pulse
    }
  }

  /* ─────────────────────────────────────────────
     SHUTTER — full capture sequence
     Returns { originalBlob, developedBlob }
  ───────────────────────────────────────────── */
  async function takeShot(style) {
    if (!_videoEl || !_stream) {
      throw new Error('Camera not ready');
    }

    // 1. Sound first (lowest latency)
    playShutterSound();

    // 2. Flash animation (simultaneous)
    triggerFlash();

    // 3. Vibration (simultaneous)
    triggerVibration();

    // 4. Capture frame + process effects
    const { originalBlob, developedBlob } = await window.CameraEffects.processShot(_videoEl, style);

    return { originalBlob, developedBlob };
  }

  /* ─────────────────────────────────────────────
     PERMISSION CHECK
  ───────────────────────────────────────────── */
  async function checkCameraPermission() {
    try {
      // Quick probe — no actual stream
      const result = await navigator.permissions.query({ name: 'camera' });
      return result.state; // 'granted' | 'denied' | 'prompt'
    } catch {
      return 'prompt'; // API not supported, assume we need to ask
    }
  }

  function isActive() {
    return !!_stream;
  }

  /* ─────────────────────────────────────────────
     TORCH (FLASHLIGHT)
  ───────────────────────────────────────────── */
  let _torchOn = false;

  async function toggleTorch() {
    if (!_stream) return false;
    const track = _stream.getVideoTracks()[0];
    if (!track) return false;

    try {
      const capabilities = track.getCapabilities?.() || {};
      if (!capabilities.torch) {
        console.info('[capture] Torch not supported on this device');
        return false;
      }
      _torchOn = !_torchOn;
      await track.applyConstraints({ advanced: [{ torch: _torchOn }] });
      return _torchOn;
    } catch (err) {
      console.warn('[capture] Torch toggle failed:', err);
      _torchOn = false;
      return false;
    }
  }

  function isTorchOn() { return _torchOn; }

  // Make sure torch is OFF when camera stops
  const _origStop = stopCamera;
  function stopCamera() {
    _torchOn = false;
    _origStop();
  }

  /* ─────────────────────────────────────────────
     ZOOM
  ───────────────────────────────────────────── */
  let _currentZoom = 1;
  let _zoomMin     = 1;
  let _zoomMax     = 1;
  let _zoomStep    = 0.5;

  function getZoomCapabilities() {
    if (!_stream) return null;
    const track = _stream.getVideoTracks()[0];
    if (!track) return null;
    const cap = track.getCapabilities?.() || {};
    return cap.zoom ? { min: cap.zoom.min, max: cap.zoom.max, step: cap.zoom.step } : null;
  }

  async function setZoom(level) {
    if (!_stream) return _currentZoom;
    const track = _stream.getVideoTracks()[0];
    if (!track) return _currentZoom;

    const cap = getZoomCapabilities();

    if (cap) {
      // Hardware zoom
      const clamped = Math.max(cap.min, Math.min(cap.max, level));
      try {
        await track.applyConstraints({ advanced: [{ zoom: clamped }] });
        _currentZoom = clamped;
        return _currentZoom;
      } catch (err) {
        console.warn('[capture] Hardware zoom failed, using CSS fallback');
      }
    }

    // CSS transform fallback (available everywhere)
    _currentZoom = Math.max(1, Math.min(5, level));
    if (_videoEl) {
      _videoEl.style.transform = _currentZoom > 1 ? `scale(${_currentZoom})` : '';
    }
    return _currentZoom;
  }

  async function zoomIn() {
    const cap = getZoomCapabilities();
    const step = cap ? (cap.step || 0.5) : 0.5;
    return setZoom(_currentZoom + step);
  }

  async function zoomOut() {
    const cap = getZoomCapabilities();
    const step = cap ? (cap.step || 0.5) : 0.5;
    return setZoom(_currentZoom - step);
  }

  function getCurrentZoom() { return _currentZoom; }

  /* ─────────────────────────────────────────────
     PINCH-TO-ZOOM (touch gesture)
  ───────────────────────────────────────────── */
  function initPinchZoom(containerEl) {
    let lastDist = 0;
    let baseZoom = 1;

    containerEl.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        lastDist = getPinchDist(e.touches);
        baseZoom = _currentZoom;
      }
    }, { passive: true });

    containerEl.addEventListener('touchmove', (e) => {
      if (e.touches.length !== 2) return;
      const dist = getPinchDist(e.touches);
      if (lastDist === 0) { lastDist = dist; return; }
      const scale  = dist / lastDist;
      const newZoom = baseZoom * scale;
      setZoom(newZoom);
    }, { passive: true });

    containerEl.addEventListener('touchend', () => { lastDist = 0; }, { passive: true });
  }

  function getPinchDist(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /* ─────────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────────── */
  window.CameraCapture = {
    startCamera,
    stopCamera,
    switchCamera,
    takeShot,
    triggerFlash,
    checkCameraPermission,
    isActive,
    toggleTorch,
    isTorchOn,
    setZoom,
    zoomIn,
    zoomOut,
    getCurrentZoom,
    getZoomCapabilities,
    initPinchZoom,
  };
})();

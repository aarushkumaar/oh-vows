/**
 * camera-app.js — Screen router and state machine
 *
 * Screens:
 *  landing          → name-entry → camera → roll-done → developing → final
 *  (film-picker removed — filter selection is now inside the camera screen)
 *
 * Shutter fix: never call CameraSession.getRemaining() in demo mode
 * Filter fix: CSS filter applied live on video, canvas effect on capture
 */
(() => {
  'use strict';

  /* ─────────────────────────────────────────────
     CONFIG
  ───────────────────────────────────────────── */
  function readConfig() {
    const get = (n) => {
      const el = document.querySelector(`meta[name="${n}"]`);
      return el ? el.getAttribute('content') : '';
    };
    return {
      supabaseUrl:       get('hvc-supabase-url'),
      supabaseKey:       get('hvc-supabase-key'),
      cloudinaryCloud:   get('hvc-cloudinary-cloud'),
      cloudinaryPreset:  get('hvc-cloudinary-preset'),
    };
  }

  /* ─────────────────────────────────────────────
     CSS FILTERS — real-time preview on video
     (GPU-accelerated, no canvas)
  ───────────────────────────────────────────── */
  const FILTER_CSS = {
    FILM:     'sepia(0.22) contrast(0.96) saturate(1.18) brightness(1.06) hue-rotate(4deg)',
    FLASH:    'contrast(1.28) saturate(0.92) brightness(1.12)',
    NOIR:     'grayscale(1) contrast(1.18) brightness(0.92)',
    POLAROID: 'saturate(0.78) contrast(0.88) brightness(1.07) sepia(0.14)',
  };

  /* ─────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────── */
  const screens = {};
  let _currentScreen = null;
  let _currentFilter = 'FILM';   // default
  let _remaining     = 30;
  let _shutterLocked = false;

  const el = (id) => document.getElementById(id);

  /* ─────────────────────────────────────────────
     SCREEN ROUTER
  ───────────────────────────────────────────── */
  function showScreen(name) {
    if (_currentScreen) {
      const prev = screens[_currentScreen];
      if (prev) {
        prev.classList.remove('screen--active');
        prev.classList.add('screen--out');
        setTimeout(() => prev.classList.remove('screen--out'), 500);
      }
    }
    _currentScreen = name;
    const next = screens[name];
    if (next) {
      next.classList.add('screen--active');
      next.setAttribute('aria-hidden', 'false');
      Object.keys(screens).forEach(k => {
        if (k !== name) screens[k]?.setAttribute('aria-hidden', 'true');
      });
    }
  }

  /* ─────────────────────────────────────────────
     COUNTER
  ───────────────────────────────────────────── */
  function updateCounter(n) {
    _remaining = Math.max(0, n);
    const counterEl = el('cam-counter');
    if (!counterEl) return;
    counterEl.textContent = _remaining;
    counterEl.classList.remove('counter-pop');
    void counterEl.offsetWidth;
    counterEl.classList.add('counter-pop');
  }

  /* ─────────────────────────────────────────────
     LIVE FILTER SWITCHING
  ───────────────────────────────────────────── */
  function setFilter(filter) {
    _currentFilter = filter;

    // Apply CSS filter to video (real-time preview, GPU only)
    const video = el('cam-video');
    if (video) video.style.filter = FILTER_CSS[filter] || '';

    // Update strip buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  /* ─────────────────────────────────────────────
     CAMERA SCREEN
  ───────────────────────────────────────────── */
  async function activateCameraScreen() {
    showScreen('camera');

    const videoEl = el('cam-video');
    const flashEl = el('cam-flash');

    // ── Critical fix: use local _remaining in demo mode ──
    if (window._hvcDemoMode) {
      updateCounter(_remaining);
    } else {
      updateCounter(window.CameraSession.getRemaining());
    }

    // Apply the current filter immediately to video
    setFilter(_currentFilter);

    try {
      await window.CameraCapture.startCamera(videoEl, flashEl);
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        showScreen('permission-denied');
      } else {
        const msg = el('permission-message');
        if (msg) msg.textContent = 'Camera unavailable. Please try another device.';
        showScreen('permission-denied');
      }
    }
  }

  /* ─────────────────────────────────────────────
     SHUTTER
  ───────────────────────────────────────────── */
  async function handleShutter() {
    if (_shutterLocked) return;
    if (_remaining <= 0) return;

    _shutterLocked = true;

    const roll  = window.CameraSession.getRoll();
    const style = _currentFilter;

    // 1. Capture + film effect
    let originalBlob, developedBlob;
    try {
      ({ originalBlob, developedBlob } = await window.CameraCapture.takeShot(style));
    } catch (err) {
      console.error('[camera-app] Capture failed:', err);
      _shutterLocked = false;
      return;
    }

    // 2. Scan-line (film advance feel)
    triggerScanLine();

    // ── DEMO MODE ────────────────────────────────────
    if (window._hvcDemoMode) {
      _remaining = Math.max(0, _remaining - 1);
      updateCounter(_remaining);
      showShotFeedback(_remaining);
      if (_remaining <= 0) {
        setTimeout(() => transitionToRollDone(), 1200);
        return;
      }
      setTimeout(() => { _shutterLocked = false; }, 600);
      return;
    }
    // ─────────────────────────────────────────────────

    // 3. Record shot (server-authoritative)
    let shotResult;
    try {
      shotResult = await window.CameraSession.recordShot();
    } catch (err) {
      console.error('[camera-app] recordShot failed:', err);
      shotResult = {
        shotsUsed:    _remaining - 1,
        shotsAllowed: roll?.shots_allowed || 30,
        remaining:    Math.max(0, _remaining - 1),
        isComplete:   false,
      };
    }

    // 4. Create photo DB record
    let photoId = 'local-' + Date.now();
    try {
      const photo = await window.CameraDB.createPhotoRecord({
        rollId:     roll.id,
        eventId:    roll.event_id,
        shotNumber: shotResult.shotsUsed,
        style,
      });
      photoId = photo.id;
    } catch (err) {
      console.warn('[camera-app] createPhotoRecord failed:', err);
    }

    // 5. Enqueue Cloudinary upload (non-blocking)
    window.CameraUpload.enqueue({
      id:            photoId,
      rollId:        roll?.id    || 'demo',
      eventId:       roll?.event_id || 'demo',
      shotNumber:    shotResult.shotsUsed,
      style,
      originalBlob,
      developedBlob,
    });

    // 6. Update UI
    updateCounter(shotResult.remaining);
    showShotFeedback(shotResult.remaining);

    // 7. Roll complete?
    if (shotResult.isComplete || shotResult.remaining <= 0) {
      setTimeout(() => transitionToRollDone(), 1200);
      return;
    }

    setTimeout(() => { _shutterLocked = false; }, 600);
  }

  /* ─────────────────────────────────────────────
     SCAN LINE (film advance animation)
  ───────────────────────────────────────────── */
  function triggerScanLine() {
    const line = el('cam-scanline');
    if (!line) return;
    line.classList.remove('scan-active');
    void line.offsetWidth;
    line.classList.add('scan-active');
    setTimeout(() => line.classList.remove('scan-active'), 450);
  }

  /* ─────────────────────────────────────────────
     SHOT FEEDBACK
  ───────────────────────────────────────────── */
  function showShotFeedback(remaining) {
    const fb = el('cam-feedback');
    if (!fb) return;
    fb.textContent = remaining <= 0
      ? 'Last shot.'
      : `${remaining} left`;
    fb.classList.remove('feedback-show');
    void fb.offsetWidth;
    fb.classList.add('feedback-show');
    setTimeout(() => fb.classList.remove('feedback-show'), 1800);
  }

  /* ─────────────────────────────────────────────
     ROLL DONE → DEVELOPING → FINAL
  ───────────────────────────────────────────── */
  function transitionToRollDone() {
    window.CameraCapture.stopCamera();
    showScreen('roll-done');
  }

  function startDeveloping() {
    showScreen('developing');
    animateDeveloping().then(() => {
      showScreen('final');
      renderFinalScreen();
    });
  }

  function animateDeveloping() {
    return new Promise(resolve => {
      const bar   = el('dev-bar');
      const pct   = el('dev-percent');
      const msgEl = el('dev-message');
      const steps = [
        'Winding the reel...',
        'Into the darkroom...',
        'Developing your memories...',
        'Fixing the light...',
        'Almost there...',
      ];
      let progress = 0;
      let stepIdx  = 0;

      const msgInterval = setInterval(() => {
        if (stepIdx < steps.length && msgEl) {
          msgEl.classList.remove('dev-msg-in');
          setTimeout(() => {
            msgEl.textContent = steps[stepIdx++];
            msgEl.classList.add('dev-msg-in');
          }, 180);
        }
      }, 2000);

      const interval = setInterval(() => {
        const inc = progress < 25  ? 0.35
          : progress < 65 ? 1.10
          : progress < 88 ? 0.45
          : 0.18;
        progress = Math.min(100, progress + inc);
        if (bar) bar.style.width = progress + '%';
        if (pct) pct.textContent = Math.floor(progress) + '%';
        if (progress >= 100) {
          clearInterval(interval);
          clearInterval(msgInterval);
          setTimeout(resolve, 900);
        }
      }, 60);
    });
  }

  function renderFinalScreen() {
    const roll      = window.CameraSession.getRoll();
    const guest     = window.CameraSession.getGuest();
    const rollNumEl = el('final-roll-number');
    const guestEl   = el('final-guest-name');

    if (rollNumEl && roll?.roll_number) {
      rollNumEl.textContent = 'ROLL #' + String(roll.roll_number).padStart(3, '0');
    }
    if (guestEl && guest?.name) {
      guestEl.textContent = guest.name;
    }
  }

  /* ─────────────────────────────────────────────
     BOOT
  ───────────────────────────────────────────── */
  async function boot() {
    // 1. Config
    window.HVC_CONFIG = readConfig();

    // 2. Collect screens
    ['landing', 'name-entry', 'camera', 'roll-done', 'developing', 'final', 'permission-denied']
      .forEach(name => {
        screens[name] = document.querySelector(`[data-screen="${name}"]`);
      });

    // 3. Wire all listeners
    wireListeners();

    // 4. Show landing immediately
    showScreen('landing');

    // 5. Recover pending uploads from previous session
    window.CameraUpload.recoverPendingUploads().catch(() => {});

    // 6. Demo mode check
    const cfg = window.HVC_CONFIG;
    const isDemo = !cfg.supabaseUrl || cfg.supabaseUrl.includes('REPLACE_WITH');

    if (isDemo) {
      console.info('[HVC] Demo mode (Supabase not configured)');
      window._hvcDemoMode = true;
      _remaining = 30;
      return;
    }

    // 7. Session recovery
    let sessionState;
    try {
      sessionState = await window.CameraSession.initSession();
    } catch (err) {
      console.error('[HVC] Session init failed:', err);
      sessionState = { status: 'new' };
    }

    if (sessionState.status === 'resume') {
      _currentFilter = sessionState.roll?.style || 'FILM';
      _remaining = window.CameraSession.getRemaining();
      await activateCameraScreen();
    } else if (sessionState.status === 'completed') {
      renderFinalScreen();
      showScreen('final');
    } else {
      showScreen('landing');
    }
  }

  /* ─────────────────────────────────────────────
     LISTENERS
  ───────────────────────────────────────────── */
  function wireListeners() {
    // Landing → Name entry
    el('start-btn')?.addEventListener('click', () => showScreen('name-entry'));

    // Name form → Camera
    el('name-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = el('guest-name-input');
      const name  = input?.value?.trim();
      if (!name) { input?.focus(); return; }
      if (input) input.disabled = true;

      if (!window._hvcDemoMode) {
        try {
          await window.CameraSession.startRoll({ name, style: _currentFilter });
        } catch (err) {
          console.error('[HVC] startRoll failed:', err);
        }
      } else {
        _remaining = 30;
      }

      await activateCameraScreen();
    });

    // Filter strip inside camera
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    // Shutter — support both click and touchend
    const shutter = el('cam-shutter');
    if (shutter) {
      shutter.addEventListener('click', handleShutter);
      shutter.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleShutter();
      }, { passive: false });
    }

    // Flip camera
    el('cam-switch-btn')?.addEventListener('click', () => {
      window.CameraCapture.switchCamera();
    });

    // Develop button
    el('develop-btn')?.addEventListener('click', startDeveloping);

    // Permission retry
    el('permission-retry-btn')?.addEventListener('click', activateCameraScreen);

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && _currentScreen === 'camera') {
        window.CameraCapture.stopCamera();
        showScreen('landing');
      }
    });
  }

  /* ─────────────────────────────────────────────
     START
  ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', boot);
})();

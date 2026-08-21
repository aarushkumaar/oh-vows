/**
 * Local Audio Player Module
 *
 * Plays background music triggered by the first intentional user interaction
 * (tapping the loading screen). Never autoplays without user gesture.
 *
 * Design principles:
 *  - Single instance guard — only one HTMLAudioElement ever exists
 *  - Graceful failure — invitation works perfectly without music
 *  - Minimal, elegant toggle button (♪ icon, top-right, fixed)
 *  - Music state persists across all sections (global, not per-section)
 */
(() => {
  'use strict';

  let audio      = null;
  let isPlaying  = false;
  let toggleBtn  = null;
  let shouldPlay = false; // flag to auto-start when audio is ready

  /* ─────────────────────────────────────────────────────────
     MUSIC TOGGLE BUTTON
     Injected into DOM when music initialises.
     Sits fixed top-right; feels part of the invitation.
  ───────────────────────────────────────────────────────── */
  function createToggleBtn() {
    if (toggleBtn) return;
    toggleBtn           = document.createElement('button');
    toggleBtn.id        = 'music-toggle';
    toggleBtn.type      = 'button';
    toggleBtn.setAttribute('aria-label', 'Toggle background music');
    toggleBtn.innerHTML = iconSVG(true);
    toggleBtn.addEventListener('click', toggleMusic);
    document.body.appendChild(toggleBtn);
  }

  function iconSVG(playing) {
    if (playing) {
      // Musical note — music is on
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>`;
    } else {
      // Crossed note — music is off / paused
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>`;
    }
  }

  function updateToggle() {
    if (!toggleBtn) return;
    toggleBtn.innerHTML = iconSVG(isPlaying);
    toggleBtn.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
    toggleBtn.classList.toggle('is-paused', !isPlaying);
  }

  function toggleMusic() {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.warn('[music] Playback failed:', e));
    }
  }

  function updateState() {
    isPlaying = !audio.paused;
    updateToggle();
  }

  /* ─────────────────────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────────────────────── */
  /**
   * initializeMusic()
   * Called once on first user interaction (loading screen tap).
   * Idempotent — safe to call multiple times.
   */
  function initializeMusic() {
    if (audio) return; // already initialized

    // Create the audio element
    audio = new Audio('/assets/audio/wedding-song.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.5;

    // Attach event listeners
    audio.addEventListener('play', updateState);
    audio.addEventListener('pause', updateState);
    audio.addEventListener('ended', updateState);
    
    // Attempt playback
    audio.play().then(() => {
      isPlaying = true;
      updateState();
    }).catch((e) => {
      console.warn('[music] Initial playback failed:', e);
      isPlaying = false;
      updateState();
    });

    createToggleBtn();
  }

  window.MusicModule = {
    initializeMusic,
    toggleMusic,
  };
})();

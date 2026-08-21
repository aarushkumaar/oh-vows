/**
 * main.js — Boot Sequencer, Progressive Image Loader, RSVP Renderer
 *
 * Architecture:
 *  1. Preload hero thumbnail (tiny WebP, ~30KB)
 *  2. Show loading stamp overlay
 *  3. After hero thumbnail loads + min splash time, overlay shows "Touch to Enter"
 *  4. User taps → premium stamp-opening iris transition → music starts → main site revealed
 *  5. Progressive loader upgrades each img.progressive-img to full-res via IntersectionObserver
 *  6. Hard safety cap: 25s of inaction auto-dismisses without music
 */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────
     DOM REFS
  ───────────────────────────────────────────── */
  let loadingOverlay;

  /* ─────────────────────────────────────────────
     CONFIG
  ───────────────────────────────────────────── */
  const MIN_SPLASH_MS = 700;   // minimum time preloader is visible
  const TAP_TIMEOUT   = 25000; // auto-dismiss if user doesn't tap within this time

  /* ─────────────────────────────────────────────
     PRELOAD — hero thumbnail ONLY
  ───────────────────────────────────────────── */
  function preloadHeroThumb() {
    return new Promise((resolve) => {
      const src = '/assets/images/thumbs/hero-palace.webp';
      const img = new Image();
      img.onload  = () => resolve();
      img.onerror = () => { console.warn('[main] Hero thumbnail failed:', src); resolve(); };
      img.src = src;
    });
  }

  /* ─────────────────────────────────────────────
     STAMP → INVITATION TRANSITION
     Cinematic iris/seal-opening reveal.
     The stamp breathes, then the dark overlay
     irises away from the stamp's position —
     like a wax seal cracking open.
  ───────────────────────────────────────────── */
  function runStampTransition(onComplete) {
    const stamp    = document.getElementById('loading-stamp');
    const identity = document.getElementById('loading-identity');
    const tapHint  = document.getElementById('loading-tap-hint');

    if (prefersReduced || !window.gsap) {
      // Graceful fallback: simple fade
      if (loadingOverlay) {
        loadingOverlay.style.transition = 'opacity 0.45s ease';
        loadingOverlay.style.opacity   = '0';
        setTimeout(() => {
          loadingOverlay.style.display = 'none';
          if (onComplete) onComplete();
        }, 480);
      } else if (onComplete) {
        onComplete();
      }
      return;
    }

    const tl = gsap.timeline({ onComplete: () => {
      if (loadingOverlay) loadingOverlay.style.display = 'none';
      if (onComplete) onComplete();
    }});

    // Phase 1: stamp breathes + warms
    tl.to(stamp, {
      scale:    1.07,
      filter:   'drop-shadow(0 14px 52px rgba(201,162,39,0.9)) drop-shadow(0 4px 28px rgba(255,210,60,0.75))',
      duration: 0.30,
      ease:     'power2.out',
    }, 0);

    // Phase 2: identity + hint dissolve out quickly
    tl.to([identity, tapHint].filter(Boolean), {
      opacity:  0,
      y:        -6,
      duration: 0.20,
      ease:     'power2.in',
    }, 0);

    // Phase 3: iris close — overlay shrinks away from stamp center
    tl.to(loadingOverlay, {
      clipPath: 'circle(0% at 50% 44%)',
      duration: 0.70,
      ease:     'power3.in',
    }, 0.16);
  }

  /* ─────────────────────────────────────────────
     DISMISS PRELOADER
     Waits for user's tap gesture (so music can
     start, since browsers require user interaction).
     Falls back to auto-dismiss after TAP_TIMEOUT.
  ───────────────────────────────────────────── */
  function dismissPreloader() {
    if (!loadingOverlay) return Promise.resolve();

    return new Promise((resolve) => {
      if (prefersReduced) {
        loadingOverlay.style.display = 'none';
        resolve();
        return;
      }

      // Show "Touch to Enter" hint
      loadingOverlay.classList.add('is-ready');

      let done = false;

      const complete = (withMusic) => {
        if (done) return;
        done = true;
        loadingOverlay.removeEventListener('click',    onTap);
        loadingOverlay.removeEventListener('touchend', onTap);
        clearTimeout(autoTimer);

        // Start music on genuine user interaction
        if (withMusic && window.MusicModule?.initializeMusic) {
          window.MusicModule.initializeMusic();
        }

        runStampTransition(resolve);
      };

      const onTap = () => complete(true);
      loadingOverlay.addEventListener('click',    onTap);
      loadingOverlay.addEventListener('touchend', onTap, { passive: true });

      // Safety net: auto-dismiss after TAP_TIMEOUT (no music — browser blocks autoplay)
      const autoTimer = setTimeout(() => complete(false), TAP_TIMEOUT);
    });
  }

  /* ─────────────────────────────────────────────
     RSVP RENDERER
     Populates #rsvp-family-display from InvitationConfig.
  ───────────────────────────────────────────── */
  function renderRSVP() {
    const display = document.getElementById('rsvp-family-display');
    if (!display) return;

    const rsvp = window.InvitationConfig?.getRSVPConfig();
    if (!rsvp) return;

    display.innerHTML = `
      <div class="gold-rule" style="width:50px;opacity:0.6;"></div>
      <p class="rsvp-family-title">${rsvp.title}</p>
      <p class="rsvp-family-names">${rsvp.names}</p>
      <p class="rsvp-family-special">${rsvp.specialMention}</p>
    `;
  }

  /* ─────────────────────────────────────────────
     PROGRESSIVE IMAGE LOADER
     img.progressive-img:
       src       = thumbnail (already visible)
       data-full = full-res path (loaded on demand)
  ───────────────────────────────────────────── */
  function upgradeImage(img) {
    const fullSrc = img.dataset.full;
    if (!fullSrc)                          return;
    if (img.dataset.pgState === 'done')    return;
    if (img.dataset.pgState === 'loading') return;

    img.dataset.pgState = 'loading';

    const loader    = new Image();
    loader.src      = fullSrc;
    loader.onload   = () => {
      img.src = fullSrc;
      img.classList.add('is-loaded');
      img.dataset.pgState = 'done';
    };
    loader.onerror  = () => {
      console.warn('[main] Full-res load failed:', fullSrc);
      img.dataset.pgState = 'error';
    };
  }

  function initProgressiveImages() {
    const allProgressive = document.querySelectorAll('img.progressive-img[data-full]');
    if (!allProgressive.length) return;

    const heroImg = document.getElementById('hero-img');
    if (heroImg) upgradeImage(heroImg);

    if (!('IntersectionObserver' in window)) {
      allProgressive.forEach(upgradeImage);
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          upgradeImage(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '450px 0px', threshold: 0 });

    allProgressive.forEach(img => {
      if (img !== heroImg) observer.observe(img);
    });
  }

  /* ─────────────────────────────────────────────
     BOOT SEQUENCE
  ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', async () => {
    loadingOverlay = document.getElementById('loading-overlay');

    // Set initial clip-path for iris transition
    if (loadingOverlay && !prefersReduced) {
      loadingOverlay.style.clipPath = 'circle(150% at 50% 44%)';
    }

    const startT = Date.now();

    try {
      // 1. Preload flower petal assets
      if (window.AnimationsModule?.preloadFlowers) {
        await window.AnimationsModule.preloadFlowers();
      }

      // 2. Preload hero thumbnail
      await preloadHeroThumb();

      // 3. Build dynamic DOM (dollhouse cards & carousel)
      if (window.EventsModule?.buildDollhouseCards) window.EventsModule.buildDollhouseCards();
      if (window.EventsModule?.buildCarousel)       window.EventsModule.buildCarousel();

      // 4. Start progressive image loader (non-blocking)
      initProgressiveImages();

      // 5. Render RSVP from invitation config
      renderRSVP();

      // 6. Honour minimum splash duration
      const elapsed = Date.now() - startT;
      if (elapsed < MIN_SPLASH_MS) {
        await new Promise(r => setTimeout(r, MIN_SPLASH_MS - elapsed));
      }

    } catch (err) {
      console.error('[main] Boot error (continuing):', err);
    }

    // 7. Dismiss preloader — waits for tap, then runs stamp transition
    await dismissPreloader();

    // 8. Init interactive & scroll animations
    if (window.AnimationsModule?.initHeroScrollEffects) window.AnimationsModule.initHeroScrollEffects();
    if (window.AnimationsModule?.initFloating)          window.AnimationsModule.initFloating();
    if (window.AnimationsModule?.initFramesAnimation)   window.AnimationsModule.initFramesAnimation();
    if (window.AnimationsModule?.initPolaroidDrift)     window.AnimationsModule.initPolaroidDrift();
    if (window.EventsModule?.initDollhouseAnimation)    window.EventsModule.initDollhouseAnimation();
    if (window.AnimationsModule?.initFlowers)           window.AnimationsModule.initFlowers();
    if (window.CountdownModule?.init)                   window.CountdownModule.init();
    if (window.EventsModule?.handleInitialHash)         window.EventsModule.handleInitialHash();

    // 9. Refresh ScrollTrigger after dynamic DOM built
    if (window.ScrollTrigger) {
      setTimeout(() => ScrollTrigger.refresh(), 300);
    }
  });
})();

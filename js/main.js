/**
 * main.js — Boot Sequencer & Progressive Image Loader
 *
 * Architecture:
 *  1. Preload ONLY the hero thumbnail (tiny WebP, ~30KB)
 *  2. Show preloader while that single asset loads
 *  3. Fade out preloader → hero is already present in DOM
 *  4. Progressive loader upgrades each img.progressive-img to full-res
 *     via IntersectionObserver — no image blocks initial load
 *  5. Hard safety cap: 4 s max on loader, even if something hangs
 */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────
     DOM REFS — gathered after DOMContentLoaded
  ───────────────────────────────────────────── */
  let loadingOverlay;

  /* ─────────────────────────────────────────────
     CONFIG
  ───────────────────────────────────────────── */
  const MIN_SPLASH_MS = 700;  // minimum time preloader is visible (feel polished)
  const MAX_SPLASH_MS = 4000; // absolute hard cap — never trap the user

  /* ─────────────────────────────────────────────
     PRELOAD — hero thumbnail ONLY
     Full-res images load later via initProgressiveImages()
  ───────────────────────────────────────────── */
  function preloadHeroThumb() {
    return new Promise((resolve) => {
      const src = 'assets/images/thumbs/hero-palace.webp';
      const img = new Image();
      // Always resolve — a failed thumb must not block the site
      img.onload  = () => resolve();
      img.onerror = () => { console.warn('[main] Hero thumbnail failed to load:', src); resolve(); };
      img.src = src;
    });
  }

  /* ─────────────────────────────────────────────
     DISMISS PRELOADER
     Fades out #loading-overlay, then hides it
  ───────────────────────────────────────────── */
  function dismissPreloader() {
    if (!loadingOverlay) return Promise.resolve();

    return new Promise((resolve) => {
      if (prefersReduced) {
        loadingOverlay.style.display = 'none';
        resolve();
        return;
      }

      // Use GSAP if available, otherwise CSS transition fallback
      if (window.gsap) {
        gsap.to(loadingOverlay, {
          opacity: 0,
          duration: 0.55,
          ease: 'power2.inOut',
          onComplete: () => {
            loadingOverlay.style.display = 'none';
            resolve();
          },
        });
      } else {
        loadingOverlay.style.transition = 'opacity 0.55s ease';
        loadingOverlay.style.opacity   = '0';
        setTimeout(() => {
          loadingOverlay.style.display = 'none';
          resolve();
        }, 580);
      }
    });
  }

  /* ─────────────────────────────────────────────
     PROGRESSIVE IMAGE LOADER
     img.progressive-img:
       src       = thumbnail (already visible)
       data-full = full-res path (loaded on demand)

     Hero full-res is triggered immediately after preloader
     All others use IntersectionObserver (450px look-ahead)
  ───────────────────────────────────────────── */
  function upgradeImage(img) {
    const fullSrc = img.dataset.full;
    if (!fullSrc)                         return;
    if (img.dataset.pgState === 'done')   return;
    if (img.dataset.pgState === 'loading') return;

    img.dataset.pgState = 'loading';

    const loader = new Image();
    loader.src = fullSrc;
    loader.onload = () => {
      img.src = fullSrc;
      img.classList.add('is-loaded');
      img.dataset.pgState = 'done';
    };
    loader.onerror = () => {
      // Keep showing the thumbnail — never break-image icon
      console.warn('[main] Full-res load failed:', fullSrc);
      img.dataset.pgState = 'error';
    };
  }

  function initProgressiveImages() {
    const allProgressive = document.querySelectorAll('img.progressive-img[data-full]');
    if (!allProgressive.length) return;

    // Hero image: start loading full-res immediately (high priority)
    const heroImg = document.getElementById('hero-img');
    if (heroImg) upgradeImage(heroImg);

    if (!('IntersectionObserver' in window)) {
      // Fallback: upgrade all immediately
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

    const startT = Date.now();

    // Hard cap: if anything hangs beyond MAX_SPLASH_MS, force-dismiss
    const hardCapTimer = setTimeout(() => {
      console.warn('[main] Hard cap reached — forcing preloader dismissal');
      if (loadingOverlay) {
        loadingOverlay.style.transition = 'opacity 0.4s ease';
        loadingOverlay.style.opacity   = '0';
        setTimeout(() => { loadingOverlay.style.display = 'none'; }, 420);
      }
    }, MAX_SPLASH_MS);

    try {
      // 1. Optional: preload flower petal assets (from AnimationsModule)
      if (window.AnimationsModule?.preloadFlowers) {
        await window.AnimationsModule.preloadFlowers();
      }

      // 2. Preload hero thumbnail only — everything else loads progressively
      await preloadHeroThumb();

      // 3. Build dynamic DOM (dollhouse cards & carousel) with progressive img markup
      if (window.EventsModule?.buildDollhouseCards) window.EventsModule.buildDollhouseCards();
      if (window.EventsModule?.buildCarousel)       window.EventsModule.buildCarousel();

      // 4. Start progressive image loader (non-blocking — runs in background)
      initProgressiveImages();

      // 5. Honour minimum splash duration for visual polish
      const elapsed = Date.now() - startT;
      if (elapsed < MIN_SPLASH_MS) {
        await new Promise(r => setTimeout(r, MIN_SPLASH_MS - elapsed));
      }

    } catch (err) {
      console.error('[main] Boot error (continuing anyway):', err);
    }

    // Cancel hard cap (we're about to dismiss ourselves)
    clearTimeout(hardCapTimer);

    // 6. Dismiss preloader — hero text is already in the DOM, no GSAP entrance needed
    await dismissPreloader();

    // 7. Init interactive & scroll animations
    if (window.AnimationsModule?.initHeroScrollEffects) window.AnimationsModule.initHeroScrollEffects();
    if (window.AnimationsModule?.initFloating)          window.AnimationsModule.initFloating();
    if (window.AnimationsModule?.initFramesAnimation)   window.AnimationsModule.initFramesAnimation();
    if (window.AnimationsModule?.initPolaroidDrift)     window.AnimationsModule.initPolaroidDrift();
    if (window.EventsModule?.initDollhouseAnimation)    window.EventsModule.initDollhouseAnimation();
    if (window.AnimationsModule?.initFlowers)           window.AnimationsModule.initFlowers();
    if (window.CountdownModule?.init)                   window.CountdownModule.init();
    if (window.EventsModule?.handleInitialHash)         window.EventsModule.handleInitialHash();

    // 8. Refresh ScrollTrigger after dynamic DOM has been built
    if (window.ScrollTrigger) {
      setTimeout(() => ScrollTrigger.refresh(), 300);
    }
  });
})();

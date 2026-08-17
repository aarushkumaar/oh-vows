/**
 * Main Application Boot & Initialization
 * Orchestrates preloading, reveal sequence, progressive image loading, and modules
 */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────────
     DOM REFS
  ────────────────────────────────────────── */
  const loadingOverlay = document.getElementById('loading-overlay');

  /* ──────────────────────────────────────────
     CRITICAL ASSET PRELOAD (Lightweight thumbnail only)
  ────────────────────────────────────────── */
  const MIN_MS = 400;
  const PRELOAD = [
    'assets/images/thumbs/hero-palace.webp',
  ];
  let preloadCount = 0;

  function preloadAssets() {
    return new Promise((resolve) => {
      if (!PRELOAD.length) { resolve(); return; }
      PRELOAD.forEach((src) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          preloadCount++;
          if (preloadCount >= PRELOAD.length) resolve();
        };
        img.src = src;
      });
    });
  }

  /* ──────────────────────────────────────────
     REVEAL ANIMATION (Smooth, Zero White Flash)
  ────────────────────────────────────────── */
  function playRevealAnimation() {
    return new Promise((resolve) => {
      if (!loadingOverlay) { resolve(); return; }
      if (prefersReduced) {
        loadingOverlay.style.display = 'none';
        resolve();
        return;
      }
      gsap.to(loadingOverlay, {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          loadingOverlay.style.display = 'none';
          resolve();
        }
      });
    });
  }

  /* ──────────────────────────────────────────
     PROGRESSIVE IMAGE LOADING SYSTEM
     1. Display small, lightweight thumbnail immediately
     2. Preload full-res image when near viewport via IntersectionObserver
     3. Subtle smooth transition with ZERO layout shift
  ────────────────────────────────────────── */
  function initProgressiveImages() {
    const progImgs = document.querySelectorAll('img.progressive-img[data-full]');
    if (!progImgs.length) return;

    function loadFullImage(img) {
      const fullSrc = img.dataset.full;
      if (!fullSrc || img.dataset.loaded === 'true' || img.dataset.loaded === 'loading') return;
      img.dataset.loaded = 'loading';

      const fullImg = new Image();
      fullImg.src = fullSrc;
      fullImg.onload = () => {
        img.src = fullSrc;
        img.classList.add('is-loaded');
        img.dataset.loaded = 'true';
      };
      fullImg.onerror = () => {
        img.dataset.loaded = 'error';
      };
    }

    // Hero full-res image starts background loading right after initial reveal
    const heroImg = document.querySelector('#hero-img.progressive-img');
    if (heroImg) {
      loadFullImage(heroImg);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadFullImage(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '450px 0px', // Begin loading 450px before entering viewport
        threshold: 0.01,
      });

      progImgs.forEach(img => {
        if (img !== heroImg) observer.observe(img);
      });
    } else {
      progImgs.forEach(loadFullImage);
    }
  }

  /* ──────────────────────────────────────────
     BOOT SEQUENCE
  ────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', async () => {
    const startT = Date.now();

    // 1. Preload flower petal assets & critical lightweight hero thumbnail
    if (window.AnimationsModule?.preloadFlowers) {
      await window.AnimationsModule.preloadFlowers();
    }
    await preloadAssets();

    // Ensure brief graceful minimum splash time
    const elapsed = Date.now() - startT;
    if (elapsed < MIN_MS) {
      await new Promise(r => setTimeout(r, MIN_MS - elapsed));
    }

    // 2. Build dynamic DOM content (cards with progressive thumbnails)
    if (window.EventsModule?.buildDollhouseCards) {
      window.EventsModule.buildDollhouseCards();
    }
    if (window.EventsModule?.buildCarousel) {
      window.EventsModule.buildCarousel();
    }

    // 3. Initialize progressive image loader
    initProgressiveImages();

    // 4. Play preloader dissolution (Hero text is already stable and visible)
    await playRevealAnimation();

    // 5. Init interactive & scroll animation modules
    if (window.AnimationsModule?.initHeroScrollEffects) {
      window.AnimationsModule.initHeroScrollEffects();
    }
    if (window.AnimationsModule?.initFloating) {
      window.AnimationsModule.initFloating();
    }
    if (window.AnimationsModule?.initFramesAnimation) {
      window.AnimationsModule.initFramesAnimation();
    }
    if (window.EventsModule?.initDollhouseAnimation) {
      window.EventsModule.initDollhouseAnimation();
    }
    if (window.AnimationsModule?.initFlowers) {
      window.AnimationsModule.initFlowers();
    }
    if (window.CountdownModule?.init) {
      window.CountdownModule.init();
    }
    if (window.EventsModule?.handleInitialHash) {
      window.EventsModule.handleInitialHash();
    }

    // Refresh ScrollTrigger after DOM build
    if (window.ScrollTrigger) {
      setTimeout(() => ScrollTrigger.refresh(), 300);
    }
  });
})();

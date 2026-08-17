/**
 * Main Application Boot & Initialization
 * Orchestrates preloading, reveal sequence, background caching, and modules
 */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile       = window.innerWidth < 768;

  /* ──────────────────────────────────────────
     DOM REFS
  ────────────────────────────────────────── */
  const loadingOverlay = document.getElementById('loading-overlay');
  const loadingBarFill = document.getElementById('loading-bar-fill');
  const loadingText    = document.getElementById('loading-text');
  const lightBloom     = document.getElementById('light-bloom');
  const heroTextGroup  = document.getElementById('hero-text-group');
  const heroScrollHint = document.getElementById('hero-scroll-hint');

  /* ──────────────────────────────────────────
     CRITICAL ASSET PRELOAD
  ────────────────────────────────────────── */
  const MIN_MS = 900;
  // Only preload the critical above-the-fold hero image.
  // Background images load on-demand via CSS when sections scroll into view.
  const PRELOAD = [
    'assets/images/hero/hero-palace.png',
  ];
  let preloadCount = 0;

  function preloadAssets() {
    return new Promise((resolve) => {
      if (!PRELOAD.length) {
        resolve();
        return;
      }
      PRELOAD.forEach((src) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          preloadCount++;
          const pct = Math.round((preloadCount / PRELOAD.length) * 100);
          if (loadingBarFill) loadingBarFill.style.width = pct + '%';
          if (loadingText) {
            loadingText.textContent = pct < 100
              ? 'Preparing your invitation\u2026 ' + pct + '%'
              : 'Ready \u2736';
          }
          if (preloadCount >= PRELOAD.length) resolve();
        };
        img.src = src;
      });
    });
  }

  /* ──────────────────────────────────────────
     REVEAL BLOOM
  ────────────────────────────────────────── */
  function playRevealAnimation() {
    if (prefersReduced) {
      if (loadingOverlay) loadingOverlay.style.display = 'none';
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (loadingOverlay) loadingOverlay.style.display = 'none';
          resolve();
        }
      });
      tl.to(loadingOverlay, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '+=0.1')
        .to(lightBloom,     { opacity: 0.85, duration: 0.3, ease: 'power2.out' }, '-=0.35')
        .to(lightBloom,     { opacity: 0, duration: 0.9, ease: 'power2.inOut' });
    });
  }

  /* ──────────────────────────────────────────
     HERO TEXT ENTRANCE
  ────────────────────────────────────────── */
  function playHeroTextEntrance() {
    if (prefersReduced || !heroTextGroup) return;
    const eyebrow = heroTextGroup.querySelector('.eyebrow');
    const title   = heroTextGroup.querySelector('.display-title');
    const tagline = heroTextGroup.querySelector('.tagline');
    const rule    = heroTextGroup.querySelector('.gold-rule');

    gsap.set([eyebrow, title, tagline, rule], { opacity: 0, y: 24 });
    if (heroScrollHint) gsap.set(heroScrollHint, { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.35 });
    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' })
      .to(rule,    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4')
      .to(title,   { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.3')
      .to(tagline, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5');

    if (heroScrollHint) {
      tl.to(heroScrollHint, { opacity: 0.85, duration: 0.6, ease: 'power2.out' }, '-=0.2');
    }
  }

  /* ──────────────────────────────────────────
     BOOT SEQUENCE
  ────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', async () => {
    const startT = Date.now();

    // 1. Preload flower petal assets & critical backgrounds
    if (window.AnimationsModule?.preloadFlowers) {
      await window.AnimationsModule.preloadFlowers();
    }
    await preloadAssets();

    // Ensure minimum splash time
    const elapsed = Date.now() - startT;
    if (elapsed < MIN_MS) {
      await new Promise(r => setTimeout(r, MIN_MS - elapsed));
    }

    // 2. Build dynamic DOM content
    if (window.EventsModule?.buildDollhouseCards) {
      window.EventsModule.buildDollhouseCards();
    }
    if (window.EventsModule?.buildCarousel) {
      window.EventsModule.buildCarousel();
    }

    // 3. Play preloader fade & light bloom
    await playRevealAnimation();
    playHeroTextEntrance();

    // 4. Init interactive & scroll animation modules
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

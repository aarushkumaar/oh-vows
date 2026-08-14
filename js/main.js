/**
 * Main Application Boot & Initialization
 * Orchestrates preloading, reveal sequence, and modules
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
  const PRELOAD = [
    'assets/images/hero/hero-palace.png',
    'assets/images/backgrounds/bg-red.png',
    'assets/images/backgrounds/bg-green.png',
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
  function openReveal() {
    return new Promise((resolve) => {
      if (!loadingOverlay) {
        resolve();
        return;
      }
      const tl = gsap.timeline({
        onComplete() {
          loadingOverlay.style.display = 'none';
          resolve();
        }
      });
      if (lightBloom) {
        tl.to(lightBloom, { opacity: 0.65, duration: 0.28, ease: 'power1.in' }, 0.3)
          .to(lightBloom, { opacity: 0,    duration: 0.65, ease: 'power2.out' }, 0.58);
      }
      tl.to(loadingOverlay, { opacity: 0, duration: 0.75, ease: 'power2.inOut' }, 0.45);
    });
  }

  /* ──────────────────────────────────────────
     HERO ENTRANCE
  ────────────────────────────────────────── */
  function animateHeroIn() {
    return new Promise((resolve) => {
      if (prefersReduced) {
        if (heroTextGroup)  gsap.set(heroTextGroup,  { opacity: 1, y: 0 });
        if (heroScrollHint) gsap.set(heroScrollHint, { opacity: 1 });
        resolve();
        return;
      }
      const tl = gsap.timeline({ onComplete: resolve });
      if (heroTextGroup) {
        tl.fromTo(heroTextGroup,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
          0
        );
      }
      if (heroScrollHint) {
        tl.fromTo(heroScrollHint,
          { opacity: 0 },
          { opacity: 1, duration: 0.75, ease: 'power2.out' },
          0.55
        );
      }
    });
  }

  /* ──────────────────────────────────────────
     BOOT
  ────────────────────────────────────────── */
  async function boot() {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Build dynamic content
    if (window.EventsModule) {
      window.EventsModule.buildDollhouseCards();
      window.EventsModule.buildThings();
      window.EventsModule.initRSVP();
    }

    // 2. Preload decorative flowers
    if (window.AnimationsModule) {
      window.AnimationsModule.preloadFlowers();
      window.AnimationsModule.initFlowers('petal-back',  { count: isMobile ? 4 : 7 });
      window.AnimationsModule.initFlowers('petal-front', { count: isMobile ? 6 : 11 });
    }

    // 3. Preload critical assets
    const minWait = new Promise(r => setTimeout(r, MIN_MS));
    const loaded  = preloadAssets();
    await Promise.all([minWait, loaded]);
    await new Promise(r => setTimeout(r, 160));

    // 4. Reveal & Hero Entrance
    await openReveal();
    await animateHeroIn();

    // 5. Initialize scroll and ambient animations
    if (window.AnimationsModule) {
      window.AnimationsModule.initHeroScrollEffects();
      window.AnimationsModule.initBgSequence();
      window.AnimationsModule.initFramesAnimation();
      window.AnimationsModule.initFloating();
      window.AnimationsModule.initPolaroidDrift();
    }

    if (window.EventsModule) {
      window.EventsModule.initDollhouseAnimation();
      window.EventsModule.initThingsAnimation();
      window.EventsModule.initWardrobeAnimation();
    }

    // 6. Countdown
    if (window.CountdownModule) {
      window.CountdownModule.init();
    }

    // 7. Refresh ScrollTrigger & check initial URL hash
    ScrollTrigger.refresh();

    if (window.EventsModule) {
      window.EventsModule.handleInitialHash();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      boot().catch(console.error);
    });
  } else {
    boot().catch(console.error);
  }
})();

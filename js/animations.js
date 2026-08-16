/**
 * Animations Module
 * Floating physics, frames entrance, flower petal physics, and light bloom
 */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────────
     HERO SCROLL EFFECTS (Disabled to keep Hero unified as 1 physical artwork)
  ────────────────────────────────────────── */
  function initHeroScrollEffects() {
    // Intentionally no-op: Hero artwork, image, decorations, and text scroll together as a single unified page section without independent drift.
  }

  /* ──────────────────────────────────────────
     FLOATING PHYSICS
     Frames have subtle organic floating movement
  ────────────────────────────────────────── */
  const FRAME_FLOAT = [
    { sy: 0.58, sx: 0.33, sr: 0.16, ay: 4, ax: 3, ar: 0.8, py: 0.0, px: 1.1, pr: 0.4 },
    { sy: 0.40, sx: 0.48, sr: 0.21, ay: 5, ax: 4, ar: 1.0, py: 2.0, px: 0.7, pr: 2.1 },
    { sy: 0.68, sx: 0.26, sr: 0.14, ay: 3, ax: 3, ar: 0.7, py: 1.2, px: 2.4, pr: 0.9 },
    { sy: 0.50, sx: 0.41, sr: 0.19, ay: 4, ax: 2, ar: 0.9, py: 3.1, px: 0.5, pr: 1.6 },
    { sy: 0.76, sx: 0.31, sr: 0.17, ay: 4, ax: 5, ar: 0.8, py: 0.8, px: 1.9, pr: 3.0 },
  ];

  let floatT   = 0;
  let floatRAF = null;
  let frameEls = [];

  function initFloating() {
    if (prefersReduced) return;
    frameEls = Array.from(document.querySelectorAll('.frame-item'));

    function tick() {
      if (!document.hidden) {
        floatT += 0.006;

        frameEls.forEach((el, i) => {
          if (!el.classList.contains('float-on')) return;
          const c = FRAME_FLOAT[i % FRAME_FLOAT.length];
          const rot = parseFloat(el.dataset.baseRot || 0);
          const dy  = Math.sin(floatT * c.sy + c.py) * c.ay;
          const dx  = Math.sin(floatT * c.sx + c.px) * c.ax;
          const dr  = Math.sin(floatT * c.sr + c.pr) * c.ar;
          el.style.transform = `rotate(${rot + dr}deg) translateY(${dy}px) translateX(${dx}px)`;
        });
      }

      floatRAF = requestAnimationFrame(tick);
    }
    tick();
  }

  /* ──────────────────────────────────────────
     FRAMES ENTRANCE
  ────────────────────────────────────────── */
  function initFramesAnimation() {
    const items = document.querySelectorAll('.frame-item');
    if (!items.length || prefersReduced) {
      items.forEach(el => {
        el.style.opacity = '1';
        el.classList.add('float-on');
      });
      return;
    }
    const dirMap = { left: { x: -55, y: 0 }, right: { x: 55, y: 0 }, up: { x: 0, y: 48 } };

    items.forEach((el, i) => {
      const d = dirMap[el.dataset.dir] || dirMap.up;
      gsap.fromTo(el,
        { opacity: 0, x: d.x, y: d.y + 10, scale: 0.93 },
        {
          opacity: 1, x: 0, y: 0, scale: 1,
          duration: 1.05, ease: 'power3.out', delay: (i % 5) * 0.07,
          scrollTrigger: { trigger: el, start: 'top 88%' },
          onComplete() { el.classList.add('float-on'); }
        }
      );
    });

    document.querySelectorAll('.polaroid-item').forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 38 },
        {
          opacity: 1, y: 0, duration: 0.88, ease: 'power2.out', delay: i * 0.11,
          scrollTrigger: { trigger: '#polaroid-rope-section', start: 'top 82%' }
        }
      );
    });

    gsap.to('#frames-grid', {
      y: -22, ease: 'none',
      scrollTrigger: {
        trigger: '#frames-section',
        start: 'top bottom', end: 'bottom top', scrub: true,
      }
    });
  }

  /* ──────────────────────────────────────────
     POLAROID DRIFT
     Polaroids are animated via pure CSS keyframes (polaroidBreeze1..4)
  ────────────────────────────────────────── */
  function initPolaroidDrift() {
    // No-op: Polaroids use pure CSS keyframe breeze physics for optimal performance
  }

  /* ──────────────────────────────────────────
     BACKGROUND SEQUENCE
     Sections now own their backgrounds via CSS url()
  ────────────────────────────────────────── */
  function initBgSequence() {
    // No-op: backgrounds are CSS-driven per section.
  }

  /* ──────────────────────────────────────────
     PETAL PHYSICS (Light and Organic)
  ────────────────────────────────────────── */
  const PETAL_SVGS = [
    'assets/images/decorative/flower-pink.svg',
    'assets/images/decorative/flower-orange.svg',
    'assets/images/decorative/flower-yellow.svg',
    'assets/images/decorative/flower-yellow-orange.svg',
    'assets/images/decorative/flower-white.svg',
  ];

  const loadedPetalImgs = [];

  function preloadFlowers() {
    return Promise.all(
      PETAL_SVGS.map((src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload  = () => { loadedPetalImgs.push(img); resolve(); };
          img.onerror = () => resolve();
        })
      )
    );
  }

  function initFlowers() {
    if (prefersReduced || !loadedPetalImgs.length) return;

    const backCanvas  = document.getElementById('petal-back');
    const frontCanvas = document.getElementById('petal-front');
    if (!backCanvas || !frontCanvas) return;

    const backCtx  = backCanvas.getContext('2d');
    const frontCtx = frontCanvas.getContext('2d');

    let W = window.innerWidth;
    let H = window.innerHeight;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      backCanvas.width  = W;
      backCanvas.height = H;
      frontCanvas.width  = W;
      frontCanvas.height = H;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const isMobile = W < 768;
    const COUNT = isMobile ? 12 : 24;

    class Petal {
      constructor(isFront) {
        this.isFront = isFront;
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * (W + 120) - 60;
        this.y = init ? Math.random() * (H + 100) - 50 : -40 - Math.random() * 60;
        this.img = loadedPetalImgs[Math.floor(Math.random() * loadedPetalImgs.length)];

        const baseSize = this.isFront ? (isMobile ? 22 : 32) : (isMobile ? 14 : 20);
        this.size = baseSize * (0.75 + Math.random() * 0.5);

        this.vx = (Math.random() - 0.45) * (this.isFront ? 0.9 : 0.5);
        this.vy = (0.7 + Math.random() * 0.9) * (this.isFront ? 1.0 : 0.65);

        this.rot  = Math.random() * Math.PI * 2;
        this.vRot = (Math.random() - 0.5) * 0.025;

        this.swayAmp   = 1.2 + Math.random() * 2.2;
        this.swayFreq  = 0.008 + Math.random() * 0.012;
        this.swayPhase = Math.random() * Math.PI * 2;

        this.opacity = this.isFront ? (0.75 + Math.random() * 0.25) : (0.35 + Math.random() * 0.3);
      }

      update(t) {
        this.rot += this.vRot;
        this.x   += this.vx + Math.sin(t * this.swayFreq + this.swayPhase) * this.swayAmp;
        this.y   += this.vy;

        if (this.y > H + 50 || this.x < -80 || this.x > W + 80) {
          this.reset(false);
        }
      }

      draw(ctx) {
        if (!this.img) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    const backPetals  = Array.from({ length: Math.floor(COUNT * 0.5) }, () => new Petal(false));
    const frontPetals = Array.from({ length: Math.ceil(COUNT * 0.5) }, () => new Petal(true));

    let flowerT = 0;
    function loop() {
      if (!document.hidden) {
        flowerT++;
        backCtx.clearRect(0, 0, W, H);
        frontCtx.clearRect(0, 0, W, H);

        backPetals.forEach(p => { p.update(flowerT); p.draw(backCtx); });
        frontPetals.forEach(p => { p.update(flowerT); p.draw(frontCtx); });
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  window.AnimationsModule = {
    initHeroScrollEffects,
    initBgSequence,
    initFramesAnimation,
    initFloating,
    initPolaroidDrift,
    preloadFlowers,
    initFlowers,
  };
})();

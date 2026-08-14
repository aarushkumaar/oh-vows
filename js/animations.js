/**
 * Animations Module
 * GSAP ScrollTrigger setups, floating drift physics, background transitions, and flower canvas particles
 */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────────
     HERO SCROLL EFFECTS
  ────────────────────────────────────────── */
  function initHeroScrollEffects() {
    if (prefersReduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const heroEl       = document.getElementById('hero');
    const imgWrap      = document.getElementById('hero-img-wrap');
    const heroTextOuter = document.getElementById('hero-text-outer');

    if (!heroEl || !imgWrap) return;

    ScrollTrigger.create({
      trigger: heroEl,
      start: 'top top',
      end:   'bottom top',
      scrub: true,
      onUpdate(self) {
        gsap.set(imgWrap, { y: -(self.progress * heroEl.offsetHeight * 0.11) });
      }
    });

    if (heroTextOuter) {
      gsap.to(heroTextOuter, {
        opacity: 0,
        y: -24,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start:   'top top',
          end:     '28% top',
          scrub:   1,
        }
      });
    }
  }

  /* ──────────────────────────────────────────
     FRAME & POLAROID FLOATING
  ────────────────────────────────────────── */
  const FRAME_FLOAT = [
    { sy: 0.58, sx: 0.33, sr: 0.16, ay: 5, ax: 4, ar: 1.2, py: 0.0, px: 1.1, pr: 0.4 },
    { sy: 0.40, sx: 0.48, sr: 0.21, ay: 7, ax: 6, ar: 1.8, py: 2.0, px: 0.7, pr: 2.1 },
    { sy: 0.68, sx: 0.26, sr: 0.14, ay: 4, ax: 5, ar: 1.0, py: 1.2, px: 2.4, pr: 0.9 },
    { sy: 0.50, sx: 0.41, sr: 0.19, ay: 6, ax: 3, ar: 1.5, py: 3.1, px: 0.5, pr: 1.6 },
    { sy: 0.76, sx: 0.31, sr: 0.17, ay: 5, ax: 7, ar: 1.3, py: 0.8, px: 1.9, pr: 3.0 },
  ];

  const POLAROID_FLOAT = [
    { sy: 0.48, sr: 0.17, ay: 4, ar: 1.8, py: 0.0, pr: 0.5 },
    { sy: 0.58, sr: 0.21, ay: 5, ar: 2.2, py: 1.8, pr: 1.7 },
    { sy: 0.38, sr: 0.14, ay: 3, ar: 1.5, py: 3.2, pr: 3.0 },
    { sy: 0.67, sr: 0.19, ay: 6, ar: 2.0, py: 1.1, pr: 0.9 },
  ];

  let floatT   = 0;
  let floatRAF = null;
  let frameEls = [];
  let polBodyEls = [];

  function initFloating() {
    if (prefersReduced) return;
    frameEls   = Array.from(document.querySelectorAll('.frame-item'));
    polBodyEls = Array.from(document.querySelectorAll('.polaroid-body'));

    function tick() {
      if (!document.hidden) {
        floatT += 0.007;

        frameEls.forEach((el, i) => {
          if (!el.classList.contains('float-on')) return;
          const c = FRAME_FLOAT[i % FRAME_FLOAT.length];
          const rot = parseFloat(el.dataset.baseRot || 0);
          const dy  = Math.sin(floatT * c.sy + c.py) * c.ay;
          const dx  = Math.sin(floatT * c.sx + c.px) * c.ax;
          const dr  = Math.sin(floatT * c.sr + c.pr) * c.ar;
          el.style.transform = `rotate(${rot + dr}deg) translateY(${dy}px) translateX(${dx}px)`;
        });

        polBodyEls.forEach((el, i) => {
          const c  = POLAROID_FLOAT[i % POLAROID_FLOAT.length];
          const dy = Math.sin(floatT * c.sy + c.py) * c.ay;
          const dr = Math.sin(floatT * c.sr + c.pr) * c.ar;
          el.style.transform = `rotate(${dr}deg) translateY(${dy}px)`;
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
     POLAROID SCROLL DRIFT
  ────────────────────────────────────────── */
  function initPolaroidDrift() {
    if (prefersReduced) return;
    const speeds = [0.055, -0.04, 0.07, -0.045];
    const items  = document.querySelectorAll('.polaroid-item');

    ScrollTrigger.create({
      trigger: '#polaroid-rope-section',
      start: 'top bottom', end: 'bottom top',
      scrub: true,
      onUpdate(self) {
        items.forEach((el, i) => {
          const shift = self.progress * speeds[i % speeds.length] * 70;
          el.style.marginLeft = shift + 'px';
        });
      }
    });
  }

  /* ──────────────────────────────────────────
     BACKGROUND SEQUENCE (Smooth Fabric Transition)
  ────────────────────────────────────────── */
  function initBgSequence() {
    gsap.registerPlugin(ScrollTrigger);

    const bg3 = document.getElementById('bg-3');
    const bg4 = document.getElementById('bg-4');
    if (!bg3 || !bg4) return;

    // Cream → Red fabric transition starts smoothly near Polaroid bottom
    ScrollTrigger.create({
      trigger: '#polaroid-rope-section',
      start: 'bottom 85%',
      end: '#dollhouse-section top 35%',
      scrub: 1.2,
      onUpdate(self) {
        bg3.style.opacity = String(self.progress);
      }
    });

    // Red → Green fabric transition at bottom
    ScrollTrigger.create({
      trigger: '#things-section',
      start: 'top 75%',
      end: '#things-section bottom 20%',
      scrub: 1.2,
      onUpdate(self) {
        bg3.style.opacity = String(1 - self.progress);
        bg4.style.opacity = String(self.progress);
      }
    });
  }

  /* ──────────────────────────────────────────
     FLOWER CANVAS PARTICLES
  ────────────────────────────────────────── */
  const FLOWER_SRCS = [
    'assets/images/decorative/flower-pink.svg',
    'assets/images/decorative/flower-white.svg',
    'assets/images/decorative/flower-yellow.svg',
    'assets/images/decorative/flower-orange.svg',
    'assets/images/decorative/flower-yellow-orange.svg',
  ];
  const flowerImgs = [];

  function preloadFlowers() {
    FLOWER_SRCS.forEach((src) => {
      const img = new Image();
      img.src = src;
      flowerImgs.push(img);
    });
  }

  function initFlowers(canvasId, opts = {}) {
    if (prefersReduced) return;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx   = canvas.getContext('2d');
    const count = opts.count || 8;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function clampN(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    class Flower {
      constructor() { this.reset(true); }
      reset(init) {
        const W = canvas.width, H = canvas.height;
        const secs = 11 + Math.random() * 14;
        this.vy  = H / (secs * 60);
        const d  = (this.vy - H / (25 * 60)) / (H / (11 * 60) - H / (25 * 60));
        this.sz  = clampN(16 + d * 48, 13, 65);
        this.op  = clampN(0.13 + d * 0.43, 0.10, 0.62);
        this.rot = Math.random() * Math.PI * 2;
        this.rv  = (Math.random() - 0.5) * (0.003 + Math.random() * 0.017);
        this.x   = Math.random() * W;
        this.y   = init ? Math.random() * H : -(this.sz * 2);
        this.vx  = (Math.random() - 0.5) * 0.5;
        this.swA = 0.28 + Math.random() * 0.75;
        this.swS = 0.004 + Math.random() * 0.011;
        this.swP = Math.random() * Math.PI * 2;
        this.img = flowerImgs[Math.floor(Math.random() * flowerImgs.length)];
      }
      update(t) {
        this.x += this.vx + Math.sin(t * this.swS + this.swP) * this.swA;
        this.y += this.vy;
        this.rot += this.rv;
        if (this.y > canvas.height + this.sz * 2) this.reset(false);
      }
      draw(ctx) {
        if (!this.img?.complete || !this.img.naturalWidth) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.globalAlpha = this.op;
        ctx.drawImage(this.img, -this.sz / 2, -this.sz / 2, this.sz, this.sz);
        ctx.restore();
      }
    }

    const flowers = Array.from({ length: count }, () => new Flower());
    let t = 0;
    (function loop() {
      if (!document.hidden) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t++;
        flowers.forEach(f => { f.update(t); f.draw(ctx); });
      }
      requestAnimationFrame(loop);
    })();
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

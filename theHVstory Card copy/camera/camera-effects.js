/**
 * camera-effects.js — Film simulation via Canvas 2D
 *
 * Four styles: FLASH / FILM / NOIR / POLAROID
 *
 * For each shot: produces two Blobs
 *   - original:  raw capture (no processing)
 *   - developed: style applied
 *
 * All processing is synchronous canvas operations.
 * Heavy loops (grain, pixel walks) use typed arrays for performance.
 */
(() => {
  'use strict';

  /* ─────────────────────────────────────────────
     CAPTURE FROM VIDEO STREAM
     Returns a canvas with the current video frame.
  ───────────────────────────────────────────── */
  function captureFrame(videoEl, maxDimension = 1600) {
    const vw = videoEl.videoWidth  || videoEl.offsetWidth;
    const vh = videoEl.videoHeight || videoEl.offsetHeight;

    // Clamp to maxDimension, preserve aspect ratio
    let w = vw, h = vh;
    if (w > maxDimension || h > maxDimension) {
      const scale = maxDimension / Math.max(w, h);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    }

    const canvas = document.createElement('canvas');
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoEl, 0, 0, w, h);
    return canvas;
  }

  /* ─────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────── */
  function clamp(v, min = 0, max = 255) {
    return v < min ? min : v > max ? max : v;
  }

  /** Apply grain to an ImageData */
  function applyGrain(data, intensity = 18) {
    for (let i = 0; i < data.length; i += 4) {
      const g = (Math.random() - 0.5) * intensity;
      data[i]     = clamp(data[i]     + g);
      data[i + 1] = clamp(data[i + 1] + g);
      data[i + 2] = clamp(data[i + 2] + g);
    }
  }

  /** Simple S-curve: lifts shadows, deepens midtones */
  function sCurve(v, strength = 0.25) {
    const n = v / 255;
    const curved = n + strength * Math.sin(Math.PI * n);
    return clamp(Math.round(curved * 255));
  }

  /** Vignette: darkens corners */
  function applyVignette(ctx, w, h, strength = 0.45) {
    const cx = w / 2, cy = h / 2;
    const r  = Math.max(w, h) * 0.7;
    const grad = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r);
    grad.addColorStop(0,   'rgba(0,0,0,0)');
    grad.addColorStop(1,   `rgba(0,0,0,${strength})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  /* ─────────────────────────────────────────────
     STYLE: FLASH
     High contrast, direct flash, slightly cold, grain
  ───────────────────────────────────────────── */
  function applyFlash(srcCanvas) {
    const w = srcCanvas.width, h = srcCanvas.height;
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    const ctx = out.getContext('2d');
    ctx.drawImage(srcCanvas, 0, 0);

    const id   = ctx.getImageData(0, 0, w, h);
    const data = id.data;

    for (let i = 0; i < data.length; i += 4) {
      // Slight exposure boost
      let r = clamp(data[i]     * 1.08);
      let g = clamp(data[i + 1] * 1.06);
      let b = clamp(data[i + 2] * 1.12); // subtle cold cast

      // Crush blacks slightly
      r = r < 30 ? Math.round(r * 0.6) : r;
      g = g < 30 ? Math.round(g * 0.6) : g;
      b = b < 30 ? Math.round(b * 0.6) : b;

      // S-curve for contrast
      data[i]     = sCurve(r, 0.18);
      data[i + 1] = sCurve(g, 0.18);
      data[i + 2] = sCurve(b, 0.18);
    }

    applyGrain(data, 20);
    ctx.putImageData(id, 0, 0);

    // Subtle hard flash highlight (center top)
    const flash = ctx.createRadialGradient(w * 0.5, 0, 0, w * 0.5, h * 0.4, w * 0.55);
    flash.addColorStop(0, 'rgba(255,255,248,0.12)');
    flash.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = flash;
    ctx.fillRect(0, 0, w, h);

    return out;
  }

  /* ─────────────────────────────────────────────
     STYLE: FILM
     Warm, soft, analog — slight desaturation + grain
  ───────────────────────────────────────────── */
  function applyFilm(srcCanvas) {
    const w = srcCanvas.width, h = srcCanvas.height;
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    const ctx = out.getContext('2d');
    ctx.drawImage(srcCanvas, 0, 0);

    const id   = ctx.getImageData(0, 0, w, h);
    const data = id.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i], g = data[i + 1], b = data[i + 2];

      // Warm shift: reds + greens up, blues down
      r = clamp(r * 1.06 + 8);
      g = clamp(g * 1.02 + 4);
      b = clamp(b * 0.90 - 6);

      // Lift blacks (film never reaches true black)
      r = clamp(r + 10);
      g = clamp(g + 8);
      b = clamp(b + 6);

      // Gentle soft contrast
      data[i]     = sCurve(r, 0.12);
      data[i + 1] = sCurve(g, 0.10);
      data[i + 2] = sCurve(b, 0.10);
    }

    applyGrain(data, 16);
    ctx.putImageData(id, 0, 0);
    applyVignette(ctx, w, h, 0.35);

    return out;
  }

  /* ─────────────────────────────────────────────
     STYLE: NOIR
     Black & white, moderate contrast, grain
  ───────────────────────────────────────────── */
  function applyNoir(srcCanvas) {
    const w = srcCanvas.width, h = srcCanvas.height;
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    const ctx = out.getContext('2d');
    ctx.drawImage(srcCanvas, 0, 0);

    const id   = ctx.getImageData(0, 0, w, h);
    const data = id.data;

    for (let i = 0; i < data.length; i += 4) {
      // Luminance-weighted grayscale (perceptual)
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      const v   = sCurve(lum, 0.22); // stronger S-curve for drama
      data[i]     = v;
      data[i + 1] = v;
      data[i + 2] = v;
    }

    applyGrain(data, 24); // more grain for noir feel
    ctx.putImageData(id, 0, 0);
    applyVignette(ctx, w, h, 0.55);

    return out;
  }

  /* ─────────────────────────────────────────────
     STYLE: POLAROID
     Soft colors, faded, white border frame
  ───────────────────────────────────────────── */
  function applyPolaroid(srcCanvas) {
    const photoW = srcCanvas.width;
    const photoH = srcCanvas.height;

    // Frame dimensions: 10% padding sides, 10% top, 22% bottom (label space)
    const padSide   = Math.round(photoW * 0.10);
    const padTop    = Math.round(photoH * 0.10);
    const padBottom = Math.round(photoH * 0.22);
    const frameW    = photoW + padSide * 2;
    const frameH    = photoH + padTop + padBottom;

    const out = document.createElement('canvas');
    out.width  = frameW;
    out.height = frameH;
    const ctx = out.getContext('2d');

    // White/cream frame
    ctx.fillStyle = '#f9f6f0';
    ctx.fillRect(0, 0, frameW, frameH);

    // Apply photo effect to a temp canvas
    const photoOut = document.createElement('canvas');
    photoOut.width  = photoW;
    photoOut.height = photoH;
    const pCtx = photoOut.getContext('2d');
    pCtx.drawImage(srcCanvas, 0, 0);

    const id   = pCtx.getImageData(0, 0, photoW, photoH);
    const data = id.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i], g = data[i + 1], b = data[i + 2];
      // Slight desaturation + lift (soft, faded Polaroid look)
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      r = clamp(r + (lum - r) * 0.25 + 12);
      g = clamp(g + (lum - g) * 0.20 + 10);
      b = clamp(b + (lum - b) * 0.30 + 8);
      // Reduce contrast slightly
      data[i]     = clamp(r * 0.90 + 12);
      data[i + 1] = clamp(g * 0.90 + 10);
      data[i + 2] = clamp(b * 0.88 + 14);
    }

    applyGrain(data, 12);
    pCtx.putImageData(id, 0, 0);

    // Draw processed photo onto frame
    ctx.drawImage(photoOut, padSide, padTop);

    // Subtle inner shadow on photo edges
    const innerShadow = ctx.createLinearGradient(padSide, padTop, padSide, padTop + 16);
    innerShadow.addColorStop(0, 'rgba(0,0,0,0.10)');
    innerShadow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = innerShadow;
    ctx.fillRect(padSide, padTop, photoW, 16);

    // Caption: "the hv story" in bottom white area
    const captionY = padTop + photoH + padBottom * 0.58;
    ctx.font         = `italic ${Math.round(frameW * 0.038)}px 'Georgia', serif`;
    ctx.fillStyle    = 'rgba(60,45,30,0.55)';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('the hv story', frameW / 2, captionY);

    return out;
  }

  /* ─────────────────────────────────────────────
     MAIN PROCESS FUNCTION
     Returns { originalBlob, developedBlob } Promises
  ───────────────────────────────────────────── */
  async function processShot(videoEl, style) {
    // 1. Capture raw frame
    const rawCanvas = captureFrame(videoEl, 1600);

    // 2. Original = raw frame as JPEG (no effect)
    const originalBlob = await canvasToBlob(rawCanvas, 0.88);

    // 3. Apply style effect
    let developedCanvas;
    switch (style) {
      case 'FLASH':    developedCanvas = applyFlash(rawCanvas);   break;
      case 'FILM':     developedCanvas = applyFilm(rawCanvas);    break;
      case 'NOIR':     developedCanvas = applyNoir(rawCanvas);    break;
      case 'POLAROID': developedCanvas = applyPolaroid(rawCanvas); break;
      default:         developedCanvas = applyFilm(rawCanvas);    break;
    }

    // 4. Developed blob
    const developedBlob = await canvasToBlob(developedCanvas, 0.85);

    return { originalBlob, developedBlob };
  }

  function canvasToBlob(canvas, quality = 0.85) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
        'image/jpeg',
        quality
      );
    });
  }

  /* ─────────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────────── */
  window.CameraEffects = {
    processShot,
    captureFrame,
    canvasToBlob,
  };
})();

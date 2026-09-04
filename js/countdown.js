/**
 * Countdown Timer Module
 * Handles wedding date calculation and animated flipping numbers
 */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WEDDING_DATE = new Date('2026-09-21T00:00:00+05:30');

  function padded(n) {
    return String(n).padStart(2, '0');
  }

  function flipDigit(el, newVal) {
    if (!el || el.textContent === newVal) return;
    if (prefersReduced) {
      el.textContent = newVal;
      return;
    }
    el.classList.add('flipping-out');
    setTimeout(() => {
      el.textContent = newVal;
      el.classList.remove('flipping-out');
      el.classList.add('flipping-in');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.remove('flipping-in');
        });
      });
    }, 200);
  }

  function updateCountdown() {
    const diff = WEDDING_DATE - new Date();
    const els = {
      days:  document.getElementById('cd-days'),
      hours: document.getElementById('cd-hours'),
      mins:  document.getElementById('cd-mins'),
      secs:  document.getElementById('cd-secs'),
    };

    if (diff <= 0) {
      Object.values(els).forEach(el => {
        if (el) el.textContent = '00';
      });
      return;
    }

    flipDigit(els.days,  padded(Math.floor(diff / 86400000)));
    flipDigit(els.hours, padded(Math.floor((diff % 86400000) / 3600000)));
    flipDigit(els.mins,  padded(Math.floor((diff % 3600000)  / 60000)));
    flipDigit(els.secs,  padded(Math.floor((diff % 60000)    / 1000)));
  }

  function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  window.CountdownModule = {
    init: initCountdown,
    update: updateCountdown,
  };
})();

/**
 * gallery.js — HV Story public photo gallery
 *
 * Fetches all uploaded photos from Supabase (no login required).
 * Grid view with sort (time/name) and guest filter.
 * Lightbox with name, timestamp, shot number, filter style.
 */
(() => {
  'use strict';

  const EVENT_SLUG = 'thehvstory';

  /* ─────────────────────────────────────────────
     CONFIG + SUPABASE CLIENT
  ───────────────────────────────────────────── */
  function readConfig() {
    const get = (n) => {
      const el = document.querySelector(`meta[name="${n}"]`);
      return el ? el.getAttribute('content') : '';
    };
    return { supabaseUrl: get('hvc-supabase-url'), supabaseKey: get('hvc-supabase-key') };
  }

  let _client = null;
  function db() {
    if (_client) return _client;
    const cfg = readConfig();
    _client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey);
    return _client;
  }

  /* ─────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────── */
  let _allPhotos    = [];   // raw data from DB
  let _filtered     = [];   // after guest filter
  let _sorted       = [];   // after sort
  let _currentSort  = 'time-desc';
  let _guestFilter  = '';
  let _lightboxIdx  = 0;

  /* ─────────────────────────────────────────────
     DOM REFS
  ───────────────────────────────────────────── */
  const el = (id) => document.getElementById(id);

  /* ─────────────────────────────────────────────
     FETCH DATA
  ───────────────────────────────────────────── */
  async function fetchPhotos() {
    // 1. Get event ID
    const { data: event, error: evErr } = await db()
      .from('events')
      .select('id')
      .eq('slug', EVENT_SLUG)
      .single();

    if (evErr || !event) {
      showError('Event not found. Make sure the database schema has been run.');
      return;
    }

    // 2. Fetch all uploaded photos with roll + guest info
    const { data: photos, error } = await db()
      .from('photos')
      .select(`
        id,
        shot_number,
        developed_path,
        original_path,
        style,
        created_at,
        rolls (
          roll_number,
          style,
          guests ( name )
        )
      `)
      .eq('event_id', event.id)
      .eq('upload_status', 'uploaded')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[gallery] Fetch error:', error);
      showError('Failed to load photos. Check console.');
      return;
    }

    // Flatten the nested structure
    _allPhotos = (photos || []).map(p => ({
      id:          p.id,
      shotNumber:  p.shot_number,
      url:         p.developed_path || p.original_path || '',
      style:       p.style || p.rolls?.style || 'FILM',
      createdAt:   p.created_at,
      rollNumber:  p.rolls?.roll_number,
      guestName:   p.rolls?.guests?.name || 'Anonymous',
    })).filter(p => p.url); // skip photos without a URL yet

    // Populate guest filter dropdown
    const names = [...new Set(_allPhotos.map(p => p.guestName))].sort();
    const sel   = el('guest-filter');
    names.forEach(name => {
      const opt  = document.createElement('option');
      opt.value  = name;
      opt.textContent = name;
      sel.appendChild(opt);
    });

    applyFilterAndSort();
  }

  /* ─────────────────────────────────────────────
     FILTER + SORT
  ───────────────────────────────────────────── */
  function applyFilterAndSort() {
    // Filter by guest
    _filtered = _guestFilter
      ? _allPhotos.filter(p => p.guestName === _guestFilter)
      : [..._allPhotos];

    // Sort
    _sorted = [..._filtered].sort((a, b) => {
      if (_currentSort === 'time-desc') return new Date(b.createdAt) - new Date(a.createdAt);
      if (_currentSort === 'time-asc')  return new Date(a.createdAt) - new Date(b.createdAt);
      if (_currentSort === 'name-asc')  return a.guestName.localeCompare(b.guestName);
      return 0;
    });

    renderGrid();
  }

  /* ─────────────────────────────────────────────
     RENDER GRID
  ───────────────────────────────────────────── */
  function renderGrid() {
    const grid    = el('gallery-grid');
    const loading = el('gallery-loading');
    const empty   = el('gallery-empty');
    const count   = el('header-count');

    if (loading) loading.style.display = 'none';

    if (_sorted.length === 0) {
      grid.style.display = 'none';
      if (empty) empty.style.display = 'block';
      if (count) count.textContent = '0 photographs';
      return;
    }

    if (empty) empty.style.display = 'none';
    grid.style.display = '';
    if (count) count.textContent = `${_sorted.length} photograph${_sorted.length !== 1 ? 's' : ''}`;

    grid.innerHTML = '';

    _sorted.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className  = 'photo-card';
      card.tabIndex   = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View photo by ${photo.guestName}`);
      card.dataset.idx = idx;

      const img = document.createElement('img');
      img.src     = photo.url;
      img.alt     = `Shot by ${photo.guestName}`;
      img.loading = 'lazy';
      img.decoding = 'async';

      const overlay = document.createElement('div');
      overlay.className = 'photo-card-overlay';
      overlay.innerHTML = `
        <div class="overlay-name">${escHtml(photo.guestName)}</div>
        <div class="overlay-time">${formatTime(photo.createdAt)}</div>
      `;

      card.appendChild(img);
      card.appendChild(overlay);

      card.addEventListener('click',   () => openLightbox(idx));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') openLightbox(idx);
      });

      grid.appendChild(card);
    });
  }

  /* ─────────────────────────────────────────────
     LIGHTBOX
  ───────────────────────────────────────────── */
  function openLightbox(idx) {
    _lightboxIdx = idx;
    renderLightbox();

    el('lightbox').classList.add('is-open');
    el('lightbox').setAttribute('aria-hidden', 'false');
    el('lightbox-backdrop').classList.add('is-open');
    document.body.style.overflow = 'hidden';
    el('lightbox-close')?.focus();
  }

  function closeLightbox() {
    el('lightbox').classList.remove('is-open');
    el('lightbox').setAttribute('aria-hidden', 'true');
    el('lightbox-backdrop').classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function renderLightbox() {
    const photo = _sorted[_lightboxIdx];
    if (!photo) return;

    const img = el('lightbox-img');
    img.src = photo.url;
    img.alt = `Shot by ${photo.guestName}`;

    const rollStr = photo.rollNumber
      ? `ROLL #${String(photo.rollNumber).padStart(3,'0')}`
      : '';
    el('lb-roll').textContent    = rollStr;
    el('lb-name').textContent    = photo.guestName;
    el('lb-time').innerHTML      = formatTimeFull(photo.createdAt);
    el('lb-shot').textContent    = `Shot ${photo.shotNumber}`;
    el('lb-filter').textContent  = `${photo.style} film`;

    const dlBtn = el('lb-download');
    dlBtn.href  = photo.url;
    dlBtn.download = `hv-story-${photo.guestName.replace(/\s+/g,'-').toLowerCase()}-shot-${String(photo.shotNumber).padStart(3,'0')}.jpg`;

    // Prev/next visibility
    el('lightbox-prev').style.opacity = _lightboxIdx > 0 ? '1' : '0.2';
    el('lightbox-next').style.opacity = _lightboxIdx < _sorted.length - 1 ? '1' : '0.2';
  }

  function prevPhoto() {
    if (_lightboxIdx > 0) { _lightboxIdx--; renderLightbox(); }
  }
  function nextPhoto() {
    if (_lightboxIdx < _sorted.length - 1) { _lightboxIdx++; renderLightbox(); }
  }

  /* ─────────────────────────────────────────────
     ERROR STATE
  ───────────────────────────────────────────── */
  function showError(msg) {
    const grid = el('gallery-grid');
    if (grid) {
      grid.innerHTML = `<div class="gallery-loading"><div class="loading-text" style="color:rgba(255,100,100,0.70)">${escHtml(msg)}</div></div>`;
    }
  }

  /* ─────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────── */
  function formatTime(iso) {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  }

  function formatTimeFull(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const date = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return `${date}<br>${time}`;
    } catch { return iso; }
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ─────────────────────────────────────────────
     INJECT SKELETON LOADERS
  ───────────────────────────────────────────── */
  function showSkeletons(count = 12) {
    const grid = el('gallery-grid');
    const loading = el('gallery-loading');
    if (loading) loading.style.display = 'none';

    // Vary heights to mimic masonry
    const heights = [200, 280, 180, 320, 240, 200, 300, 180, 260, 220, 280, 200];
    for (let i = 0; i < count; i++) {
      const skel = document.createElement('div');
      skel.className = 'skeleton-card';
      skel.style.height = (heights[i % heights.length]) + 'px';
      grid.appendChild(skel);
    }
  }

  /* ─────────────────────────────────────────────
     EVENT WIRING
  ───────────────────────────────────────────── */
  function wireListeners() {
    // Sort buttons
    document.querySelectorAll('.sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sort-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        _currentSort = btn.dataset.sort;
        applyFilterAndSort();
      });
    });

    // Guest filter
    el('guest-filter')?.addEventListener('change', (e) => {
      _guestFilter = e.target.value;
      applyFilterAndSort();
    });

    // Lightbox close
    el('lightbox-close')?.addEventListener('click', closeLightbox);
    el('lightbox-backdrop')?.addEventListener('click', closeLightbox);
    el('lightbox-prev')?.addEventListener('click', prevPhoto);
    el('lightbox-next')?.addEventListener('click', nextPhoto);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!el('lightbox')?.classList.contains('is-open')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    });

    // Touch swipe in lightbox
    let touchStartX = 0;
    el('lightbox')?.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    el('lightbox')?.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) dx < 0 ? nextPhoto() : prevPhoto();
    });
  }

  /* ─────────────────────────────────────────────
     BOOT
  ───────────────────────────────────────────── */
  async function boot() {
    wireListeners();
    showSkeletons(12);

    const cfg = readConfig();
    if (!cfg.supabaseUrl || cfg.supabaseUrl.includes('REPLACE_WITH')) {
      showError('Supabase not configured. Add credentials to the meta tags.');
      return;
    }

    try {
      await fetchPhotos();
    } catch (err) {
      console.error('[gallery] Boot error:', err);
      showError('Something went wrong loading the gallery.');
    }
  }

  document.addEventListener('DOMContentLoaded', boot);
})();

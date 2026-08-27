/**
 * admin.js — Admin dashboard logic
 *
 * Handles:
 *  - Supabase email/password authentication
 *  - Event stats (guests, rolls, photos)
 *  - Roll list with guest names and styles
 *  - Photo gallery panel with signed URLs
 *  - Individual photo download
 */
(() => {
  'use strict';

  const EVENT_SLUG = 'thehvstory';
  let _client      = null;
  let _eventId     = null;
  let _currentRollId = null;

  /* ─────────────────────────────────────────────
     CONFIG
  ───────────────────────────────────────────── */
  function readConfig() {
    const get = (name) => {
      const el = document.querySelector(`meta[name="${name}"]`);
      return el ? el.getAttribute('content') : '';
    };
    return {
      supabaseUrl: get('hvc-supabase-url'),
      supabaseKey: get('hvc-supabase-key'),
    };
  }

  function getClient() {
    if (_client) return _client;
    const cfg = readConfig();
    _client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey);
    return _client;
  }

  /* ─────────────────────────────────────────────
     DOM HELPERS
  ───────────────────────────────────────────── */
  const el = (id) => document.getElementById(id);
  const qs = (sel, ctx = document) => ctx.querySelector(sel);

  /* ─────────────────────────────────────────────
     AUTH
  ───────────────────────────────────────────── */
  async function handleLogin(email, password) {
    const btn = el('login-submit');
    const err = el('login-error');
    btn.disabled = true;
    if (err) err.style.display = 'none';

    const { data, error } = await getClient().auth.signInWithPassword({ email, password });

    if (error) {
      if (err) { err.textContent = 'Incorrect email or password.'; err.style.display = 'block'; }
      btn.disabled = false;
      return;
    }

    showDashboard();
  }

  async function handleSignOut() {
    await getClient().auth.signOut();
    el('admin-dashboard').classList.remove('is-visible');
    el('admin-login').classList.remove('is-hidden');
  }

  async function checkExistingSession() {
    const { data: { session } } = await getClient().auth.getSession();
    if (session) {
      showDashboard();
    }
  }

  /* ─────────────────────────────────────────────
     DASHBOARD
  ───────────────────────────────────────────── */
  function showDashboard() {
    el('admin-login').classList.add('is-hidden');
    el('admin-dashboard').classList.add('is-visible');
    loadDashboard();
  }

  async function loadDashboard() {
    const rollsListEl = el('rolls-list');
    if (rollsListEl) rollsListEl.innerHTML = '<div class="admin-loading">Loading rolls...</div>';

    try {
      // Get event
      const { data: event } = await getClient()
        .from('events')
        .select('*')
        .eq('slug', EVENT_SLUG)
        .single();

      if (!event) {
        if (rollsListEl) rollsListEl.innerHTML = '<div class="admin-empty">No event found. Check your event slug.</div>';
        return;
      }

      _eventId = event.id;

      // Get all rolls with guest info
      const { data: rolls, error: rollsError } = await getClient()
        .from('rolls')
        .select('*, guests(name)')
        .eq('event_id', _eventId)
        .order('roll_number', { ascending: true });

      if (rollsError) throw rollsError;

      // Get photo count per roll
      const { data: photoCounts } = await getClient()
        .from('photos')
        .select('roll_id')
        .eq('event_id', _eventId)
        .eq('upload_status', 'uploaded');

      // Build count map
      const countMap = {};
      (photoCounts || []).forEach(p => {
        countMap[p.roll_id] = (countMap[p.roll_id] || 0) + 1;
      });

      // Stats
      const totalGuests = new Set((rolls || []).map(r => r.guest_id)).size;
      const totalPhotos = Object.values(countMap).reduce((a, b) => a + b, 0);
      const completed   = (rolls || []).filter(r => r.status !== 'active').length;

      renderStats({ totalGuests, totalRolls: (rolls || []).length, completed, totalPhotos });
      renderRolls(rolls || [], countMap);

    } catch (err) {
      console.error('[admin] Load failed:', err);
      if (rollsListEl) rollsListEl.innerHTML = '<div class="admin-empty">Failed to load data. Check console.</div>';
    }
  }

  /* ─────────────────────────────────────────────
     STATS
  ───────────────────────────────────────────── */
  function renderStats({ totalGuests, totalRolls, completed, totalPhotos }) {
    const set = (id, val) => { const e = el(id); if (e) e.textContent = val; };
    set('stat-guests',  totalGuests);
    set('stat-rolls',   totalRolls);
    set('stat-photos',  totalPhotos);
    set('stat-done',    completed);

    const countEl = el('rolls-count');
    if (countEl) countEl.textContent = totalRolls + ' roll' + (totalRolls !== 1 ? 's' : '');
  }

  /* ─────────────────────────────────────────────
     ROLL LIST
  ───────────────────────────────────────────── */
  function renderRolls(rolls, countMap) {
    const container = el('rolls-list');
    if (!container) return;

    if (rolls.length === 0) {
      container.innerHTML = '<div class="admin-empty">No rolls yet. Share the QR code at the wedding.</div>';
      return;
    }

    container.innerHTML = '';

    rolls.forEach(roll => {
      const guestName  = roll.guests?.name || 'Anonymous';
      const shotsUsed  = roll.shots_used || 0;
      const rollNum    = String(roll.roll_number || 0).padStart(3, '0');
      const uploaded   = countMap[roll.id] || 0;
      const dateStr    = roll.created_at
        ? new Date(roll.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        : '';

      const row = document.createElement('div');
      row.className = 'roll-row';
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.setAttribute('aria-label', `Open roll ${rollNum} by ${guestName}`);
      row.innerHTML = `
        <div class="roll-number">#${rollNum}</div>
        <div class="roll-info">
          <div class="roll-guest">${escHtml(guestName)}</div>
          <div class="roll-meta">${dateStr} &nbsp;·&nbsp; ${uploaded} uploaded</div>
        </div>
        <div class="roll-style-badge">${escHtml(roll.style)}</div>
        <div class="roll-shots">${shotsUsed}</div>
        <div class="roll-status ${roll.status}">${roll.status}</div>
      `;

      row.addEventListener('click',   () => openRollPanel(roll));
      row.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openRollPanel(roll); });

      container.appendChild(row);
    });
  }

  /* ─────────────────────────────────────────────
     PHOTO PANEL
  ───────────────────────────────────────────── */
  async function openRollPanel(roll) {
    _currentRollId = roll.id;
    const guestName = roll.guests?.name || 'Guest';
    const rollNum   = String(roll.roll_number || 0).padStart(3, '0');

    const panel = el('photo-panel');
    const title = el('panel-title');
    if (title) title.textContent = `${guestName} — Roll #${rollNum}`;

    panel.classList.add('is-open');

    const grid = el('photo-grid');
    if (grid) grid.innerHTML = '<div class="admin-loading">Loading photographs...</div>';

    try {
      const { data: photos, error } = await getClient()
        .from('photos')
        .select('*')
        .eq('roll_id', roll.id)
        .order('shot_number', { ascending: true });

      if (error) throw error;

      renderPhotoGrid(photos || [], roll.style);
    } catch (err) {
      console.error('[admin] Photos load failed:', err);
      if (grid) grid.innerHTML = '<div class="admin-empty">Failed to load photographs.</div>';
    }
  }

  function closeRollPanel() {
    el('photo-panel').classList.remove('is-open');
    _currentRollId = null;
  }

  async function renderPhotoGrid(photos, style) {
    const grid = el('photo-grid');
    if (!grid) return;

    if (photos.length === 0) {
      grid.innerHTML = '<div class="admin-empty">No photographs uploaded yet.</div>';
      return;
    }

    grid.innerHTML = '';

    for (const photo of photos) {
      const card = document.createElement('div');
      card.className = 'photo-card';

      const shotStr = String(photo.shot_number).padStart(3, '0');

      card.innerHTML = `
        <div class="photo-img loading" id="img-wrap-${photo.id}"></div>
        <div class="photo-meta">
          <span class="photo-shot-num">Shot ${shotStr}</span>
          <button class="photo-download" data-photo-id="${photo.id}" aria-label="Download shot ${shotStr}">
            Download
          </button>
        </div>
      `;

      grid.appendChild(card);

      // Load signed URL asynchronously
      loadPhotoImage(photo);
    }

    // Wire download buttons
    grid.querySelectorAll('.photo-download').forEach(btn => {
      btn.addEventListener('click', () => downloadPhoto(btn.dataset.photoId, photos));
    });
  }

  async function loadPhotoImage(photo) {
    const wrap = document.getElementById(`img-wrap-${photo.id}`);
    if (!wrap) return;

    const url = photo.developed_path || photo.original_path;
    if (!url) {
      wrap.classList.remove('loading');
      wrap.style.background = '#1a1a1a';
      return;
    }

    // Cloudinary URLs are direct HTTPS — no signed URL needed
    if (url.startsWith('http')) {
      const img = document.createElement('img');
      img.className = 'photo-img';
      img.src       = url;
      img.alt       = `Shot ${photo.shot_number}`;
      img.loading   = 'lazy';
      img.onload    = () => wrap.replaceWith(img);
      img.onerror   = () => { wrap.classList.remove('loading'); };
      return;
    }

    // Legacy Supabase signed URL fallback
    try {
      const bucket = photo.developed_path ? 'photos-developed' : 'photos-original';
      const { data, error } = await getClient()
        .storage.from(bucket)
        .createSignedUrl(url, 3600);
      if (error || !data?.signedUrl) throw error;
      const img = document.createElement('img');
      img.className = 'photo-img';
      img.src       = data.signedUrl;
      img.alt       = `Shot ${photo.shot_number}`;
      img.loading   = 'lazy';
      img.onload    = () => wrap.replaceWith(img);
      img.onerror   = () => { wrap.classList.remove('loading'); };
    } catch {
      wrap.classList.remove('loading');
    }
  }

  async function downloadPhoto(photoId, photos) {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    const path   = photo.developed_path || photo.original_path;
    const bucket = photo.developed_path ? 'photos-developed' : 'photos-original';

    try {
      const { data, error } = await getClient()
        .storage.from(bucket)
        .createSignedUrl(path, 60);

      if (error || !data?.signedUrl) throw error;

      const a  = document.createElement('a');
      a.href   = data.signedUrl;
      a.download = `hv-story-shot-${String(photo.shot_number).padStart(3,'0')}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('[admin] Download failed:', err);
      alert('Download failed. Please try again.');
    }
  }

  /* ─────────────────────────────────────────────
     UTILITIES
  ───────────────────────────────────────────── */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ─────────────────────────────────────────────
     BOOT
  ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', async () => {
    // Check if already logged in
    await checkExistingSession();

    // Login form
    const loginForm = el('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email    = el('login-email')?.value?.trim();
        const password = el('login-password')?.value;
        if (email && password) handleLogin(email, password);
      });
    }

    // Sign out
    const signOutBtn = el('admin-signout');
    if (signOutBtn) signOutBtn.addEventListener('click', handleSignOut);

    // Close photo panel
    const panelBack = el('panel-back-btn');
    if (panelBack) panelBack.addEventListener('click', closeRollPanel);

    // Keyboard close panel
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && el('photo-panel')?.classList.contains('is-open')) {
        closeRollPanel();
      }
    });

    // Refresh rolls
    const refreshBtn = el('refresh-btn');
    if (refreshBtn) refreshBtn.addEventListener('click', loadDashboard);
  });
})();

/**
 * camera-session.js — Guest session management
 *
 * Responsibilities:
 *  - Generate + persist anonymous session token
 *  - Create/recover guest + roll in Supabase
 *  - Expose current session state to other modules
 *
 * The session token is the primary guest identity.
 * If a guest refreshes, we find their existing roll by token.
 */
(() => {
  'use strict';

  const STORAGE_KEY   = 'hvc_session_token';
  const ROLL_KEY      = 'hvc_roll_id';
  const GUEST_KEY     = 'hvc_guest_id';
  const EVENT_SLUG    = 'thehvstory';

  /* ─────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────── */
  let _event   = null;
  let _guest   = null;
  let _roll    = null;

  /* ─────────────────────────────────────────────
     TOKEN MANAGEMENT
  ───────────────────────────────────────────── */
  function getOrCreateToken() {
    let token = localStorage.getItem(STORAGE_KEY);
    if (!token) {
      // Generate a UUID-style token
      token = 'hvc-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(STORAGE_KEY, token);
    }
    return token;
  }

  function getDeviceHint() {
    // Non-invasive: just a truncated UA + viewport hint for de-duplication support
    const ua   = (navigator.userAgent || '').slice(0, 80);
    const vp   = `${window.screen.width}x${window.screen.height}`;
    return `${ua}|${vp}`;
  }

  /* ─────────────────────────────────────────────
     INITIALIZATION
     Called once on app boot. Returns session state:
       { status: 'new' | 'resume' | 'completed', roll, guest, event }
  ───────────────────────────────────────────── */
  async function initSession() {
    // 1. Load active event from DB
    _event = await window.CameraDB.getActiveEvent(EVENT_SLUG);
    if (!_event) throw new Error('No active event found.');

    // 2. Check for existing session token
    const token = getOrCreateToken();

    // 3. Look up guest by token
    const existingGuest = await window.CameraDB.findGuestByToken(token);

    if (existingGuest) {
      _guest = existingGuest;

      // 4. Find their roll
      const existingRoll = await window.CameraDB.getRollByGuestId(_guest.id);

      if (existingRoll) {
        _roll = existingRoll;

        if (_roll.status === 'completed' || _roll.status === 'developed') {
          return { status: 'completed', roll: _roll, guest: _guest, event: _event };
        }

        if (_roll.shots_used >= _roll.shots_allowed) {
          // Edge case: shots full but status not updated yet
          await window.CameraDB.completeRoll(_roll.id);
          _roll.status = 'completed';
          return { status: 'completed', roll: _roll, guest: _guest, event: _event };
        }

        return { status: 'resume', roll: _roll, guest: _guest, event: _event };
      }
    }

    // 5. No existing session — fresh start
    return { status: 'new', roll: null, guest: null, event: _event };
  }

  /* ─────────────────────────────────────────────
     CREATE GUEST + ROLL  (called after name entry + style selection)
  ───────────────────────────────────────────── */
  async function startRoll({ name, style }) {
    const token = getOrCreateToken();

    // Create guest
    _guest = await window.CameraDB.createGuest({
      eventId:     _event.id,
      name:        name.trim(),
      sessionToken: token,
      deviceHint:  getDeviceHint(),
    });

    // Create roll
    _roll = await window.CameraDB.createRoll({
      guestId:      _guest.id,
      eventId:      _event.id,
      style,
      shotsAllowed: _event.shots_allowed,
    });

    // Cache locally for quick access
    localStorage.setItem(GUEST_KEY, _guest.id);
    localStorage.setItem(ROLL_KEY,  _roll.id);

    return { guest: _guest, roll: _roll, event: _event };
  }

  /* ─────────────────────────────────────────────
     INCREMENT SHOT (server-authoritative)
     Returns updated shots_used. Throws if roll is full.
  ───────────────────────────────────────────── */
  async function recordShot() {
    if (!_roll) throw new Error('No active roll.');

    // Optimistic local increment (UI update)
    _roll.shots_used += 1;

    // Server increment (authoritative)
    try {
      const updated = await window.CameraDB.incrementShots(_roll.id);
      if (updated !== null) _roll.shots_used = updated;
    } catch (err) {
      // Revert optimistic increment on server error
      _roll.shots_used = Math.max(0, _roll.shots_used - 1);
      throw err;
    }

    const remaining = _roll.shots_allowed - _roll.shots_used;

    if (remaining <= 0) {
      await window.CameraDB.completeRoll(_roll.id);
      _roll.status = 'completed';
    }

    return {
      shotsUsed:    _roll.shots_used,
      shotsAllowed: _roll.shots_allowed,
      remaining:    Math.max(0, remaining),
      isComplete:   _roll.status === 'completed',
    };
  }

  /* ─────────────────────────────────────────────
     GETTERS
  ───────────────────────────────────────────── */
  function getEvent()  { return _event;  }
  function getGuest()  { return _guest;  }
  function getRoll()   { return _roll;   }

  function getRemaining() {
    if (!_roll) return 0;
    return Math.max(0, _roll.shots_allowed - _roll.shots_used);
  }

  function isRollComplete() {
    return _roll?.status === 'completed' || _roll?.status === 'developed';
  }

  function setGuest(g) { _guest = g; }
  function setRoll(r)  { _roll  = r; }

  /* ─────────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────────── */
  window.CameraSession = {
    initSession,
    startRoll,
    recordShot,
    getEvent,
    getGuest,
    getRoll,
    getRemaining,
    isRollComplete,
    setGuest,
    setRoll,
  };
})();

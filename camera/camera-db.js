/**
 * camera-db.js — Supabase client wrapper
 *
 * All database operations go through this module.
 * Never import Supabase client directly in other modules.
 *
 * Config is read from window.HVC_CONFIG (injected by camera-app.js
 * from the <meta> tags in index.html — keeps keys out of JS files).
 */
(() => {
  'use strict';

  /* ─────────────────────────────────────────────
     LAZY INIT — waits for Supabase CDN to load
  ───────────────────────────────────────────── */
  let _client = null;

  function getClient() {
    if (_client) return _client;
    const cfg = window.HVC_CONFIG;
    if (!cfg?.supabaseUrl || !cfg?.supabaseKey) {
      throw new Error('[camera-db] Supabase config not found. Set HVC_CONFIG before using DB.');
    }
    _client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey);
    return _client;
  }

  /* ─────────────────────────────────────────────
     EVENTS
  ───────────────────────────────────────────── */
  async function getActiveEvent(slug) {
    const { data, error } = await getClient()
      .from('events')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single();
    if (error) throw error;
    return data;
  }

  /* ─────────────────────────────────────────────
     GUESTS
  ───────────────────────────────────────────── */
  async function findGuestByToken(sessionToken) {
    const { data, error } = await getClient()
      .from('guests')
      .select('*, rolls(*)')
      .eq('session_token', sessionToken)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async function createGuest({ eventId, name, sessionToken, deviceHint }) {
    const { data, error } = await getClient()
      .from('guests')
      .insert({
        event_id:      eventId,
        name,
        session_token: sessionToken,
        device_hint:   deviceHint,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /* ─────────────────────────────────────────────
     ROLLS
  ───────────────────────────────────────────── */
  async function getRollByGuestId(guestId) {
    const { data, error } = await getClient()
      .from('rolls')
      .select('*')
      .eq('guest_id', guestId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async function createRoll({ guestId, eventId, style, shotsAllowed }) {
    const { data, error } = await getClient()
      .from('rolls')
      .insert({
        guest_id:      guestId,
        event_id:      eventId,
        style,
        shots_allowed: shotsAllowed,
        shots_used:    0,
        status:        'active',
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /**
   * Atomically increment shots_used on the server.
   * Returns the updated roll. If shots_used would exceed shots_allowed,
   * Supabase CHECK constraint rejects it — we catch that and treat it as full roll.
   */
  async function incrementShots(rollId) {
    // Use RPC for atomic increment (no race conditions)
    const { data, error } = await getClient()
      .rpc('increment_shots', { roll_id: rollId });
    if (error) throw error;
    return data;
  }

  async function completeRoll(rollId) {
    const { data, error } = await getClient()
      .from('rolls')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', rollId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /* ─────────────────────────────────────────────
     PHOTOS
  ───────────────────────────────────────────── */
  async function createPhotoRecord({ rollId, eventId, shotNumber, style }) {
    const { data, error } = await getClient()
      .from('photos')
      .insert({
        roll_id:      rollId,
        event_id:     eventId,
        shot_number:  shotNumber,
        style,
        upload_status: 'pending',
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async function updatePhotoUrls({ photoId, originalUrl, developedUrl }) {
    // Stores full Cloudinary HTTPS URLs in the path columns
    const { data, error } = await getClient()
      .from('photos')
      .update({
        original_path:  originalUrl,
        developed_path: developedUrl,
        upload_status:  'uploaded',
      })
      .eq('id', photoId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async function markPhotoFailed(photoId) {
    await getClient()
      .from('photos')
      .update({ upload_status: 'failed' })
      .eq('id', photoId);
  }

  /* ─────────────────────────────────────────────
     STORAGE UPLOAD
  ───────────────────────────────────────────── */
  async function uploadPhoto({ bucket, path, blob }) {
    const { data, error } = await getClient()
      .storage
      .from(bucket)
      .upload(path, blob, {
        contentType: 'image/jpeg',
        upsert: false,
      });
    if (error) throw error;
    return data;
  }

  /* ─────────────────────────────────────────────
     ADMIN — reads all rolls + photos for an event
  ───────────────────────────────────────────── */
  async function getEventStats(eventId) {
    const { data, error } = await getClient()
      .from('rolls')
      .select('*, guests(name), photos(count)')
      .eq('event_id', eventId)
      .order('roll_number', { ascending: true });
    if (error) throw error;
    return data;
  }

  async function getPhotosForRoll(rollId) {
    const { data, error } = await getClient()
      .from('photos')
      .select('*')
      .eq('roll_id', rollId)
      .order('shot_number', { ascending: true });
    if (error) throw error;
    return data;
  }

  async function getSignedUrl(bucket, path, expiresIn = 3600) {
    const { data, error } = await getClient()
      .storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    if (error) throw error;
    return data.signedUrl;
  }

  /* ─────────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────────── */
  window.CameraDB = {
    getActiveEvent,
    findGuestByToken,
    createGuest,
    getRollByGuestId,
    createRoll,
    incrementShots,
    completeRoll,
    createPhotoRecord,
    updatePhotoUrls,
    markPhotoFailed,
    uploadPhoto,
    getEventStats,
    getPhotosForRoll,
    getSignedUrl,
  };
})();

/**
 * camera-upload.js — Cloudinary upload queue
 *
 * Uploads both original + developed blobs to Cloudinary.
 * Uses unsigned upload preset (safe for client-side use).
 *
 * Upload path: thehvstory/camera/rolls/<rollId>/original/shot-001
 *              thehvstory/camera/rolls/<rollId>/developed/shot-001
 *
 * Resilience:
 *  - IndexedDB queue persists across page closes
 *  - Exponential backoff up to MAX_RETRIES
 *  - Resumes on page load / online reconnect
 */
(() => {
  'use strict';

  const MAX_RETRIES   = 5;
  const RETRY_BASE_MS = 1500;
  const DB_NAME       = 'hvc-upload-queue';
  const DB_VERSION    = 2;
  const STORE_NAME    = 'queue';

  /* ─────────────────────────────────────────────
     IN-MEMORY QUEUE
  ───────────────────────────────────────────── */
  const queue = [];
  let workerRunning = false;

  /* ─────────────────────────────────────────────
     INDEXEDDB — offline persistence
  ───────────────────────────────────────────── */
  let _idb = null;

  function openIDB() {
    if (_idb) return Promise.resolve(_idb);
    return new Promise((resolve) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = e => { _idb = e.target.result; resolve(_idb); };
      req.onerror   = ()  => resolve(null);
    });
  }

  async function persistToIDB(item) {
    const db = await openIDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({
      id: item.id, rollId: item.rollId, eventId: item.eventId,
      shotNumber: item.shotNumber, style: item.style,
      originalBlob: item.originalBlob, developedBlob: item.developedBlob,
      retries: item.retries,
    });
  }

  async function removeFromIDB(id) {
    const db = await openIDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
  }

  async function loadQueueFromIDB() {
    const db = await openIDB();
    if (!db) return [];
    return new Promise(resolve => {
      const tx  = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror   = () => resolve([]);
    });
  }

  /* ─────────────────────────────────────────────
     CLOUDINARY UPLOAD
  ───────────────────────────────────────────── */
  async function uploadToCloudinary({ blob, publicId }) {
    const cfg = window.HVC_CONFIG;
    if (!cfg?.cloudinaryCloud || !cfg?.cloudinaryPreset) {
      throw new Error('Cloudinary not configured');
    }

    const form = new FormData();
    form.append('file', blob);
    form.append('upload_preset', cfg.cloudinaryPreset);
    form.append('public_id', publicId);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cfg.cloudinaryCloud}/image/upload`,
      { method: 'POST', body: form }
    );

    if (!res.ok) {
      const err = await res.text().catch(() => res.status);
      throw new Error(`Cloudinary ${res.status}: ${err}`);
    }

    const json = await res.json();
    return json.secure_url; // Full HTTPS URL
  }

  /* ─────────────────────────────────────────────
     UPLOAD ONE ITEM
  ───────────────────────────────────────────── */
  async function uploadItem(item) {
    const base    = `thehvstory/camera/rolls/${item.rollId}`;
    const shotStr = String(item.shotNumber).padStart(3, '0');

    // Original
    const originalUrl = await uploadToCloudinary({
      blob:     item.originalBlob,
      publicId: `${base}/original/shot-${shotStr}`,
    });

    // Developed (with film effect applied)
    const developedUrl = await uploadToCloudinary({
      blob:     item.developedBlob,
      publicId: `${base}/developed/shot-${shotStr}`,
    });

    // Update Supabase photos table with the Cloudinary URLs
    await window.CameraDB.updatePhotoUrls({
      photoId:      item.id,
      originalUrl,
      developedUrl,
    });
  }

  /* ─────────────────────────────────────────────
     ENQUEUE
  ───────────────────────────────────────────── */
  async function enqueue({ id, rollId, eventId, shotNumber, style, originalBlob, developedBlob }) {
    const item = {
      id, rollId, eventId, shotNumber, style,
      originalBlob, developedBlob,
      retries: 0,
      status:  'queued',
    };

    queue.push(item);
    await persistToIDB(item);

    if (!workerRunning) runWorker();
  }

  /* ─────────────────────────────────────────────
     BACKGROUND WORKER
  ───────────────────────────────────────────── */
  async function runWorker() {
    workerRunning = true;

    while (queue.length > 0) {
      const item = queue.find(i => i.status === 'queued');
      if (!item) break;

      item.status = 'uploading';

      try {
        await uploadItem(item);
        item.status = 'done';
        await removeFromIDB(item.id);
        const idx = queue.indexOf(item);
        if (idx > -1) queue.splice(idx, 1);
      } catch (err) {
        item.retries += 1;
        console.warn(`[upload] Shot ${item.shotNumber} attempt ${item.retries} failed:`, err.message);

        if (item.retries >= MAX_RETRIES) {
          item.status = 'failed';
          await window.CameraDB.markPhotoFailed(item.id).catch(() => {});
          await removeFromIDB(item.id);
          const idx = queue.indexOf(item);
          if (idx > -1) queue.splice(idx, 1);
        } else {
          item.status = 'queued';
          const delay = RETRY_BASE_MS * Math.pow(2, item.retries - 1);
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }

    workerRunning = false;
  }

  /* ─────────────────────────────────────────────
     RECOVER FROM IDB ON BOOT
  ───────────────────────────────────────────── */
  async function recoverPendingUploads() {
    const saved = await loadQueueFromIDB();
    if (!saved.length) return;
    console.log(`[upload] Recovering ${saved.length} pending upload(s)`);
    for (const item of saved) {
      if (!queue.find(q => q.id === item.id)) {
        item.status = 'queued';
        queue.push(item);
      }
    }
    if (!workerRunning && queue.length > 0) runWorker();
  }

  /* ─────────────────────────────────────────────
     ONLINE RECONNECT
  ───────────────────────────────────────────── */
  window.addEventListener('online', () => {
    if (!workerRunning && queue.some(i => i.status === 'queued')) {
      runWorker();
    }
  });

  /* ─────────────────────────────────────────────
     STATUS
  ───────────────────────────────────────────── */
  function getQueueStatus() {
    return {
      total:     queue.length,
      queued:    queue.filter(i => i.status === 'queued').length,
      uploading: queue.filter(i => i.status === 'uploading').length,
      failed:    queue.filter(i => i.status === 'failed').length,
    };
  }

  /* ─────────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────────── */
  window.CameraUpload = {
    enqueue,
    recoverPendingUploads,
    getQueueStatus,
  };
})();

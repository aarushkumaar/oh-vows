-- ════════════════════════════════════════════════════════════
-- HV Story Camera — Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TABLE: events
CREATE TABLE IF NOT EXISTS events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text UNIQUE NOT NULL,
  active        boolean DEFAULT true,
  shots_allowed integer NOT NULL DEFAULT 30,
  styles        text[] NOT NULL DEFAULT ARRAY['FLASH','FILM','NOIR','POLAROID'],
  created_at    timestamptz DEFAULT now()
);

INSERT INTO events (name, slug, active, shots_allowed)
VALUES ('Vartika & Hardik Wedding', 'thehvstory', true, 30)
ON CONFLICT (slug) DO NOTHING;

-- TABLE: guests
CREATE TABLE IF NOT EXISTS guests (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name           text NOT NULL,
  session_token  text UNIQUE NOT NULL,
  device_hint    text,
  created_at     timestamptz DEFAULT now()
);

-- TABLE: rolls
CREATE TABLE IF NOT EXISTS rolls (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id      uuid NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  event_id      uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  roll_number   integer,
  style         text NOT NULL,
  shots_allowed integer NOT NULL DEFAULT 30,
  shots_used    integer NOT NULL DEFAULT 0,
  status        text NOT NULL DEFAULT 'active',
  created_at    timestamptz DEFAULT now(),
  completed_at  timestamptz,
  CONSTRAINT rolls_shots_check CHECK (shots_used >= 0 AND shots_used <= shots_allowed),
  CONSTRAINT rolls_status_check CHECK (status IN ('active','completed','developed'))
);

CREATE OR REPLACE FUNCTION assign_roll_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.roll_number := (
    SELECT COALESCE(MAX(roll_number), 0) + 1
    FROM rolls WHERE event_id = NEW.event_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_roll_number
  BEFORE INSERT ON rolls
  FOR EACH ROW EXECUTE FUNCTION assign_roll_number();

-- TABLE: photos
CREATE TABLE IF NOT EXISTS photos (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_id        uuid NOT NULL REFERENCES rolls(id) ON DELETE CASCADE,
  event_id       uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  shot_number    integer NOT NULL,
  original_path  text,
  developed_path text,
  style          text NOT NULL,
  upload_status  text NOT NULL DEFAULT 'pending',
  created_at     timestamptz DEFAULT now(),
  CONSTRAINT photos_status_check CHECK (upload_status IN ('pending','uploaded','failed'))
);

-- TABLE: notes (future-ready)
CREATE TABLE IF NOT EXISTS notes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_id    uuid NOT NULL REFERENCES rolls(id) ON DELETE CASCADE,
  message    text,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE rolls   ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_public_read"  ON events  FOR SELECT USING (active = true);
CREATE POLICY "guests_insert"       ON guests  FOR INSERT WITH CHECK (true);
CREATE POLICY "guests_read_own"     ON guests  FOR SELECT USING (true);
CREATE POLICY "rolls_insert"        ON rolls   FOR INSERT WITH CHECK (true);
CREATE POLICY "rolls_read_own"      ON rolls   FOR SELECT USING (true);
CREATE POLICY "rolls_update_own"    ON rolls   FOR UPDATE USING (true);
CREATE POLICY "photos_insert"       ON photos  FOR INSERT WITH CHECK (true);
CREATE POLICY "photos_read_own"     ON photos  FOR SELECT USING (true);
CREATE POLICY "notes_insert"        ON notes   FOR INSERT WITH CHECK (true);
CREATE POLICY "notes_read_own"      ON notes   FOR SELECT USING (true);

-- ════════════════════════════════════════════════════════════
-- RPC FUNCTION: increment_shots
-- Atomically increments shots_used on a roll.
-- Returns the new shots_used value.
-- Enforced by CHECK constraint (rolls_shots_check).
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION increment_shots(roll_id uuid)
RETURNS integer AS $$
DECLARE
  new_shots integer;
BEGIN
  UPDATE rolls
  SET shots_used = shots_used + 1
  WHERE id = roll_id
    AND shots_used < shots_allowed
  RETURNING shots_used INTO new_shots;

  -- If no row was updated, the roll is already full
  IF new_shots IS NULL THEN
    RAISE EXCEPTION 'Roll is full or does not exist';
  END IF;

  RETURN new_shots;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant anon users access to call this function
GRANT EXECUTE ON FUNCTION increment_shots(uuid) TO anon;

-- ════════════════════════════════════════════════════════════
-- STORAGE SETUP INSTRUCTIONS
-- Run the following in Supabase Dashboard > Storage:
--
--  1. Create bucket: photos-original
--     - Public: OFF (private)
--     - File size limit: 10MB
--
--  2. Create bucket: photos-developed
--     - Public: OFF (private)
--     - File size limit: 10MB
--
-- Then add these Storage RLS policies:
-- ════════════════════════════════════════════════════════════

-- Storage policy: authenticated admin can read all
-- (Set these in Dashboard > Storage > Policies > photos-original / photos-developed)
--
-- For anon INSERT (guests uploading):
-- Bucket: photos-original
-- Operation: INSERT
-- Policy: (true)  -- any authenticated request can upload
--
-- Bucket: photos-developed
-- Operation: INSERT
-- Policy: (true)

-- ════════════════════════════════════════════════════════════
-- SUPABASE AUTH SETUP
-- Create the admin user in Dashboard > Authentication > Users:
--   Email:    aarush@thehvstory.in
--   Password: (set a strong password)
--   Confirm email: YES (auto-confirm)
-- ════════════════════════════════════════════════════════════

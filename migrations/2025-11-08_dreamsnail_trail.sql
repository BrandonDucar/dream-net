-- DreamSnail TrailCommit placeholder storage
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS dreamsnail_trail_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commitment text NOT NULL,
  nullifier text,
  root text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS dreamsnail_trail_events_commitment_idx
  ON dreamsnail_trail_events (commitment);

CREATE INDEX IF NOT EXISTS dreamsnail_trail_events_timestamp_idx
  ON dreamsnail_trail_events (timestamp DESC);

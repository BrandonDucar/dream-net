export const VAULT_POSTGRES_SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS vault_sources (
  id text PRIMARY KEY,
  kind text NOT NULL,
  name text NOT NULL,
  system text NOT NULL,
  scope text NOT NULL,
  auth_state text NOT NULL,
  endpoint text,
  last_seen_at timestamptz NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS vault_objects (
  id text PRIMARY KEY,
  source_id text NOT NULL REFERENCES vault_sources(id),
  kind text NOT NULL,
  external_id text NOT NULL,
  uri text NOT NULL,
  title text NOT NULL,
  content_hash text,
  size_bytes bigint,
  mime_type text,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  sensitivity text NOT NULL,
  indexed_at timestamptz NOT NULL,
  blob_pointer text,
  vector_ref text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  embedding vector(1536)
);

CREATE INDEX IF NOT EXISTS vault_objects_source_idx ON vault_objects(source_id);
CREATE INDEX IF NOT EXISTS vault_objects_hash_idx ON vault_objects(content_hash);
CREATE INDEX IF NOT EXISTS vault_objects_tags_idx ON vault_objects USING gin(tags);
CREATE INDEX IF NOT EXISTS vault_objects_metadata_idx ON vault_objects USING gin(metadata);

CREATE TABLE IF NOT EXISTS vault_events (
  id text PRIMARY KEY,
  type text NOT NULL,
  severity text NOT NULL,
  source_id text NOT NULL REFERENCES vault_sources(id),
  object_id text REFERENCES vault_objects(id),
  message text NOT NULL,
  created_at timestamptz NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS vault_events_source_idx ON vault_events(source_id);
CREATE INDEX IF NOT EXISTS vault_events_severity_idx ON vault_events(severity);
CREATE INDEX IF NOT EXISTS vault_events_created_idx ON vault_events(created_at DESC);

CREATE TABLE IF NOT EXISTS vault_receipts (
  id text PRIMARY KEY,
  schema_version text NOT NULL,
  job_id text NOT NULL,
  source_ids text[] NOT NULL,
  action text NOT NULL,
  status text NOT NULL,
  started_at timestamptz NOT NULL,
  finished_at timestamptz NOT NULL,
  object_count integer NOT NULL,
  event_count integer NOT NULL,
  auth_context jsonb NOT NULL,
  sensitivity text NOT NULL,
  destination_pointer text,
  previous_hash text,
  hash text NOT NULL UNIQUE,
  errors text[] NOT NULL DEFAULT '{}'::text[],
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS vault_receipts_job_idx ON vault_receipts(job_id);
CREATE INDEX IF NOT EXISTS vault_receipts_finished_idx ON vault_receipts(finished_at DESC);

CREATE TABLE IF NOT EXISTS vault_index_jobs (
  id text PRIMARY KEY,
  name text NOT NULL,
  source_kind text NOT NULL,
  mode text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  handler_name text NOT NULL,
  schedule text,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
`;

export function printVaultPostgresSchema(): string {
  return VAULT_POSTGRES_SCHEMA_SQL.trim();
}

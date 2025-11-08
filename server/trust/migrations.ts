import { sql } from "drizzle-orm";
import { db } from "../db";

const TRUST_SCHEMA = "dreamnet_trust";

let initialized = false;

async function createSchema() {
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS ${sql.raw(TRUST_SCHEMA)};`);
}

async function createVectorLedger() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ${sql.raw(`${TRUST_SCHEMA}.vector_events`)} (
      id TEXT PRIMARY KEY,
      object_type TEXT NOT NULL,
      object_id TEXT NOT NULL,
      model TEXT NOT NULL,
      dim INTEGER NOT NULL,
      hash_algo TEXT NOT NULL DEFAULT 'SHA-256',
      vec_hash TEXT NOT NULL,
      payload_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS vector_events_object_idx
      ON ${sql.raw(`${TRUST_SCHEMA}.vector_events`)} (object_type, object_id);
  `);
}

async function createReputationGraph() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ${sql.raw(`${TRUST_SCHEMA}.rep_nodes`)} (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ${sql.raw(`${TRUST_SCHEMA}.rep_edges`)} (
      src TEXT NOT NULL,
      dst TEXT NOT NULL,
      kind TEXT NOT NULL,
      weight DOUBLE PRECISION NOT NULL DEFAULT 1.0,
      signature TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (src, dst, kind),
      FOREIGN KEY (src) REFERENCES ${sql.raw(`${TRUST_SCHEMA}.rep_nodes`)} (id) ON DELETE CASCADE,
      FOREIGN KEY (dst) REFERENCES ${sql.raw(`${TRUST_SCHEMA}.rep_nodes`)} (id) ON DELETE CASCADE
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ${sql.raw(`${TRUST_SCHEMA}.rep_scores`)} (
      node_id TEXT PRIMARY KEY REFERENCES ${sql.raw(`${TRUST_SCHEMA}.rep_nodes`)} (id) ON DELETE CASCADE,
      score DOUBLE PRECISION NOT NULL,
      computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function createZkLayer() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ${sql.raw(`${TRUST_SCHEMA}.zk_attestations`)} (
      content_hash TEXT PRIMARY KEY,
      proof_hash TEXT NOT NULL,
      backend TEXT NOT NULL,
      anchor_root TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function createWatchdogTables() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ${sql.raw(`${TRUST_SCHEMA}.repo_fingerprints`)} (
      snapshot_id TEXT NOT NULL,
      path TEXT NOT NULL,
      hash_algo TEXT NOT NULL DEFAULT 'SHA-256',
      hash TEXT NOT NULL,
      size_bytes BIGINT,
      recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (snapshot_id, path)
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ${sql.raw(`${TRUST_SCHEMA}.watchdog_alerts`)} (
      alert_id TEXT PRIMARY KEY,
      severity TEXT NOT NULL,
      message TEXT NOT NULL,
      diff JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function createMetricsView() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ${sql.raw(`${TRUST_SCHEMA}.trust_metrics`)} (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

export async function runTrustMigrations() {
  if (initialized) return;

  await createSchema();
  await Promise.all([
    createVectorLedger(),
    createReputationGraph(),
    createZkLayer(),
    createWatchdogTables(),
    createMetricsView(),
  ]);

  initialized = true;
}

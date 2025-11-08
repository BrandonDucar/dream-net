import { sql, desc, and, inArray, gt, eq } from "drizzle-orm";
import { db } from "../db";
import {
  starbridgeEvents,
  insertStarbridgeEventSchema,
  StarbridgeEventRecord,
} from "@shared/schema";
import { StarbridgeEvent } from "./types";

let initialized = false;

async function ensureInitialized() {
  if (initialized) return;

  await db.execute(sql`
    DO $$
    BEGIN
      CREATE TYPE starbridge_topic AS ENUM ('Governor', 'Deploy', 'System', 'Economy', 'Vault');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$
    BEGIN
      CREATE TYPE starbridge_source AS ENUM ('Runtime', 'ComputeGovernor', 'DeployKeeper', 'DreamKeeper', 'RelayBot', 'External');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS starbridge_events (
      id TEXT PRIMARY KEY,
      topic starbridge_topic NOT NULL,
      source starbridge_source NOT NULL,
      type TEXT NOT NULL,
      ts TIMESTAMPTZ NOT NULL DEFAULT now(),
      payload JSONB,
      replayed BOOLEAN NOT NULL DEFAULT false
    );
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS starbridge_events_ts_idx ON starbridge_events (ts DESC);
  `);

  initialized = true;
}

export async function persistEvent(event: StarbridgeEvent) {
  await ensureInitialized();
  const parsed = insertStarbridgeEventSchema.parse({
    id: event.id,
    topic: event.topic,
    source: event.source,
    type: event.type,
    ts: event.ts,
    payload: event.payload ?? null,
  });

  await db
    .insert(starbridgeEvents)
    .values(parsed)
    .onConflictDoNothing({ target: starbridgeEvents.id });
}

export async function markEventReplayed(id: string) {
  await ensureInitialized();
  await db
    .update(starbridgeEvents)
    .set({ replayed: true })
    .where(eq(starbridgeEvents.id, id));
}

interface FetchOptions {
  topics?: string[];
  limit?: number;
  since?: Date;
}

export async function fetchEvents(options: FetchOptions = {}): Promise<StarbridgeEventRecord[]> {
  await ensureInitialized();
  const { topics, limit = 100, since } = options;

  const conditions = [];
  if (topics && topics.length > 0) {
    conditions.push(inArray(starbridgeEvents.topic, topics));
  }
  if (since) {
    conditions.push(gt(starbridgeEvents.ts, since));
  }

  let query = db.select().from(starbridgeEvents);

  if (conditions.length === 1) {
    query = query.where(conditions[0]);
  } else if (conditions.length > 1) {
    query = query.where(and(...(conditions as [any, any, ...any[]])));
  }

  query = query.orderBy(desc(starbridgeEvents.ts)).limit(limit);

  return query;
}

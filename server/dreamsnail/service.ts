import { db, executeWithRetry } from "../db";
import {
  dreamsnailTrailEvents,
  insertDreamsnailTrailEventSchema,
} from "@shared/schema";
import { desc } from "drizzle-orm";

export async function recordTrailEvent(input: unknown) {
  const parsed = insertDreamsnailTrailEventSchema.parse(input);
  const [record] = await executeWithRetry(() =>
    db
      .insert(dreamsnailTrailEvents)
      .values({
        commitment: parsed.commitment,
        nullifier: parsed.nullifier ?? null,
        root: parsed.root ?? "",
        timestamp: parsed.timestamp ?? new Date(),
      })
      .onConflictDoNothing({ target: dreamsnailTrailEvents.commitment })
      .returning(),
  );

  if (record) return record;

  const existing = await executeWithRetry(() =>
    db.query.dreamsnailTrailEvents.findFirst({
      where: (events, { eq }) => eq(events.commitment, parsed.commitment),
    }),
  );
  if (existing) return existing;
  throw new Error("Failed to record DreamSnail trail event");
}

export async function verifyTrailCommitment(commitment: string) {
  const record = await executeWithRetry(() =>
    db.query.dreamsnailTrailEvents.findFirst({
      where: (events, { eq }) => eq(events.commitment, commitment),
    }),
  );
  return record;
}

export async function latestTrailRoot() {
  const record = await executeWithRetry(() =>
    db.query.dreamsnailTrailEvents.findFirst({
      orderBy: desc(dreamsnailTrailEvents.timestamp),
    }),
  );
  return record?.root ?? null;
}

export async function listTrailEvents(limit = 20) {
  return executeWithRetry(() =>
    db.query.dreamsnailTrailEvents.findMany({
      orderBy: desc(dreamsnailTrailEvents.timestamp),
      limit,
    }),
  );
}

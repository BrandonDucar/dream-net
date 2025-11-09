import { db, executeWithRetry } from "../db";
import {
  dreamstarGenerations,
  dreamstarIngestions,
  insertDreamstarGenerationSchema,
  insertDreamstarIngestionSchema,
} from "@shared/schema";
import { desc } from "drizzle-orm";

export async function createDreamstarIngestion(input: unknown) {
  const payload = insertDreamstarIngestionSchema.parse(input);
  const [record] = await executeWithRetry(() =>
    db.insert(dreamstarIngestions).values(payload).returning(),
  );
  return record;
}

export async function createDreamstarGeneration(input: unknown) {
  const payload = insertDreamstarGenerationSchema.parse(input);
  const [record] = await executeWithRetry(() =>
    db.insert(dreamstarGenerations).values(payload).returning(),
  );
  return record;
}

export async function getRecentDreamstarMissions(limit = 10) {
  const [ingestions, generations] = await Promise.all([
    executeWithRetry(() =>
      db.query.dreamstarIngestions.findMany({
        orderBy: desc(dreamstarIngestions.createdAt),
        limit,
      }),
    ),
    executeWithRetry(() =>
      db.query.dreamstarGenerations.findMany({
        orderBy: desc(dreamstarGenerations.createdAt),
        limit,
      }),
    ),
  ]);

  return { ingestions, generations };
}

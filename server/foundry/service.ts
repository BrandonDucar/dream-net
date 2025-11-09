import { db, executeWithRetry } from "../db";
import {
  foundryTraits,
  foundryHybrids,
  insertFoundryTraitSchema,
  insertFoundryHybridSchema,
} from "@shared/schema";
import { desc } from "drizzle-orm";

export async function ingestTrait(input: unknown) {
  const payload = insertFoundryTraitSchema.parse(input);
  const [record] = await executeWithRetry(() =>
    db.insert(foundryTraits).values(payload).returning(),
  );
  return record;
}

export async function createHybrid(input: unknown) {
  const payload = insertFoundryHybridSchema.parse(input);
  const [record] = await executeWithRetry(() =>
    db.insert(foundryHybrids).values(payload).returning(),
  );
  return record;
}

export async function listTraits(limit = 20) {
  return executeWithRetry(() =>
    db.query.foundryTraits.findMany({
      orderBy: desc(foundryTraits.createdAt),
      limit,
    }),
  );
}

export async function listHybrids(limit = 20) {
  return executeWithRetry(() =>
    db.query.foundryHybrids.findMany({
      orderBy: desc(foundryHybrids.createdAt),
      limit,
    }),
  );
}

import { sql } from "drizzle-orm";
import { performance } from "perf_hooks";
import { db } from "../db";
import { nanoid } from "nanoid";
import { hashJson, hashVector, hashBuffer, activeHashAlgo, HashAlgorithm } from "../trust/hash";
import { publishInternalEvent, StarbridgeSource, StarbridgeTopic } from "../starbridge";
import { computeMerkleRoot } from "../trust/merkle";
import { recordMetric } from "../trust/metrics";

const TABLE = "dreamnet_trust.vector_events";

export interface VectorLogInput {
  objectType: string;
  objectId: string;
  model: string;
  vector?: number[];
  payload?: unknown;
  hashAlgo?: HashAlgorithm;
}

export interface VectorEventRecord {
  id: string;
  object_type: string;
  object_id: string;
  model: string;
  dim: number;
  hash_algo: string;
  vec_hash: string;
  payload_hash: string;
  created_at: Date;
}

export async function logVectorEvent(input: VectorLogInput): Promise<VectorEventRecord> {
  const id = nanoid();
  const vector = input.vector ?? [];
  const dim = vector.length;
  const algo = input.hashAlgo ?? activeHashAlgo;
  const vecHash = hashVector(vector, algo);
  const payloadHash = hashJson(input.payload ?? {}, algo);

  await db.execute(sql`
    INSERT INTO ${sql.raw(TABLE)} (id, object_type, object_id, model, dim, hash_algo, vec_hash, payload_hash)
    VALUES (${id}, ${input.objectType}, ${input.objectId}, ${input.model}, ${dim}, ${algo}, ${vecHash}, ${payloadHash})
    ON CONFLICT (id) DO NOTHING;
  `);

  const record = await db.execute(sql`
    SELECT * FROM ${sql.raw(TABLE)} WHERE id = ${id}
  `);

  const row = (record.rows?.[0] ?? {}) as VectorEventRecord;

  await publishInternalEvent({
    topic: StarbridgeTopic.System,
    source: StarbridgeSource.Runtime,
    type: "vector.event.logged",
    payload: {
      id,
      objectType: input.objectType,
      objectId: input.objectId,
      model: input.model,
      hashAlgo: algo,
    },
  });

  await recordMetric("vector.events", {
    lastEventId: id,
    lastObjectType: input.objectType,
    lastObjectId: input.objectId,
    lastModel: input.model,
    lastHashAlgo: algo,
    lastCreatedAt: new Date().toISOString(),
  });

  return row;
}

export async function getVectorHistory(objectType: string, objectId: string, limit = 100) {
  const result = await db.execute(sql`
    SELECT * FROM ${sql.raw(TABLE)}
    WHERE object_type = ${objectType} AND object_id = ${objectId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `);

  return result.rows as VectorEventRecord[];
}

export async function getVectorEvent(id: string) {
  const result = await db.execute(sql`
    SELECT * FROM ${sql.raw(TABLE)}
    WHERE id = ${id}
    LIMIT 1
  `);

  return (result.rows?.[0] ?? null) as VectorEventRecord | null;
}

export interface VectorVerifyInput {
  id: string;
  vector?: number[];
  payload?: unknown;
}

export async function verifyVectorEvent(input: VectorVerifyInput) {
  const start = performance.now?.() ?? Date.now();
  const record = await getVectorEvent(input.id);
  if (!record) {
    await recordMetric("vector.verify", {
      lastId: input.id,
      ok: false,
      reason: "not_found",
      latencyMs: (performance.now?.() ?? Date.now()) - start,
    });
    return { ok: false, reason: "not_found" } as const;
  }

  const algo = record.hash_algo as HashAlgorithm;
  const vecHash = input.vector ? hashVector(input.vector, algo) : null;
  const payloadHash = input.payload ? hashJson(input.payload, algo) : null;

  const vecMatches = vecHash ? vecHash === record.vec_hash : true;
  const payloadMatches = payloadHash ? payloadHash === record.payload_hash : true;

  const result = {
    ok: vecMatches && payloadMatches,
    vecMatches,
    payloadMatches,
    expectedVecHash: record.vec_hash,
    computedVecHash: vecHash ?? undefined,
    expectedPayloadHash: record.payload_hash,
    computedPayloadHash: payloadHash ?? undefined,
  };

  await recordMetric("vector.verify", {
    lastId: input.id,
    ok: result.ok,
    vecMatches,
    payloadMatches,
    latencyMs: (performance.now?.() ?? Date.now()) - start,
    timestamp: new Date().toISOString(),
  });

  return result;
}

export async function runVectorRollup(date: Date) {
  const batchDate = date.toISOString().slice(0, 10);
  const result = await db.execute(sql`
    SELECT vec_hash, payload_hash, hash_algo
    FROM ${sql.raw(TABLE)}
    WHERE DATE(created_at) = ${batchDate}
    ORDER BY created_at ASC
  `);

  const rows = result.rows as Array<{ vec_hash: string; payload_hash: string; hash_algo: string }>;
  if (rows.length === 0) {
    return null;
  }

  const algo = rows[0].hash_algo as HashAlgorithm;
  const leaves = rows.map((row) => {
    const combined = Buffer.from(`${row.vec_hash}:${row.payload_hash}`, "utf-8");
    return hashBuffer(combined, algo);
  });

  const merkleRoot = computeMerkleRoot(leaves, algo);

  await db.execute(sql`
    INSERT INTO ${sql.raw("dreamnet_trust.vector_roots")} (batch_date, merkle_root, hash_algo, event_count)
    VALUES (${batchDate}, ${merkleRoot}, ${algo}, ${rows.length})
    ON CONFLICT (batch_date)
    DO UPDATE SET merkle_root = EXCLUDED.merkle_root,
                  hash_algo = EXCLUDED.hash_algo,
                  event_count = EXCLUDED.event_count,
                  computed_at = NOW();
  `);

  await publishInternalEvent({
    topic: StarbridgeTopic.System,
    source: StarbridgeSource.Runtime,
    type: "vector.rollup.completed",
    payload: {
      batchDate,
      merkleRoot,
      hashAlgo: algo,
      eventCount: rows.length,
    },
  });

  await recordMetric("vector.rollup", {
    batchDate,
    merkleRoot,
    hashAlgo: algo,
    eventCount: rows.length,
    computedAt: new Date().toISOString(),
  });

  return { batchDate, merkleRoot, hashAlgo: algo, eventCount: rows.length };
}

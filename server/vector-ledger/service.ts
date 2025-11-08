import { sql } from "drizzle-orm";
import { db } from "../db";
import { nanoid } from "nanoid";
import { hashJson, hashVector, activeHashAlgo, HashAlgorithm } from "../trust/hash";
import { publishInternalEvent, StarbridgeSource, StarbridgeTopic } from "../starbridge";

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
  const record = await getVectorEvent(input.id);
  if (!record) {
    return { ok: false, reason: "not_found" } as const;
  }

  const algo = record.hash_algo as HashAlgorithm;
  const vecHash = input.vector ? hashVector(input.vector, algo) : null;
  const payloadHash = input.payload ? hashJson(input.payload, algo) : null;

  const vecMatches = vecHash ? vecHash === record.vec_hash : true;
  const payloadMatches = payloadHash ? payloadHash === record.payload_hash : true;

  return {
    ok: vecMatches && payloadMatches,
    vecMatches,
    payloadMatches,
    expectedVecHash: record.vec_hash,
    computedVecHash: vecHash ?? undefined,
    expectedPayloadHash: record.payload_hash,
    computedPayloadHash: payloadHash ?? undefined,
  };
}

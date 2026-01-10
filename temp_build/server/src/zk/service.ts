import fs from "fs/promises";
import path from "path";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { hashJson, activeHashAlgo } from "../trust/hash";
import { recordMetric } from "../trust/metrics";
import { publishInternalEvent, StarbridgeSource, StarbridgeTopic } from "../starbridge";

const TABLE = "dreamnet_trust.zk_attestations";
const ROOTS_TABLE = "dreamnet_trust.zk_roots";

let snark: typeof import("snarkjs") | null = null;

async function getSnark() {
  if (!snark) {
    snark = await import("snarkjs");
  }
  return snark!;
}

function artifactPaths() {
  const base = process.env.ZK_ARTIFACT_BUCKET ?? path.resolve(process.cwd(), "zk-artifacts");
  const wasm = process.env.ZK_WASM_PATH ?? path.join(base, "content_ok.wasm");
  const zkey = process.env.ZK_ZKEY_PATH ?? path.join(base, "content_ok.zkey");
  const vkey = process.env.ZK_VKEY_PATH ?? path.join(base, "content_ok.vkey.json");
  return { wasm, zkey, vkey };
}

async function ensureArtifacts() {
  const { wasm, zkey, vkey } = artifactPaths();
  for (const file of [wasm, zkey, vkey]) {
    try {
      await fs.access(file);
    } catch {
      return false;
    }
  }
  return true;
}

export async function proveContent(payload: unknown) {
  if (!process.env.ZK_BACKEND || process.env.ZK_BACKEND !== "circom") {
    throw new Error("ZK_BACKEND must be set to circom");
  }

  if (!(await ensureArtifacts())) {
    throw new Error("ZK artifacts missing; ensure wasm/zkey/vkey are present");
  }

  const snarkjs = await getSnark();
  const { wasm, zkey } = artifactPaths();
  const input = { content: hashJson(payload, activeHashAlgo) };
  const proof = await snarkjs.groth16.fullProve(input, wasm, zkey);

  return {
    proof: proof.proof,
    publicSignals: proof.publicSignals,
    contentHash: input.content,
  };
}

export async function verifyContent(content: unknown, proof: any, publicSignals: string[]) {
  if (!(await ensureArtifacts())) {
    throw new Error("ZK artifacts missing; ensure wasm/zkey/vkey are present");
  }
  const snarkjs = await getSnark();
  const { vkey } = artifactPaths();
  const vKeyJson = JSON.parse(await fs.readFile(vkey, "utf-8"));
  const ok = await snarkjs.groth16.verify(vKeyJson, publicSignals, proof);
  if (!ok) {
    return { ok: false };
  }

  const contentHash = hashJson(content, activeHashAlgo);

  await db.execute(sql`
    INSERT INTO ${sql.raw(TABLE)} (content_hash, proof_hash, backend, anchor_root)
    VALUES (${contentHash}, ${hashJson({ proof, publicSignals }, activeHashAlgo)}, ${process.env.ZK_BACKEND ?? "circom"}, NULL)
    ON CONFLICT (content_hash)
    DO UPDATE SET proof_hash = EXCLUDED.proof_hash, created_at = NOW();
  `);

  await recordMetric("zk.attestations", {
    lastContentHash: contentHash,
    lastProvedAt: new Date().toISOString(),
  });

  await publishInternalEvent({
    topic: StarbridgeTopic.System,
    source: StarbridgeSource.Runtime,
    type: "zk.attestation.recorded",
    payload: { contentHash },
  });

  return { ok: true, contentHash };
}

export async function getAttestation(contentHash: string) {
  const result = await db.execute(sql`
    SELECT * FROM ${sql.raw(TABLE)} WHERE content_hash = ${contentHash}
  `);
  return result.rows?.[0] ?? null;
}

import crypto from "crypto";
import blake3 from "blake3";

const HASH_ALGOS = ["SHA-256", "SHA3-512", "BLAKE3"] as const;

export type HashAlgorithm = (typeof HASH_ALGOS)[number];

function resolveAlgo(): HashAlgorithm {
  const envAlgo = (process.env.HASH_ALGO ?? "SHA-256").toUpperCase();
  if (HASH_ALGOS.includes(envAlgo as HashAlgorithm)) {
    return envAlgo as HashAlgorithm;
  }
  return "SHA-256";
}

export const activeHashAlgo: HashAlgorithm = resolveAlgo();

export function hashBuffer(buffer: Buffer, algo: HashAlgorithm = activeHashAlgo): string {
  switch (algo) {
    case "SHA3-512":
      return crypto.createHash("sha3-512").update(buffer).digest("hex");
    case "BLAKE3":
      return blake3.hash(buffer).toString("hex");
    case "SHA-256":
    default:
      return crypto.createHash("sha256").update(buffer).digest("hex");
  }
}

export function hashJson(payload: unknown, algo: HashAlgorithm = activeHashAlgo): string {
  const serialized = Buffer.from(JSON.stringify(payload ?? {}));
  return hashBuffer(serialized, algo);
}

export function hashVector(vector: number[], algo: HashAlgorithm = activeHashAlgo): string {
  const buffer = Buffer.from(Float32Array.from(vector).buffer);
  return hashBuffer(buffer, algo);
}

export function availableAlgos(): HashAlgorithm[] {
  return [...HASH_ALGOS];
}

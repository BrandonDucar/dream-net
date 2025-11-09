import { createHash, createHmac, randomBytes } from "crypto";

const HKDF_LENGTH = 32;

function hkdf(secret: Buffer, info: string, length = HKDF_LENGTH) {
  const salt = Buffer.alloc(length, 0);
  const prk = createHmac("sha256", salt).update(secret).digest();
  let previous = Buffer.alloc(0);
  const buffers: Buffer[] = [];
  let i = 0;
  while (Buffer.concat(buffers).length < length) {
    i += 1;
    previous = createHmac("sha256", prk).update(Buffer.concat([previous, Buffer.from(info), Buffer.from([i])])).digest();
    buffers.push(previous);
  }
  return Buffer.concat(buffers).slice(0, length);
}

export function deriveMasterSeed(entropy?: Buffer | string) {
  const input = typeof entropy === "string" ? Buffer.from(entropy) : entropy ?? randomBytes(32);
  return createHash("sha256").update(input).digest("hex");
}

export function deriveShellSeed(masterSeed: string, context = "dreamsnail-shell") {
  const material = hkdf(Buffer.from(masterSeed, "hex"), context);
  return material.toString("hex");
}

export function deriveHelixHash(seed: string, mod = "dreamsnail-helix") {
  return createHash("sha256").update(seed + mod).digest("hex");
}

export function deriveNetworkKey(chain: string, index: number) {
  const material = hkdf(Buffer.from(chain + ":" + index), "dreamsnail-network");
  return material.toString("hex");
}

export function deriveZkSalt(seed: string, epoch: number) {
  const material = hkdf(Buffer.from(seed + ":" + epoch), "dreamsnail-zksalt");
  return material.toString("hex");
}

export function deriveRelayerNonce(epoch: number, extra?: string) {
  const base = Buffer.from(`${epoch}:${extra ?? ""}`);
  return createHash("sha256").update(base).digest("hex");
}

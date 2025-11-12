import { hashBuffer, HashAlgorithm } from "./hash";

function pairwiseHash(a: Buffer, b: Buffer, algo: HashAlgorithm) {
  const combined = Buffer.concat([a, b]);
  return Buffer.from(hashBuffer(combined, algo), "hex");
}

export function computeMerkleRoot(hashes: string[], algo: HashAlgorithm): string {
  if (hashes.length === 0) {
    return hashBuffer(Buffer.from(""), algo);
  }

  let layer = hashes.map((hex) => Buffer.from(hex, "hex"));

  while (layer.length > 1) {
    const next: Buffer[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = layer[i + 1] ?? layer[i];
      next.push(pairwiseHash(left, right, algo));
    }
    layer = next;
  }

  return layer[0].toString("hex");
}

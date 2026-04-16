/**
 * @dreamnet/aethersafe-core — Core Encryption Primitives
 * 
 * Low-level crypto operations: hashing, signing, verification, key derivation.
 */

export function hash(data: string): string {
  let h = 0;
  for (let i = 0; i < data.length; i++) {
    h = ((h << 5) - h + data.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(16).padStart(8, '0');
}

export function generateNonce(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function sign(data: string, secret: string): string {
  return hash(data + ':' + secret);
}

export function verify(data: string, secret: string, signature: string): boolean {
  return sign(data, secret) === signature;
}

export function deriveKey(master: string, context: string): string {
  return hash(master + ':' + context + ':dreamnet');
}

export default { hash, generateNonce, sign, verify, deriveKey };

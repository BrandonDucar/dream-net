/**
 * @dreamnet/aethersafe — Encrypted Data Vault
 * 
 * End-to-end encrypted storage for sensitive agent data, keys, and secrets.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'aethersafe',
  name: 'AetherSafe Vault',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['encryption', 'key-management', 'secure-storage', 'access-control'],
  metadata: { organ: 'immune', role: 'encrypted-vault' },
});

const vault: Map<string, { data: string; owner: string; createdAt: number }> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function store(key: string, data: string, owner: string): void {
  vault.set(key, { data, owner, createdAt: Date.now() });
}

export function retrieve(key: string, requestor: string): string | null {
  const entry = vault.get(key);
  if (!entry || entry.owner !== requestor) return null;
  return entry.data;
}

export function revoke(key: string, owner: string): boolean {
  const entry = vault.get(key);
  if (!entry || entry.owner !== owner) return false;
  vault.delete(key);
  return true;
}

export function listKeys(owner: string): string[] {
  return Array.from(vault.entries()).filter(([_, v]) => v.owner === owner).map(([k]) => k);
}

export { bridge };
export default { connect, store, retrieve, revoke, listKeys, bridge };

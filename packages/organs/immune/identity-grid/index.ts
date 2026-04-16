/**
 * @dreamnet/identity-grid — Decentralized Identity Management
 * 
 * Agent identity, DID resolution, passport verification, and identity linking.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'identity-grid',
  name: 'DreamNet Identity Grid',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['did-resolution', 'passport-verification', 'identity-linking', 'attestation'],
  metadata: { organ: 'immune', role: 'identity' },
});

export interface AgentIdentity { agentId: string; did?: string; passportId?: string; linkedAccounts: { platform: string; handle: string }[]; verifiedAt?: number; }

const identities: Map<string, AgentIdentity> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function register(identity: AgentIdentity): void { identities.set(identity.agentId, identity); }
export function resolve(agentId: string): AgentIdentity | undefined { return identities.get(agentId); }

export function linkAccount(agentId: string, platform: string, handle: string): void {
  const id = identities.get(agentId);
  if (id) { id.linkedAccounts.push({ platform, handle }); }
}

export function verifyPassport(agentId: string, passportId: string): boolean {
  const id = identities.get(agentId);
  if (!id || id.passportId !== passportId) return false;
  id.verifiedAt = Date.now();
  return true;
}

export function getAllIdentities(): AgentIdentity[] { return Array.from(identities.values()); }

export { bridge };
export default { connect, register, resolve, linkAccount, verifyPassport, getAllIdentities, bridge };

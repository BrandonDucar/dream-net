/**
 * @dreamnet/shield-core — Core Defense Shield
 * 
 * Firewall, DDoS protection, and request filtering for all DreamNet endpoints.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'shield-core',
  name: 'DreamNet Shield',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['firewall', 'ddos-protection', 'request-filtering', 'ip-blocking', 'geo-fencing'],
  metadata: { organ: 'immune', role: 'shield' },
});

const blockedIPs: Set<string> = new Set();
const blockedAgents: Set<string> = new Set();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function blockIP(ip: string): void { blockedIPs.add(ip); }
export function unblockIP(ip: string): void { blockedIPs.delete(ip); }
export function blockAgent(agentId: string): void { blockedAgents.add(agentId); }
export function unblockAgent(agentId: string): void { blockedAgents.delete(agentId); }

export function isAllowed(ip: string, agentId?: string): boolean {
  if (blockedIPs.has(ip)) return false;
  if (agentId && blockedAgents.has(agentId)) return false;
  return true;
}

export function getBlockedIPs(): string[] { return Array.from(blockedIPs); }
export function getBlockedAgents(): string[] { return Array.from(blockedAgents); }

export { bridge };
export default { connect, blockIP, unblockIP, blockAgent, unblockAgent, isAllowed, getBlockedIPs, getBlockedAgents, bridge };

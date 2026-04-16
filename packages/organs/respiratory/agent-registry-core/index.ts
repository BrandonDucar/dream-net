/**
 * @dreamnet/agent-registry-core — Agent Registry & Discovery
 * 
 * Central registry of all agents with capabilities, status, and discovery.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'agent-registry',
  name: 'DreamNet Agent Registry',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['agent-registration', 'discovery', 'capability-search', 'health-tracking'],
  metadata: { organ: 'respiratory', role: 'registry' },
});

export interface AgentRecord { agentId: string; name: string; capabilities: string[]; status: string; endpoint?: string; registeredAt: number; lastSeen: number; metadata?: any; }

const registry: Map<string, AgentRecord> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function register(agent: AgentRecord): void { registry.set(agent.agentId, agent); }
export function unregister(agentId: string): void { registry.delete(agentId); }
export function get(agentId: string): AgentRecord | undefined { return registry.get(agentId); }
export function getAll(): AgentRecord[] { return Array.from(registry.values()); }

export function findByCapability(capability: string): AgentRecord[] {
  return Array.from(registry.values()).filter(a => a.capabilities.includes(capability));
}

export function updateStatus(agentId: string, status: string): void {
  const a = registry.get(agentId);
  if (a) { a.status = status; a.lastSeen = Date.now(); }
}

export { bridge };
export default { connect, register, unregister, get, getAll, findByCapability, updateStatus, bridge };

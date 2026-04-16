/**
 * @dreamnet/omni-sync-core — Universal State Synchronization
 * 
 * Syncs state across all agents, organs, and external systems.
 */

import { createBridge } from '../runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'omni-sync',
  name: 'DreamNet OmniSync',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['state-sync', 'conflict-resolution', 'versioning', 'snapshot'],
  metadata: { organ: 'nervous', role: 'omni-sync' },
});

const stateStore: Map<string, { data: any; version: number; updatedBy: string; timestamp: number }> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function setState(key: string, data: any, updatedBy: string): number {
  const existing = stateStore.get(key);
  const version = (existing?.version || 0) + 1;
  stateStore.set(key, { data, version, updatedBy, timestamp: Date.now() });
  return version;
}

export function getState(key: string): { data: any; version: number } | undefined {
  const entry = stateStore.get(key);
  return entry ? { data: entry.data, version: entry.version } : undefined;
}

export function snapshot(): Record<string, any> {
  const snap: Record<string, any> = {};
  for (const [k, v] of stateStore) snap[k] = v;
  return snap;
}

export { bridge };
export default { connect, setState, getState, snapshot, bridge };

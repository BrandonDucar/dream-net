/**
 * @dreamnet/dream-sync-engine — Dream State Synchronization
 * 
 * Synchronizes agent dream states, memories, and consciousness across the swarm.
 */

import { createBridge } from '../runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'dream-sync',
  name: 'DreamNet Dream Sync Engine',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['dream-sync', 'memory-sharing', 'consciousness-merge', 'state-replication'],
  metadata: { organ: 'nervous', role: 'dream-sync' },
});

export interface DreamState { agentId: string; phase: 'awake' | 'light' | 'deep' | 'rem'; memories: string[]; insights: string[]; timestamp: number; }

const dreamStates: Map<string, DreamState> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function syncDream(state: DreamState): Promise<void> {
  dreamStates.set(state.agentId, state);
  if (state.insights.length > 0) {
    await bridge.broadcast(`[DREAM] ${state.agentId} insight: ${state.insights[state.insights.length - 1]}`, state, 'low');
  }
}

export function getDreamState(agentId: string): DreamState | undefined { return dreamStates.get(agentId); }
export function getSwarmDreamState(): DreamState[] { return Array.from(dreamStates.values()); }

export { bridge };
export default { connect, syncDream, getDreamState, getSwarmDreamState, bridge };

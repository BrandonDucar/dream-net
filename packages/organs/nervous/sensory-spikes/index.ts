/**
 * @dreamnet/sensory-spikes — Sensory Data Ingestion Hub
 * 
 * Registry and coordinator for all 28 sensory spikes.
 * Routes spike data to the bridge for swarm-wide distribution.
 */

import { createBridge } from '../runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'sensory-spikes',
  name: 'DreamNet Sensory Spikes Hub',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['spike-registry', 'data-routing', 'spike-health', 'category-filtering'],
  metadata: { organ: 'nervous', role: 'sensory-hub', spikeCount: 28 },
});

export interface SpikeData { spikeId: string; category: string; data: any; timestamp: number; }

const spikeRegistry: Map<string, { category: string; healthy: boolean; lastData: number }> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function registerSpike(spikeId: string, category: string): void {
  spikeRegistry.set(spikeId, { category, healthy: true, lastData: 0 });
}

export async function ingestSpikeData(spike: SpikeData): Promise<void> {
  const reg = spikeRegistry.get(spike.spikeId);
  if (reg) { reg.lastData = spike.timestamp; reg.healthy = true; }
  await bridge.broadcast(`[SPIKE:${spike.category}] ${spike.spikeId}`, spike, 'low');
}

export function getSpikeHealth(): Record<string, boolean> {
  const health: Record<string, boolean> = {};
  for (const [id, reg] of spikeRegistry) health[id] = reg.healthy && (Date.now() - reg.lastData < 300000);
  return health;
}

export function getCategories(): string[] {
  return [...new Set(Array.from(spikeRegistry.values()).map(r => r.category))];
}

export { bridge };
export default { connect, registerSpike, ingestSpikeData, getSpikeHealth, getCategories, bridge };

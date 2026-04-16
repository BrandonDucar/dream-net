/**
 * @dreamnet/dreamnet-metrics-core — Metrics Collection & Aggregation
 * 
 * Collects, stores, and queries operational metrics from all agents.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'metrics-core',
  name: 'DreamNet Metrics',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['metrics-collection', 'aggregation', 'time-series', 'dashboards'],
  metadata: { organ: 'endocrine', role: 'metrics' },
});

export interface Metric {
  name: string;
  value: number;
  unit: string;
  tags: Record<string, string>;
  timestamp: number;
}

const metrics: Metric[] = [];

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function emit(name: string, value: number, unit: string, tags: Record<string, string> = {}): void {
  metrics.push({ name, value, unit, tags, timestamp: Date.now() });
  if (metrics.length > 10000) metrics.splice(0, 1000);
}

export function query(name: string, sinceMs?: number, tags?: Record<string, string>): Metric[] {
  const since = sinceMs ? Date.now() - sinceMs : 0;
  return metrics.filter(m => m.name === name && m.timestamp >= since && (!tags || Object.entries(tags).every(([k, v]) => m.tags[k] === v)));
}

export function latest(name: string): Metric | undefined {
  for (let i = metrics.length - 1; i >= 0; i--) {
    if (metrics[i].name === name) return metrics[i];
  }
  return undefined;
}

export { bridge };
export default { connect, emit, query, latest, bridge };

/**
 * @dreamnet/metrics-engine — Advanced Metrics & Analytics Engine
 * 
 * Aggregation, percentiles, histograms, and real-time analytics dashboards.
 * Higher-level than metrics-core — this is the analytics layer.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'metrics-engine',
  name: 'DreamNet Metrics Engine',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['analytics', 'percentiles', 'histograms', 'real-time-dashboards', 'anomaly-detection'],
  metadata: { organ: 'endocrine', role: 'analytics-engine' },
});

export interface TimeSeriesPoint { value: number; timestamp: number; }
const series: Map<string, TimeSeriesPoint[]> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function record(name: string, value: number): void {
  if (!series.has(name)) series.set(name, []);
  const s = series.get(name)!;
  s.push({ value, timestamp: Date.now() });
  if (s.length > 10000) s.splice(0, 1000);
}

export function percentile(name: string, p: number, windowMs = 3600000): number {
  const s = series.get(name) || [];
  const cutoff = Date.now() - windowMs;
  const values = s.filter(pt => pt.timestamp >= cutoff).map(pt => pt.value).sort((a, b) => a - b);
  if (values.length === 0) return 0;
  const idx = Math.ceil((p / 100) * values.length) - 1;
  return values[Math.max(0, idx)];
}

export function average(name: string, windowMs = 3600000): number {
  const s = series.get(name) || [];
  const cutoff = Date.now() - windowMs;
  const values = s.filter(pt => pt.timestamp >= cutoff).map(pt => pt.value);
  return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}

export function rate(name: string, windowMs = 60000): number {
  const s = series.get(name) || [];
  const cutoff = Date.now() - windowMs;
  return s.filter(pt => pt.timestamp >= cutoff).length / (windowMs / 1000);
}

export { bridge };
export default { connect, record, percentile, average, rate, bridge };

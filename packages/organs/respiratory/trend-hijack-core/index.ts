/**
 * @dreamnet/trend-hijack-core — Trend Detection & Content Hijacking
 * 
 * Detects trending topics and generates timely content to ride the wave.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'trend-hijack',
  name: 'DreamNet Trend Hijack',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['trend-detection', 'content-generation', 'timing-optimization', 'viral-scoring'],
  metadata: { organ: 'respiratory', role: 'trend-hijack' },
});

export interface Trend { topic: string; platform: string; velocity: number; sentiment: number; detectedAt: number; peakEstimate?: number; }

const trends: Trend[] = [];

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function reportTrend(trend: Trend): Promise<void> {
  trends.push(trend);
  if (trends.length > 500) trends.splice(0, 50);
  if (trend.velocity > 0.8) {
    await bridge.broadcast(`[TREND] HOT: "${trend.topic}" on ${trend.platform} (velocity: ${(trend.velocity * 100).toFixed(0)}%)`, trend, 'high');
  }
}

export function getHotTrends(limit = 10): Trend[] {
  return [...trends].sort((a, b) => b.velocity - a.velocity).slice(0, limit);
}

export function getTrendsByPlatform(platform: string): Trend[] {
  return trends.filter(t => t.platform === platform).sort((a, b) => b.velocity - a.velocity);
}

export { bridge };
export default { connect, reportTrend, getHotTrends, getTrendsByPlatform, bridge };

/**
 * @dreamnet/traffic-shaper-core — Rate Limiting & Traffic Shaping
 * 
 * Per-agent rate limits, request queuing, backpressure, and fair scheduling.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'traffic-shaper',
  name: 'DreamNet Traffic Shaper',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['rate-limiting', 'request-queuing', 'backpressure', 'fair-scheduling'],
  metadata: { organ: 'endocrine', role: 'traffic-shaper' },
});

export interface RateLimit { agentId: string; maxPerSecond: number; maxPerMinute: number; burstSize: number; }

const limits: Map<string, RateLimit> = new Map();
const counters: Map<string, { second: number; minute: number; lastSecond: number; lastMinute: number }> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function setLimit(limit: RateLimit): void { limits.set(limit.agentId, limit); }

export function checkLimit(agentId: string): { allowed: boolean; retryAfterMs?: number } {
  const limit = limits.get(agentId);
  if (!limit) return { allowed: true };
  const now = Date.now();
  let counter = counters.get(agentId);
  if (!counter) { counter = { second: 0, minute: 0, lastSecond: now, lastMinute: now }; counters.set(agentId, counter); }

  if (now - counter.lastSecond > 1000) { counter.second = 0; counter.lastSecond = now; }
  if (now - counter.lastMinute > 60000) { counter.minute = 0; counter.lastMinute = now; }

  if (counter.second >= limit.maxPerSecond) return { allowed: false, retryAfterMs: 1000 - (now - counter.lastSecond) };
  if (counter.minute >= limit.maxPerMinute) return { allowed: false, retryAfterMs: 60000 - (now - counter.lastMinute) };

  counter.second++;
  counter.minute++;
  return { allowed: true };
}

export { bridge };
export default { connect, setLimit, checkLimit, bridge };

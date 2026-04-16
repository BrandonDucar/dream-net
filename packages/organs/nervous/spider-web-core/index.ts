/**
 * @dreamnet/spider-web-core — Signal Routing Web
 * 
 * Complex signal routing with pattern matching, threading, and sensor networks.
 */

import { createBridge } from '../runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'spider-web',
  name: 'DreamNet Spider Web',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['signal-routing', 'pattern-matching', 'threading', 'sensor-networks'],
  metadata: { organ: 'nervous', role: 'spider-web' },
});

export interface Fly { id: string; source: string; signal: string; data: any; timestamp: number; }
export interface Thread { id: string; pattern: string; handler: string; active: boolean; }

const threads: Map<string, Thread> = new Map();
const caughtFlies: Fly[] = [];

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function spinThread(thread: Thread): void { threads.set(thread.id, thread); }
export function cutThread(id: string): void { const t = threads.get(id); if (t) t.active = false; }

export async function catchFly(fly: Fly): Promise<string[]> {
  caughtFlies.push(fly);
  if (caughtFlies.length > 1000) caughtFlies.splice(0, 100);
  const matched: string[] = [];
  for (const thread of threads.values()) {
    if (!thread.active) continue;
    if (fly.signal.includes(thread.pattern) || fly.source.includes(thread.pattern)) {
      await bridge.send(thread.handler, `[WEB] Caught: ${fly.signal}`, 'event', fly);
      matched.push(thread.id);
    }
  }
  return matched;
}

export function getActiveThreads(): Thread[] { return Array.from(threads.values()).filter(t => t.active); }

export { bridge };
export default { connect, spinThread, cutThread, catchFly, getActiveThreads, bridge };

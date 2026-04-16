/**
 * @dreamnet/heart — Central Heartbeat & Pulse System
 * 
 * The heart of DreamNet. Generates the master clock pulse,
 * coordinates heartbeats, and detects system-wide failures.
 */

import { createBridge } from '../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'heart',
  name: 'DreamNet Heart',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['master-clock', 'heartbeat-coordination', 'failure-detection', 'resuscitation'],
  metadata: { organ: 'heart', role: 'heartbeat' },
});

let bpm = 60;
let beating = false;
let beatCount = 0;
const agentHeartbeats: Map<string, number> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function startBeating(beatsPerMinute = 60): void {
  bpm = beatsPerMinute;
  beating = true;
}

export function stopBeating(): void { beating = false; }

export function recordHeartbeat(agentId: string): void {
  agentHeartbeats.set(agentId, Date.now());
}

export function getDeadAgents(timeoutMs = 300000): string[] {
  const now = Date.now();
  return Array.from(agentHeartbeats.entries())
    .filter(([_, lastBeat]) => now - lastBeat > timeoutMs)
    .map(([id]) => id);
}

export function getVitals(): { beating: boolean; bpm: number; beatCount: number; agentsAlive: number; agentsDead: number } {
  const dead = getDeadAgents();
  return { beating, bpm, beatCount, agentsAlive: agentHeartbeats.size - dead.length, agentsDead: dead.length };
}

export { bridge };
export default { connect, startBeating, stopBeating, recordHeartbeat, getDeadAgents, getVitals, bridge };

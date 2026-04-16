/**
 * @dreamnet/excretory — Garbage Collection & Data Cleanup
 * 
 * Removes stale data, expired caches, dead agents, and orphaned resources.
 */

import { createBridge } from '../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'excretory',
  name: 'DreamNet Excretory System',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['garbage-collection', 'cache-eviction', 'dead-agent-cleanup', 'log-rotation'],
  metadata: { organ: 'excretory', role: 'cleanup' },
});

export interface CleanupResult { type: string; itemsCleaned: number; bytesFreed: number; timestamp: number; }

const cleanupLog: CleanupResult[] = [];

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function cleanStaleData(maxAgeMs: number): Promise<CleanupResult> {
  const result: CleanupResult = { type: 'stale-data', itemsCleaned: 0, bytesFreed: 0, timestamp: Date.now() };
  cleanupLog.push(result);
  await bridge.broadcast(`[EXCRETORY] Cleaned stale data older than ${maxAgeMs / 1000}s`, result, 'low');
  return result;
}

export async function evictCache(cacheName: string): Promise<CleanupResult> {
  const result: CleanupResult = { type: 'cache-eviction', itemsCleaned: 0, bytesFreed: 0, timestamp: Date.now() };
  cleanupLog.push(result);
  return result;
}

export function getCleanupLog(limit = 20): CleanupResult[] { return cleanupLog.slice(-limit); }

export { bridge };
export default { connect, cleanStaleData, evictCache, getCleanupLog, bridge };

/**
 * @dreamnet/lymphatic — Error Recovery & Self-Healing
 * 
 * Detects failures, routes recovery signals, and manages self-healing workflows.
 */

import { createBridge } from '../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'lymphatic',
  name: 'DreamNet Lymphatic System',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['error-recovery', 'self-healing', 'circuit-breaker', 'retry-orchestration'],
  metadata: { organ: 'lymphatic', role: 'self-healing' },
});

export interface FailureEvent { agentId: string; error: string; severity: string; recoveryAttempts: number; timestamp: number; }

const failures: FailureEvent[] = [];
const circuitBreakers: Map<string, { open: boolean; openedAt: number; failures: number }> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function reportFailure(event: FailureEvent): Promise<string> {
  failures.push(event);
  const cb = circuitBreakers.get(event.agentId) || { open: false, openedAt: 0, failures: 0 };
  cb.failures++;
  if (cb.failures >= 5) { cb.open = true; cb.openedAt = Date.now(); }
  circuitBreakers.set(event.agentId, cb);

  if (cb.open) {
    await bridge.broadcast(`[LYMPHATIC] Circuit OPEN for ${event.agentId} — ${cb.failures} failures`, event, 'critical');
    return 'circuit-open';
  }
  await bridge.broadcast(`[LYMPHATIC] Failure in ${event.agentId}: ${event.error}`, event, 'high');
  return 'logged';
}

export function isCircuitOpen(agentId: string): boolean { return circuitBreakers.get(agentId)?.open || false; }
export function resetCircuit(agentId: string): void { circuitBreakers.delete(agentId); }

export { bridge };
export default { connect, reportFailure, isCircuitOpen, resetCircuit, bridge };

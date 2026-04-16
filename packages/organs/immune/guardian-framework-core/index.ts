/**
 * @dreamnet/guardian-framework-core — Agent Guardian Framework
 * 
 * Watchdog system that monitors agent behavior and enforces safety constraints.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'guardian',
  name: 'DreamNet Guardian',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['behavior-monitoring', 'safety-constraints', 'kill-switch', 'quarantine'],
  metadata: { organ: 'immune', role: 'guardian' },
});

export interface SafetyConstraint { id: string; name: string; check: (action: string, data: any) => boolean; action: 'block' | 'warn' | 'quarantine'; }
export interface Violation { agentId: string; constraint: string; action: string; timestamp: number; }

const constraints: Map<string, SafetyConstraint> = new Map();
const violations: Violation[] = [];
const quarantined: Set<string> = new Set();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function addConstraint(c: SafetyConstraint): void { constraints.set(c.id, c); }

export async function evaluate(agentId: string, action: string, data: any): Promise<{ allowed: boolean; violations: string[] }> {
  if (quarantined.has(agentId)) return { allowed: false, violations: ['agent-quarantined'] };
  const v: string[] = [];
  for (const c of constraints.values()) {
    if (!c.check(action, data)) {
      v.push(c.name);
      violations.push({ agentId, constraint: c.name, action, timestamp: Date.now() });
      if (c.action === 'quarantine') { quarantined.add(agentId); await bridge.broadcast(`[GUARDIAN] ${agentId} QUARANTINED: ${c.name}`, { agentId, constraint: c.name }, 'critical'); }
      if (c.action === 'block') return { allowed: false, violations: v };
    }
  }
  return { allowed: v.length === 0, violations: v };
}

export function isQuarantined(agentId: string): boolean { return quarantined.has(agentId); }
export function releaseFromQuarantine(agentId: string): void { quarantined.delete(agentId); }

export { bridge };
export default { connect, addConstraint, evaluate, isQuarantined, releaseFromQuarantine, bridge };

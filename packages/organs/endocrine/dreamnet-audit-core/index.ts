/**
 * @dreamnet/dreamnet-audit-core — Audit Trail & Compliance
 * 
 * Immutable audit logging for all agent actions, decisions, and state changes.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'audit-core',
  name: 'DreamNet Audit',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['audit-logging', 'compliance', 'provenance', 'attestation'],
  metadata: { organ: 'endocrine', role: 'audit' },
});

export interface AuditEntry {
  id: string;
  agentId: string;
  action: string;
  category: 'auth' | 'data' | 'financial' | 'config' | 'security' | 'operational';
  detail: string;
  before?: any;
  after?: any;
  timestamp: number;
}

const auditLog: AuditEntry[] = [];

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): Promise<string> {
  const id = `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const full: AuditEntry = { ...entry, id, timestamp: Date.now() };
  auditLog.push(full);
  if (entry.category === 'security' || entry.category === 'financial') {
    await bridge.broadcast(`[AUDIT] ${entry.agentId}: ${entry.action} — ${entry.detail}`, full, 'high');
  }
  return id;
}

export function query(filter: { agentId?: string; category?: string; since?: number; limit?: number }): AuditEntry[] {
  let results = auditLog;
  if (filter.agentId) results = results.filter(e => e.agentId === filter.agentId);
  if (filter.category) results = results.filter(e => e.category === filter.category);
  if (filter.since) results = results.filter(e => e.timestamp >= filter.since);
  return results.slice(-(filter.limit || 100));
}

export { bridge };
export default { connect, log, query, bridge };

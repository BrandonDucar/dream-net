/**
 * @dreamnet/dreamnet-snail-core — Intrusion Detection System
 * 
 * Slow, thorough security scanning. Detects anomalies, unauthorized access, and data exfiltration.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'snail-core',
  name: 'DreamNet Snail IDS',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['intrusion-detection', 'anomaly-scanning', 'exfiltration-detection', 'behavioral-analysis'],
  metadata: { organ: 'immune', role: 'ids' },
});

export interface SecurityEvent {
  type: 'unauthorized-access' | 'anomaly' | 'exfiltration' | 'brute-force' | 'replay' | 'escalation';
  source: string;
  target: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detail: string;
  timestamp: number;
}

const events: SecurityEvent[] = [];

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function report(event: SecurityEvent): Promise<void> {
  events.push(event);
  const priority = event.severity === 'critical' ? 'critical' : event.severity === 'high' ? 'high' : 'normal';
  await bridge.broadcast(`[SNAIL-IDS] ${event.type}: ${event.detail}`, event, priority as any);
}

export function getEvents(severity?: string, limit = 50): SecurityEvent[] {
  const filtered = severity ? events.filter(e => e.severity === severity) : events;
  return filtered.slice(-limit);
}

export function getThreatLevel(): 'green' | 'yellow' | 'orange' | 'red' {
  const recent = events.filter(e => Date.now() - e.timestamp < 3600000);
  const criticals = recent.filter(e => e.severity === 'critical').length;
  const highs = recent.filter(e => e.severity === 'high').length;
  if (criticals > 0) return 'red';
  if (highs > 2) return 'orange';
  if (highs > 0 || recent.length > 5) return 'yellow';
  return 'green';
}

export { bridge };
export default { connect, report, getEvents, getThreatLevel, bridge };

/**
 * @dreamnet/dreamnet-alerts-core — Centralized Alert System
 * 
 * Manages alert rules, thresholds, and notification routing for all agents.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'alerts-core',
  name: 'DreamNet Alerts',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['alert-rules', 'threshold-monitoring', 'notification-routing', 'escalation'],
  metadata: { organ: 'endocrine', role: 'alerts' },
});

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: AlertSeverity;
  targets: string[];
  cooldownMs: number;
  enabled: boolean;
}

export interface Alert {
  ruleId: string;
  severity: AlertSeverity;
  message: string;
  value: number;
  timestamp: number;
}

const rules: Map<string, AlertRule> = new Map();
const lastFired: Map<string, number> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function addRule(rule: AlertRule): void { rules.set(rule.id, rule); }
export function removeRule(id: string): void { rules.delete(id); }
export function getRules(): AlertRule[] { return Array.from(rules.values()); }

export async function fire(alert: Alert): Promise<boolean> {
  const rule = rules.get(alert.ruleId);
  if (!rule?.enabled) return false;
  const last = lastFired.get(alert.ruleId) || 0;
  if (Date.now() - last < rule.cooldownMs) return false;

  lastFired.set(alert.ruleId, Date.now());
  for (const target of rule.targets) {
    await bridge.send(target, `[ALERT:${alert.severity.toUpperCase()}] ${alert.message}`, 'event', alert, alert.severity === 'critical' ? 'critical' : 'high');
  }
  return true;
}

export { bridge };
export default { connect, addRule, removeRule, getRules, fire, bridge };

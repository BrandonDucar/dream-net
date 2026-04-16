/**
 * @dreamnet/dreamnet-operational-bridge — Endocrine Operational Bridge
 * 
 * The endocrine system handles scheduling, cost tracking, and operational signals.
 * This bridge connects operational metrics and scheduling events to the Sovereign Bridge.
 * 
 * Responsibilities:
 *   - Report operational metrics (uptime, throughput, errors) to the swarm
 *   - Relay scheduling events (cron triggers, task deadlines)
 *   - Broadcast cost/budget alerts across agents
 *   - Sync operational state for the dashboard
 */

import { RuntimeBridge, createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'endocrine-ops',
  name: 'DreamNet Operational Bridge',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['ops-metrics', 'scheduling', 'cost-alerts', 'state-sync'],
  metadata: { organ: 'endocrine', role: 'operational' },
});

export interface OpsMetric {
  name: string;
  value: number;
  unit: string;
  source: string;
  timestamp: number;
}

export interface ScheduleEvent {
  name: string;
  cronExpr?: string;
  nextRun?: number;
  lastRun?: number;
  status: 'active' | 'paused' | 'fired';
}

export async function connect(): Promise<boolean> {
  return bridge.connectWithRetry(10, 5_000);
}

export async function reportMetric(metric: OpsMetric): Promise<void> {
  await bridge.broadcast(`[OPS] ${metric.name}: ${metric.value}${metric.unit}`, metric, 'low');
}

export async function reportScheduleEvent(event: ScheduleEvent): Promise<void> {
  await bridge.broadcast(`[SCHEDULE] ${event.name} — ${event.status}`, event);
}

export async function alertCostThreshold(agent: string, cost: number, limit: number): Promise<void> {
  await bridge.send(agent, `COST ALERT: $${cost.toFixed(2)} / $${limit.toFixed(2)} limit`, 'event', { cost, limit }, 'high');
}

export async function syncState(state: Record<string, any>): Promise<void> {
  await bridge.broadcast('[OPS] State sync', state, 'low');
}

export { bridge };
export default { connect, reportMetric, reportScheduleEvent, alertCostThreshold, syncState, bridge };

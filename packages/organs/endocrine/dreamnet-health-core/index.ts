/**
 * @dreamnet/dreamnet-health-core — System Health Monitor
 * 
 * Aggregates health checks from all agents and services.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'health-core',
  name: 'DreamNet Health Monitor',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['health-checks', 'uptime-tracking', 'degradation-detection', 'recovery'],
  metadata: { organ: 'endocrine', role: 'health-monitor' },
});

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

export interface HealthCheck {
  agentId: string;
  status: HealthStatus;
  latencyMs: number;
  checks: { name: string; passed: boolean; detail?: string }[];
  timestamp: number;
}

const healthHistory: Map<string, HealthCheck[]> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function report(check: HealthCheck): Promise<void> {
  if (!healthHistory.has(check.agentId)) healthHistory.set(check.agentId, []);
  const history = healthHistory.get(check.agentId)!;
  history.push(check);
  if (history.length > 100) history.shift();

  if (check.status === 'unhealthy') {
    await bridge.broadcast(`[HEALTH] ${check.agentId} is UNHEALTHY: ${check.checks.filter(c => !c.passed).map(c => c.name).join(', ')}`, check, 'critical');
  }
}

export function getHealth(agentId: string): HealthCheck | undefined {
  const history = healthHistory.get(agentId);
  return history?.[history.length - 1];
}

export function getFleetHealth(): Record<string, HealthStatus> {
  const result: Record<string, HealthStatus> = {};
  for (const [id, history] of healthHistory) {
    result[id] = history[history.length - 1]?.status || 'unknown';
  }
  return result;
}

export { bridge };
export default { connect, report, getHealth, getFleetHealth, bridge };

/**
 * @dreamnet/dreamnet-autoscale-core — Auto-Scaling Engine
 * 
 * Monitors load and automatically scales agent instances up/down.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'autoscale',
  name: 'DreamNet AutoScale',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['load-monitoring', 'scale-up', 'scale-down', 'resource-allocation'],
  metadata: { organ: 'endocrine', role: 'autoscaler' },
});

export interface ScalePolicy {
  agentId: string;
  minInstances: number;
  maxInstances: number;
  scaleUpThreshold: number;
  scaleDownThreshold: number;
  cooldownMs: number;
}

export interface LoadMetric {
  agentId: string;
  cpuPercent: number;
  memoryPercent: number;
  queueDepth: number;
  latencyMs: number;
  timestamp: number;
}

const policies: Map<string, ScalePolicy> = new Map();
const currentInstances: Map<string, number> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function setPolicy(policy: ScalePolicy): void { policies.set(policy.agentId, policy); }

export async function evaluateLoad(metric: LoadMetric): Promise<{ action: 'scale-up' | 'scale-down' | 'none'; instances?: number }> {
  const policy = policies.get(metric.agentId);
  if (!policy) return { action: 'none' };
  const current = currentInstances.get(metric.agentId) || 1;

  if (metric.cpuPercent > policy.scaleUpThreshold && current < policy.maxInstances) {
    currentInstances.set(metric.agentId, current + 1);
    await bridge.broadcast(`[AUTOSCALE] Scaling UP ${metric.agentId}: ${current} → ${current + 1}`, metric, 'high');
    return { action: 'scale-up', instances: current + 1 };
  }
  if (metric.cpuPercent < policy.scaleDownThreshold && current > policy.minInstances) {
    currentInstances.set(metric.agentId, current - 1);
    await bridge.broadcast(`[AUTOSCALE] Scaling DOWN ${metric.agentId}: ${current} → ${current - 1}`, metric);
    return { action: 'scale-down', instances: current - 1 };
  }
  return { action: 'none' };
}

export { bridge };
export default { connect, setPolicy, evaluateLoad, bridge };

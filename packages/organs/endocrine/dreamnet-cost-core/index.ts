/**
 * @dreamnet/dreamnet-cost-core — Cost Tracking Engine
 * 
 * Tracks API costs, compute usage, and resource consumption per agent.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'cost-core',
  name: 'DreamNet Cost Tracker',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['cost-tracking', 'usage-metering', 'billing', 'budget-enforcement'],
  metadata: { organ: 'endocrine', role: 'cost-tracking' },
});

export interface CostRecord {
  agentId: string;
  category: 'llm' | 'compute' | 'storage' | 'network' | 'api' | 'other';
  provider: string;
  amount: number;
  currency: 'USD' | 'ETH' | 'DT';
  description: string;
  timestamp: number;
}

const records: CostRecord[] = [];
const budgets: Map<string, number> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function record(entry: CostRecord): void {
  records.push(entry);
}

export function setBudget(agentId: string, limitUsd: number): void {
  budgets.set(agentId, limitUsd);
}

export function getSpend(agentId: string, sinceMs?: number): number {
  const since = sinceMs ? Date.now() - sinceMs : 0;
  return records.filter(r => r.agentId === agentId && r.timestamp >= since && r.currency === 'USD').reduce((sum, r) => sum + r.amount, 0);
}

export function getTotalSpend(sinceMs?: number): Record<string, number> {
  const since = sinceMs ? Date.now() - sinceMs : 0;
  const byAgent: Record<string, number> = {};
  records.filter(r => r.timestamp >= since && r.currency === 'USD').forEach(r => {
    byAgent[r.agentId] = (byAgent[r.agentId] || 0) + r.amount;
  });
  return byAgent;
}

export { bridge };
export default { connect, record, setBudget, getSpend, getTotalSpend, bridge };

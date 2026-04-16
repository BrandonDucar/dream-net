/**
 * @dreamnet/dreamnet-cost-economic-bridge — Cost & Economic Bridge
 * 
 * Tracks API costs, token usage, and economic signals across the swarm.
 * Broadcasts budget alerts and usage reports through the Sovereign Bridge.
 * 
 * Responsibilities:
 *   - Track per-agent API spend (OpenAI, Anthropic, etc.)
 *   - Broadcast budget threshold warnings
 *   - Report token usage metrics
 *   - Economic signal relay (market data, cost optimization suggestions)
 */

import { RuntimeBridge, createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'economic-bridge',
  name: 'DreamNet Economic Bridge',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['cost-tracking', 'budget-alerts', 'token-usage', 'economic-signals'],
  metadata: { organ: 'endocrine', role: 'economic' },
});

export interface CostEntry {
  agentId: string;
  provider: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
  timestamp: number;
}

export interface BudgetAlert {
  agentId: string;
  currentSpend: number;
  budgetLimit: number;
  percentUsed: number;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

let totalSpend = 0;
const agentSpend: Map<string, number> = new Map();

export async function connect(): Promise<boolean> {
  return bridge.connectWithRetry(10, 5_000);
}

export async function trackCost(entry: CostEntry): Promise<void> {
  totalSpend += entry.costUsd;
  agentSpend.set(entry.agentId, (agentSpend.get(entry.agentId) || 0) + entry.costUsd);

  // Only broadcast significant costs
  if (entry.costUsd > 0.01) {
    await bridge.send(entry.agentId, 
      `Cost: $${entry.costUsd.toFixed(4)} (${entry.provider}/${entry.model}, ${entry.tokensIn + entry.tokensOut} tokens)`,
      'event', entry, 'low'
    );
  }
}

export async function checkBudget(agentId: string, limit: number, period: BudgetAlert['period'] = 'daily'): Promise<BudgetAlert | null> {
  const spent = agentSpend.get(agentId) || 0;
  const pct = (spent / limit) * 100;

  if (pct >= 80) {
    const alert: BudgetAlert = { agentId, currentSpend: spent, budgetLimit: limit, percentUsed: pct, period };
    const priority = pct >= 100 ? 'critical' : 'high';
    await bridge.send(agentId, `BUDGET ${pct >= 100 ? 'EXCEEDED' : 'WARNING'}: $${spent.toFixed(2)}/$${limit.toFixed(2)} (${pct.toFixed(0)}%)`, 'event', alert, priority);
    return alert;
  }
  return null;
}

export function getSpendReport(): { total: number; byAgent: Record<string, number> } {
  return { total: totalSpend, byAgent: Object.fromEntries(agentSpend) };
}

export { bridge };
export default { connect, trackCost, checkBudget, getSpendReport, bridge };

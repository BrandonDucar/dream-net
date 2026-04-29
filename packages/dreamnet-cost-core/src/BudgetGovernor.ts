import { CostRecord } from '../types';

export interface AgentPerformance {
  agentId: string;
  successRate: number; // 0.0 to 1.0
  avgLatency: number; // ms
  costPerOp: number; // in base currency (e.g., GHO or ETH)
}

/**
 * 💰 BudgetGovernor (BAMAS structure)
 * 
 * Role: Economic Optimization & Agent Selection.
 * Logic: Integer Linear Programming (ILP) style selection.
 * Mission: Select the most cost-effective agent for a task without violating budget constraints.
 */
export class BudgetGovernor {
  /**
   * Selects the optimal agent based on a target utility function:
   * Utility = (SuccessRate * W_s) - (Cost * W_c) - (Latency * W_l)
   */
  public selectOptimalAgent(
    agents: AgentPerformance[],
    weights: { success: number; cost: number; latency: number } = { success: 0.5, cost: 0.3, latency: 0.2 }
  ): AgentPerformance | undefined {
    if (agents.length === 0) return undefined;

    let bestAgent = agents[0];
    let maxUtility = -Infinity;

    for (const agent of agents) {
      // Basic Linear Utility (Simplified ILP approach for selection)
      const utility =
        (agent.successRate * weights.success) -
        (agent.costPerOp * weights.cost) -
        ((agent.avgLatency / 1000) * weights.latency);

      if (utility > maxUtility) {
        maxUtility = utility;
        bestAgent = agent;
      }
    }

    console.log(`💰 [BudgetGovernor] Selected Agent: ${bestAgent.agentId} | Utility: ${maxUtility.toFixed(4)}`);
    return bestAgent;
  }

  /**
   * Checks if a planned expenditure violates the cluster budget.
   */
  public isWithinBudget(clusterId: string, plannedCost: number, currentSpend: number, limit: number): boolean {
    const isAllowed = (currentSpend + plannedCost) <= limit;
    if (!isAllowed) {
      console.warn(`⚠️ [BudgetGovernor] Budget EXCEEDED for cluster ${clusterId}. Blocked spend: ${plannedCost}`);
    }
    return isAllowed;
  }
  private jouleConsumption: Map<string, number> = new Map();

  /**
   * Enforces a compute limit (JouleLimit) for an agent.
   */
  public enforceJouleLimit(agentId: string, limit: number, costOfOp: number): boolean {
    const current = this.jouleConsumption.get(agentId) || 0;
    const total = current + costOfOp;

    if (total > limit) {
      console.warn(`🛑 [BudgetGovernor] JouleLimit exceeded for ${agentId}. Limit: ${limit}J | Attempted: ${total}J`);
      return false;
    }

    this.jouleConsumption.set(agentId, total);
    console.log(`📊 [BudgetGovernor] Joule Usage for ${agentId}: ${total.toFixed(2)}J / ${limit}J`);
    return true;
  }

  public getJouleUsage(agentId: string): number {
    return this.jouleConsumption.get(agentId) || 0;
  }
}

export const budgetGovernor = new BudgetGovernor();

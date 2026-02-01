/**
 * DreamNet Cost Core
 * API cost tracking and optimization
 */

import { costStore } from './store/costStore.js';
import type { CostRecord, CostSummary, CostAlert, CostBudget } from './types.js';
// import { bridgeCostToEconomicEngine, bridgeCostAlertToEconomicEngine } from "@dreamnet/cost-economic-bridge";

export const DreamNetCostCore = {
  /**
   * Record a cost
   */
  recordCost(record: CostRecord): void {
    costStore.recordCost(record);

    // Bridge to Economic Engine
    // bridgeCostToEconomicEngine({
    //   clusterId: record.clusterId,
    //   provider: record.provider,
    //   operation: record.operation,
    //   cost: record.cost,
    //   currency: record.currency,
    //   timestamp: record.timestamp,
    // });
  },

  /**
   * Get cost summary for a cluster
   */
  getCostSummary(clusterId: string): CostSummary {
    return costStore.getCostSummary(clusterId);
  },

  /**
   * Get cost summaries for all clusters
   */
  getAllCostSummaries(): Record<string, CostSummary> {
    return costStore.getAllCostSummaries();
  },

  /**
   * Set a budget
   */
  setBudget(budget: CostBudget): void {
    costStore.setBudget(budget);
  },

  /**
   * Get budget
   */
  getBudget(budgetId: string): CostBudget | undefined {
    return costStore.getBudget(budgetId);
  },

  /**
   * Get budgets for a cluster
   */
  getBudgetsForCluster(clusterId: string): CostBudget[] {
    return costStore.getBudgetsForCluster(clusterId);
  },

  /**
   * Get active cost alerts
   */
  getActiveAlerts(): CostAlert[] {
    return costStore.getActiveAlerts();
  },

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string): void {
    costStore.acknowledgeAlert(alertId);
  },
};

export * from './types.js';
export default DreamNetCostCore;


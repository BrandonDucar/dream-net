/**
 * Cost Store
 * Tracks API costs and spending
 */

import type { CostRecord, CostSummary, CostAlert, CostBudget } from '../types.js';
// import { bridgeCostAlertToEconomicEngine } from "@dreamnet/cost-economic-bridge";

class CostStore {
  private records: CostRecord[] = [];
  private budgets: Map<string, CostBudget> = new Map();
  private alerts: CostAlert[] = [];
  private maxRecords = 50000; // Keep last 50k records

  recordCost(record: CostRecord): void {
    this.records.push(record);

    // Keep only recent records
    if (this.records.length > this.maxRecords) {
      this.records = this.records.slice(-this.maxRecords);
    }

    // Check budgets
    this.checkBudgets(record.clusterId);
  }

  getCostSummary(clusterId: string): CostSummary {
    const clusterRecords = this.records.filter((r) => r.clusterId === clusterId);
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    const totalCost = clusterRecords.reduce((sum, r) => sum + r.cost, 0);
    const costToday = clusterRecords.filter((r) => r.timestamp >= oneDayAgo).reduce((sum, r) => sum + r.cost, 0);
    const costThisWeek = clusterRecords.filter((r) => r.timestamp >= oneWeekAgo).reduce((sum, r) => sum + r.cost, 0);
    const costThisMonth = clusterRecords.filter((r) => r.timestamp >= oneMonthAgo).reduce((sum, r) => sum + r.cost, 0);

    return {
      clusterId,
      totalCost,
      costToday,
      costThisWeek,
      costThisMonth,
      currency: clusterRecords[0]?.currency || "USD",
      recordCount: clusterRecords.length,
      lastUpdatedAt: now,
    };
  }

  getAllCostSummaries(): Record<string, CostSummary> {
    const clusterIds = new Set(this.records.map((r) => r.clusterId));
    const summaries: Record<string, CostSummary> = {};

    for (const clusterId of clusterIds) {
      summaries[clusterId] = this.getCostSummary(clusterId);
    }

    return summaries;
  }

  setBudget(budget: CostBudget): void {
    this.budgets.set(budget.id, budget);
  }

  getBudget(budgetId: string): CostBudget | undefined {
    return this.budgets.get(budgetId);
  }

  getBudgetsForCluster(clusterId: string): CostBudget[] {
    return Array.from(this.budgets.values()).filter((b) => b.clusterId === clusterId);
  }

  private checkBudgets(clusterId: string): void {
    const budgets = this.getBudgetsForCluster(clusterId);
    const summary = this.getCostSummary(clusterId);

    for (const budget of budgets) {
      if (!budget.enabled) continue;

      let currentCost = 0;
      if (budget.period === "daily") {
        currentCost = summary.costToday;
      } else if (budget.period === "weekly") {
        currentCost = summary.costThisWeek;
      } else {
        currentCost = summary.costThisMonth;
      }

      // Check if budget exceeded
      if (currentCost >= budget.amount) {
        this.triggerBudgetAlert(budget, currentCost);
      }

      // Check threshold alert
      if (budget.alertThreshold) {
        const thresholdAmount = (budget.amount * budget.alertThreshold) / 100;
        if (currentCost >= thresholdAmount) {
          this.triggerBudgetAlert(budget, currentCost, true);
        }
      }
    }
  }

  private triggerBudgetAlert(budget: CostBudget, currentCost: number, isThreshold: boolean = false): void {
    // Check if alert already exists and is recent
    const recentAlert = this.alerts.find(
      (a) =>
        a.clusterId === budget.clusterId &&
        a.period === budget.period &&
        Date.now() - a.triggeredAt < 60 * 60 * 1000 // 1 hour cooldown
    );

    if (recentAlert) return;

    const alert: CostAlert = {
      id: `cost-alert-${Date.now()}`,
      clusterId: budget.clusterId,
      threshold: isThreshold ? (budget.amount * (budget.alertThreshold || 0)) / 100 : budget.amount,
      currentCost,
      period: budget.period,
      triggeredAt: Date.now(),
      acknowledged: false,
    };

    this.alerts.push(alert);

    // Bridge alert to Economic Engine
    // bridgeCostAlertToEconomicEngine({
    //   clusterId: budget.clusterId,
    //   threshold: alert.threshold,
    //   currentCost: alert.currentCost,
    //   period: alert.period,
    // });
  }

  getActiveAlerts(): CostAlert[] {
    return this.alerts.filter((a) => !a.acknowledged);
  }

  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }
}

export const costStore = new CostStore();


/**
 * Cost Core ↔ Economic Engine Bridge Types
 * Biomimetic: Cost Core (resource tracking) → Economic Engine (circulatory system)
 */

export interface CostTransaction {
  clusterId: string;
  provider: string;
  operation: string;
  cost: number;
  currency: string;
  timestamp: number;
}

export interface BudgetAllocation {
  clusterId: string;
  budgetId: string;
  amount: number;
  period: "daily" | "weekly" | "monthly";
  currency: string;
}


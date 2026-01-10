type ProviderKey = string;

interface BudgetRecord {
  limit: number;
  used: number;
  lastUpdated: string;
}

const budgets = new Map<ProviderKey, BudgetRecord>();

function getOrCreateBudget(provider: ProviderKey): BudgetRecord {
  if (!budgets.has(provider)) {
    budgets.set(provider, {
      limit: Number.POSITIVE_INFINITY,
      used: 0,
      lastUpdated: new Date().toISOString(),
    });
  }
  return budgets.get(provider)!;
}

export const BudgetControlService = {
  setBudgetLimit(provider: ProviderKey, monthlyUsd: number) {
    const record = getOrCreateBudget(provider);
    record.limit = Number.isFinite(monthlyUsd) ? Math.max(monthlyUsd, 0) : Number.POSITIVE_INFINITY;
    record.lastUpdated = new Date().toISOString();
  },

  getBudgetStatus(provider: ProviderKey) {
    const record = getOrCreateBudget(provider);
    const remaining = record.limit === Number.POSITIVE_INFINITY ? Infinity : record.limit - record.used;
    return {
      provider,
      limit: record.limit,
      used: record.used,
      remaining,
      lastUpdated: record.lastUpdated,
      overBudget: remaining < 0,
    };
  },

  getAllBudgets() {
    return Array.from(budgets.keys()).map((provider) =>
      BudgetControlService.getBudgetStatus(provider),
    );
  },

  requireBudget(provider: ProviderKey, estimatedCost: number) {
    const status = BudgetControlService.getBudgetStatus(provider);
    if (Number.isFinite(status.limit) && status.remaining < estimatedCost) {
      throw new Error(`Provider "${provider}" is over budget`);
    }
  },

  recordUsage(provider: ProviderKey, cost: number) {
    const record = getOrCreateBudget(provider);
    record.used += Math.max(cost, 0);
    record.lastUpdated = new Date().toISOString();
  },

  checkBudget(provider: ProviderKey, estimatedCost: number) {
    const status = BudgetControlService.getBudgetStatus(provider);
    return {
      allowed: !(Number.isFinite(status.limit) && status.remaining < estimatedCost),
      status,
    };
  },

  resetBudget(provider: ProviderKey) {
    const record = getOrCreateBudget(provider);
    record.used = 0;
    record.lastUpdated = new Date().toISOString();
  },
};


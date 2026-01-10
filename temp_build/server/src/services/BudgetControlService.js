"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetControlService = void 0;
var budgets = new Map();
function getOrCreateBudget(provider) {
    if (!budgets.has(provider)) {
        budgets.set(provider, {
            limit: Number.POSITIVE_INFINITY,
            used: 0,
            lastUpdated: new Date().toISOString(),
        });
    }
    return budgets.get(provider);
}
exports.BudgetControlService = {
    setBudgetLimit: function (provider, monthlyUsd) {
        var record = getOrCreateBudget(provider);
        record.limit = Number.isFinite(monthlyUsd) ? Math.max(monthlyUsd, 0) : Number.POSITIVE_INFINITY;
        record.lastUpdated = new Date().toISOString();
    },
    getBudgetStatus: function (provider) {
        var record = getOrCreateBudget(provider);
        var remaining = record.limit === Number.POSITIVE_INFINITY ? Infinity : record.limit - record.used;
        return {
            provider: provider,
            limit: record.limit,
            used: record.used,
            remaining: remaining,
            lastUpdated: record.lastUpdated,
            overBudget: remaining < 0,
        };
    },
    getAllBudgets: function () {
        return Array.from(budgets.keys()).map(function (provider) {
            return exports.BudgetControlService.getBudgetStatus(provider);
        });
    },
    requireBudget: function (provider, estimatedCost) {
        var status = exports.BudgetControlService.getBudgetStatus(provider);
        if (Number.isFinite(status.limit) && status.remaining < estimatedCost) {
            throw new Error("Provider \"".concat(provider, "\" is over budget"));
        }
    },
    recordUsage: function (provider, cost) {
        var record = getOrCreateBudget(provider);
        record.used += Math.max(cost, 0);
        record.lastUpdated = new Date().toISOString();
    },
    checkBudget: function (provider, estimatedCost) {
        var status = exports.BudgetControlService.getBudgetStatus(provider);
        return {
            allowed: !(Number.isFinite(status.limit) && status.remaining < estimatedCost),
            status: status,
        };
    },
    resetBudget: function (provider) {
        var record = getOrCreateBudget(provider);
        record.used = 0;
        record.lastUpdated = new Date().toISOString();
    },
};

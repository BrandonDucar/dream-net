"use strict";
/**
 * API Keeper Summary
 * Provides summary statistics for Ports Ops Panel
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiKeeperSummary = getApiKeeperSummary;
const index_1 = require("./index");
/**
 * Get API Keeper summary for Ports Ops Panel
 */
function getApiKeeperSummary() {
    const status = index_1.APIKeeperCore.status();
    const keys = index_1.APIKeeperCore.listKeys();
    // Count keys by provider
    const byProvider = {};
    for (const key of keys) {
        byProvider[key.providerId] = (byProvider[key.providerId] || 0) + 1;
    }
    return {
        totalKeys: status.keyCount,
        byProvider,
        lastScanAt: status.lastRunAt ? new Date(status.lastRunAt).toISOString() : null,
        costToday: status.costToday,
        costThisMonth: status.costThisMonth,
    };
}

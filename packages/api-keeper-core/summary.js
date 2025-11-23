/**
 * API Keeper Summary
 * Provides summary statistics for Ports Ops Panel
 */
import { APIKeeperCore } from "./index";
/**
 * Get API Keeper summary for Ports Ops Panel
 */
export function getApiKeeperSummary() {
    const status = APIKeeperCore.status();
    const keys = APIKeeperCore.listKeys();
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

/**
 * Conduit Governor
 * Enforces per-line budgets and limits for {portId, clusterId, toolId} combos
 */
import { getConduitConfig } from "./conduits";
// Re-export for convenience
export { getConduitConfig };
const perConduitUsage = new Map();
export function evaluateConduit(portId, clusterId, toolId) {
    const cfg = getConduitConfig(portId, clusterId, toolId);
    if (!cfg) {
        return { allowed: true };
    }
    const key = cfg.id;
    const now = Date.now();
    const windowMs = 60_000;
    let usage = perConduitUsage.get(key);
    if (!usage || now - usage.windowStart >= windowMs) {
        usage = {
            windowStart: now,
            count: 0,
            totalCount: usage?.totalCount ?? 0,
            failureCount: usage?.failureCount ?? 0,
            timeoutCount: usage?.timeoutCount ?? 0,
            lastErrorReason: usage?.lastErrorReason,
        };
    }
    usage.count += 1;
    usage.totalCount = (usage.totalCount ?? 0) + 1;
    perConduitUsage.set(key, usage);
    if (cfg.budgets.maxCallsPerMinute &&
        usage.count > cfg.budgets.maxCallsPerMinute) {
        return {
            allowed: false,
            reason: "CONDUIT_RATE_LIMIT",
            conduitId: cfg.id,
        };
    }
    return { allowed: true, conduitId: cfg.id };
}
/**
 * Get current usage stats for a conduit
 */
export function getConduitUsage(conduitId) {
    return perConduitUsage.get(conduitId);
}
/**
 * Record a failure for a conduit
 */
export function recordConduitFailure(conduitId, errorReason, isTimeout = false) {
    const usage = perConduitUsage.get(conduitId);
    if (usage) {
        usage.failureCount = (usage.failureCount ?? 0) + 1;
        usage.lastErrorReason = errorReason;
        if (isTimeout) {
            usage.timeoutCount = (usage.timeoutCount ?? 0) + 1;
        }
        perConduitUsage.set(conduitId, usage);
    }
}
/**
 * Get all conduit usage stats
 */
export function getAllConduitUsage() {
    return Array.from(perConduitUsage.entries()).map(([conduitId, usage]) => ({
        conduitId,
        usage: { ...usage },
    }));
}

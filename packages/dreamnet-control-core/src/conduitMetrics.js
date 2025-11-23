/**
 * Conduit Metrics
 * Tracks dynamic metrics for conduit "heat" visualization
 */
import { CONDUITS } from "./conduits";
import { getAllConduitUsage } from "./conduitGovernor";
/**
 * Compute metrics for all conduits
 */
export function computeConduitMetrics() {
    const usageMap = new Map();
    for (const { conduitId, usage } of getAllConduitUsage()) {
        usageMap.set(conduitId, usage);
    }
    const metrics = [];
    for (const [id, cfg] of Object.entries(CONDUITS)) {
        const usage = usageMap.get(id);
        const callsLastWindow = usage?.count ?? 0;
        const totalCount = usage?.totalCount ?? 0;
        const failureCount = usage?.failureCount ?? 0;
        const timeoutCount = usage?.timeoutCount ?? 0;
        // Simple heat model: normalized by maxCallsPerMinute
        const maxPerMinute = cfg.budgets.maxCallsPerMinute ?? 60;
        const rawHeat = callsLastWindow / Math.max(1, maxPerMinute);
        const heat = Math.max(0, Math.min(1, rawHeat));
        let status = "ok";
        if (heat > 0.8)
            status = "hot";
        if (failureCount > 0 && heat > 0.5)
            status = "throttled";
        if (failureCount > 5 || timeoutCount > 3)
            status = "blocked";
        metrics.push({
            conduitId: id,
            portId: cfg.portId,
            clusterId: cfg.clusterId,
            toolId: cfg.toolId,
            label: cfg.label,
            priorityLane: cfg.priorityLane,
            callsLastWindow,
            totalCount,
            failureCount,
            timeoutCount,
            lastErrorReason: usage?.lastErrorReason,
            heat,
            status,
        });
    }
    return metrics;
}

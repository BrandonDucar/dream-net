"use strict";
/**
 * Conduit Metrics
 * Tracks dynamic metrics for conduit "heat" visualization
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeConduitMetrics = computeConduitMetrics;
const conduits_1 = require("./conduits");
const conduitGovernor_1 = require("./conduitGovernor");
/**
 * Compute metrics for all conduits
 */
function computeConduitMetrics() {
    const usageMap = new Map();
    for (const { conduitId, usage } of (0, conduitGovernor_1.getAllConduitUsage)()) {
        usageMap.set(conduitId, usage);
    }
    const metrics = [];
    for (const [id, cfg] of Object.entries(conduits_1.CONDUITS)) {
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

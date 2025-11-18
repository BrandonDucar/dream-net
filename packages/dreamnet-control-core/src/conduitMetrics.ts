/**
 * Conduit Metrics
 * Tracks dynamic metrics for conduit "heat" visualization
 */

import { CONDUITS, type ConduitId } from "./conduits";
import { getAllConduitUsage } from "./conduitGovernor";

export type ConduitStatus = "ok" | "hot" | "throttled" | "blocked";

export interface ConduitMetric {
  conduitId: ConduitId;
  portId: string;
  clusterId: string;
  toolId: string;
  label: string;
  priorityLane: number;
  // dynamic
  callsLastWindow: number;
  totalCount: number;
  failureCount: number;
  timeoutCount: number;
  lastErrorReason?: string;
  heat: number; // 0–1
  status: ConduitStatus;
}

/**
 * Compute metrics for all conduits
 */
export function computeConduitMetrics(): ConduitMetric[] {
  const usageMap = new Map<ConduitId, ReturnType<typeof getAllConduitUsage>[number]["usage"]>();
  for (const { conduitId, usage } of getAllConduitUsage()) {
    usageMap.set(conduitId, usage);
  }

  const metrics: ConduitMetric[] = [];

  for (const [id, cfg] of Object.entries(CONDUITS)) {
    const usage = usageMap.get(id as ConduitId);
    const callsLastWindow = usage?.count ?? 0;
    const totalCount = usage?.totalCount ?? 0;
    const failureCount = usage?.failureCount ?? 0;
    const timeoutCount = usage?.timeoutCount ?? 0;

    // Simple heat model: normalized by maxCallsPerMinute
    const maxPerMinute = cfg.budgets.maxCallsPerMinute ?? 60;
    const rawHeat = callsLastWindow / Math.max(1, maxPerMinute);
    const heat = Math.max(0, Math.min(1, rawHeat));

    let status: ConduitStatus = "ok";
    if (heat > 0.8) status = "hot";
    if (failureCount > 0 && heat > 0.5) status = "throttled";
    if (failureCount > 5 || timeoutCount > 3) status = "blocked";

    metrics.push({
      conduitId: id as ConduitId,
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

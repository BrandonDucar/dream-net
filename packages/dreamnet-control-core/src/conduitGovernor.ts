/**
 * Conduit Governor
 * Enforces per-line budgets and limits for {portId, clusterId, toolId} combos
 */

import { getConduitConfig } from "./conduits";
import type { PortId } from "@dreamnet/port-governor/types";
import type { ClusterId } from "../clusters";
import type { ToolId } from "@dreamnet/agent-gateway/tools";

// Re-export for convenience
export { getConduitConfig };

import type { ConduitId } from "./conduits";

export interface ConduitUsage {
  windowStart: number;
  count: number;
  totalCount: number;
  failureCount: number;
  timeoutCount: number;
  lastErrorReason?: string;
}

const perConduitUsage = new Map<ConduitId, ConduitUsage>();

export interface ConduitDecision {
  allowed: boolean;
  reason?: string;
  conduitId?: string;
}

export function evaluateConduit(
  portId: PortId,
  clusterId: ClusterId,
  toolId: ToolId
): ConduitDecision {
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

  if (
    cfg.budgets.maxCallsPerMinute &&
    usage.count > cfg.budgets.maxCallsPerMinute
  ) {
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
export function getConduitUsage(conduitId: ConduitId): ConduitUsage | undefined {
  return perConduitUsage.get(conduitId);
}

/**
 * Record a failure for a conduit
 */
export function recordConduitFailure(conduitId: ConduitId, errorReason: string, isTimeout: boolean = false): void {
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
export function getAllConduitUsage(): Array<{ conduitId: ConduitId; usage: ConduitUsage }> {
  return Array.from(perConduitUsage.entries()).map(([conduitId, usage]) => ({
    conduitId,
    usage: { ...usage },
  }));
}


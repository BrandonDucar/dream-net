/**
 * Conduit Governor
 * Enforces per-line budgets and limits for {portId, clusterId, toolId} combos
 * Also applies throttling based on Free Tier quota status
 */

import { getConduitConfig } from "./conduits";
import { FreeTierQuotaService } from "../../../server/services/FreeTierQuotaService.js";
import type { PortId } from "../../port-governor/src/types";
import type { ClusterId } from "../clusters";
import type { ToolId } from "../../agent-gateway/src/tools";

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

  // Check Free Tier quotas for throttling
  const requestsQuota = FreeTierQuotaService.getQuotaStatus('cloudrun-requests');
  
  // Apply throttling based on quota usage
  let effectiveMaxCallsPerMinute = cfg.budgets.maxCallsPerMinute;
  if (effectiveMaxCallsPerMinute && requestsQuota.status === 'warning') {
    // At 80%+ usage, reduce rate limit by 50%
    effectiveMaxCallsPerMinute = Math.floor(effectiveMaxCallsPerMinute * 0.5);
  } else if (effectiveMaxCallsPerMinute && requestsQuota.status === 'critical') {
    // At 95%+ usage, reduce rate limit by 80%
    effectiveMaxCallsPerMinute = Math.floor(effectiveMaxCallsPerMinute * 0.2);
  } else if (requestsQuota.status === 'exceeded') {
    // At 100% usage, block all requests
    return {
      allowed: false,
      reason: `FREE_TIER_QUOTA_EXCEEDED: ${requestsQuota.quotaType} (${requestsQuota.used}/${requestsQuota.limit})`,
      conduitId: cfg.id,
    };
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
    effectiveMaxCallsPerMinute &&
    usage.count > effectiveMaxCallsPerMinute
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


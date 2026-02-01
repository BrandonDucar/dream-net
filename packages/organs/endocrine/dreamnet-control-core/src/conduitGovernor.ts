/**
 * Conduit Governor
 * Enforces per-line budgets and limits for {portId, clusterId, toolId} combos
 */

import { getConduitConfig } from './conduits.js';
import type { PortId } from "@dreamnet/types";
import type { ClusterId } from './clusters.js';
// import type { ToolId } from "@dreamnet/agent-gateway/src/tools";
type ToolId = string;

// Re-export for convenience
export { getConduitConfig };

import type { ConduitId } from './conduits.js';

export interface ConduitUsage {
  windowStart: number;
  count: number;
  totalCount: number;
  failureCount: number;
  timeoutCount: number;
  lastErrorReason?: string;
}

// import { CoolingSystem } from "@dreamnet/dreamnet-os-core/logic/liquidCooling";
class CoolingSystem {
  constructor(private id: string) { }
  getStatus() { return { isThrottling: false, temperature: 0 }; }
  cycleCoolant() { }
  absorbHeat(amount: number) { }
}

const perConduitUsage = new Map<ConduitId, ConduitUsage>();
const perConduitCooling = new Map<ConduitId, CoolingSystem>();

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

  // [LIQUID COOLING] Thermal Regulation
  let cooling = perConduitCooling.get(key);
  if (!cooling) {
    cooling = new CoolingSystem(key);
    perConduitCooling.set(key, cooling);
  }

  // Check temperature BEFORE work
  const thermalStatus = cooling.getStatus();
  if (thermalStatus.isThrottling) {
    // Cooldown cycle (simulate automatic dissipation over time or rejecting request helps cool)
    cooling.cycleCoolant();
    return {
      allowed: false,
      reason: `CONDUIT_OVERHEATED (Temp: ${thermalStatus.temperature})`,
      conduitId: cfg.id
    };
  }

  // Absorb heat for this request (1 unit for now, could be dynamic based on token cost)
  cooling.absorbHeat(1);


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
    // Also cycle coolant on window reset to help drift back to zero if idle
    cooling.cycleCoolant();
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


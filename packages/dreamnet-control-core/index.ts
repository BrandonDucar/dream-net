/**
 * DreamNet Control Core
 * Global kill-switch and per-cluster rate limiting
 * Now with tier-based access control
 */

import { controlStore } from "./store/controlStore";
import type { ClusterId, ClusterRateLimit, ControlConfig, ControlContext } from "./types";
import type { TierId, TierConfig } from "./tierConfig";
import { bridgeToSpiderWeb } from "../dreamnet-operational-bridge";
import { getTierConfig, tierHasFeature } from "./tierConfig";

export const DreamNetControlCore = {
  // Kill-switch controls
  getKillSwitchState() {
    return controlStore.getKillSwitchState();
  },

  enableGlobalKillSwitch(reason?: string, disabledBy?: string) {
    controlStore.setGlobalKillSwitch(true, reason, disabledBy);
    
    // Bridge to Spider Web
    bridgeToSpiderWeb({
      type: "kill_switch_enabled",
      severity: "critical",
      message: `Global kill-switch enabled${reason ? `: ${reason}` : ""}`,
      metadata: { disabledBy },
      timestamp: Date.now(),
    });
  },

  disableGlobalKillSwitch(reason?: string) {
    controlStore.setGlobalKillSwitch(false, reason);
    
    // Bridge to Spider Web
    bridgeToSpiderWeb({
      type: "kill_switch_disabled",
      severity: "low",
      message: `Global kill-switch disabled${reason ? `: ${reason}` : ""}`,
      timestamp: Date.now(),
    });
  },

  isGlobalKillSwitchEnabled(): boolean {
    return controlStore.getKillSwitchState().globalKillSwitch;
  },

  enableCluster(clusterId: ClusterId, reason?: string) {
    controlStore.setClusterState(clusterId, true, reason);
    
    // Bridge to Spider Web
    bridgeToSpiderWeb({
      type: "cluster_enabled",
      clusterId,
      severity: "low",
      message: `Cluster ${clusterId} enabled${reason ? `: ${reason}` : ""}`,
      timestamp: Date.now(),
    });
  },

  disableCluster(clusterId: ClusterId, reason?: string, disabledBy?: string) {
    controlStore.setClusterState(clusterId, false, reason, disabledBy);
    
    // Bridge to Spider Web
    bridgeToSpiderWeb({
      type: "cluster_disabled",
      clusterId,
      severity: "high",
      message: `Cluster ${clusterId} disabled${reason ? `: ${reason}` : ""}`,
      metadata: { disabledBy },
      timestamp: Date.now(),
    });
  },

  isClusterEnabled(clusterId: ClusterId): boolean {
    return controlStore.isClusterEnabled(clusterId);
  },

  // Rate limiting
  getRateLimit(clusterId: ClusterId): ClusterRateLimit | undefined {
    return controlStore.getRateLimit(clusterId);
  },

  setRateLimit(limit: ClusterRateLimit) {
    controlStore.setRateLimit(limit);
  },

  checkRateLimit(clusterId: ClusterId): { allowed: boolean; reason?: string; remaining?: number } {
    return controlStore.checkRateLimit(clusterId);
  },

  recordRequest(clusterId: ClusterId) {
    controlStore.recordRequest(clusterId);
  },

  // Circuit breakers
  tripCircuitBreaker(clusterId: ClusterId, autoResetAfter?: number) {
    controlStore.tripCircuitBreaker(clusterId, autoResetAfter);
  },

  resetCircuitBreaker(clusterId: ClusterId) {
    controlStore.resetCircuitBreaker(clusterId);
  },

  isCircuitBreakerTripped(clusterId: ClusterId): boolean {
    return controlStore.isCircuitBreakerTripped(clusterId);
  },

  // Full config
  getConfig(): ControlConfig {
    return controlStore.getConfig();
  },

  // Check if operation is allowed (combines kill-switch + rate limit + circuit breaker + tier)
  checkOperation(context: ControlContext & { callerTierId?: TierId; callerTier?: TierConfig }): { allowed: boolean; reason?: string; details?: any } {
    const { clusterId, callerTierId, callerTier } = context;

    // Check global kill-switch
    if (this.isGlobalKillSwitchEnabled()) {
      return {
        allowed: false,
        reason: "Global kill-switch is enabled",
        details: { clusterId, traceId: context.traceId, callerTierId },
      };
    }

    // Check cluster kill-switch
    if (!this.isClusterEnabled(clusterId)) {
      const state = controlStore.getKillSwitchState().clusterStates[clusterId];
      return {
        allowed: false,
        reason: `Cluster ${clusterId} is disabled`,
        details: { clusterId, reason: state?.reason, traceId: context.traceId, callerTierId },
      };
    }

    // Check circuit breaker
    if (this.isCircuitBreakerTripped(clusterId)) {
      return {
        allowed: false,
        reason: `Circuit breaker tripped for ${clusterId}`,
        details: { clusterId, traceId: context.traceId, callerTierId },
      };
    }

    // Check tier-based feature access
    if (callerTierId && callerTier) {
      // Map cluster to feature flag
      const clusterFeatureMap: Record<ClusterId, string> = {
        "wolf-pack": "canAccessWolfPack",
        "octopus-executor": "canAccessOctopus",
        "shield-core": "canAccessShield",
        "orca-pack": "canAccessWolfPack",
        "whale-pack": "canAccessWolfPack",
        "spider-web": "canAccessWolfPack",
        "jaggy-core": "canAccessDreamKeeper",
        "webhook-nervous": "canAccessWebhookNervous",
        "api-keeper": "canAccessWolfPack",
        "ai-seo": "canAccessWolfPack",
        "dream-state": "canAccessDreamKeeper",
        "star-bridge": "canAccessOctopus",
        "all": "canManageClusters",
      };
      
      const requiredFeature = clusterFeatureMap[clusterId];
      if (requiredFeature && !tierHasFeature(callerTierId, requiredFeature)) {
        return {
          allowed: false,
          reason: `Tier ${callerTierId} does not have access to cluster ${clusterId}`,
          details: {
            clusterId,
            callerTierId,
            requiredFlag: requiredFeature,
            traceId: context.traceId,
          },
        };
      }
    }

    // Check rate limit with effective limit = min(cluster limit, tier limit)
    const clusterLimit = this.getRateLimit(clusterId);
    const clusterLimitPerMinute = clusterLimit?.requestsPerMinute || 1000; // Default fallback

    if (callerTierId && callerTier) {
      // Use tier-based rate limit with effective limit
      const tierRateLimitCheck = controlStore.checkTierRateLimit(
        callerTierId,
        callerTier,
        clusterLimitPerMinute
      );
      if (!tierRateLimitCheck.allowed) {
        return {
          allowed: false,
          reason: tierRateLimitCheck.reason,
          details: {
            clusterId,
            callerTierId,
            remaining: tierRateLimitCheck.remaining,
            traceId: context.traceId,
          },
        };
      }
      // Record tier request
      controlStore.recordTierRequest(callerTierId);
    } else {
      // Fallback to cluster rate limit
      const rateLimitCheck = this.checkRateLimit(clusterId);
      if (!rateLimitCheck.allowed) {
        return {
          allowed: false,
          reason: rateLimitCheck.reason,
          details: { clusterId, remaining: rateLimitCheck.remaining, traceId: context.traceId },
        };
      }
      // Record cluster request
      this.recordRequest(clusterId);
    }

    return { allowed: true };
  },
};

export * from "./types";
export * from "./tierConfig";
export * from "./godVault";
export * from "./identityResolver";
export * from "./clusters";
export * from "./rateLimiter";
export * from "./eventFabric";
export * from "./policyEngine";
export * from "./controlCoreMiddleware";
// Conduit layer exports
export * from "./src/conduits";
export * from "./src/conduitGovernor";
export * from "./src/deadLetter";
export * from "./src/conduitMetrics";
export default DreamNetControlCore;


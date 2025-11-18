/**
 * Control Core Middleware
 * 
 * Enforces cluster-level access control, rate limits, and feature flags.
 * 
 * HOW CLUSTERS WORK:
 * - Clusters are biomimetic "organs" - specialized systems within DreamNet
 * - Each cluster has a config (CLUSTERS) defining:
 *   - enabled: Can be disabled per-cluster
 *   - defaultMaxRequestsPerMinute: Cluster-level rate limit
 *   - requiredFeatureFlag: Tier feature flag required to access
 * 
 * HOW TIER + CLUSTER INTERACT:
 * - Tier defines maxRequestsPerMinute (user-level limit)
 * - Cluster defines defaultMaxRequestsPerMinute (cluster-level limit)
 * - Effective limit = Math.min(tierLimit, clusterLimit)
 * - Feature flags: Tier must have cluster.requiredFeatureFlag enabled
 * - God Vault bypasses all restrictions (except logging)
 * 
 * HOW TO ATTACH A ROUTE TO A CLUSTER:
 * ```typescript
 * import { withCluster } from "@dreamnet/dreamnet-control-core/controlCoreMiddleware";
 * 
 * app.post("/api/wolf-pack/run-job",
 *   withCluster("WOLF_PACK"),
 *   wolfPackRunJobHandler
 * );
 * ```
 * 
 * Or manually:
 * ```typescript
 * router.post("/api/wolf-pack/run-job", (req, res, next) => {
 *   req.clusterId = "WOLF_PACK";
 *   next();
 * }, controlCoreMiddleware, handler);
 * ```
 * 
 * EVENT FABRIC & POLICY ENGINE:
 * - All decisions are emitted to eventFabric for observability
 * - Policy engine evaluates context before final allow/deny
 * - Policy engine can add extraFlags (risk score, cost, health, audit flags)
 * 
 * @module @dreamnet/dreamnet-control-core/controlCoreMiddleware
 */

import type { Request, Response, NextFunction } from "express";
import type { ClusterId } from "./clusters";
import { CLUSTERS, getClusterConfig } from "./clusters";
import type { TierId } from "./tierConfig";
import { TIERS } from "./tierConfig";
import type { RequestWithIdentity, CallerIdentity } from "./identityResolver";
import { checkAndConsume } from "./rateLimiter";
import { emitControlCoreEvent, type ControlDecision } from "./eventFabric";
import { evaluatePolicy, type PolicyContext } from "./policyEngine";
import type { OfficeId, CabinetId } from "@dreamnet/dreamstate/types";
import { NERVE_BUS } from "@dreamnet/nerve/bus";
import { createRequestDecisionEvent, createShieldEvent } from "@dreamnet/nerve/factory";

// Global kill-switch flag (in-memory for now, TODO: move to config store)
let globalKillSwitch = false;

/**
 * Set global kill-switch state
 * 
 * @param enabled - Whether kill-switch is enabled
 */
export function setGlobalKillSwitch(enabled: boolean): void {
  globalKillSwitch = enabled;
}

/**
 * Get global kill-switch state
 * 
 * @returns true if kill-switch is enabled
 */
export function isGlobalKillSwitchEnabled(): boolean {
  return globalKillSwitch;
}

/**
 * Control Core Middleware
 * 
 * Enforces:
 * 1. Global kill-switch (blocks all non-GodVault callers)
 * 2. Cluster enable/disable (blocks if cluster disabled and not GodVault)
 * 3. Feature flags (checks tier.featureFlags[cluster.requiredFeatureFlag])
 * 4. Rate limits (effective limit = min(tierLimit, clusterLimit))
 * 
 * Attaches clusterId to request via withCluster() helper or req.clusterId
 */
/**
 * Check if caller has a specific office
 * 
 * @param identity - Caller identity
 * @param officeId - Office ID to check
 * @returns true if caller has the office
 */
function hasOffice(identity: CallerIdentity | undefined, officeId: OfficeId): boolean {
  if (!identity) return false;
  return identity.officeIds?.includes(officeId) === true;
}

/**
 * Check if caller belongs to a specific cabinet
 * 
 * @param identity - Caller identity
 * @param cabinetId - Cabinet ID to check
 * @returns true if caller belongs to the cabinet
 */
function hasCabinet(identity: CallerIdentity | undefined, cabinetId: CabinetId): boolean {
  if (!identity) return false;
  return identity.cabinetIds?.includes(cabinetId) === true;
}

export function controlCoreMiddleware(
  req: RequestWithIdentity,
  res: Response,
  next: NextFunction
): void {
  const traceId = req.traceId || "unknown";
  const callerIdentity = req.callerIdentity;
  const clusterId = (req as any).clusterId as ClusterId | undefined;
  const requiredOfficeId = (req as any).requiredOfficeId as OfficeId | undefined;
  const requiredCabinetId = (req as any).requiredCabinetId as CabinetId | undefined;
  const routeId = `${req.method} ${req.path}`;
  
  // Track base decision and reason for policy evaluation
  let baseDecision: "allow" | "deny" = "allow";
  let baseReason: string | undefined;
  let decision: ControlDecision = "bypassed_no_cluster";
  let effectiveRateLimit: number | undefined;
  let remainingRateLimit: number | undefined;

  // 1. GLOBAL KILL-SWITCH CHECK
  if (globalKillSwitch) {
    const isGodVault = callerIdentity?.isGodVault || false;
    
    if (!isGodVault) {
      baseDecision = "deny";
      baseReason = "Global kill-switch is enabled";
      decision = "denied_global_kill_switch";
      
      console.log(`🚫 [ControlCore] Global kill-switch active - Trace: ${traceId}, Tier: ${callerIdentity?.tierId || "unknown"}`);
      
      // Emit event before returning
      emitControlCoreEvent({
        traceId,
        callerIdentity,
        clusterId,
        routeId,
        decision,
        reason: baseReason,
        metadata: {
          tierId: callerIdentity?.tierId,
          isGodVault: false,
          globalKillSwitchEnabled: true,
        },
        timestamp: Date.now(),
      });
      
      return res.status(503).json({
        ok: false,
        error: "GLOBAL_KILL_SWITCH_ACTIVE",
        reason: baseReason,
        traceId,
        clusterId: clusterId || null,
      });
    }
    
    // God Vault can bypass kill-switch (but log it)
    console.log(`⚠️ [ControlCore] God Vault bypassing global kill-switch - Trace: ${traceId}`);
  }

  // 2. NO CLUSTER ID - ALLOW (some routes may be unclustered)
  if (!clusterId) {
    decision = "bypassed_no_cluster";
    
    // Emit event for unclustered route
    emitControlCoreEvent({
      traceId,
      callerIdentity,
      clusterId: undefined,
      routeId,
      decision,
      metadata: {
        tierId: callerIdentity?.tierId,
        isGodVault: callerIdentity?.isGodVault || false,
      },
      timestamp: Date.now(),
    });
    
    return next();
  }

  // 3. CLUSTER CONFIG LOOKUP
  const clusterConfig = getClusterConfig(clusterId);
  
  if (!clusterConfig) {
    baseDecision = "deny";
    baseReason = `Cluster ${clusterId} not found in configuration`;
    decision = "denied_unknown_cluster";
    
    console.warn(`[ControlCore] Unknown cluster: ${clusterId} - Trace: ${traceId}`);
    
    // Emit event
    emitControlCoreEvent({
      traceId,
      callerIdentity,
      clusterId,
      routeId,
      decision,
      reason: baseReason,
      metadata: {
        tierId: callerIdentity?.tierId,
        isGodVault: callerIdentity?.isGodVault || false,
      },
      timestamp: Date.now(),
    });
    
    return res.status(500).json({
      ok: false,
      error: "UNKNOWN_CLUSTER",
      reason: baseReason,
      traceId,
      clusterId,
    });
  }

  // 4. CLUSTER ENABLED CHECK
  const isGodVault = callerIdentity?.isGodVault || false;
  
  if (!clusterConfig.enabled && !isGodVault) {
    baseDecision = "deny";
    baseReason = `Cluster ${clusterId} is disabled`;
    decision = "denied_cluster_disabled";
    
    console.log(`🚫 [ControlCore] Cluster disabled - Trace: ${traceId}, Cluster: ${clusterId}, Tier: ${callerIdentity?.tierId || "unknown"}`);
    
    // Emit event
    emitControlCoreEvent({
      traceId,
      callerIdentity,
      clusterId,
      routeId,
      decision,
      reason: baseReason,
      metadata: {
        tierId: callerIdentity?.tierId,
        isGodVault: false,
        clusterEnabled: false,
      },
      timestamp: Date.now(),
    });
    
    return res.status(503).json({
      ok: false,
      error: "CLUSTER_DISABLED",
      reason: baseReason,
      traceId,
      clusterId,
      tierId: callerIdentity?.tierId || null,
    });
  }

  // 5. FEATURE FLAG CHECK
  if (clusterConfig.requiredFeatureFlag && !isGodVault) {
    if (!callerIdentity) {
      baseDecision = "deny";
      baseReason = "Caller identity required for cluster access";
      decision = "denied_identity_required";
      
      console.warn(`[ControlCore] No caller identity - Trace: ${traceId}, Cluster: ${clusterId}`);
      
      // Emit event
      emitControlCoreEvent({
        traceId,
        callerIdentity: undefined,
        clusterId,
        routeId,
        decision,
        reason: baseReason,
        metadata: {
          requiredFeatureFlag: clusterConfig.requiredFeatureFlag,
        },
        timestamp: Date.now(),
      });
      
      return res.status(401).json({
        ok: false,
        error: "IDENTITY_REQUIRED",
        reason: baseReason,
        traceId,
        clusterId,
      });
    }

    const hasFeature = callerIdentity.tier.featureFlags[clusterConfig.requiredFeatureFlag] === true;
    
    if (!hasFeature) {
      baseDecision = "deny";
      baseReason = `Tier ${callerIdentity.tierId} does not have access to cluster ${clusterId}`;
      decision = "denied_feature_flag";
      
      console.log(`🚫 [ControlCore] Feature flag denied - Trace: ${traceId}, Cluster: ${clusterId}, Tier: ${callerIdentity.tierId}, Required: ${clusterConfig.requiredFeatureFlag}`);
      
      // Emit event
      emitControlCoreEvent({
        traceId,
        callerIdentity,
        clusterId,
        routeId,
        decision,
        reason: baseReason,
        metadata: {
          tierId: callerIdentity.tierId,
          isGodVault: false,
          requiredFeatureFlag: clusterConfig.requiredFeatureFlag,
        },
        timestamp: Date.now(),
      });
      
      // Publish Nerve Event for deny decision
      try {
        const startTime = (req as any).startTime || Date.now();
        const latencyMs = Date.now() - startTime;
        
        const nerveEvent = createRequestDecisionEvent({
          traceId,
          clusterId,
          tierId: callerIdentity.tierId,
          citizenId: callerIdentity.passport?.citizenId,
          officeIds: callerIdentity.officeIds,
          cabinetIds: callerIdentity.cabinetIds,
          routeId,
          method: req.method,
          decision: "deny",
          reason: baseReason,
          statusCode: 403,
          latencyMs,
        });
        NERVE_BUS.publish(nerveEvent);
      } catch (error) {
        console.error(`[ControlCore] Failed to publish Nerve event:`, error);
      }
      
      return res.status(403).json({
        ok: false,
        error: "FEATURE_FLAG_DENIED",
        reason: baseReason,
        traceId,
        clusterId,
        tierId: callerIdentity.tierId,
        requiredFlag: clusterConfig.requiredFeatureFlag,
      });
    }
  }

  // 6. RATE LIMIT CHECK
  if (callerIdentity && !isGodVault) {
    const tierConfig = TIERS[callerIdentity.tierId];
    const clusterLimit = clusterConfig.defaultMaxRequestsPerMinute;
    const tierLimit = tierConfig.maxRequestsPerMinute;
    effectiveRateLimit = Math.min(clusterLimit, tierLimit);

    const rateLimitResult = checkAndConsume(
      clusterId,
      callerIdentity.tierId,
      effectiveRateLimit
    );
    
    remainingRateLimit = rateLimitResult.remaining;

    if (!rateLimitResult.allowed) {
      baseDecision = "deny";
      baseReason = `Rate limit exceeded for cluster ${clusterId}`;
      decision = "denied_rate_limited";
      
      console.log(`🚫 [ControlCore] Rate limited - Trace: ${traceId}, Cluster: ${clusterId}, Tier: ${callerIdentity.tierId}, Limit: ${effectiveRateLimit}/min`);
      
      // Emit event
      emitControlCoreEvent({
        traceId,
        callerIdentity,
        clusterId,
        routeId,
        decision,
        reason: baseReason,
        metadata: {
          tierId: callerIdentity.tierId,
          isGodVault: false,
          effectiveRateLimit,
          remainingRateLimit: rateLimitResult.remaining,
        },
        timestamp: Date.now(),
      });
      
      // Publish Nerve Event for throttle decision
      try {
        const startTime = (req as any).startTime || Date.now();
        const latencyMs = Date.now() - startTime;
        
        const nerveEvent = createRequestDecisionEvent({
          traceId,
          clusterId,
          tierId: callerIdentity.tierId,
          citizenId: callerIdentity.passport?.citizenId,
          officeIds: callerIdentity.officeIds,
          cabinetIds: callerIdentity.cabinetIds,
          routeId,
          method: req.method,
          decision: "throttle",
          reason: baseReason,
          statusCode: 429,
          latencyMs,
        });
        NERVE_BUS.publish(nerveEvent);
      } catch (error) {
        console.error(`[ControlCore] Failed to publish Nerve event:`, error);
      }
      
      return res.status(429).json({
        ok: false,
        error: "RATE_LIMITED",
        reason: baseReason,
        traceId,
        clusterId,
        tierId: callerIdentity.tierId,
        limitPerMinute: effectiveRateLimit,
        remaining: rateLimitResult.remaining,
      });
    }

    // Log successful rate limit check (for observability)
    if (process.env.DEBUG_RATE_LIMIT === "true") {
      console.log(`✅ [ControlCore] Rate limit OK - Trace: ${traceId}, Cluster: ${clusterId}, Tier: ${callerIdentity.tierId}, Remaining: ${rateLimitResult.remaining}`);
    }
  } else if (isGodVault) {
    // God Vault: Log but don't block
    const tierConfig = callerIdentity ? TIERS[callerIdentity.tierId] : null;
    const clusterLimit = clusterConfig.defaultMaxRequestsPerMinute;
    const tierLimit = tierConfig?.maxRequestsPerMinute || 1000;
    effectiveRateLimit = Math.min(clusterLimit, tierLimit);

    // Still check rate limit for stats, but don't block
    const rateLimitResult = checkAndConsume(
      clusterId,
      callerIdentity?.tierId || "GOD_MODE",
      effectiveRateLimit
    );
    
    remainingRateLimit = rateLimitResult.remaining;

    if (process.env.DEBUG_RATE_LIMIT === "true") {
      console.log(`⚠️ [ControlCore] God Vault rate limit check (not enforced) - Trace: ${traceId}, Cluster: ${clusterId}, Remaining: ${rateLimitResult.remaining}`);
    }
  }

  // 7. DREAMSTATE GOVERNANCE CHECKS (office/cabinet requirements)
  if (!isGodVault) {
    // Check required office
    if (requiredOfficeId) {
      if (!hasOffice(callerIdentity, requiredOfficeId)) {
        baseDecision = "deny";
        baseReason = `Office ${requiredOfficeId} required for this operation`;
        decision = "denied_feature_flag"; // Use generic denial type
        
        console.log(`🚫 [ControlCore] Office required - Trace: ${traceId}, Cluster: ${clusterId}, Required: ${requiredOfficeId}, Tier: ${callerIdentity?.tierId || "unknown"}`);
        
        // Emit event
        emitControlCoreEvent({
          traceId,
          callerIdentity,
          clusterId,
          routeId,
          decision,
          reason: baseReason,
          metadata: {
            tierId: callerIdentity?.tierId,
            isGodVault: false,
            requiredOfficeId,
            callerOffices: callerIdentity?.officeIds || [],
          },
          timestamp: Date.now(),
        });
        
        return res.status(403).json({
          ok: false,
          error: "OFFICE_REQUIRED",
          reason: baseReason,
          traceId,
          clusterId,
          tierId: callerIdentity?.tierId || null,
          requiredOfficeId,
        });
      }
    }
    
    // Check required cabinet
    if (requiredCabinetId) {
      if (!hasCabinet(callerIdentity, requiredCabinetId)) {
        baseDecision = "deny";
        baseReason = `Cabinet ${requiredCabinetId} required for this operation`;
        decision = "denied_feature_flag"; // Use generic denial type
        
        console.log(`🚫 [ControlCore] Cabinet required - Trace: ${traceId}, Cluster: ${clusterId}, Required: ${requiredCabinetId}, Tier: ${callerIdentity?.tierId || "unknown"}`);
        
        // Emit event
        emitControlCoreEvent({
          traceId,
          callerIdentity,
          clusterId,
          routeId,
          decision,
          reason: baseReason,
          metadata: {
            tierId: callerIdentity?.tierId,
            isGodVault: false,
            requiredCabinetId,
            callerCabinets: callerIdentity?.cabinetIds || [],
          },
          timestamp: Date.now(),
        });
        
        return res.status(403).json({
          ok: false,
          error: "CABINET_REQUIRED",
          reason: baseReason,
          traceId,
          clusterId,
          tierId: callerIdentity?.tierId || null,
          requiredCabinetId,
        });
      }
    }
  }

  // 8. POLICY ENGINE EVALUATION (before final allow/deny)
  const policyContext: PolicyContext = {
    traceId,
    callerIdentity,
    clusterId,
    routeId,
    baseDecision,
    baseReason,
    context: {
      tierId: callerIdentity?.tierId,
      isGodVault,
      effectiveRateLimit,
      remainingRateLimit,
      requiredFeatureFlag: clusterConfig.requiredFeatureFlag,
      clusterEnabled: clusterConfig.enabled,
      globalKillSwitchEnabled: globalKillSwitch,
      requiredOfficeId,
      requiredCabinetId,
    },
  };

  const policyResult = evaluatePolicy(policyContext);

  // Policy engine can override base decision
  if (!policyResult.allowed) {
    decision = "denied_feature_flag"; // Use generic denial type for policy denial
    baseReason = policyResult.reason || baseReason || "Policy engine denied";
    
    // Emit event
    emitControlCoreEvent({
      traceId,
      callerIdentity,
      clusterId,
      routeId,
      decision,
      reason: baseReason,
      metadata: {
        tierId: callerIdentity?.tierId,
        isGodVault,
        effectiveRateLimit,
        remainingRateLimit,
        requiredFeatureFlag: clusterConfig.requiredFeatureFlag,
        clusterEnabled: clusterConfig.enabled,
        globalKillSwitchEnabled: globalKillSwitch,
        ...policyResult.extraFlags, // Include policy flags
      },
      timestamp: Date.now(),
    });
    
    return res.status(403).json({
      ok: false,
      error: "POLICY_DENIED",
      reason: baseReason,
      traceId,
      clusterId,
      tierId: callerIdentity?.tierId || null,
      extraFlags: policyResult.extraFlags,
    });
  }

  // 9. ALL CHECKS PASSED - ALLOW REQUEST
  decision = isGodVault ? "allowed_god_vault" : "allowed";
  console.log(`✅ [ControlCore] ${decision} - Trace: ${traceId}, Cluster: ${clusterId}, Tier: ${callerIdentity?.tierId || "unknown"}`);

  // Emit success event with policy flags
  emitControlCoreEvent({
    traceId,
    callerIdentity,
    clusterId,
    routeId,
    decision,
    metadata: {
      tierId: callerIdentity?.tierId,
      isGodVault,
      effectiveRateLimit,
      remainingRateLimit,
      requiredFeatureFlag: clusterConfig.requiredFeatureFlag,
      clusterEnabled: clusterConfig.enabled,
      globalKillSwitchEnabled: globalKillSwitch,
      ...policyResult.extraFlags, // Include policy flags (risk score, cost, etc.)
    },
    timestamp: Date.now(),
  });
  
  // Publish Nerve Event for request decision
  try {
    const startTime = (req as any).startTime || Date.now();
    const latencyMs = Date.now() - startTime;
    
    const nerveEvent = createRequestDecisionEvent({
      traceId,
      clusterId,
      tierId: callerIdentity?.tierId,
      citizenId: callerIdentity?.passport?.citizenId,
      officeIds: callerIdentity?.officeIds,
      cabinetIds: callerIdentity?.cabinetIds,
      routeId,
      method: req.method,
      decision: "allow",
      statusCode: res.statusCode || 200,
      latencyMs,
      riskScore: policyResult.extraFlags?.riskScore,
      costEstimate: policyResult.extraFlags?.estimatedCost,
    });
    NERVE_BUS.publish(nerveEvent);
  } catch (error) {
    // Don't break request pipeline if Nerve event fails
    console.error(`[ControlCore] Failed to publish Nerve event:`, error);
  }

  // Add control headers (including policy flags if available)
  res.setHeader("X-Control-Core-Status", "allowed");
  res.setHeader("X-Cluster-ID", clusterId);
  if (callerIdentity) {
    res.setHeader("X-Caller-Tier-Id", callerIdentity.tierId);
  }
  if (isGodVault) {
    res.setHeader("X-Caller-Is-God-Vault", "true");
  }
  if (policyResult.extraFlags) {
    if (policyResult.extraFlags.riskScore !== undefined) {
      res.setHeader("X-Policy-Risk-Score", policyResult.extraFlags.riskScore.toString());
    }
    if (policyResult.extraFlags.estimatedCost !== undefined) {
      res.setHeader("X-Policy-Estimated-Cost", policyResult.extraFlags.estimatedCost.toString());
    }
    if (policyResult.extraFlags.requiresAudit) {
      res.setHeader("X-Policy-Requires-Audit", "true");
    }
  }

  next();
}

/**
 * Helper to attach cluster ID to request
 * 
 * Usage:
 * ```typescript
 * app.post("/api/wolf-pack/run-job",
 *   withCluster("WOLF_PACK"),
 *   controlCoreMiddleware,
 *   wolfPackRunJobHandler
 * );
 * ```
 * 
 * @param clusterId - Cluster identifier
 * @returns Express middleware that attaches clusterId to request
 */
export function withCluster(clusterId: ClusterId) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    (req as any).clusterId = clusterId;
    next();
  };
}

/**
 * Governance options for route protection
 */
export interface GovernanceOptions {
  clusterId: ClusterId;
  requiredOfficeId?: OfficeId;
  requiredCabinetId?: CabinetId;
}

/**
 * Helper to attach governance requirements to request
 * 
 * Usage:
 * ```typescript
 * app.post("/api/shield/adjust-phase",
 *   withGovernance({
 *     clusterId: "SHIELD_CORE",
 *     requiredOfficeId: "SHIELD_COMMANDER"
 *   }),
 *   controlCoreMiddleware,
 *   shieldAdjustHandler
 * );
 * ```
 * 
 * @param options - Governance options (clusterId, requiredOfficeId, requiredCabinetId)
 * @returns Express middleware that attaches governance requirements to request
 */
export function withGovernance(
  options: GovernanceOptions
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    (req as any).clusterId = options.clusterId;
    if (options.requiredOfficeId) {
      (req as any).requiredOfficeId = options.requiredOfficeId;
    }
    if (options.requiredCabinetId) {
      (req as any).requiredCabinetId = options.requiredCabinetId;
    }
    next();
  };
}


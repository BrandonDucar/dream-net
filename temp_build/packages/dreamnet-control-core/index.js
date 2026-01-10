"use strict";
/**
 * DreamNet Control Core
 * Global kill-switch and per-cluster rate limiting
 * Now with tier-based access control
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DreamNetControlCore = void 0;
const controlStore_1 = require("./store/controlStore");
const dreamnet_operational_bridge_1 = require("../dreamnet-operational-bridge");
const tierConfig_1 = require("./tierConfig");
exports.DreamNetControlCore = {
    // Kill-switch controls
    getKillSwitchState() {
        return controlStore_1.controlStore.getKillSwitchState();
    },
    enableGlobalKillSwitch(reason, disabledBy) {
        controlStore_1.controlStore.setGlobalKillSwitch(true, reason, disabledBy);
        // Bridge to Spider Web
        (0, dreamnet_operational_bridge_1.bridgeToSpiderWeb)({
            type: "kill_switch_enabled",
            severity: "critical",
            message: `Global kill-switch enabled${reason ? `: ${reason}` : ""}`,
            metadata: { disabledBy },
            timestamp: Date.now(),
        });
    },
    disableGlobalKillSwitch(reason) {
        controlStore_1.controlStore.setGlobalKillSwitch(false, reason);
        // Bridge to Spider Web
        (0, dreamnet_operational_bridge_1.bridgeToSpiderWeb)({
            type: "kill_switch_disabled",
            severity: "low",
            message: `Global kill-switch disabled${reason ? `: ${reason}` : ""}`,
            timestamp: Date.now(),
        });
    },
    isGlobalKillSwitchEnabled() {
        return controlStore_1.controlStore.getKillSwitchState().globalKillSwitch;
    },
    enableCluster(clusterId, reason) {
        controlStore_1.controlStore.setClusterState(clusterId, true, reason);
        // Bridge to Spider Web
        (0, dreamnet_operational_bridge_1.bridgeToSpiderWeb)({
            type: "cluster_enabled",
            clusterId,
            severity: "low",
            message: `Cluster ${clusterId} enabled${reason ? `: ${reason}` : ""}`,
            timestamp: Date.now(),
        });
    },
    disableCluster(clusterId, reason, disabledBy) {
        controlStore_1.controlStore.setClusterState(clusterId, false, reason, disabledBy);
        // Bridge to Spider Web
        (0, dreamnet_operational_bridge_1.bridgeToSpiderWeb)({
            type: "cluster_disabled",
            clusterId,
            severity: "high",
            message: `Cluster ${clusterId} disabled${reason ? `: ${reason}` : ""}`,
            metadata: { disabledBy },
            timestamp: Date.now(),
        });
    },
    isClusterEnabled(clusterId) {
        return controlStore_1.controlStore.isClusterEnabled(clusterId);
    },
    // Rate limiting
    getRateLimit(clusterId) {
        return controlStore_1.controlStore.getRateLimit(clusterId);
    },
    setRateLimit(limit) {
        controlStore_1.controlStore.setRateLimit(limit);
    },
    checkRateLimit(clusterId) {
        return controlStore_1.controlStore.checkRateLimit(clusterId);
    },
    recordRequest(clusterId) {
        controlStore_1.controlStore.recordRequest(clusterId);
    },
    // Circuit breakers
    tripCircuitBreaker(clusterId, autoResetAfter) {
        controlStore_1.controlStore.tripCircuitBreaker(clusterId, autoResetAfter);
    },
    resetCircuitBreaker(clusterId) {
        controlStore_1.controlStore.resetCircuitBreaker(clusterId);
    },
    isCircuitBreakerTripped(clusterId) {
        return controlStore_1.controlStore.isCircuitBreakerTripped(clusterId);
    },
    // Full config
    getConfig() {
        return controlStore_1.controlStore.getConfig();
    },
    // Check if operation is allowed (combines kill-switch + rate limit + circuit breaker + tier)
    checkOperation(context) {
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
            const state = controlStore_1.controlStore.getKillSwitchState().clusterStates[clusterId];
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
            const clusterFeatureMap = {
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
            if (requiredFeature && !(0, tierConfig_1.tierHasFeature)(callerTierId, requiredFeature)) {
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
            const tierRateLimitCheck = controlStore_1.controlStore.checkTierRateLimit(callerTierId, callerTier, clusterLimitPerMinute);
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
            controlStore_1.controlStore.recordTierRequest(callerTierId);
        }
        else {
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
__exportStar(require("./types"), exports);
__exportStar(require("./tierConfig"), exports);
__exportStar(require("./godVault"), exports);
__exportStar(require("./identityResolver"), exports);
__exportStar(require("./clusters"), exports);
__exportStar(require("./rateLimiter"), exports);
__exportStar(require("./eventFabric"), exports);
__exportStar(require("./policyEngine"), exports);
__exportStar(require("./controlCoreMiddleware"), exports);
// Conduit layer exports
__exportStar(require("./src/conduits"), exports);
__exportStar(require("./src/conduitGovernor"), exports);
__exportStar(require("./src/deadLetter"), exports);
__exportStar(require("./src/conduitMetrics"), exports);
exports.default = exports.DreamNetControlCore;

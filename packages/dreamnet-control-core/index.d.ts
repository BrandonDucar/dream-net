/**
 * DreamNet Control Core
 * Global kill-switch and per-cluster rate limiting
 * Now with tier-based access control
 */
import type { ClusterId, ClusterRateLimit, ControlConfig, ControlContext } from "./types";
import type { TierId, TierConfig } from "./tierConfig";
export declare const DreamNetControlCore: {
    getKillSwitchState(): import("./types").KillSwitchState;
    enableGlobalKillSwitch(reason?: string, disabledBy?: string): void;
    disableGlobalKillSwitch(reason?: string): void;
    isGlobalKillSwitchEnabled(): boolean;
    enableCluster(clusterId: ClusterId, reason?: string): void;
    disableCluster(clusterId: ClusterId, reason?: string, disabledBy?: string): void;
    isClusterEnabled(clusterId: ClusterId): boolean;
    getRateLimit(clusterId: ClusterId): ClusterRateLimit | undefined;
    setRateLimit(limit: ClusterRateLimit): void;
    checkRateLimit(clusterId: ClusterId): {
        allowed: boolean;
        reason?: string;
        remaining?: number;
    };
    recordRequest(clusterId: ClusterId): void;
    tripCircuitBreaker(clusterId: ClusterId, autoResetAfter?: number): void;
    resetCircuitBreaker(clusterId: ClusterId): void;
    isCircuitBreakerTripped(clusterId: ClusterId): boolean;
    getConfig(): ControlConfig;
    checkOperation(context: ControlContext & {
        callerTierId?: TierId;
        callerTier?: TierConfig;
    }): {
        allowed: boolean;
        reason?: string;
        details?: any;
    };
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
export * from "./src/conduits";
export * from "./src/conduitGovernor";
export * from "./src/deadLetter";
export * from "./src/conduitMetrics";
export default DreamNetControlCore;

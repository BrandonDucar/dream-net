/**
 * Control Store - In-memory state for kill-switch and rate limits
 * In production, this should use Redis/KV store
 */
import type { KillSwitchState, ClusterRateLimit, ControlConfig, ClusterId } from "../types";
import type { TierId, TierConfig } from "../tierConfig";
declare class ControlStore {
    private killSwitchState;
    private rateLimits;
    private requestCounts;
    private circuitBreakers;
    private tierRequestCounts;
    private tierConcurrencyCounts;
    constructor();
    private initializeDefaultRateLimits;
    getKillSwitchState(): KillSwitchState;
    setGlobalKillSwitch(enabled: boolean, reason?: string, disabledBy?: string): void;
    setClusterState(clusterId: ClusterId, enabled: boolean, reason?: string, disabledBy?: string): void;
    isClusterEnabled(clusterId: ClusterId): boolean;
    getRateLimit(clusterId: ClusterId): ClusterRateLimit | undefined;
    setRateLimit(limit: ClusterRateLimit): void;
    recordRequest(clusterId: ClusterId): void;
    checkRateLimit(clusterId: ClusterId): {
        allowed: boolean;
        reason?: string;
        remaining?: number;
    };
    tripCircuitBreaker(clusterId: ClusterId, autoResetAfter?: number): void;
    resetCircuitBreaker(clusterId: ClusterId): void;
    isCircuitBreakerTripped(clusterId: ClusterId): boolean;
    recordTierRequest(tierId: TierId): void;
    /**
     * Check tier rate limit with effective limit (min of cluster and tier limits)
     *
     * @param tierId - Tier ID
     * @param tierConfig - Tier configuration
     * @param clusterLimitPerMinute - Cluster rate limit per minute
     * @returns Rate limit check result
     */
    checkTierRateLimit(tierId: TierId, tierConfig: TierConfig, clusterLimitPerMinute: number): {
        allowed: boolean;
        reason?: string;
        remaining?: number;
    };
    incrementTierConcurrency(tierId: TierId): void;
    decrementTierConcurrency(tierId: TierId): void;
    getConfig(): ControlConfig;
}
export declare const controlStore: ControlStore;
export {};

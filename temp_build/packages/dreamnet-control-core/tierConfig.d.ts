/**
 * DreamNet Access Tier Configuration
 * Strongly-typed tier system with rate limits and feature flags
 *
 * @module @dreamnet/dreamnet-control-core/tierConfig
 */
/**
 * Tier ID - Strongly typed tier identifiers
 */
export type TierId = "SEED" | "BUILDER" | "OPERATOR" | "GOD_MODE";
/**
 * Tier Configuration
 * Defines rate limits and feature flags for each access tier
 */
export interface TierConfig {
    /** Tier identifier */
    id: TierId;
    /** Human-readable label */
    label: string;
    /** Description of the tier */
    description?: string;
    /** Maximum requests per minute */
    maxRequestsPerMinute: number;
    /** Maximum requests per hour (optional) */
    maxRequestsPerHour?: number;
    /** Maximum concurrent requests (optional) */
    maxConcurrentRequests?: number;
    /** Feature flags - controls access to clusters/features */
    featureFlags: {
        canAccessWolfPack?: boolean;
        canAccessOctopus?: boolean;
        canAccessWebhookNervousSystem?: boolean;
        canAccessShieldCore?: boolean;
        canUseHighCostEndpoints?: boolean;
        canManageDeployments?: boolean;
        canToggleKillSwitch?: boolean;
        canManageTiers?: boolean;
        [key: string]: boolean | undefined;
    };
}
/**
 * TIERS - Complete tier configuration registry
 *
 * Usage:
 * ```typescript
 * import { TIERS } from "@dreamnet/dreamnet-control-core/tierConfig";
 * const seedTier = TIERS.SEED;
 * ```
 */
export declare const TIERS: Record<TierId, TierConfig>;
/**
 * Get tier configuration by ID
 *
 * @param tierId - Tier identifier
 * @returns Tier configuration
 */
export declare function getTierConfig(tierId: TierId): TierConfig;
/**
 * Check if a tier has a specific feature flag enabled
 *
 * @param tierId - Tier identifier
 * @param featureFlag - Feature flag name
 * @returns true if feature is enabled, false otherwise
 */
export declare function tierHasFeature(tierId: TierId, featureFlag: string): boolean;
/**
 * Get effective rate limit (minimum of cluster and tier limits)
 *
 * @param tierId - Tier identifier
 * @param clusterLimit - Cluster rate limit (per minute)
 * @returns Effective rate limit per minute
 */
export declare function getEffectiveRateLimit(tierId: TierId, clusterLimit: number): number;

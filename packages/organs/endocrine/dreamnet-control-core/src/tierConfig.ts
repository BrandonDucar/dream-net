/**
 * DreamNet Access Tier Configuration
 * Strongly-typed tier system with rate limits and feature flags
 * 
 * @module @dreamnet/dreamnet-control-core/tierConfig
 */

/**
 * Tier ID - Strongly typed tier identifiers
 */
import { type TierId } from '@dreamnet/types';
export { type TierId };

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
    canUseOptimisticRollups?: boolean; // Hijack: Skip ShieldCore pre-check
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
export const TIERS: Record<TierId, TierConfig> = {
  FREE_TIER: {
    id: "FREE_TIER",
    label: "Free Tier",
    description: "Legacy Free Tier",
    maxRequestsPerMinute: 10,
    maxRequestsPerHour: 100,
    featureFlags: {
      canAccessWolfPack: false,
    }
  },
  VERCEL_PRO: {
    id: "VERCEL_PRO",
    label: "Vercel Pro",
    description: "Legacy Vercel Pro Tier",
    maxRequestsPerMinute: 50,
    maxRequestsPerHour: 1000,
    featureFlags: {
      canAccessWolfPack: true,
      canAccessOctopus: true,
    }
  },
  SEED: {
    id: "SEED",
    label: "Seed",
    description: "Default / low-trust tier for basic experimentation.",
    maxRequestsPerMinute: 10,
    maxRequestsPerHour: 300,
    maxConcurrentRequests: 2,
    featureFlags: {
      canAccessWolfPack: false,
      canAccessOctopus: false,
      canAccessWebhookNervousSystem: false,
      canAccessShieldCore: false,
      canUseHighCostEndpoints: false,
      canManageDeployments: false,
      canToggleKillSwitch: false,
      canManageTiers: false,
      canUseOptimisticRollups: false,
    },
  },
  BUILDER: {
    id: "BUILDER",
    label: "Builder",
    description: "Builders actively wiring DreamNet into real workloads.",
    maxRequestsPerMinute: 60,
    maxRequestsPerHour: 3_000,
    maxConcurrentRequests: 10,
    featureFlags: {
      canAccessWolfPack: true,
      canAccessOctopus: true,
      canAccessWebhookNervousSystem: true,
      canAccessShieldCore: false,
      canUseHighCostEndpoints: false,
      canManageDeployments: false,
      canToggleKillSwitch: false,
      canManageTiers: false,
      canUseOptimisticRollups: false,
    },
  },
  OPERATOR: {
    id: "OPERATOR",
    label: "Operator",
    description: "Operational tier for serious, ongoing DreamNet operations.",
    maxRequestsPerMinute: 200,
    maxRequestsPerHour: 10_000,
    maxConcurrentRequests: 40,
    featureFlags: {
      canAccessWolfPack: true,
      canAccessOctopus: true,
      canAccessWebhookNervousSystem: true,
      canAccessShieldCore: true,
      canUseHighCostEndpoints: true,
      canManageDeployments: true,
      canToggleKillSwitch: false,
      canManageTiers: false,
      canUseOptimisticRollups: true,
    },
  },
  GOD_MODE: {
    id: "GOD_MODE",
    label: "God Mode",
    description: "Internal-only founder / root operator tier. Dangerous. Do not expose.",
    maxRequestsPerMinute: 1_000,
    maxRequestsPerHour: 60_000,
    maxConcurrentRequests: 200,
    featureFlags: {
      canAccessWolfPack: true,
      canAccessOctopus: true,
      canAccessWebhookNervousSystem: true,
      canAccessShieldCore: true,
      canUseHighCostEndpoints: true,
      canManageDeployments: true,
      canToggleKillSwitch: true,
      canManageTiers: true,
      canUseOptimisticRollups: true,
    },
  },
};

/**
 * Get tier configuration by ID
 * 
 * @param tierId - Tier identifier
 * @returns Tier configuration
 */
export function getTierConfig(tierId: TierId): TierConfig {
  return TIERS[tierId];
}

/**
 * Check if a tier has a specific feature flag enabled
 * 
 * @param tierId - Tier identifier
 * @param featureFlag - Feature flag name
 * @returns true if feature is enabled, false otherwise
 */
export function tierHasFeature(tierId: TierId, featureFlag: string): boolean {
  const config = getTierConfig(tierId);
  return config.featureFlags[featureFlag] === true;
}

/**
 * Get effective rate limit (minimum of cluster and tier limits)
 * 
 * @param tierId - Tier identifier
 * @param clusterLimit - Cluster rate limit (per minute)
 * @returns Effective rate limit per minute
 */
export function getEffectiveRateLimit(tierId: TierId, clusterLimit: number): number {
  const tierConfig = getTierConfig(tierId);
  return Math.min(clusterLimit, tierConfig.maxRequestsPerMinute);
}

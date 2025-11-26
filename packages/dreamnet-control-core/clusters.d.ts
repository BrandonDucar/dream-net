/**
 * Cluster Configuration
 * Defines clusters/organs and their access requirements
 *
 * Clusters are biomimetic "organs" - specialized systems within DreamNet
 * Each cluster can be enabled/disabled and has rate limits and feature flag requirements
 *
 * @module @dreamnet/dreamnet-control-core/clusters
 */
export type ClusterId = "WOLF_PACK" | "OCTOPUS" | "SPIDER_WEB" | "JAGGY" | "SHIELD_CORE" | "WEBHOOK_NERVOUS_SYSTEM" | "ORCA_PACK" | "WHALE_PACK" | "API_KEEPER" | "AI_SEO" | "DREAM_STATE" | "STAR_BRIDGE" | "DEPLOYKEEPER_CORE" | "CLOUD_RUN_CORE";
export interface ClusterConfig {
    /** Cluster identifier */
    id: ClusterId;
    /** Human-readable label */
    label: string;
    /** Description of the cluster's purpose */
    description?: string;
    /** Whether the cluster is enabled (can be disabled per-cluster) */
    enabled: boolean;
    /** Default maximum requests per minute for this cluster */
    defaultMaxRequestsPerMinute: number;
    /** Default maximum requests per hour (optional) */
    defaultMaxRequestsPerHour?: number;
    /** Required feature flag from tier config (e.g., "canAccessWolfPack") */
    requiredFeatureFlag?: string;
}
/**
 * CLUSTERS - Complete cluster configuration registry
 *
 * Each cluster represents a biomimetic "organ" in DreamNet:
 * - Wolf Pack: Offensive/executional agents
 * - Octopus: Multi-arm integration brain
 * - Spider Web: Nervous system (event routing)
 * - Shield Core: Immune system (defense)
 * - Webhook Nervous System: Biomimetic webhook management
 * - Jaggy: Silent sentinel / observability
 * - Orca Pack: Communications & narrative management
 * - Whale Pack: Commerce & product management
 *
 * Usage:
 * ```typescript
 * import { CLUSTERS } from "@dreamnet/dreamnet-control-core/clusters";
 * const wolfConfig = CLUSTERS.WOLF_PACK;
 * ```
 */
export declare const CLUSTERS: Record<ClusterId, ClusterConfig>;
/**
 * Get cluster configuration by ID
 *
 * @param clusterId - Cluster identifier
 * @returns Cluster configuration
 */
export declare function getClusterConfig(clusterId: ClusterId): ClusterConfig;
/**
 * Check if a cluster is enabled
 *
 * @param clusterId - Cluster identifier
 * @returns true if cluster exists and is enabled
 */
export declare function isClusterEnabled(clusterId: ClusterId): boolean;

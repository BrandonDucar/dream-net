/**
 * Cluster Configuration
 * Defines clusters/organs and their access requirements
 *
 * Clusters are biomimetic "organs" - specialized systems within DreamNet
 * Each cluster can be enabled/disabled and has rate limits and feature flag requirements
 *
 * @module @dreamnet/dreamnet-control-core/clusters
 */
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
export const CLUSTERS = {
    WOLF_PACK: {
        id: "WOLF_PACK",
        label: "Wolf Pack",
        description: "Offensive/executional agents - funding discovery, grant hunting, partner outreach",
        enabled: true,
        defaultMaxRequestsPerMinute: 60,
        defaultMaxRequestsPerHour: 1000,
        requiredFeatureFlag: "canAccessWolfPack",
    },
    OCTOPUS: {
        id: "OCTOPUS",
        label: "Octopus Executor",
        description: "Multi-arm integration brain - 8-arm parallel task execution, connector orchestration",
        enabled: true,
        defaultMaxRequestsPerMinute: 120,
        defaultMaxRequestsPerHour: 5000,
        requiredFeatureFlag: "canAccessOctopus",
    },
    SPIDER_WEB: {
        id: "SPIDER_WEB",
        label: "Spider Web Core",
        description: "Nervous system - event routing, thread execution, signal pathways",
        enabled: true,
        defaultMaxRequestsPerMinute: 100,
        defaultMaxRequestsPerHour: 2000,
        requiredFeatureFlag: "canAccessWebhookNervousSystem", // Spider Web is part of nervous system
    },
    JAGGY: {
        id: "JAGGY",
        label: "Jaggy Core",
        description: "Silent sentinel - observability, reconnaissance, passive monitoring",
        enabled: true,
        defaultMaxRequestsPerMinute: 20,
        defaultMaxRequestsPerHour: 200,
        requiredFeatureFlag: "canAccessDreamKeeper", // Jaggy is part of DreamKeeper system
    },
    SHIELD_CORE: {
        id: "SHIELD_CORE",
        label: "Shield Core",
        description: "Immune system - threat detection, rate limiting, anomaly detection, defensive spikes",
        enabled: true,
        defaultMaxRequestsPerMinute: 1000,
        defaultMaxRequestsPerHour: 50000,
        requiredFeatureFlag: "canAccessShieldCore",
    },
    WEBHOOK_NERVOUS_SYSTEM: {
        id: "WEBHOOK_NERVOUS_SYSTEM",
        label: "Webhook Nervous System",
        description: "Biomimetic webhook management - neurons, synapses, reflex arcs, mycelium network",
        enabled: true,
        defaultMaxRequestsPerMinute: 200,
        defaultMaxRequestsPerHour: 5000,
        requiredFeatureFlag: "canAccessWebhookNervousSystem",
    },
    ORCA_PACK: {
        id: "ORCA_PACK",
        label: "Orca Pack",
        description: "Communications & narrative management - content strategy, theme generation, multi-channel posting",
        enabled: true,
        defaultMaxRequestsPerMinute: 30,
        defaultMaxRequestsPerHour: 500,
        requiredFeatureFlag: "canAccessWolfPack", // Orca Pack uses similar access as Wolf Pack for now
    },
    WHALE_PACK: {
        id: "WHALE_PACK",
        label: "Whale Pack",
        description: "Commerce & product management - TikTok commerce, product optimization, audience targeting",
        enabled: true,
        defaultMaxRequestsPerMinute: 30,
        defaultMaxRequestsPerHour: 500,
        requiredFeatureFlag: "canAccessWolfPack", // Whale Pack uses similar access as Wolf Pack for now
    },
    API_KEEPER: {
        id: "API_KEEPER",
        label: "API Keeper",
        description: "API management and key administration",
        enabled: true,
        defaultMaxRequestsPerMinute: 100,
        defaultMaxRequestsPerHour: 2000,
        requiredFeatureFlag: "canAccessWolfPack", // API Keeper uses similar access
    },
    AI_SEO: {
        id: "AI_SEO",
        label: "AI SEO Core",
        description: "AI-powered SEO optimization and content enhancement",
        enabled: true,
        defaultMaxRequestsPerMinute: 50,
        defaultMaxRequestsPerHour: 1000,
        requiredFeatureFlag: "canAccessWolfPack", // AI SEO uses similar access
    },
    DREAM_STATE: {
        id: "DREAM_STATE",
        label: "Dream State Core",
        description: "Government layer - passports, governance, diplomatic relations",
        enabled: true,
        defaultMaxRequestsPerMinute: 100,
        defaultMaxRequestsPerHour: 2000,
        requiredFeatureFlag: "canAccessDreamKeeper", // Dream State is governance layer
    },
    STAR_BRIDGE: {
        id: "STAR_BRIDGE",
        label: "Star Bridge Lungs",
        description: "Cross-chain breathwork - chain health monitoring, routing preferences",
        enabled: true,
        defaultMaxRequestsPerMinute: 30,
        defaultMaxRequestsPerHour: 500,
        requiredFeatureFlag: "canAccessOctopus", // Star Bridge is cross-chain connector
    },
    DEPLOYKEEPER_CORE: {
        id: "DEPLOYKEEPER_CORE",
        label: "Deploy Keeper Core",
        description: "Deployment management - Vercel, Railway, GCP, GKE deployments and cleanup",
        enabled: true,
        defaultMaxRequestsPerMinute: 20,
        defaultMaxRequestsPerHour: 200,
        requiredFeatureFlag: "canManageDeployments", // Requires OPERATOR tier or higher
    },
    CLOUD_RUN_CORE: {
        id: "CLOUD_RUN_CORE",
        label: "Cloud Run Core",
        description: "Google Cloud Run lifecycle management - deploy, scale, update, keep-alive, budget control",
        enabled: true,
        defaultMaxRequestsPerMinute: 10,
        defaultMaxRequestsPerHour: 100,
        requiredFeatureFlag: "canManageDeployments", // Requires OPERATOR tier or higher
    },
};
/**
 * Get cluster configuration by ID
 *
 * @param clusterId - Cluster identifier
 * @returns Cluster configuration
 */
export function getClusterConfig(clusterId) {
    return CLUSTERS[clusterId];
}
/**
 * Check if a cluster is enabled
 *
 * @param clusterId - Cluster identifier
 * @returns true if cluster exists and is enabled
 */
export function isClusterEnabled(clusterId) {
    const config = CLUSTERS[clusterId];
    return config ? config.enabled : false;
}

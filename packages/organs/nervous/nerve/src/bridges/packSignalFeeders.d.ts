/**
 * Pack Signal Feeders
 * Biomimetic: Feed operational metrics into packs (Wolf, Whale, Orca)
 */
import type { ScalingMetrics } from '../../dreamnet-metrics-core/types.js';
import type { CostSummary } from '../../dreamnet-cost-core/types.js';
/**
 * Feed cost metrics to Wolf Pack (funding decisions)
 */
export declare function feedCostMetricsToWolfPack(costSummary: CostSummary): void;
/**
 * Feed performance metrics to Whale Pack (commerce optimization)
 */
export declare function feedPerformanceMetricsToWhalePack(metrics: ScalingMetrics): void;
/**
 * Feed social/engagement metrics to Orca Pack (content strategy)
 */
export declare function feedSocialMetricsToOrcaPack(metrics: {
    clusterId: string;
    engagementRate: number;
    reach: number;
    impressions: number;
    timestamp: number;
}): void;
/**
 * Feed health metrics to all packs (adaptive behavior)
 */
export declare function feedHealthMetricsToPacks(health: {
    clusterId: string;
    status: "healthy" | "degraded" | "down";
    latency?: number;
    timestamp: number;
}): void;
//# sourceMappingURL=packSignalFeeders.d.ts.map
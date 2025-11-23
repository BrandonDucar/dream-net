/**
 * Pack Signal Feeders
 * Biomimetic: Feed operational metrics into packs (Wolf, Whale, Orca)
 */
/**
 * Feed cost metrics to Wolf Pack (funding decisions)
 */
export function feedCostMetricsToWolfPack(costSummary) {
    // In production, this would call WolfPackFundingCore.SignalCore.addSignal()
    // For now, we'll create a signal structure that can be consumed
    const signal = {
        type: "cost_metric",
        clusterId: costSummary.clusterId,
        totalCost: costSummary.totalCost,
        costToday: costSummary.costToday,
        costThisWeek: costSummary.costThisWeek,
        costThisMonth: costSummary.costThisMonth,
        timestamp: Date.now(),
    };
    console.log(`🐺 [Wolf Pack Signal] Cost metric fed: ${costSummary.clusterId} - $${costSummary.totalCost.toFixed(2)} total`);
    // TODO: Integrate with WolfPackFundingCore.SignalCore
    // WolfPackFundingCore.SignalCore.addSignal({
    //   kind: "economic",
    //   source: "cost-core",
    //   payload: signal,
    // });
}
/**
 * Feed performance metrics to Whale Pack (commerce optimization)
 */
export function feedPerformanceMetricsToWhalePack(metrics) {
    const signal = {
        type: "performance_metric",
        clusterId: metrics.clusterId,
        requestsPerSecond: metrics.requestsPerSecond,
        errorRate: metrics.errorRate,
        averageLatency: metrics.averageLatency,
        p95Latency: metrics.p95Latency,
        timestamp: Date.now(),
    };
    console.log(`🐋 [Whale Pack Signal] Performance metric fed: ${metrics.clusterId} - ${metrics.requestsPerSecond.toFixed(2)} req/s`);
    // TODO: Integrate with WhalePackCore.SignalCore
    // WhalePackCore.SignalCore.addSignal({
    //   kind: "performance",
    //   source: "metrics-core",
    //   payload: signal,
    // });
}
/**
 * Feed social/engagement metrics to Orca Pack (content strategy)
 */
export function feedSocialMetricsToOrcaPack(metrics) {
    const signal = {
        type: "social_metric",
        clusterId: metrics.clusterId,
        engagementRate: metrics.engagementRate,
        reach: metrics.reach,
        impressions: metrics.impressions,
        timestamp: Date.now(),
    };
    console.log(`🐬 [Orca Pack Signal] Social metric fed: ${metrics.clusterId} - ${metrics.engagementRate.toFixed(2)}% engagement`);
    // TODO: Integrate with OrcaPackCore.SignalCore
    // OrcaPackCore.SignalCore.addSignal({
    //   kind: "social",
    //   source: "metrics-core",
    //   payload: signal,
    // });
}
/**
 * Feed health metrics to all packs (adaptive behavior)
 */
export function feedHealthMetricsToPacks(health) {
    const signal = {
        type: "health_metric",
        clusterId: health.clusterId,
        status: health.status,
        latency: health.latency,
        timestamp: Date.now(),
    };
    console.log(`🔄 [Pack Signals] Health metric fed to all packs: ${health.clusterId} - ${health.status}`);
    // TODO: Feed to all packs
    // WolfPackFundingCore.SignalCore.addSignal({ ...signal, pack: "wolf" });
    // WhalePackCore.SignalCore.addSignal({ ...signal, pack: "whale" });
    // OrcaPackCore.SignalCore.addSignal({ ...signal, pack: "orca" });
}

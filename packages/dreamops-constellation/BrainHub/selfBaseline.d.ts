/**
 * Self Baseline System
 *
 * Defines "normal" system state patterns (the "self" in immune system terms)
 * Stores baseline metrics for service health, deployments, resources, and integrations
 */
import type DreamMemory from "../DreamMemory/index.js";
export interface BaselineMetric {
    name: string;
    value: number;
    unit: string;
    timestamp: string;
}
export interface BaselinePattern {
    id: string;
    category: "service_health" | "deployment" | "resource_usage" | "integration";
    metrics: BaselineMetric[];
    statistics: {
        mean: number;
        stdDev: number;
        min: number;
        max: number;
        percentile25: number;
        percentile50: number;
        percentile75: number;
        percentile95: number;
    };
    sampleCount: number;
    version: number;
    createdAt: string;
    updatedAt: string;
}
export interface ServiceHealthBaseline {
    service: string;
    latency: BaselinePattern;
    errorRate: BaselinePattern;
    uptime: BaselinePattern;
}
export interface DeploymentBaseline {
    successRate: BaselinePattern;
    rollbackFrequency: BaselinePattern;
    deploymentDuration: BaselinePattern;
}
export interface ResourceBaseline {
    cpu: BaselinePattern;
    memory: BaselinePattern;
    cost: BaselinePattern;
}
export interface IntegrationBaseline {
    integration: string;
    healthStatus: BaselinePattern;
    responseTime: BaselinePattern;
}
export declare class SelfBaseline {
    private dreamMemory;
    private baselines;
    constructor(dreamMemory: DreamMemory);
    /**
     * Calculate statistics from a set of metric values
     */
    private calculateStatistics;
    /**
     * Build baseline from historical metrics
     */
    buildBaseline(category: BaselinePattern["category"], metricName: string, values: number[], unit?: string): Promise<BaselinePattern>;
    /**
     * Build service health baseline
     */
    buildServiceHealthBaseline(service: string, latencyHistory: number[], errorRateHistory: number[], uptimeHistory: number[]): Promise<ServiceHealthBaseline>;
    /**
     * Build deployment baseline
     */
    buildDeploymentBaseline(successRateHistory: number[], rollbackFrequencyHistory: number[], deploymentDurationHistory: number[]): Promise<DeploymentBaseline>;
    /**
     * Build resource usage baseline
     */
    buildResourceBaseline(cpuHistory: number[], memoryHistory: number[], costHistory: number[]): Promise<ResourceBaseline>;
    /**
     * Build integration baseline
     */
    buildIntegrationBaseline(integration: string, healthStatusHistory: number[], // 0 = down, 1 = up
    responseTimeHistory: number[]): Promise<IntegrationBaseline>;
    /**
     * Get baseline for a specific metric
     */
    getBaseline(category: BaselinePattern["category"], metricName: string): Promise<BaselinePattern | undefined>;
    /**
     * Update baseline with new metric value
     */
    updateBaseline(category: BaselinePattern["category"], metricName: string, newValue: number): Promise<BaselinePattern>;
    /**
     * Get all baselines for a category
     */
    getBaselinesByCategory(category: BaselinePattern["category"]): Promise<BaselinePattern[]>;
}
export default SelfBaseline;

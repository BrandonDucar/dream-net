/**
 * Self Baseline System
 *
 * Defines "normal" system state patterns (the "self" in immune system terms)
 * Stores baseline metrics for service health, deployments, resources, and integrations
 */
export class SelfBaseline {
    dreamMemory;
    baselines = new Map();
    constructor(dreamMemory) {
        this.dreamMemory = dreamMemory;
    }
    /**
     * Calculate statistics from a set of metric values
     */
    calculateStatistics(values) {
        if (values.length === 0) {
            throw new Error("Cannot calculate statistics from empty array");
        }
        const sorted = [...values].sort((a, b) => a - b);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        const percentile = (p) => {
            const index = Math.ceil((p / 100) * sorted.length) - 1;
            return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
        };
        return {
            mean,
            stdDev,
            min: sorted[0],
            max: sorted[sorted.length - 1],
            percentile25: percentile(25),
            percentile50: percentile(50),
            percentile75: percentile(75),
            percentile95: percentile(95),
        };
    }
    /**
     * Build baseline from historical metrics
     */
    async buildBaseline(category, metricName, values, unit = "") {
        if (values.length === 0) {
            throw new Error("Cannot build baseline from empty values");
        }
        const statistics = this.calculateStatistics(values);
        const now = new Date().toISOString();
        // Check for existing baseline
        const existingKey = `baseline:${category}:${metricName}`;
        const existing = await this.dreamMemory.recall("ops", existingKey);
        const baseline = {
            id: existing?.id || `baseline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            category,
            metrics: values.map((value, idx) => ({
                name: metricName,
                value,
                unit,
                timestamp: new Date(Date.now() - (values.length - idx) * 60000).toISOString(), // Approximate timestamps
            })),
            statistics,
            sampleCount: values.length,
            version: existing ? (existing.content.version || 1) + 1 : 1,
            createdAt: existing?.content.createdAt || now,
            updatedAt: now,
        };
        // Store in DreamMemory
        await this.dreamMemory.store("ops", existingKey, baseline, {
            category,
            metricName,
            version: baseline.version,
        });
        this.baselines.set(existingKey, baseline);
        return baseline;
    }
    /**
     * Build service health baseline
     */
    async buildServiceHealthBaseline(service, latencyHistory, errorRateHistory, uptimeHistory) {
        const latency = await this.buildBaseline("service_health", `${service}:latency`, latencyHistory, "ms");
        const errorRate = await this.buildBaseline("service_health", `${service}:errorRate`, errorRateHistory, "%");
        const uptime = await this.buildBaseline("service_health", `${service}:uptime`, uptimeHistory, "%");
        return {
            service,
            latency,
            errorRate,
            uptime,
        };
    }
    /**
     * Build deployment baseline
     */
    async buildDeploymentBaseline(successRateHistory, rollbackFrequencyHistory, deploymentDurationHistory) {
        const successRate = await this.buildBaseline("deployment", "successRate", successRateHistory, "%");
        const rollbackFrequency = await this.buildBaseline("deployment", "rollbackFrequency", rollbackFrequencyHistory, "per_deployment");
        const deploymentDuration = await this.buildBaseline("deployment", "deploymentDuration", deploymentDurationHistory, "ms");
        return {
            successRate,
            rollbackFrequency,
            deploymentDuration,
        };
    }
    /**
     * Build resource usage baseline
     */
    async buildResourceBaseline(cpuHistory, memoryHistory, costHistory) {
        const cpu = await this.buildBaseline("resource_usage", "cpu", cpuHistory, "%");
        const memory = await this.buildBaseline("resource_usage", "memory", memoryHistory, "%");
        const cost = await this.buildBaseline("resource_usage", "cost", costHistory, "USD");
        return {
            cpu,
            memory,
            cost,
        };
    }
    /**
     * Build integration baseline
     */
    async buildIntegrationBaseline(integration, healthStatusHistory, // 0 = down, 1 = up
    responseTimeHistory) {
        const healthStatus = await this.buildBaseline("integration", `${integration}:healthStatus`, healthStatusHistory, "binary");
        const responseTime = await this.buildBaseline("integration", `${integration}:responseTime`, responseTimeHistory, "ms");
        return {
            integration,
            healthStatus,
            responseTime,
        };
    }
    /**
     * Get baseline for a specific metric
     */
    async getBaseline(category, metricName) {
        const key = `baseline:${category}:${metricName}`;
        // Check cache first
        if (this.baselines.has(key)) {
            return this.baselines.get(key);
        }
        // Load from DreamMemory
        const memory = await this.dreamMemory.recall("ops", key);
        if (memory) {
            const baseline = memory.content;
            this.baselines.set(key, baseline);
            return baseline;
        }
        return undefined;
    }
    /**
     * Update baseline with new metric value
     */
    async updateBaseline(category, metricName, newValue) {
        const existing = await this.getBaseline(category, metricName);
        if (!existing) {
            // Create new baseline with single value
            return await this.buildBaseline(category, metricName, [newValue]);
        }
        // Add new value to existing metrics (keep last 1000 samples)
        const allValues = [...existing.metrics.map(m => m.value), newValue].slice(-1000);
        return await this.buildBaseline(category, metricName, allValues, existing.metrics[0]?.unit || "");
    }
    /**
     * Get all baselines for a category
     */
    async getBaselinesByCategory(category) {
        const memories = this.dreamMemory.getMemoriesByNamespace("ops");
        return memories
            .filter(m => m.key.startsWith(`baseline:${category}:`))
            .map(m => m.content);
    }
}
export default SelfBaseline;

/**
 * ShieldCore Adaptive Thresholding (Bio-inspired Local Reflexes)
 * 
 * Objectives:
 * 1. Sensing: Collect real-time SLOs (latency, error %, drops).
 * 2. Reflexes: Run tiny negative-selection anomaly checks (AIS "non-self").
 * 3. Homeostasis: If health < threshold -> propose backoff/reroute.
 */

export interface AgentSLO {
    agentId: string;
    latencyP95: number;
    errorRate: number;
    dropRate: number;
    cpuLevel: number;
    timestamp: number;
}

export interface HealthReport {
    healthScore: number; // 0-100
    status: 'OPTIMAL' | 'DEGRADED' | 'QUARANTINE';
    recommendedAction: 'NONE' | 'THROTTLE' | 'REROUTE' | 'REPAIR';
}

export class AdaptiveThresholdEngine {
    private readonly baseline: AgentSLO;
    private readonly tolerance = 1.618; // The Golden Ratio for bio-inspired scaling

    constructor(baseline: AgentSLO) {
        this.baseline = baseline;
    }

    /**
     * Compute Bio-Metric Health
     * Returns a score from 100 (Nominal) to 0 (Critical Failure)
     */
    public evaluateHealth(current: AgentSLO): HealthReport {
        const latencyDelta = current.latencyP95 / this.baseline.latencyP95;
        const errorIncr = current.errorRate - this.baseline.errorRate;
        const cpuStress = current.cpuLevel / this.baseline.cpuLevel;

        // One-class boundary check (Simplified Negative Selection)
        const isSelf = (latencyDelta < this.tolerance) && (errorIncr < 0.05) && (cpuStress < 2.0);

        let score = 100;
        score -= Math.max(0, (latencyDelta - 1) * 20);
        score -= (errorIncr * 500); // Heavy penalty for error spike
        score -= Math.max(0, (cpuStress - 1.5) * 10);

        score = Math.max(0, Math.min(100, score));

        let status: HealthReport['status'] = 'OPTIMAL';
        let action: HealthReport['recommendedAction'] = 'NONE';

        if (score < 40 || !isSelf) {
            status = 'QUARANTINE';
            action = 'REPAIR';
        } else if (score < 70) {
            status = 'DEGRADED';
            action = 'THROTTLE';
        }

        return { healthScore: score, status, recommendedAction: action };
    }
}

/**
 * Global Shield Monitor
 * Intercepts metrics and applies reflex logic.
 */
export const SHIELD_REFLEX = {
    check: (slo: AgentSLO) => {
        // Placeholder for real baseline retrieval from MemoryDNA
        const engine = new AdaptiveThresholdEngine({
            agentId: slo.agentId,
            latencyP95: 200,
            errorRate: 0.001,
            dropRate: 0,
            cpuLevel: 0.3,
            timestamp: Date.now()
        });

        const report = engine.evaluateHealth(slo);
        console.log(`[🛡️ SHIELD] Health for ${slo.agentId}: ${report.healthScore}% | Status: ${report.status}`);
        return report;
    }
};

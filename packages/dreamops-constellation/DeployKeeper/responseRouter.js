/**
 * Staged Response Router
 *
 * Routes anomalies to appropriate response stage based on:
 * - Severity score
 * - Blast radius
 * - Confidence level
 * - Historical success rate
 */
export class ResponseRouter {
    stagedResponseSystem;
    historicalResponses = [];
    constructor(stagedResponseSystem) {
        this.stagedResponseSystem = stagedResponseSystem;
    }
    /**
     * Route anomaly to appropriate response stage
     */
    async routeAnomaly(anomaly, affectedServices, additionalMetrics) {
        // Calculate blast radius (0-1)
        const blastRadius = this.calculateBlastRadius(affectedServices, additionalMetrics);
        // Get historical success rate for similar anomalies
        const historicalSuccessRate = this.getHistoricalSuccessRate(anomaly);
        // Create staged response
        const response = this.stagedResponseSystem.createResponse(anomaly.id, anomaly.severity, anomaly.confidence, blastRadius, affectedServices, historicalSuccessRate);
        // Generate reasoning
        const reasoning = this.generateReasoning(response.stage, anomaly.severity, anomaly.confidence, blastRadius, historicalSuccessRate);
        return {
            responseId: response.id,
            stage: response.stage,
            reasoning,
            confidence: anomaly.confidence,
        };
    }
    /**
     * Calculate blast radius (how many services/components are affected)
     */
    calculateBlastRadius(affectedServices, additionalMetrics) {
        // Base blast radius from number of affected services
        // Normalize to 0-1 (assuming max 10 services = 1.0)
        const serviceBlastRadius = Math.min(1.0, affectedServices.length / 10);
        // If multiple metrics are affected, increase blast radius
        let metricBlastRadius = 0;
        if (additionalMetrics && additionalMetrics.length > 1) {
            // Multiple metrics failing = larger blast radius
            metricBlastRadius = Math.min(0.3, additionalMetrics.length * 0.1);
        }
        return Math.min(1.0, serviceBlastRadius + metricBlastRadius);
    }
    /**
     * Get historical success rate for similar anomalies
     */
    getHistoricalSuccessRate(anomaly) {
        // Find similar historical responses
        const similar = this.historicalResponses.filter(h => {
            // Simple similarity check - in production, use embeddings
            return h.anomalyPattern.includes(anomaly.metric);
        });
        if (similar.length === 0) {
            return undefined;
        }
        // Calculate success rate
        const successful = similar.filter(h => h.success).length;
        return successful / similar.length;
    }
    /**
     * Generate reasoning for routing decision
     */
    generateReasoning(stage, severity, confidence, blastRadius, historicalSuccessRate) {
        const parts = [];
        parts.push(`Stage ${stage} selected based on:`);
        if (severity > 0.7) {
            parts.push(`high severity (${(severity * 100).toFixed(0)}%)`);
        }
        else if (severity > 0.4) {
            parts.push(`moderate severity (${(severity * 100).toFixed(0)}%)`);
        }
        else {
            parts.push(`low severity (${(severity * 100).toFixed(0)}%)`);
        }
        if (confidence > 0.7) {
            parts.push(`high confidence (${(confidence * 100).toFixed(0)}%)`);
        }
        else if (confidence < 0.5) {
            parts.push(`low confidence (${(confidence * 100).toFixed(0)}%)`);
        }
        if (blastRadius > 0.5) {
            parts.push(`large blast radius (${(blastRadius * 100).toFixed(0)}%)`);
        }
        if (historicalSuccessRate !== undefined) {
            parts.push(`historical success rate: ${(historicalSuccessRate * 100).toFixed(0)}%`);
        }
        return parts.join(", ");
    }
    /**
     * Record historical response for learning
     */
    recordHistoricalResponse(anomalyPattern, stage, success) {
        this.historicalResponses.push({
            anomalyPattern,
            stage,
            success,
            timestamp: new Date().toISOString(),
        });
        // Keep only last 1000 responses
        if (this.historicalResponses.length > 1000) {
            this.historicalResponses = this.historicalResponses.slice(-1000);
        }
    }
    /**
     * Get routing statistics
     */
    getRoutingStats() {
        const responses = this.stagedResponseSystem.getAllResponses();
        const byStage = { 0: 0, 1: 0, 2: 0, 3: 0 };
        let totalConfidence = 0;
        let totalBlastRadius = 0;
        for (const response of responses) {
            byStage[response.stage]++;
            totalConfidence += response.confidence;
            totalBlastRadius += response.blastRadius;
        }
        return {
            totalRouted: responses.length,
            byStage,
            averageConfidence: responses.length > 0 ? totalConfidence / responses.length : 0,
            averageBlastRadius: responses.length > 0 ? totalBlastRadius / responses.length : 0,
        };
    }
}
export default ResponseRouter;

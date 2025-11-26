/**
 * Threat Recognizer
 *
 * Matches current anomalies to historical threats using embeddings and pattern matching
 * Suggests proven responses from memory
 */
export class ThreatRecognizer {
    threatMemory;
    constructor(threatMemory) {
        this.threatMemory = threatMemory;
    }
    /**
     * Recognize threat from anomaly detection
     */
    async recognizeThreat(anomaly, additionalMetrics) {
        // Create embedding for current anomaly
        const anomalyEmbedding = await this.createAnomalyEmbedding(anomaly, additionalMetrics);
        // Search for similar threats
        const similarThreats = await this.threatMemory.searchSimilarThreats(anomalyEmbedding, 5);
        if (similarThreats.length === 0) {
            return null;
        }
        // Get best match (highest similarity)
        const bestMatch = similarThreats[0];
        if (bestMatch.similarity < 0.7) {
            // Threshold for recognition
            return null;
        }
        // Get response effectiveness for this threat
        const effectiveness = await this.threatMemory.getResponseEffectiveness(bestMatch.threat.id);
        // Calculate confidence
        const similarityConfidence = bestMatch.similarity;
        const historicalConfidence = effectiveness.totalResponses > 0 ? effectiveness.successRate : 0.5;
        const confidence = (similarityConfidence * 0.6 + historicalConfidence * 0.4);
        // Suggest response based on historical effectiveness
        let suggestedResponse;
        if (effectiveness.bestResponseStage !== undefined) {
            // Get best response actions from history
            const threatResponses = await this.getThreatResponses(bestMatch.threat.id);
            const bestResponses = threatResponses
                .filter(r => r.responseStage === effectiveness.bestResponseStage && r.success)
                .slice(0, 1);
            if (bestResponses.length > 0) {
                suggestedResponse = {
                    stage: effectiveness.bestResponseStage,
                    actions: bestResponses[0].actions,
                    successRate: effectiveness.successRate,
                };
            }
        }
        return {
            threatId: bestMatch.threat.id,
            threat: bestMatch.threat,
            similarity: bestMatch.similarity,
            confidence,
            suggestedResponse,
        };
    }
    /**
     * Create embedding for anomaly
     */
    async createAnomalyEmbedding(anomaly, additionalMetrics) {
        // Create a feature vector from anomaly
        const features = {
            severity: anomaly.severity,
            confidence: anomaly.confidence,
            deviation: Math.abs(anomaly.deviation),
            [`metric:${anomaly.metric}`]: anomaly.currentValue,
        };
        // Add additional metrics
        if (additionalMetrics) {
            for (const metric of additionalMetrics) {
                features[`${metric.category}:${metric.metricName}`] = metric.value;
            }
        }
        // Convert to embedding (simplified - in production, use actual embedding model)
        // For now, create a normalized vector from features
        const values = Object.values(features);
        const norm = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0));
        return values.map(v => norm > 0 ? v / norm : 0);
    }
    /**
     * Get threat responses from memory
     */
    async getThreatResponses(threatId) {
        // In production, would load from DreamMemory
        // For now, return empty array
        return [];
    }
    /**
     * Match anomaly pattern against threat signatures
     */
    async matchPattern(anomaly, additionalMetrics) {
        const allThreats = this.threatMemory.getAllThreatSignatures();
        // Pattern matching: check if anomaly metrics match threat signatures
        for (const threat of allThreats) {
            const matchScore = this.calculatePatternMatch(anomaly, threat, additionalMetrics);
            if (matchScore > 0.8) {
                // High match - get response effectiveness
                const effectiveness = await this.threatMemory.getResponseEffectiveness(threat.id);
                return {
                    threatId: threat.id,
                    threat,
                    similarity: matchScore,
                    confidence: matchScore * effectiveness.successRate,
                    suggestedResponse: effectiveness.bestResponseStage !== undefined ? {
                        stage: effectiveness.bestResponseStage,
                        actions: [], // Would load from history
                        successRate: effectiveness.successRate,
                    } : undefined,
                };
            }
        }
        return null;
    }
    /**
     * Calculate pattern match score
     */
    calculatePatternMatch(anomaly, threat, additionalMetrics) {
        let matches = 0;
        let total = 0;
        // Check if anomaly metric matches threat signature
        if (threat.metrics[anomaly.metric]) {
            total++;
            const expectedValue = threat.metrics[anomaly.metric];
            const tolerance = expectedValue * 0.1; // 10% tolerance
            if (Math.abs(anomaly.currentValue - expectedValue) <= tolerance) {
                matches++;
            }
        }
        // Check additional metrics
        if (additionalMetrics) {
            for (const metric of additionalMetrics) {
                const key = `${metric.category}:${metric.metricName}`;
                if (threat.metrics[key]) {
                    total++;
                    const expectedValue = threat.metrics[key];
                    const tolerance = expectedValue * 0.1;
                    if (Math.abs(metric.value - expectedValue) <= tolerance) {
                        matches++;
                    }
                }
            }
        }
        if (total === 0) {
            return 0;
        }
        return matches / total;
    }
}
export default ThreatRecognizer;

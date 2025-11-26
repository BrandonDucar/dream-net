/**
 * Threat Recognizer
 *
 * Matches current anomalies to historical threats using embeddings and pattern matching
 * Suggests proven responses from memory
 */
import type { AnomalyDetection } from "./nonSelfDetector.js";
import type ThreatMemory from "../DreamMemory/threatMemory.js";
import type { ThreatSignature } from "../DreamMemory/threatMemory.js";
export interface ThreatMatch {
    threatId: string;
    threat: ThreatSignature;
    similarity: number;
    confidence: number;
    suggestedResponse?: {
        stage: 0 | 1 | 2 | 3;
        actions: string[];
        successRate: number;
    };
}
export declare class ThreatRecognizer {
    private threatMemory;
    constructor(threatMemory: ThreatMemory);
    /**
     * Recognize threat from anomaly detection
     */
    recognizeThreat(anomaly: AnomalyDetection, additionalMetrics?: Array<{
        category: string;
        metricName: string;
        value: number;
    }>): Promise<ThreatMatch | null>;
    /**
     * Create embedding for anomaly
     */
    private createAnomalyEmbedding;
    /**
     * Get threat responses from memory
     */
    private getThreatResponses;
    /**
     * Match anomaly pattern against threat signatures
     */
    matchPattern(anomaly: AnomalyDetection, additionalMetrics?: Array<{
        category: string;
        metricName: string;
        value: number;
    }>): Promise<ThreatMatch | null>;
    /**
     * Calculate pattern match score
     */
    private calculatePatternMatch;
}
export default ThreatRecognizer;

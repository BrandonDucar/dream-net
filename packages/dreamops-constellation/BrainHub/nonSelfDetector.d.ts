/**
 * Non-Self Detector
 *
 * Detects anomalies by comparing current state to baseline ("self")
 * Uses statistical deviation, pattern matching, rate of change, and cross-correlation
 */
import type { BaselinePattern } from "./selfBaseline.js";
import SelfBaseline from "./selfBaseline.js";
export interface AnomalyDetection {
    id: string;
    metric: string;
    category: BaselinePattern["category"];
    currentValue: number;
    baselineValue: number;
    deviation: number;
    severity: number;
    confidence: number;
    timestamp: string;
    metadata?: Record<string, any>;
}
export interface AnomalyPattern {
    id: string;
    pattern: string;
    metrics: string[];
    signature: Record<string, number>;
    frequency: number;
    lastSeen: string;
}
export interface CrossCorrelation {
    metric1: string;
    metric2: string;
    correlation: number;
    anomaly: boolean;
}
export declare class NonSelfDetector {
    private selfBaseline;
    private anomalyPatterns;
    constructor(selfBaseline: SelfBaseline);
    /**
     * Calculate z-score (standard deviations from mean)
     */
    private calculateZScore;
    /**
     * Detect anomaly for a single metric
     */
    detectAnomaly(category: BaselinePattern["category"], metricName: string, currentValue: number, threshold?: number): Promise<AnomalyDetection | null>;
    /**
     * Detect anomalies across multiple metrics (cross-correlation)
     */
    detectAnomalies(metrics: Array<{
        category: BaselinePattern["category"];
        metricName: string;
        value: number;
    }>, threshold?: number): Promise<AnomalyDetection[]>;
    /**
     * Analyze rate of change (sudden spikes/drops)
     */
    detectRateOfChangeAnomaly(category: BaselinePattern["category"], metricName: string, currentValue: number, previousValue: number, timeDelta: number): Promise<AnomalyDetection | null>;
    /**
     * Match anomaly against known threat patterns
     */
    matchThreatPattern(detections: AnomalyDetection[]): AnomalyPattern | null;
    /**
     * Register a known threat pattern
     */
    registerThreatPattern(pattern: AnomalyPattern): void;
    /**
     * Get all registered threat patterns
     */
    getThreatPatterns(): AnomalyPattern[];
}
export default NonSelfDetector;

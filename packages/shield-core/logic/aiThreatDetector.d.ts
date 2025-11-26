/**
 * AI-Powered Threat Detection System
 * Uses ML models for real-time threat classification and anomaly detection
 */
import type { Threat } from "../types";
/**
 * Feature vector for ML model input
 */
interface ThreatFeatures {
    requestSize: number;
    requestRate: number;
    userAgent: string;
    ipAddress: string;
    path: string;
    method: string;
    sessionDuration: number;
    requestPattern: string;
    errorRate: number;
    previousThreats: number;
    previousBlocks: number;
    trustScore: number;
}
/**
 * AI Threat Detector Class
 */
export declare class AIThreatDetector {
    private modelLoaded;
    private featureHistory;
    private anomalyThreshold;
    constructor();
    /**
     * Detect threat using AI/ML models
     */
    detectThreatAI(features: ThreatFeatures, source?: string, target?: string, payload?: Record<string, any>): Promise<Threat | null>;
    /**
     * Predict threat using ML model (simulated for now)
     * In production, this would call a trained ML model
     */
    private predictThreat;
    /**
     * Calculate anomaly score using unsupervised learning approach
     */
    private calculateAnomalyScore;
    /**
     * Store features for learning
     */
    private storeFeatures;
    /**
     * Analyze threat and determine if it should be blocked (AI-enhanced)
     */
    analyzeThreatAI(threat: Threat): {
        shouldBlock: boolean;
        recommendedSpike?: string;
        confidence: number;
    };
    /**
     * Update anomaly threshold based on false positive rate
     */
    updateThreshold(falsePositiveRate: number): void;
}
export declare const aiThreatDetector: AIThreatDetector;
export {};

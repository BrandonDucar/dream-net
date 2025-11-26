/**
 * Predictive Threat Modeling
 * Predicts future attacks based on patterns and historical data
 */
import type { ThreatType, ThreatLevel } from "../types";
export interface ThreatPrediction {
    threatType: ThreatType;
    threatLevel: ThreatLevel;
    probability: number;
    timeframe: "immediate" | "short-term" | "medium-term" | "long-term";
    confidence: number;
    recommendedActions: string[];
    vulnerableComponents: string[];
}
export interface ThreatTrend {
    threatType: ThreatType;
    trend: "increasing" | "decreasing" | "stable";
    changeRate: number;
    forecast: ThreatLevel[];
}
/**
 * Threat Predictor
 * Uses time-series forecasting and pattern recognition to predict threats
 */
export declare class ThreatPredictor {
    private predictionHistory;
    private maxHistorySize;
    /**
     * Predict future threats based on patterns
     */
    predictThreats(): Promise<ThreatPrediction[]>;
    /**
     * Identify vulnerable components before they're attacked
     */
    identifyVulnerableComponents(): string[];
    /**
     * Recommend proactive security measures
     */
    recommendProactiveMeasures(): string[];
    /**
     * Forecast threat trends
     */
    forecastThreatTrends(): ThreatTrend[];
    /**
     * Analyze threat patterns
     */
    private analyzeThreatPatterns;
    /**
     * Predict threat from pattern
     */
    private predictFromPattern;
    /**
     * Get recommended actions for threat type/level
     */
    private getRecommendedActions;
    /**
     * Calculate average threat level
     */
    private calculateAverageThreatLevel;
    /**
     * Escalate threat level
     */
    private escalateLevel;
    /**
     * Deescalate threat level
     */
    private deescalateLevel;
    /**
     * Get prediction history
     */
    getPredictionHistory(): ThreatPrediction[];
}
export declare const threatPredictor: ThreatPredictor;

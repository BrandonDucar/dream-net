/**
 * Staged Response Router
 *
 * Routes anomalies to appropriate response stage based on:
 * - Severity score
 * - Blast radius
 * - Confidence level
 * - Historical success rate
 */
import StagedResponseSystem, { type ResponseStage } from "./stagedResponse.js";
import type { AnomalyDetection } from "../BrainHub/nonSelfDetector.js";
export interface RoutingDecision {
    responseId: string;
    stage: ResponseStage;
    reasoning: string;
    confidence: number;
}
export interface HistoricalResponse {
    anomalyPattern: string;
    stage: ResponseStage;
    success: boolean;
    timestamp: string;
}
export declare class ResponseRouter {
    private stagedResponseSystem;
    private historicalResponses;
    constructor(stagedResponseSystem: StagedResponseSystem);
    /**
     * Route anomaly to appropriate response stage
     */
    routeAnomaly(anomaly: AnomalyDetection, affectedServices: string[], additionalMetrics?: Array<{
        category: string;
        metricName: string;
        value: number;
    }>): Promise<RoutingDecision>;
    /**
     * Calculate blast radius (how many services/components are affected)
     */
    private calculateBlastRadius;
    /**
     * Get historical success rate for similar anomalies
     */
    private getHistoricalSuccessRate;
    /**
     * Generate reasoning for routing decision
     */
    private generateReasoning;
    /**
     * Record historical response for learning
     */
    recordHistoricalResponse(anomalyPattern: string, stage: ResponseStage, success: boolean): void;
    /**
     * Get routing statistics
     */
    getRoutingStats(): {
        totalRouted: number;
        byStage: Record<ResponseStage, number>;
        averageConfidence: number;
        averageBlastRadius: number;
    };
}
export default ResponseRouter;

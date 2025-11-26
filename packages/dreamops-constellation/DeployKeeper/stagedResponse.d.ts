/**
 * Staged Response System
 *
 * Implements staged activation (local → containment → escalation → remediation)
 * Based on immune system's staged response to threats
 */
export type ResponseStage = 0 | 1 | 2 | 3;
export interface StagedResponse {
    id: string;
    anomalyId: string;
    stage: ResponseStage;
    stageName: string;
    actions: ResponseAction[];
    severity: number;
    confidence: number;
    blastRadius: number;
    startedAt: string;
    completedAt?: string;
    escalatedTo?: ResponseStage;
    metadata?: Record<string, any>;
}
export interface ResponseAction {
    id: string;
    type: "log" | "quarantine" | "notify" | "recover" | "rollback" | "escalate";
    target: string;
    description: string;
    executed: boolean;
    executedAt?: string;
    result?: "success" | "failed" | "partial";
    error?: string;
}
export declare class StagedResponseSystem {
    private responses;
    private readonly STAGE_NAMES;
    /**
     * Determine appropriate response stage based on anomaly characteristics
     */
    determineStage(severity: number, confidence: number, blastRadius: number, historicalSuccessRate?: number): ResponseStage;
    /**
     * Create staged response for an anomaly
     */
    createResponse(anomalyId: string, severity: number, confidence: number, blastRadius: number, affectedServices: string[], historicalSuccessRate?: number): StagedResponse;
    /**
     * Generate actions for a specific stage
     */
    private generateActionsForStage;
    /**
     * Execute a staged response
     */
    executeResponse(responseId: string): Promise<StagedResponse>;
    /**
     * Execute a single action
     */
    private executeAction;
    /**
     * Escalate response to next stage
     */
    escalateResponse(responseId: string): Promise<StagedResponse>;
    /**
     * Get response by ID
     */
    getResponse(id: string): StagedResponse | undefined;
    /**
     * Get all responses
     */
    getAllResponses(): StagedResponse[];
    /**
     * Get responses by stage
     */
    getResponsesByStage(stage: ResponseStage): StagedResponse[];
}
export default StagedResponseSystem;

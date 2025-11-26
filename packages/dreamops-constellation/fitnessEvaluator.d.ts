/**
 * Fitness Evaluation System
 *
 * Evaluates system on reliability, cost, and latency metrics
 * Based on ALife system-fitness principles
 */
import type DreamMemory from "./DreamMemory/index.js";
export interface FitnessMetrics {
    reliability: number;
    cost: number;
    latency: number;
    overall: number;
}
export interface AgentFitness {
    agentId: string;
    agentName: string;
    metrics: FitnessMetrics;
    timestamp: string;
    history: FitnessMetrics[];
}
export interface SystemFitness {
    overall: FitnessMetrics;
    agents: AgentFitness[];
    timestamp: string;
    trends: {
        reliability: "improving" | "stable" | "degrading";
        cost: "improving" | "stable" | "degrading";
        latency: "improving" | "stable" | "degrading";
    };
}
export declare class FitnessEvaluator {
    private dreamMemory;
    private agentFitness;
    constructor(dreamMemory: DreamMemory);
    /**
     * Evaluate fitness for an agent
     */
    evaluateAgentFitness(agentId: string, agentName: string, metrics: {
        uptime?: number;
        errorRate?: number;
        recoveryTime?: number;
        resourceUsage?: number;
        cost?: number;
        responseTime?: number;
        detectionSpeed?: number;
        remediationTime?: number;
    }): Promise<AgentFitness>;
    /**
     * Evaluate system-wide fitness
     */
    evaluateSystemFitness(): Promise<SystemFitness>;
    /**
     * Calculate trends from agent history
     */
    private calculateTrends;
    /**
     * Get agent fitness by ID
     */
    getAgentFitness(agentId: string): AgentFitness | undefined;
    /**
     * Get all agent fitness records
     */
    getAllAgentFitness(): AgentFitness[];
    /**
     * Get top performing agents
     */
    getTopAgents(limit?: number): AgentFitness[];
}
export default FitnessEvaluator;

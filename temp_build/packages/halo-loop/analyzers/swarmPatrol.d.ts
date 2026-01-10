import type { AnalyzerResult } from "../types";
export interface MicroAgentResult {
    agentId: string;
    checkName: string;
    status: "green" | "amber" | "red";
    message: string;
    metadata?: Record<string, unknown>;
}
/**
 * Swarm Repair Patrol: Orchestrates 100+ micro-agents
 * Each agent does one simple check, collectively forming system health picture
 */
export declare function swarmPatrolAnalyzer(): Promise<AnalyzerResult>;

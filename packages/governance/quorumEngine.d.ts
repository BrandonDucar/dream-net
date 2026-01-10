import type { QuorumDecision, QuorumType, ActorContext } from './types.js';
export declare class QuorumEngine {
    private decisions;
    /**
     * Register a vote for a policy decision
     */
    vote(policyId: string, voter: ActorContext, decision: "approve" | "reject" | "abstain", quorumTypes: QuorumType[], threshold: number, reason?: string): QuorumDecision;
    /**
     * Get current decision status
     */
    getDecision(policyId: string): QuorumDecision | null;
    /**
     * Check if decision is approved
     */
    isApproved(policyId: string): boolean;
    /**
     * Clear decision (for reversible policies)
     */
    clearDecision(policyId: string): void;
    /**
     * Get all pending decisions
     */
    getPendingDecisions(): QuorumDecision[];
}
export declare const quorumEngine: QuorumEngine;
/**
 * Tech Quorum: Agents + automated tests
 */
export declare function checkTechQuorum(policyId: string, testResults: {
    passed: number;
    total: number;
}, agentVotes: Array<{
    agentId: string;
    decision: "approve" | "reject";
}>): Promise<boolean>;
/**
 * Creator Quorum: Stake/rep weighted
 */
export declare function checkCreatorQuorum(votes: Array<{
    wallet: string;
    stake: number;
    decision: "approve" | "reject";
}>, threshold: number): boolean;
/**
 * Safety Quorum: Abuse/fraud guards (unanimous or near-unanimous)
 */
export declare function checkSafetyQuorum(votes: Array<{
    guardId: string;
    decision: "approve" | "reject";
}>, requireUnanimous?: boolean): boolean;
//# sourceMappingURL=quorumEngine.d.ts.map
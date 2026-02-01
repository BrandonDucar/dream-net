const quorumStore = {};
export class QuorumEngine {
    decisions = new Map();
    /**
     * Register a vote for a policy decision
     */
    vote(policyId, voter, decision, quorumTypes, threshold, reason) {
        const existing = this.decisions.get(policyId) || {
            policyId,
            quorumType: quorumTypes[0], // Primary quorum type
            votes: [],
            threshold,
            reached: false,
            result: "pending",
            timestamp: new Date().toISOString(),
        };
        // Check if voter already voted
        const existingVoteIndex = existing.votes.findIndex((v) => v.voter === voter.actorId);
        const vote = {
            voter: voter.actorId,
            voterType: voter.actorType,
            decision,
            timestamp: new Date().toISOString(),
            reason,
        };
        if (existingVoteIndex >= 0) {
            existing.votes[existingVoteIndex] = vote;
        }
        else {
            existing.votes.push(vote);
        }
        // Check if quorum reached
        const approvals = existing.votes.filter((v) => v.decision === "approve").length;
        const rejections = existing.votes.filter((v) => v.decision === "reject").length;
        existing.reached = approvals >= threshold;
        existing.result = existing.reached
            ? "approved"
            : rejections > approvals
                ? "rejected"
                : "pending";
        this.decisions.set(policyId, existing);
        return existing;
    }
    /**
     * Get current decision status
     */
    getDecision(policyId) {
        return this.decisions.get(policyId) || null;
    }
    /**
     * Check if decision is approved
     */
    isApproved(policyId) {
        const decision = this.decisions.get(policyId);
        return decision?.result === "approved" || false;
    }
    /**
     * Clear decision (for reversible policies)
     */
    clearDecision(policyId) {
        this.decisions.delete(policyId);
    }
    /**
     * Get all pending decisions
     */
    getPendingDecisions() {
        return Array.from(this.decisions.values()).filter((d) => d.result === "pending");
    }
}
export const quorumEngine = new QuorumEngine();
/**
 * Tech Quorum: Agents + automated tests
 */
export async function checkTechQuorum(policyId, testResults, agentVotes) {
    const testPassRate = testResults.total > 0 ? testResults.passed / testResults.total : 0;
    const testApproval = testPassRate >= 0.8; // 80% pass rate required
    const agentApprovals = agentVotes.filter((v) => v.decision === "approve").length;
    const agentRejections = agentVotes.filter((v) => v.decision === "reject").length;
    // Tech quorum requires: tests pass + agent consensus
    return testApproval && agentApprovals > agentRejections;
}
/**
 * Creator Quorum: Stake/rep weighted
 */
export function checkCreatorQuorum(votes, threshold) {
    const totalStake = votes.reduce((sum, v) => sum + v.stake, 0);
    const approvalStake = votes
        .filter((v) => v.decision === "approve")
        .reduce((sum, v) => sum + v.stake, 0);
    const approvalRate = totalStake > 0 ? approvalStake / totalStake : 0;
    return approvalRate >= threshold;
}
/**
 * Safety Quorum: Abuse/fraud guards (unanimous or near-unanimous)
 */
export function checkSafetyQuorum(votes, requireUnanimous = false) {
    if (votes.length === 0)
        return false;
    const approvals = votes.filter((v) => v.decision === "approve").length;
    const rejections = votes.filter((v) => v.decision === "reject").length;
    if (requireUnanimous) {
        return rejections === 0;
    }
    // Near-unanimous: 90% approval required
    return approvals / votes.length >= 0.9;
}
//# sourceMappingURL=quorumEngine.js.map
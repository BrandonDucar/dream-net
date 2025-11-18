import type { QuorumDecision, QuorumVote, QuorumType, ActorContext } from "./types";
import { getMinApprovals } from "./policyTable";

interface QuorumStore {
  [policyId: string]: QuorumDecision;
}

const quorumStore: QuorumStore = {};

export class QuorumEngine {
  private decisions: Map<string, QuorumDecision> = new Map();

  /**
   * Register a vote for a policy decision
   */
  vote(
    policyId: string,
    voter: ActorContext,
    decision: "approve" | "reject" | "abstain",
    quorumTypes: QuorumType[],
    threshold: number,
    reason?: string
  ): QuorumDecision {
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
    const vote: QuorumVote = {
      voter: voter.actorId,
      voterType: voter.actorType,
      decision,
      timestamp: new Date().toISOString(),
      reason,
    };

    if (existingVoteIndex >= 0) {
      existing.votes[existingVoteIndex] = vote;
    } else {
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
  getDecision(policyId: string): QuorumDecision | null {
    return this.decisions.get(policyId) || null;
  }

  /**
   * Check if decision is approved
   */
  isApproved(policyId: string): boolean {
    const decision = this.decisions.get(policyId);
    return decision?.result === "approved" || false;
  }

  /**
   * Clear decision (for reversible policies)
   */
  clearDecision(policyId: string): void {
    this.decisions.delete(policyId);
  }

  /**
   * Get all pending decisions
   */
  getPendingDecisions(): QuorumDecision[] {
    return Array.from(this.decisions.values()).filter((d) => d.result === "pending");
  }
}

export const quorumEngine = new QuorumEngine();

/**
 * Tech Quorum: Agents + automated tests
 */
export async function checkTechQuorum(
  policyId: string,
  testResults: { passed: number; total: number },
  agentVotes: Array<{ agentId: string; decision: "approve" | "reject" }>
): Promise<boolean> {
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
export function checkCreatorQuorum(
  votes: Array<{ wallet: string; stake: number; decision: "approve" | "reject" }>,
  threshold: number
): boolean {
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
export function checkSafetyQuorum(
  votes: Array<{ guardId: string; decision: "approve" | "reject" }>,
  requireUnanimous: boolean = false
): boolean {
  if (votes.length === 0) return false;

  const approvals = votes.filter((v) => v.decision === "approve").length;
  const rejections = votes.filter((v) => v.decision === "reject").length;

  if (requireUnanimous) {
    return rejections === 0;
  }

  // Near-unanimous: 90% approval required
  return approvals / votes.length >= 0.9;
}


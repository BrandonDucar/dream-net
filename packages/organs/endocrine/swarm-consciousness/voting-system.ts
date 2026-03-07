// SwarmConsciousnessEngine - Voting System

import { Agent, OpportunityProposal, SwarmVote, VotingResult, SwarmConfig } from './types';

export class VotingSystem {
  private votes: Map<string, SwarmVote[]> = new Map();
  private config: SwarmConfig;

  constructor(config: SwarmConfig) {
    this.config = config;
  }

  /**
   * Submit a vote from an agent on an opportunity
   */
  async submitVote(
    opportunityId: string,
    agentId: string,
    vote: 'yes' | 'no' | 'abstain',
    confidence: number,
    reasoning: string
  ): Promise<SwarmVote> {
    const newVote: SwarmVote = {
      opportunityId,
      agentId,
      vote,
      confidence,
      reasoning,
      timestamp: new Date(),
    };

    if (!this.votes.has(opportunityId)) {
      this.votes.set(opportunityId, []);
    }

    this.votes.get(opportunityId)!.push(newVote);

    console.log(`[SWARM] Vote recorded: ${agentId} voted ${vote} on opportunity ${opportunityId}`);
    return newVote;
  }

  /**
   * Tallies votes and returns results for an opportunity
   */
  getVotingResults(opportunityId: string, totalAgents: number): VotingResult {
    const opportunityVotes = this.votes.get(opportunityId) || [];
    
    const yesVotes = opportunityVotes.filter(v => v.vote === 'yes').length;
    const noVotes = opportunityVotes.filter(v => v.vote === 'no').length;
    const abstainVotes = opportunityVotes.filter(v => v.vote === 'abstain').length;
    const totalVotes = opportunityVotes.length;

    const quorumRequired = Math.ceil((totalAgents * this.config.quorumPercentage) / 100);
    const quorumMet = totalVotes >= quorumRequired;

    const approvalPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
    const approvalMet = approvalPercentage >= this.config.requiredApprovalPercentage;

    let decision: 'approved' | 'rejected' | 'deferred';
    if (!quorumMet) {
      decision = 'deferred';
    } else if (approvalMet) {
      decision = 'approved';
    } else {
      decision = 'rejected';
    }

    return {
      opportunityId,
      totalVotes,
      yesVotes,
      noVotes,
      abstainVotes,
      approvalPercentage: Math.round(approvalPercentage * 100) / 100,
      decision,
      requiredQuorum: quorumRequired,
      quorumMet,
    };
  }

  /**
   * Clear votes for an opportunity (after execution or timeout)
   */
  clearVotes(opportunityId: string): void {
    this.votes.delete(opportunityId);
    console.log(`[SWARM] Votes cleared for opportunity ${opportunityId}`);
  }

  /**
   * Get all votes for an opportunity
   */
  getVotesForOpportunity(opportunityId: string): SwarmVote[] {
    return this.votes.get(opportunityId) || [];
  }

  /**
   * Get voting statistics across all opportunities
   */
  getVotingStats(): {
    totalOpportunitiesVoted: number;
    totalVotesSubmitted: number;
    averageApprovalRate: number;
  } {
    let totalVotes = 0;
    let totalApprovals = 0;

    this.votes.forEach((votes) => {
      totalVotes += votes.length;
      totalApprovals += votes.filter(v => v.vote === 'yes').length;
    });

    return {
      totalOpportunitiesVoted: this.votes.size,
      totalVotesSubmitted: totalVotes,
      averageApprovalRate: totalVotes > 0 ? (totalApprovals / totalVotes) * 100 : 0,
    };
  }
}

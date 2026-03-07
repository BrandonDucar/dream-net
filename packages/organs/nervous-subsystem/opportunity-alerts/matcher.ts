// OpportunityAlertSystem - Matching Engine

import { Opportunity, AgentProfile, OpportunityMatch } from './types';

export class OpportunityMatcher {
  /**
   * Match an opportunity to agents
   */
  matchOpportunityToAgents(opportunity: Opportunity, agents: AgentProfile[]): OpportunityMatch[] {
    return agents
      .map(agent => this.calculateMatch(opportunity, agent))
      .filter(match => match.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Calculate match score between opportunity and agent
   */
  private calculateMatch(opportunity: Opportunity, agent: AgentProfile): OpportunityMatch {
    let score = 0;

    // 1. Skill matching (40% weight)
    const skillMatches = opportunity.requiredSkills.filter(skill => agent.skills.includes(skill));
    const skillScore = (skillMatches.length / opportunity.requiredSkills.length) * 100;
    score += skillScore * 0.4;

    // 2. Amount preference (25% weight)
    if (opportunity.requiredAmount >= agent.preferences.minAmount && opportunity.requiredAmount <= agent.preferences.maxAmount) {
      score += 100 * 0.25;
    } else if (opportunity.requiredAmount < agent.preferences.minAmount) {
      score += (opportunity.requiredAmount / agent.preferences.minAmount) * 100 * 0.25;
    } else if (opportunity.requiredAmount > agent.preferences.maxAmount) {
      score += (agent.preferences.maxAmount / opportunity.requiredAmount) * 100 * 0.25;
    }

    // 3. Source preference (15% weight)
    if (agent.preferences.preferredSources.includes(opportunity.source)) {
      score += 100 * 0.15;
    } else {
      score += 50 * 0.15; // Neutral if not in preferences
    }

    // 4. Workload capacity (10% weight)
    const workloadCapacity = Math.max(0, 100 - agent.currentWorkload);
    score += (workloadCapacity / 100) * 100 * 0.1;

    // 5. Success rate bonus (10% weight)
    score += agent.successRate * 0.1;

    // Calculate matched and missing skills
    const skillsMissing = opportunity.requiredSkills.filter(skill => !agent.skills.includes(skill));

    // Determine recommendation
    let recommendation: 'bid_solo' | 'bid_with_swarm' | 'skip' = 'skip';
    if (score > 70) {
      recommendation = 'bid_solo';
    } else if (score > 50 && opportunity.isPoolable) {
      recommendation = 'bid_with_swarm';
    } else if (score >= 40) {
      recommendation = 'bid_with_swarm';
    }

    const reason = this.generateMatchReason(opportunity, agent, skillMatches, skillsMissing, score);

    return {
      opportunityId: opportunity.id,
      agentId: agent.agentId,
      matchScore: Math.round(score * 100) / 100,
      skillsMatched: skillMatches,
      skillsMissing: skillsMissing,
      reason,
      recommendedAction: recommendation,
    };
  }

  /**
   * Generate human-readable reason for match
   */
  private generateMatchReason(
    opportunity: Opportunity,
    agent: AgentProfile,
    matched: string[],
    missing: string[],
    score: number
  ): string {
    const parts: string[] = [];

    if (matched.length > 0) {
      parts.push(`Matched skills: ${matched.join(', ')}`);
    }

    if (missing.length > 0) {
      parts.push(`Missing: ${missing.join(', ')}`);
    }

    const workloadCapacity = 100 - agent.currentWorkload;
    if (workloadCapacity < 30) {
      parts.push('Agent is busy');
    } else if (workloadCapacity > 70) {
      parts.push('Agent has capacity');
    }

    return parts.join('; ');
  }

  /**
   * Find best agent for an opportunity
   */
  findBestAgent(opportunity: Opportunity, agents: AgentProfile[]): OpportunityMatch | null {
    const matches = this.matchOpportunityToAgents(opportunity, agents);
    return matches.length > 0 ? matches[0] : null;
  }

  /**
   * Find all viable agents (matching threshold)
   */
  findViableAgents(opportunity: Opportunity, agents: AgentProfile[], minScore: number = 60): OpportunityMatch[] {
    return this.matchOpportunityToAgents(opportunity, agents).filter(match => match.matchScore >= minScore);
  }

  /**
   * Get agent capability score for a specific skill
   */
  getAgentSkillScore(agent: AgentProfile, skill: string): number {
    if (!agent.skills.includes(skill)) return 0;

    // Assume equal proficiency for all listed skills
    // In a real system, you'd track proficiency levels per skill
    return 80;
  }

  /**
   * Find agents that can fill skill gaps
   */
  findSpecialistAgents(opportunity: Opportunity, missingSkills: string[], agents: AgentProfile[]): Array<{ skill: string; specialist: OpportunityMatch | null }> {
    return missingSkills.map(skill => {
      const specialists = agents.filter(a => a.skills.includes(skill));
      const best = specialists.length > 0 ? specialists[0] : null;
      const match = best ? this.calculateMatch(opportunity, best) : this.emptyMatch(opportunity, 'unknown');

      return {
        skill,
        specialist: match,
      };
    });
  }

  /**
   * Create empty match object
   */
  private emptyMatch(opportunity: Opportunity, agentId: string): OpportunityMatch {
    return {
      opportunityId: opportunity.id,
      agentId,
      matchScore: 0,
      skillsMatched: [],
      skillsMissing: opportunity.requiredSkills,
      reason: 'No match found',
      recommendedAction: 'skip',
    };
  }
}

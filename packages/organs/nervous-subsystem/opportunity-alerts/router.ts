// OpportunityAlertSystem - Auto-Router

import { Opportunity, AgentProfile, OpportunityMatch } from './types';
import { OpportunityMatcher } from './matcher';

export class OpportunityRouter {
  private matcher: OpportunityMatcher;

  constructor() {
    this.matcher = new OpportunityMatcher();
  }

  /**
   * Route opportunity to best agent
   */
  routeToBestAgent(opportunity: Opportunity, agents: AgentProfile[]): OpportunityMatch | null {
    return this.matcher.findBestAgent(opportunity, agents);
  }

  /**
   * Route opportunity to multiple agents (for pooling)
   */
  routeToMultipleAgents(opportunity: Opportunity, agents: AgentProfile[], count: number = 3): OpportunityMatch[] {
    const matches = this.matcher.matchOpportunityToAgents(opportunity, agents);
    return matches.slice(0, count);
  }

  /**
   * Route to swarm if opportunity is large
   */
  shouldEscalateToSwarm(opportunity: Opportunity, threshold: number): boolean {
    return opportunity.requiredAmount > threshold || !opportunity.isPoolable === false;
  }

  /**
   * Determine routing strategy
   */
  determineRoutingStrategy(
    opportunity: Opportunity,
    bestMatch: OpportunityMatch | null,
    swarmThreshold: number,
    minMatchScore: number
  ): {
    strategy: 'solo' | 'pooled' | 'swarm' | 'skip';
    targetAgents: string[];
    reason: string;
  } {
    if (!bestMatch || bestMatch.matchScore < minMatchScore) {
      return {
        strategy: 'skip',
        targetAgents: [],
        reason: 'No viable agent found',
      };
    }

    if (this.shouldEscalateToSwarm(opportunity, swarmThreshold)) {
      return {
        strategy: 'swarm',
        targetAgents: ['swarm-consciousness'],
        reason: `Large opportunity ($${opportunity.requiredAmount}) requires swarm coordination`,
      };
    }

    if (bestMatch.recommendedAction === 'bid_solo' && bestMatch.matchScore > 75) {
      return {
        strategy: 'solo',
        targetAgents: [bestMatch.agentId],
        reason: `Strong match (${bestMatch.matchScore}%) for solo bid`,
      };
    }

    if (opportunity.isPoolable && bestMatch.recommendedAction === 'bid_with_swarm') {
      return {
        strategy: 'pooled',
        targetAgents: [bestMatch.agentId, 'swarm-consciousness'],
        reason: `Medium match (${bestMatch.matchScore}%) - recommend pooling with swarm`,
      };
    }

    return {
      strategy: 'skip',
      targetAgents: [],
      reason: 'Does not meet routing criteria',
    };
  }
}

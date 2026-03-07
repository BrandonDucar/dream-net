// OpportunityAlertSystem - Main Engine

import { Opportunity, AgentProfile, AlertConfig, DeadlineWarning } from './types';
import { OpportunityMatcher } from './matcher';
import { AlertDelivery } from './alerts';
import { OpportunityRouter } from './router';

export class OpportunityAlertSystem {
  private matcher: OpportunityMatcher;
  private alertDelivery: AlertDelivery;
  private router: OpportunityRouter;
  private config: AlertConfig;
  private opportunities: Map<string, Opportunity> = new Map();
  private agents: Map<string, AgentProfile> = new Map();
  private deadlineWarnings: Map<string, DeadlineWarning> = new Map();
  private deadlineCheckInterval: NodeJS.Timeout | null = null;

  constructor(config: AlertConfig) {
    this.config = config;
    this.matcher = new OpportunityMatcher();
    this.alertDelivery = new AlertDelivery(config);
    this.router = new OpportunityRouter();
  }

  /**
   * Register agents with the system
   */
  registerAgents(agents: AgentProfile[]): void {
    agents.forEach(agent => this.agents.set(agent.agentId, agent));
    console.log(`[OPPORTUNITY-ALERTS] Registered ${agents.length} agents`);
  }

  /**
   * Add opportunity to tracking
   */
  async processNewOpportunity(opportunity: Opportunity): Promise<any> {
    this.opportunities.set(opportunity.id, opportunity);

    console.log(`[OPPORTUNITY-ALERTS] Processing new opportunity: ${opportunity.title}`);

    // Match to agents
    const matches = this.matcher.matchOpportunityToAgents(opportunity, Array.from(this.agents.values()));

    // Route opportunity
    const bestMatch = matches.length > 0 ? matches[0] : null;
    const routingStrategy = this.router.determineRoutingStrategy(
      opportunity,
      bestMatch,
      this.config.autoEscalateThreshold,
      this.config.minMatchScore
    );

    console.log(`[OPPORTUNITY-ALERTS] Routing strategy: ${routingStrategy.strategy} - ${routingStrategy.reason}`);

    // Send alerts based on strategy
    if (routingStrategy.strategy === 'solo' && bestMatch) {
      const agent = this.agents.get(bestMatch.agentId);
      if (agent) {
        await this.alertDelivery.sendOpportunityAlert(
          agent.agentId,
          agent.email,
          agent.phone,
          opportunity.id,
          opportunity.title,
          bestMatch.matchScore,
          'bid_solo'
        );
      }
    } else if (routingStrategy.strategy === 'swarm') {
      await this.alertDelivery.sendSwarmEscalationAlert(
        opportunity.id,
        opportunity.title,
        opportunity.requiredAmount,
        routingStrategy.reason
      );
    } else if (routingStrategy.strategy === 'pooled') {
      // Alert both best agent AND swarm
      const agent = this.agents.get(bestMatch!.agentId);
      if (agent) {
        await this.alertDelivery.sendOpportunityAlert(
          agent.agentId,
          agent.email,
          agent.phone,
          opportunity.id,
          opportunity.title,
          bestMatch!.matchScore,
          'bid_with_swarm'
        );
      }

      await this.alertDelivery.sendSwarmEscalationAlert(
        opportunity.id,
        opportunity.title,
        opportunity.requiredAmount,
        'Pooling opportunity - recommended agent provided'
      );
    }

    // Set up deadline warnings
    this.setupDeadlineWarnings(opportunity);

    return {
      opportunity,
      matches,
      routingStrategy,
    };
  }

  /**
   * Setup deadline warnings for opportunity
   */
  private setupDeadlineWarnings(opportunity: Opportunity): void {
    const now = new Date();
    const msToDeadline = opportunity.deadline.getTime() - now.getTime();
    const daysToDeadline = Math.floor(msToDeadline / (1000 * 60 * 60 * 24));

    this.config.deadlineWarnings.forEach(days => {
      if (daysToDeadline <= days) {
        const warning: DeadlineWarning = {
          opportunityId: opportunity.id,
          daysUntilDeadline: daysToDeadline,
          warningLevel: daysToDeadline <= 1 ? '1day' : daysToDeadline <= 3 ? '3days' : daysToDeadline <= 7 ? '7days' : 'normal',
        };

        this.deadlineWarnings.set(`${opportunity.id}_${days}days`, warning);
      }
    });
  }

  /**
   * Start background deadline checker
   */
  startDeadlineChecker(intervalMinutes: number = 60): void {
    if (this.deadlineCheckInterval) {
      console.log('[OPPORTUNITY-ALERTS] Deadline checker already running');
      return;
    }

    this.deadlineCheckInterval = setInterval(() => {
      this.checkDeadlines();
    }, intervalMinutes * 60 * 1000);

    console.log(`[OPPORTUNITY-ALERTS] Deadline checker started (every ${intervalMinutes} minutes)`);
  }

  /**
   * Stop deadline checker
   */
  stopDeadlineChecker(): void {
    if (this.deadlineCheckInterval) {
      clearInterval(this.deadlineCheckInterval);
      this.deadlineCheckInterval = null;
      console.log('[OPPORTUNITY-ALERTS] Deadline checker stopped');
    }
  }

  /**
   * Check for approaching deadlines
   */
  private async checkDeadlines(): Promise<void> {
    const now = new Date();

    for (const [oppId, opportunity] of this.opportunities) {
      const msToDeadline = opportunity.deadline.getTime() - now.getTime();
      const daysToDeadline = Math.floor(msToDeadline / (1000 * 60 * 60 * 24));

      // Check each warning threshold
      for (const days of this.config.deadlineWarnings) {
        const warningKey = `${oppId}_${days}days`;
        const warning = this.deadlineWarnings.get(warningKey);

        if (daysToDeadline === days && (!warning || !warning.lastWarning)) {
          // Send deadline warning to all interested agents
          const agents = Array.from(this.agents.values());
          for (const agent of agents) {
            const matches = this.matcher.matchOpportunityToAgents(opportunity, [agent]);
            if (matches.length > 0 && matches[0].matchScore >= this.config.minMatchScore) {
              await this.alertDelivery.sendDeadlineWarning(
                agent.agentId,
                agent.email,
                opportunity.id,
                opportunity.title,
                daysToDeadline
              );
            }
          }

          // Update warning
          if (warning) {
            warning.lastWarning = now;
          }
        }
      }
    }
  }

  /**
   * Get opportunity status
   */
  getOpportunityStatus(opportunityId: string): any {
    const opportunity = this.opportunities.get(opportunityId);
    if (!opportunity) return null;

    const matches = this.matcher.matchOpportunityToAgents(opportunity, Array.from(this.agents.values()));
    const now = new Date();
    const msToDeadline = opportunity.deadline.getTime() - now.getTime();
    const daysToDeadline = Math.floor(msToDeadline / (1000 * 60 * 60 * 24));

    return {
      opportunity,
      topMatches: matches.slice(0, 5),
      daysUntilDeadline: daysToDeadline,
      alertsSent: this.alertDelivery.getAlertHistory(opportunityId),
    };
  }

  /**
   * Get system metrics
   */
  getMetrics(): any {
    return {
      totalOpportunities: this.opportunities.size,
      totalAgents: this.agents.size,
      deadlineWarningsActive: this.deadlineWarnings.size,
      alertStats: this.alertDelivery.getAlertStats(),
    };
  }

  /**
   * Export state
   */
  getState(): any {
    return {
      opportunities: Array.from(this.opportunities.values()),
      agents: Array.from(this.agents.values()),
      deadlineWarnings: Array.from(this.deadlineWarnings.values()),
      metrics: this.getMetrics(),
    };
  }
}

export { OpportunityMatcher, AlertDelivery, OpportunityRouter };

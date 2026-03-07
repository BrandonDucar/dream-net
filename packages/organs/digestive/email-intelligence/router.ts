// EmailIntelligence - Intelligent Router

import { ParsedEmail, RoutingDecision, EmailIntent } from './types';

export class EmailRouter {
  private agentSkills: Map<string, string[]> = new Map();
  private agentEmails: Map<string, string> = new Map();
  private swarmThreshold: number = 100000;

  /**
   * Register agent with their skills and contact
   */
  registerAgent(agentId: string, email: string, skills: string[]): void {
    this.agentEmails.set(agentId, email);
    this.agentSkills.set(agentId, skills);
  }

  /**
   * Route email to appropriate agent
   */
  routeEmail(parsed: ParsedEmail, allAgents: string[]): RoutingDecision {
    const { intent, urgency, actionRequired, keyEntities } = parsed;

    // Extract amount if present
    const amount = keyEntities.amounts && keyEntities.amounts.length > 0 ? keyEntities.amounts[0] : 0;

    // Determine if should escalate to swarm
    const shouldEscalate = this.shouldEscalateToSwarm(intent, urgency, amount);

    if (shouldEscalate) {
      return {
        parsedEmail: parsed,
        recommendedAgent: 'swarm-consciousness',
        alternativeAgents: allAgents.slice(0, 3),
        reason: `High-value opportunity ($${amount}) or critical urgency - escalating to swarm`,
        shouldEscalateToSwarm: true,
      };
    }

    // Find best agent for the intent
    const bestAgent = this.findBestAgentForIntent(intent, allAgents);

    const alternativeAgents = allAgents
      .filter(a => a !== bestAgent)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    return {
      parsedEmail: parsed,
      recommendedAgent: bestAgent || allAgents[0] || 'swarm-consciousness',
      alternativeAgents,
      reason: this.generateRoutingReason(intent, bestAgent),
      shouldEscalateToSwarm: false,
    };
  }

  /**
   * Determine if email should escalate to swarm
   */
  private shouldEscalateToSwarm(intent: EmailIntent, urgency: string, amount: number): boolean {
    // Escalate if critical urgency
    if (urgency === 'critical') return true;

    // Escalate if large amount
    if (amount > this.swarmThreshold) return true;

    // Escalate if grant approval (swarm should celebrate!)
    if (intent === 'grant_approved') return true;

    // Escalate if payment received (treasury event)
    if (intent === 'payment_received') return true;

    return false;
  }

  /**
   * Find best agent for email intent
   */
  private findBestAgentForIntent(intent: EmailIntent, agents: string[]): string {
    const intentToSkills: Record<EmailIntent, string[]> = {
      'grant_notification': ['grants', 'proposals', 'government'],
      'grant_approved': ['grants', 'treasury', 'contracts'],
      'grant_rejected': ['analysis', 'proposals'],
      'contract_inquiry': ['contracts', 'negotiation'],
      'payment_notification': ['finance', 'treasury'],
      'payment_received': ['finance', 'treasury'],
      'deadline_reminder': ['project-management', 'organization'],
      'document_request': ['documentation', 'organization'],
      'negotiation': ['contracts', 'negotiation', 'sales'],
      'status_update': ['project-management'],
      'other': [],
    };

    const requiredSkills = intentToSkills[intent] || [];

    // Score each agent
    let bestAgent = agents[0];
    let bestScore = 0;

    for (const agent of agents) {
      const skills = this.agentSkills.get(agent) || [];
      const matchedSkills = requiredSkills.filter(s => skills.includes(s)).length;
      const score = matchedSkills / Math.max(requiredSkills.length, 1);

      if (score > bestScore) {
        bestScore = score;
        bestAgent = agent;
      }
    }

    return bestAgent;
  }

  /**
   * Generate human-readable routing reason
   */
  private generateRoutingReason(intent: EmailIntent, agent: string): string {
    const reasons: Record<EmailIntent, string> = {
      'grant_notification': 'Routing to grants specialist',
      'grant_approved': 'Exciting news - grant approved!',
      'grant_rejected': 'Analyzing rejection for improvement',
      'contract_inquiry': 'Routing to contract specialist',
      'payment_notification': 'Invoice routing to finance',
      'payment_received': 'Payment logged in treasury',
      'deadline_reminder': 'Deadline tracking activated',
      'document_request': 'Document collection initiated',
      'negotiation': 'Negotiation specialist assigned',
      'status_update': 'Status tracked and logged',
      'other': 'Routing to available agent',
    };

    return reasons[intent] || 'Routing to available agent';
  }
}

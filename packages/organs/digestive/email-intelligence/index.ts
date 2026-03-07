// EmailIntelligence - Main Engine

import { Email, ParsedEmail, RoutingDecision, AutoResponse, EmailAction, FollowUpSchedule, EmailConfig } from './types';
import { EmailParser } from './parser';
import { EmailRouter } from './router';
import { ResponseGenerator } from './responder';

export class EmailIntelligence {
  private parser: EmailParser;
  private router: EmailRouter;
  private responder: ResponseGenerator;
  private config: EmailConfig;
  private parsedEmails: Map<string, ParsedEmail> = new Map();
  private routingDecisions: Map<string, RoutingDecision> = new Map();
  private autoResponses: AutoResponse[] = [];
  private emailActions: EmailAction[] = [];
  private followUps: Map<string, FollowUpSchedule> = new Map();
  private agents: Map<string, { name: string; email: string; skills: string[] }> = new Map();

  constructor(config: EmailConfig) {
    this.config = config;
    this.parser = new EmailParser();
    this.router = new EmailRouter();
    this.responder = new ResponseGenerator();
  }

  /**
   * Register agents with email intelligence
   */
  registerAgents(agents: Array<{ id: string; name: string; email: string; skills: string[] }>): void {
    agents.forEach(agent => {
      this.agents.set(agent.id, agent);
      this.router.registerAgent(agent.id, agent.email, agent.skills);
    });
    console.log(`[EMAIL-INTELLIGENCE] Registered ${agents.length} agents`);
  }

  /**
   * Main entry point: process incoming email
   */
  async processEmail(email: Email): Promise<{
    parsed: ParsedEmail;
    routing: RoutingDecision;
    response?: AutoResponse;
    actions: EmailAction[];
  }> {
    console.log(`[EMAIL-INTELLIGENCE] Processing email: ${email.subject}`);

    // 1. Parse email
    const parsed = this.parser.parseEmail(email);
    this.parsedEmails.set(email.id, parsed);
    console.log(`[EMAIL-INTELLIGENCE] Intent: ${parsed.intent}, Urgency: ${parsed.urgency}`);

    // 2. Route email
    const allAgentIds = Array.from(this.agents.keys());
    const routing = this.router.routeEmail(parsed, allAgentIds);
    this.routingDecisions.set(email.id, routing);
    console.log(`[EMAIL-INTELLIGENCE] Routed to: ${routing.recommendedAgent}`);

    // 3. Generate auto-response if configured
    let response: AutoResponse | undefined;
    if (this.config.autoResponseEnabled) {
      const agent = this.agents.get(routing.recommendedAgent);
      const agentName = agent?.name || 'Team';

      response = this.responder.generateAutoResponse(parsed, agentName);

      if (this.config.requireApprovalForResponses && response.requiresApproval) {
        console.log(`[EMAIL-INTELLIGENCE] Response requires approval before sending`);
      } else {
        this.autoResponses.push(response);
        console.log(`[EMAIL-INTELLIGENCE] Auto-response generated and queued`);
      }
    }

    // 4. Generate actions
    const actions = this.responder.generateActions(parsed, routing.recommendedAgent);
    this.emailActions.push(...actions);
    console.log(`[EMAIL-INTELLIGENCE] Generated ${actions.length} action(s)`);

    // 5. Schedule follow-ups if enabled
    if (this.config.followUpEnabled) {
      const followUp = this.scheduleFollowUp(email.id, routing.recommendedAgent);
      if (followUp) {
        this.followUps.set(followUp.emailId, followUp);
        console.log(`[EMAIL-INTELLIGENCE] Follow-up scheduled for ${followUp.scheduledFor}`);
      }
    }

    return {
      parsed,
      routing,
      response,
      actions,
    };
  }

  /**
   * Schedule follow-up for email
   */
  private scheduleFollowUp(emailId: string, agentId: string): FollowUpSchedule | null {
    const parsed = this.parsedEmails.get(emailId);
    if (!parsed) return null;

    const scheduleFor = new Date();

    // Schedule based on email type
    if (parsed.intent === 'grant_approved') {
      scheduleFor.setHours(scheduleFor.getHours() + 1); // Follow up in 1 hour
      return {
        emailId,
        scheduledFor: scheduleFor,
        type: 'follow_up',
        action: 'Check on grant approved workflow',
        status: 'scheduled',
      };
    }

    if (parsed.intent === 'contract_inquiry') {
      scheduleFor.setDate(scheduleFor.getDate() + 1); // Follow up in 1 day
      return {
        emailId,
        scheduledFor: scheduleFor,
        type: 'reminder',
        action: 'Check contract review status',
        status: 'scheduled',
      };
    }

    if (parsed.intent === 'payment_notification') {
      scheduleFor.setDate(scheduleFor.getDate() + parsed.keyEntities.dates?.[0] ? 7 : 3);
      return {
        emailId,
        scheduledFor: scheduleFor,
        type: 'deadline_warning',
        action: 'Verify payment was processed',
        status: 'scheduled',
      };
    }

    return null;
  }

  /**
   * Execute pending actions
   */
  async executePendingActions(): Promise<any> {
    const pending = this.emailActions.filter(a => a.status === 'pending');
    console.log(`[EMAIL-INTELLIGENCE] Executing ${pending.length} pending actions`);

    const results = [];

    for (const action of pending) {
      action.status = 'executing';

      try {
        // In production, integrate with actual systems
        // For now, just mark as complete
        action.status = 'complete';
        action.executedAt = new Date();
        results.push({ action, success: true });
        console.log(`[EMAIL-INTELLIGENCE] Executed: ${action.description}`);
      } catch (error) {
        action.status = 'failed';
        results.push({ action, success: false, error });
        console.error(`[EMAIL-INTELLIGENCE] Failed to execute: ${action.description}`, error);
      }
    }

    return results;
  }

  /**
   * Send pending auto-responses
   */
  async sendPendingResponses(): Promise<any> {
    console.log(`[EMAIL-INTELLIGENCE] Sending ${this.autoResponses.length} pending responses`);

    const results = [];

    for (const response of this.autoResponses) {
      try {
        // In production, integrate with email service
        console.log(`[EMAIL-INTELLIGENCE] Sending response to: ${response.to}`);
        results.push({ response, success: true });
      } catch (error) {
        console.error(`[EMAIL-INTELLIGENCE] Failed to send response`, error);
        results.push({ response, success: false, error });
      }
    }

    this.autoResponses = [];
    return results;
  }

  /**
   * Get email intelligence summary
   */
  getSummary(): {
    emailsProcessed: number;
    intents: Record<string, number>;
    urgencyDistribution: Record<string, number>;
    routingDistribution: Record<string, number>;
    pendingActions: number;
    followUpsScheduled: number;
  } {
    const intents: Record<string, number> = {};
    const urgency: Record<string, number> = {};
    const routing: Record<string, number> = {};

    this.parsedEmails.forEach(parsed => {
      intents[parsed.intent] = (intents[parsed.intent] || 0) + 1;
      urgency[parsed.urgency] = (urgency[parsed.urgency] || 0) + 1;
    });

    this.routingDecisions.forEach(decision => {
      routing[decision.recommendedAgent] = (routing[decision.recommendedAgent] || 0) + 1;
    });

    return {
      emailsProcessed: this.parsedEmails.size,
      intents,
      urgencyDistribution: urgency,
      routingDistribution: routing,
      pendingActions: this.emailActions.filter(a => a.status === 'pending').length,
      followUpsScheduled: this.followUps.size,
    };
  }

  /**
   * Export state
   */
  getState(): any {
    return {
      parsedEmails: Array.from(this.parsedEmails.values()),
      routingDecisions: Array.from(this.routingDecisions.values()),
      autoResponses: this.autoResponses,
      emailActions: this.emailActions,
      followUps: Array.from(this.followUps.values()),
      summary: this.getSummary(),
    };
  }
}

export { EmailParser, EmailRouter, ResponseGenerator };

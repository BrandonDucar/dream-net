// EmailIntelligence - Response Generator

import { ParsedEmail, AutoResponse, EmailAction } from './types';

export class ResponseGenerator {
  private templateBank: Map<string, string> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  /**
   * Generate auto-response based on parsed email
   */
  generateAutoResponse(parsed: ParsedEmail, agentName: string): AutoResponse {
    const { originalEmail, intent, urgency, actionRequired } = parsed;

    const template = this.getTemplate(intent);
    const body = this.formatTemplate(template, {
      agentName,
      emailSubject: originalEmail.subject,
      urgency,
      actionRequired,
    });

    return {
      to: originalEmail.from,
      subject: `Re: ${originalEmail.subject}`,
      body,
      requiresApproval: urgency === 'critical',
    };
  }

  /**
   * Generate action items from email
   */
  generateActions(parsed: ParsedEmail, agentId: string): EmailAction[] {
    const actions: EmailAction[] = [];
    const { intent, urgency, actionItems, keyEntities } = parsed;

    // Action 1: Alert agent
    if (urgency === 'critical') {
      actions.push({
        id: `action_${Date.now()}_1`,
        type: 'alert',
        description: `Critical email requires immediate attention`,
        targetAgentId: agentId,
        status: 'pending',
      });
    }

    // Action 2: Create task for each action item
    actionItems.forEach((item, index) => {
      actions.push({
        id: `action_${Date.now()}_${index + 2}`,
        type: 'create_task',
        description: `Task: ${item}`,
        targetAgentId: agentId,
        payload: {
          title: item,
          priority: urgency === 'critical' ? 'high' : 'normal',
          dueDate: this.calculateDueDate(parsed),
        },
        status: 'pending',
      });
    });

    // Action 3: Handle specific intents
    if (intent === 'grant_approved') {
      actions.push({
        id: `action_${Date.now()}_grant_approved`,
        type: 'trigger_workflow',
        description: 'Grant Approved Workflow - Begin invoice preparation',
        targetSwarm: true,
        payload: {
          workflowType: 'grant_approved',
          amount: keyEntities.amounts?.[0] || 0,
        },
        status: 'pending',
      });
    }

    if (intent === 'payment_received') {
      actions.push({
        id: `action_${Date.now()}_payment_received`,
        type: 'update_record',
        description: 'Update payment records and treasury',
        targetAgentId: agentId,
        payload: {
          recordType: 'payment',
          amount: keyEntities.amounts?.[0] || 0,
          date: new Date(),
        },
        status: 'pending',
      });
    }

    return actions;
  }

  /**
   * Calculate due date for task
   */
  private calculateDueDate(parsed: ParsedEmail): Date {
    const { keyEntities, urgency } = parsed;

    // If email mentions specific date, use that
    if (keyEntities.dates && keyEntities.dates.length > 0) {
      return keyEntities.dates[0];
    }

    // Otherwise use urgency level
    const daysToAdd = urgency === 'critical' ? 1 : urgency === 'high' ? 3 : 7;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysToAdd);
    return dueDate;
  }

  /**
   * Initialize response templates
   */
  private initializeTemplates(): void {
    this.templateBank.set(
      'grant_notification',
      `Hello,

Thank you for the grant opportunity notification. ${agentName} is reviewing the details.

We will submit a competitive proposal if it aligns with our capabilities.

Best regards,
Vanguard Team`
    );

    this.templateBank.set(
      'grant_approved',
      `Excellent news - ${agentName} will follow up immediately to:
- Confirm all details
- Prepare invoice documentation
- Schedule kick-off meeting

Thank you for choosing us!

Best regards,
Vanguard Team`
    );

    this.templateBank.set(
      'payment_notification',
      `Thank you for the invoice notification. Payment terms have been noted and scheduled.

Our finance team is processing this immediately.

Best regards,
Vanguard Team`
    );

    this.templateBank.set(
      'contract_inquiry',
      `Thank you for your interest in working with us. ${agentName} will review the contract terms and scope.

We will provide feedback and signature authority within 2 business days.

Best regards,
Vanguard Team`
    );

    this.templateBank.set(
      'deadline_reminder',
      `Thank you for the deadline reminder. Our team is on track and will submit before the deadline.

Best regards,
Vanguard Team`
    );

    this.templateBank.set(
      'other',
      `Thank you for reaching out. We will review this and respond promptly.

Best regards,
Vanguard Team`
    );
  }

  /**
   * Get response template
   */
  private getTemplate(intent: string): string {
    return this.templateBank.get(intent) || this.templateBank.get('other') || 'Thank you for your email.';
  }

  /**
   * Format template with variables
   */
  private formatTemplate(template: string, variables: Record<string, any>): string {
    let formatted = template;

    for (const [key, value] of Object.entries(variables)) {
      formatted = formatted.replace(new RegExp(`{${key}}`, 'g'), String(value));
      formatted = formatted.replace(new RegExp(`\\$${key}`, 'g'), String(value));
    }

    return formatted;
  }
}

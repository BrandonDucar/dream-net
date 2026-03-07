// OpportunityAlertSystem - Alert Delivery

import { Alert, AlertConfig } from './types';

export class AlertDelivery {
  private alerts: Alert[] = [];
  private config: AlertConfig;

  constructor(config: AlertConfig) {
    this.config = config;
  }

  /**
   * Send alert via email
   */
  async sendEmailAlert(recipient: string, subject: string, body: string, actionUrl?: string): Promise<boolean> {
    if (!this.config.emailEnabled) {
      console.log(`[ALERT] Email disabled, skipping: ${subject}`);
      return false;
    }

    console.log(`[ALERT] Sending email to ${recipient}: ${subject}`);
    // In production, integrate with email service (SendGrid, AWS SES, etc)
    // await emailService.send({ to: recipient, subject, body, actionUrl });

    return true;
  }

  /**
   * Send alert via SMS
   */
  async sendSMSAlert(phoneNumber: string, message: string): Promise<boolean> {
    if (!this.config.smsEnabled) {
      console.log(`[ALERT] SMS disabled, skipping`);
      return false;
    }

    console.log(`[ALERT] Sending SMS to ${phoneNumber}: ${message}`);
    // In production, integrate with SMS service (Twilio, AWS SNS, etc)
    // await smsService.send({ to: phoneNumber, body: message });

    return true;
  }

  /**
   * Post alert to dashboard
   */
  async postDashboardAlert(agentId: string, subject: string, body: string): Promise<boolean> {
    if (!this.config.dashboardEnabled) {
      console.log(`[ALERT] Dashboard disabled, skipping`);
      return false;
    }

    console.log(`[ALERT] Dashboard alert for ${agentId}: ${subject}`);
    // In production, post to dashboard message queue or database

    return true;
  }

  /**
   * Send comprehensive alert (email + SMS + dashboard)
   */
  async sendComprehensiveAlert(
    agentId: string,
    agentEmail: string,
    agentPhone: string,
    subject: string,
    body: string,
    priority: 'low' | 'medium' | 'high' | 'critical',
    opportunityId: string,
    actionUrl?: string
  ): Promise<Alert> {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'all',
      recipient: agentEmail,
      agentId,
      opportunityId,
      subject,
      body,
      priority,
      sentAt: new Date(),
      actionUrl,
    };

    this.alerts.push(alert);

    // Send via all enabled channels
    const results = await Promise.all([
      this.sendEmailAlert(agentEmail, subject, body, actionUrl),
      priority === 'critical' ? this.sendSMSAlert(agentPhone, `ALERT: ${subject}`) : Promise.resolve(false),
      this.postDashboardAlert(agentId, subject, body),
    ]);

    console.log(`[ALERT] Sent comprehensive alert (Priority: ${priority}) - ${results.filter(r => r).length} channels`);

    return alert;
  }

  /**
   * Create and send opportunity alert
   */
  async sendOpportunityAlert(
    agentId: string,
    agentEmail: string,
    agentPhone: string,
    opportunityId: string,
    opportunityTitle: string,
    matchScore: number,
    recommendedAction: string,
    actionUrl?: string
  ): Promise<Alert> {
    const priority = matchScore > 85 ? 'critical' : matchScore > 70 ? 'high' : 'medium';

    const subject = `${recommendedAction === 'bid_solo' ? 'STRONG' : 'Potential'} Match: ${opportunityTitle}`;
    const body = `
New opportunity match for you!

Title: ${opportunityTitle}
Match Score: ${matchScore}%
Recommended Action: ${recommendedAction}

Action: ${actionUrl || 'Check dashboard for details'}
    `.trim();

    return this.sendComprehensiveAlert(agentId, agentEmail, agentPhone, subject, body, priority, opportunityId, actionUrl);
  }

  /**
   * Create and send deadline warning
   */
  async sendDeadlineWarning(
    agentId: string,
    agentEmail: string,
    opportunityId: string,
    opportunityTitle: string,
    daysRemaining: number,
    actionUrl?: string
  ): Promise<Alert> {
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let subject = '';

    if (daysRemaining <= 0) {
      priority = 'critical';
      subject = `DEADLINE PASSED: ${opportunityTitle}`;
    } else if (daysRemaining === 1) {
      priority = 'critical';
      subject = `LAST DAY: ${opportunityTitle} - Bid Due Today!`;
    } else if (daysRemaining <= 3) {
      priority = 'high';
      subject = `URGENT: ${daysRemaining} Days Left - ${opportunityTitle}`;
    } else if (daysRemaining <= 7) {
      priority = 'medium';
      subject = `Reminder: ${daysRemaining} Days Left - ${opportunityTitle}`;
    } else {
      priority = 'low';
      subject = `Upcoming: ${opportunityTitle} - Deadline in ${daysRemaining} Days`;
    }

    const body = `
Deadline reminder for: ${opportunityTitle}
Days remaining: ${daysRemaining}

${daysRemaining <= 3 ? 'URGENT - Please submit your bid ASAP!' : 'Remember to prepare your proposal.'}

Action: ${actionUrl || 'Check dashboard for details'}
    `.trim();

    return this.sendComprehensiveAlert(agentId, agentEmail, undefined, subject, body, priority, opportunityId, actionUrl);
  }

  /**
   * Send escalation alert to swarm
   */
  async sendSwarmEscalationAlert(
    opportunityId: string,
    opportunityTitle: string,
    requiredAmount: number,
    reason: string,
    actionUrl?: string
  ): Promise<Alert> {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'dashboard',
      recipient: 'swarm-consciousness',
      opportunityId,
      subject: `SWARM ESCALATION: ${opportunityTitle}`,
      body: `
Opportunity escalated to swarm for collective decision:

Title: ${opportunityTitle}
Required Amount: $${requiredAmount}
Reason: ${reason}

Action: ${actionUrl || 'Review in swarm dashboard'}
      `.trim(),
      priority: 'critical',
      sentAt: new Date(),
      actionUrl,
    };

    this.alerts.push(alert);
    console.log(`[ALERT] Escalated to swarm: ${opportunityTitle} ($${requiredAmount})`);

    return alert;
  }

  /**
   * Get alert history for an agent
   */
  getAlertHistory(agentId: string, limit: number = 50): Alert[] {
    return this.alerts.filter(a => a.agentId === agentId).slice(-limit).reverse();
  }

  /**
   * Get unread alerts for an agent
   */
  getUnreadAlerts(agentId: string): Alert[] {
    return this.alerts.filter(a => a.agentId === agentId && !a.readAt);
  }

  /**
   * Mark alert as read
   */
  markAsRead(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.readAt = new Date();
    }
  }

  /**
   * Get alert statistics
   */
  getAlertStats(): {
    totalAlerts: number;
    unreadCount: number;
    byPriority: Record<string, number>;
    byType: Record<string, number>;
  } {
    const unreadCount = this.alerts.filter(a => !a.readAt).length;
    const byPriority: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    const byType: Record<string, number> = { email: 0, sms: 0, dashboard: 0, all: 0 };

    this.alerts.forEach(alert => {
      byPriority[alert.priority]++;
      byType[alert.type]++;
    });

    return {
      totalAlerts: this.alerts.length,
      unreadCount,
      byPriority,
      byType,
    };
  }
}

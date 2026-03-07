// EmailIntelligence - Parser

import { Email, ParsedEmail, EmailIntent } from './types';

export class EmailParser {
  /**
   * Parse email to extract intent, sentiment, urgency, and action items
   */
  parseEmail(email: Email): ParsedEmail {
    const intent = this.detectIntent(email.subject, email.body);
    const sentiment = this.analyzeSentiment(email.body);
    const urgency = this.detectUrgency(email.subject, email.body);
    const actionItems = this.extractActionItems(email.body);
    const keyEntities = this.extractEntities(email.body);
    const actionRequired = urgency === 'critical' || urgency === 'high' || actionItems.length > 0;

    return {
      originalEmail: email,
      intent,
      sentiment,
      urgency,
      actionRequired,
      actionItems,
      keyEntities,
      confidence: this.calculateConfidence(email, intent),
    };
  }

  /**
   * Detect email intent from subject and body
   */
  private detectIntent(subject: string, body: string): EmailIntent {
    const combined = `${subject} ${body}`.toLowerCase();

    const patterns: Array<[EmailIntent, string[]]> = [
      ['grant_approved', ['approved', 'congratulations', 'selected', 'awarded', 'grant', 'success']],
      ['grant_rejected', ['rejected', 'denied', 'not selected', 'unfortunately', 'unsuccessful']],
      ['grant_notification', ['grant', 'opportunity', 'application', 'submission', 'deadline', 'funding']],
      ['payment_received', ['payment received', 'deposited', 'received', 'credited', 'invoice paid']],
      ['payment_notification', ['payment', 'invoice', 'billing', 'amount due', 'payment terms']],
      ['deadline_reminder', ['deadline', 'due date', 'expires', 'last day', 'closing']],
      ['document_request', ['document', 'please provide', 'submit', 'attachment', 'required']],
      ['negotiation', ['negotiate', 'terms', 'rate', 'proposal', 'discussion', 'agreement']],
      ['status_update', ['status', 'update', 'progress', 'report', 'completed']],
      ['contract_inquiry', ['contract', 'agreement', 'scope', 'terms', 'conditions']],
    ];

    for (const [intent, keywords] of patterns) {
      const matches = keywords.filter(kw => combined.includes(kw)).length;
      if (matches >= 2) {
        return intent;
      }
    }

    return 'other';
  }

  /**
   * Analyze sentiment of email
   */
  private analyzeSentiment(body: string): 'positive' | 'neutral' | 'negative' {
    const positive = ['congratulations', 'great', 'excellent', 'approved', 'success', 'happy', 'thank', 'appreciate'];
    const negative = ['rejected', 'denied', 'failed', 'issue', 'problem', 'urgent', 'critical', 'error'];

    const lowerBody = body.toLowerCase();

    const positiveCount = positive.filter(word => lowerBody.includes(word)).length;
    const negativeCount = negative.filter(word => lowerBody.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Detect urgency level
   */
  private detectUrgency(subject: string, body: string): 'low' | 'medium' | 'high' | 'critical' {
    const combined = `${subject} ${body}`.toLowerCase();

    const critical = ['critical', 'urgent', 'asap', 'immediately', 'emergency', '!!!', 'deadline today'];
    const high = ['urgent', 'important', 'soon', 'deadline', 'expires', 'last day'];
    const medium = ['please', 'action required', 'attention needed'];

    if (critical.some(w => combined.includes(w))) return 'critical';
    if (high.some(w => combined.includes(w))) return 'high';
    if (medium.some(w => combined.includes(w))) return 'medium';
    return 'low';
  }

  /**
   * Extract action items from email
   */
  private extractActionItems(body: string): string[] {
    const actions: string[] = [];

    const patterns = [
      /please\s+([^.!?]+)/gi,
      /action item:\s*([^.!?]+)/gi,
      /todo:\s*([^.!?]+)/gi,
      /required:\s*([^.!?]+)/gi,
      /need to\s+([^.!?]+)/gi,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(body)) !== null) {
        if (match[1]) {
          actions.push(match[1].trim());
        }
      }
    }

    return [...new Set(actions)]; // Remove duplicates
  }

  /**
   * Extract key entities (amounts, dates, names, organizations)
   */
  private extractEntities(body: string) {
    const amounts: number[] = [];
    const dates: Date[] = [];
    const names: string[] = [];
    const organizations: string[] = [];

    // Extract amounts ($X or USD X)
    const amountPattern = /\$[\d,]+(?:\.\d{2})?|USD\s+[\d,]+/gi;
    let match;
    while ((match = amountPattern.exec(body)) !== null) {
      const amount = parseFloat(match[0].replace(/[$,]/g, ''));
      amounts.push(amount);
    }

    // Extract dates (simple patterns)
    const datePattern = /\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}/g;
    const dateMatches = body.match(datePattern) || [];
    dateMatches.forEach(dateStr => {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        dates.push(parsed);
      }
    });

    // Extract capitalized phrases (rough name detection)
    const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;
    const nameMatches = body.match(namePattern) || [];
    names.push(...nameMatches.slice(0, 5));

    return {
      amounts: [...new Set(amounts)],
      dates: [...new Set(dates)],
      names: [...new Set(names)],
      organizations,
    };
  }

  /**
   * Calculate confidence in parsing
   */
  private calculateConfidence(email: Email, intent: EmailIntent): number {
    let score = 50; // Base score

    // More information = higher confidence
    if (email.subject && email.subject.length > 10) score += 10;
    if (email.body && email.body.length > 100) score += 10;
    if (email.attachments && email.attachments.length > 0) score += 5;

    // Clear intent = higher confidence
    if (intent !== 'other') score += 15;

    return Math.min(100, score);
  }

  /**
   * Get email summary
   */
  getSummary(parsed: ParsedEmail): string {
    const { intent, urgency, actionRequired, actionItems } = parsed;

    let summary = `Email detected as: ${intent}\n`;
    summary += `Urgency: ${urgency}\n`;
    summary += `Requires action: ${actionRequired ? 'YES' : 'NO'}\n`;

    if (actionItems.length > 0) {
      summary += `Action items:\n${actionItems.map(a => `  - ${a}`).join('\n')}\n`;
    }

    return summary;
  }
}

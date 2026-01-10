/**
 * Gmail API Adapter for Inbox²
 * Handles draft creation, sending, and engagement tracking via Gmail API
 */

import { google } from 'googleapis';
import type { EngagementMetrics, EmailDraft } from '../types';

export class GmailApiAdapter {
  private gmail: any;
  private userId: string = 'me';

  constructor(oauth2Client: any) {
    this.gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  }

  /**
   * Create a draft in Gmail
   */
  async createDraft(
    to: string,
    subject: string,
    body: string,
    html?: string,
    from: string = 'dreamnetgmo@gmail.com',
    labelIds?: string[]
  ): Promise<string> {
    const message = this.encodeMessage({
      to,
      from,
      subject,
      body,
      html,
    });

    const draft = await this.gmail.users.drafts.create({
      userId: this.userId,
      requestBody: {
        message: {
          raw: message,
          labelIds: labelIds || ['DRAFT', 'INBOX_SQUARED'],
        },
      },
    });

    return draft.data.id;
  }

  /**
   * Send a draft
   */
  async sendDraft(draftId: string): Promise<string> {
    const draft = await this.gmail.users.drafts.get({
      userId: this.userId,
      id: draftId,
    });

    const sent = await this.gmail.users.messages.send({
      userId: this.userId,
      requestBody: {
        raw: draft.data.message.raw,
        threadId: draft.data.message.threadId,
      },
    });

    return sent.data.id;
  }

  /**
   * Send email directly (without draft)
   */
  async sendEmail(
    to: string,
    subject: string,
    body: string,
    html?: string,
    from: string = 'dreamnetgmo@gmail.com'
  ): Promise<{ messageId: string; threadId?: string }> {
    const message = this.encodeMessage({
      to,
      from,
      subject,
      body,
      html,
    });

    const response = await this.gmail.users.messages.send({
      userId: this.userId,
      requestBody: {
        raw: message,
      },
    });

    return {
      messageId: response.data.id,
      threadId: response.data.threadId,
    };
  }

  /**
   * Track email engagement
   */
  async trackEngagement(messageId: string): Promise<EngagementMetrics> {
    try {
      const message = await this.gmail.users.messages.get({
        userId: this.userId,
        id: messageId,
        format: 'metadata',
        metadataHeaders: ['From', 'Subject', 'Date'],
      });

      const threadId = message.data.threadId;
      let replied = false;

      if (threadId) {
        const thread = await this.gmail.users.threads.get({
          userId: this.userId,
          id: threadId,
          format: 'metadata',
        });

        // Check if thread has more than one message (indicating reply)
        replied = (thread.data.messages?.length || 0) > 1;
      }

      // Check if email was opened (UNREAD label removed)
      const opened = !message.data.labelIds?.includes('UNREAD');

      return {
        messageId,
        threadId,
        opened,
        openedAt: opened ? new Date().toISOString() : undefined,
        replied,
        repliedAt: replied ? new Date().toISOString() : undefined,
        clicked: false, // Would need click tracking links
        bounced: message.data.labelIds?.includes('SPAM') || false,
        unsubscribed: false,
      };
    } catch (error) {
      console.error('[Gmail API] Error tracking engagement:', error);
      throw error;
    }
  }

  /**
   * List sent emails
   */
  async listSentEmails(options?: {
    after?: Date;
    maxResults?: number;
    query?: string;
  }): Promise<Array<{ id: string; threadId?: string; snippet: string }>> {
    let query = 'in:sent';
    if (options?.after) {
      const afterTimestamp = Math.floor(options.after.getTime() / 1000);
      query += ` after:${afterTimestamp}`;
    }
    if (options?.query) {
      query += ` ${options.query}`;
    }

    const response = await this.gmail.users.messages.list({
      userId: this.userId,
      q: query,
      maxResults: options?.maxResults || 50,
    });

    return (
      response.data.messages?.map((msg: any) => ({
        id: msg.id,
        threadId: msg.threadId,
        snippet: msg.snippet || '',
      })) || []
    );
  }

  /**
   * Search emails
   */
  async searchEmails(query: string, maxResults: number = 50): Promise<string[]> {
    const response = await this.gmail.users.messages.list({
      userId: this.userId,
      q: query,
      maxResults,
    });

    return response.data.messages?.map((msg: any) => msg.id) || [];
  }

  /**
   * Get message content
   */
  async getMessage(messageId: string): Promise<any> {
    return await this.gmail.users.messages.get({
      userId: this.userId,
      id: messageId,
      format: 'full',
    });
  }

  /**
   * Encode email message for Gmail API
   */
  private encodeMessage(email: {
    to: string;
    from: string;
    subject: string;
    body: string;
    html?: string;
  }): string {
    const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    let message = [
      `To: ${email.to}`,
      `From: ${email.from}`,
      `Subject: ${email.subject}`,
      `MIME-Version: 1.0`,
    ];

    if (email.html) {
      message.push(
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        `Content-Type: text/plain; charset=utf-8`,
        `Content-Transfer-Encoding: 7bit`,
        '',
        email.body,
        `--${boundary}`,
        `Content-Type: text/html; charset=utf-8`,
        `Content-Transfer-Encoding: 7bit`,
        '',
        email.html,
        `--${boundary}--`
      );
    } else {
      message.push(
        `Content-Type: text/plain; charset=utf-8`,
        `Content-Transfer-Encoding: 7bit`,
        '',
        email.body
      );
    }

    const rawMessage = message.join('\r\n');
    return Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}


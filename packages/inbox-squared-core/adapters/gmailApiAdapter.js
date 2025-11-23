/**
 * Gmail API Adapter for Inbox²
 * Handles draft creation, sending, and engagement tracking via Gmail API
 */
import { google } from 'googleapis';
export class GmailApiAdapter {
    gmail;
    userId = 'me';
    constructor(oauth2Client) {
        this.gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    }
    /**
     * Create a draft in Gmail
     */
    async createDraft(to, subject, body, html, from = 'dreamnetgmo@gmail.com', labelIds) {
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
    async sendDraft(draftId) {
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
    async sendEmail(to, subject, body, html, from = 'dreamnetgmo@gmail.com') {
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
    async trackEngagement(messageId) {
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
        }
        catch (error) {
            console.error('[Gmail API] Error tracking engagement:', error);
            throw error;
        }
    }
    /**
     * List sent emails
     */
    async listSentEmails(options) {
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
        return (response.data.messages?.map((msg) => ({
            id: msg.id,
            threadId: msg.threadId,
            snippet: msg.snippet || '',
        })) || []);
    }
    /**
     * Search emails
     */
    async searchEmails(query, maxResults = 50) {
        const response = await this.gmail.users.messages.list({
            userId: this.userId,
            q: query,
            maxResults,
        });
        return response.data.messages?.map((msg) => msg.id) || [];
    }
    /**
     * Get message content
     */
    async getMessage(messageId) {
        return await this.gmail.users.messages.get({
            userId: this.userId,
            id: messageId,
            format: 'full',
        });
    }
    /**
     * Encode email message for Gmail API
     */
    encodeMessage(email) {
        const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        let message = [
            `To: ${email.to}`,
            `From: ${email.from}`,
            `Subject: ${email.subject}`,
            `MIME-Version: 1.0`,
        ];
        if (email.html) {
            message.push(`Content-Type: multipart/alternative; boundary="${boundary}"`, '', `--${boundary}`, `Content-Type: text/plain; charset=utf-8`, `Content-Transfer-Encoding: 7bit`, '', email.body, `--${boundary}`, `Content-Type: text/html; charset=utf-8`, `Content-Transfer-Encoding: 7bit`, '', email.html, `--${boundary}--`);
        }
        else {
            message.push(`Content-Type: text/plain; charset=utf-8`, `Content-Transfer-Encoding: 7bit`, '', email.body);
        }
        const rawMessage = message.join('\r\n');
        return Buffer.from(rawMessage)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }
}

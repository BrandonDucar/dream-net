/**
 * Gmail API Adapter for Inbox²
 * Handles draft creation, sending, and engagement tracking via Gmail API
 */
import type { EngagementMetrics } from '../types.js';
export declare class GmailApiAdapter {
    private gmail;
    private userId;
    constructor(oauth2Client: any);
    /**
     * Create a draft in Gmail
     */
    createDraft(to: string, subject: string, body: string, html?: string, from?: string, labelIds?: string[]): Promise<string>;
    /**
     * Send a draft
     */
    sendDraft(draftId: string): Promise<string>;
    /**
     * Send email directly (without draft)
     */
    sendEmail(to: string, subject: string, body: string, html?: string, from?: string): Promise<{
        messageId: string;
        threadId?: string;
    }>;
    /**
     * Track email engagement
     */
    trackEngagement(messageId: string): Promise<EngagementMetrics>;
    /**
     * List sent emails
     */
    listSentEmails(options?: {
        after?: Date;
        maxResults?: number;
        query?: string;
    }): Promise<Array<{
        id: string;
        threadId?: string;
        snippet: string;
    }>>;
    /**
     * Search emails
     */
    searchEmails(query: string, maxResults?: number): Promise<string[]>;
    /**
     * Get message content
     */
    getMessage(messageId: string): Promise<any>;
    /**
     * Encode email message for Gmail API
     */
    private encodeMessage;
}

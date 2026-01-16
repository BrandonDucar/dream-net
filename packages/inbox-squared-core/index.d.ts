/**
 * Inbox² Core - AI-powered communication copilot
 *
 * Four intelligent layers:
 * 1. Research Engine - Gathers 3-5 credible facts
 * 2. SEO + Relevance Layer - Finds trending topics
 * 3. Geo Awareness - Adds local/event personalization
 * 4. Learning Loop - Adjusts based on engagement
 */
export * from './types.js';
export * from './adapters/gmailApiAdapter.js';
export * from './logic/researchEngine.js';
export * from './logic/relevanceEngine.js';
export * from './logic/geoAwareness.js';
export * from './logic/learningLoop.js';
export * from './logic/draftGenerator.js';
import type { EmailDraft, EngagementMetrics, DraftGenerationOptions, InboxSquaredConfig } from './types.js';
export declare class InboxSquared {
    private gmailAdapter?;
    private config;
    constructor(config?: InboxSquaredConfig);
    /**
     * Initialize Gmail API adapter
     */
    initializeGmail(oauth2Client: any): void;
    /**
     * Generate intelligent email draft
     */
    generateDraft(recipientEmail: string, options?: DraftGenerationOptions, recipientName?: string, recipientCompany?: string): Promise<EmailDraft>;
    /**
     * Create draft in Gmail
     */
    createGmailDraft(draft: EmailDraft): Promise<string>;
    /**
     * Track email engagement
     */
    trackEngagement(messageId: string): Promise<EngagementMetrics>;
    /**
     * Get research engine
     */
    getResearchEngine(): import("./index.js").ResearchEngine;
    /**
     * Get relevance engine
     */
    getRelevanceEngine(): import("./index.js").RelevanceEngine;
    /**
     * Get geo awareness
     */
    getGeoAwareness(): import("./index.js").GeoAwareness;
    /**
     * Get learning loop
     */
    getLearningLoop(): import("./index.js").LearningLoop;
    /**
     * Send email directly
     */
    sendEmail(to: string, subject: string, body: string, html?: string, from?: string): Promise<{
        messageId: string;
        threadId?: string;
    }>;
}
export declare const inboxSquared: InboxSquared;

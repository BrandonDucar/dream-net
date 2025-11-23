/**
 * Inbox² Core - AI-powered communication copilot
 *
 * Four intelligent layers:
 * 1. Research Engine - Gathers 3-5 credible facts
 * 2. SEO + Relevance Layer - Finds trending topics
 * 3. Geo Awareness - Adds local/event personalization
 * 4. Learning Loop - Adjusts based on engagement
 */
export * from './types';
export * from './adapters/gmailApiAdapter';
export * from './logic/researchEngine';
export * from './logic/relevanceEngine';
export * from './logic/geoAwareness';
export * from './logic/learningLoop';
export * from './logic/draftGenerator';
import type { EmailDraft, EngagementMetrics, DraftGenerationOptions, InboxSquaredConfig } from './types';
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
    generateDraft(recipientEmail: string, recipientName?: string, recipientCompany?: string, options?: DraftGenerationOptions): Promise<EmailDraft>;
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
    getResearchEngine(): import(".").ResearchEngine;
    /**
     * Get relevance engine
     */
    getRelevanceEngine(): import(".").RelevanceEngine;
    /**
     * Get geo awareness
     */
    getGeoAwareness(): import(".").GeoAwareness;
    /**
     * Get learning loop
     */
    getLearningLoop(): import(".").LearningLoop;
}
export declare const inboxSquared: InboxSquared;

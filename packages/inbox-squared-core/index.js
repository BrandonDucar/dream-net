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
// Main Inbox² class
import { GmailApiAdapter } from './adapters/gmailApiAdapter';
import { researchEngine } from './logic/researchEngine';
import { relevanceEngine } from './logic/relevanceEngine';
import { geoAwareness } from './logic/geoAwareness';
import { learningLoop } from './logic/learningLoop';
import { draftGenerator } from './logic/draftGenerator';
export class InboxSquared {
    gmailAdapter;
    config;
    constructor(config = {}) {
        this.config = config;
    }
    /**
     * Initialize Gmail API adapter
     */
    initializeGmail(oauth2Client) {
        this.gmailAdapter = new GmailApiAdapter(oauth2Client);
    }
    /**
     * Generate intelligent email draft
     */
    async generateDraft(recipientEmail, recipientName, recipientCompany, options = {
        fromName: 'DreamNet Team',
        fromEmail: 'dreamnetgmo@gmail.com',
    }) {
        return await draftGenerator.generateDraft(recipientEmail, recipientName, recipientCompany, options);
    }
    /**
     * Create draft in Gmail
     */
    async createGmailDraft(draft) {
        if (!this.gmailAdapter) {
            throw new Error('Gmail API not initialized. Call initializeGmail() first.');
        }
        return await this.gmailAdapter.createDraft(draft.toEmail, draft.subject, draft.body, draft.html, 'dreamnetgmo@gmail.com', ['DRAFT', 'INBOX_SQUARED']);
    }
    /**
     * Track email engagement
     */
    async trackEngagement(messageId) {
        if (!this.gmailAdapter) {
            throw new Error('Gmail API not initialized.');
        }
        const metrics = await this.gmailAdapter.trackEngagement(messageId);
        await learningLoop.recordEngagement(messageId, metrics);
        return metrics;
    }
    /**
     * Get research engine
     */
    getResearchEngine() {
        return researchEngine;
    }
    /**
     * Get relevance engine
     */
    getRelevanceEngine() {
        return relevanceEngine;
    }
    /**
     * Get geo awareness
     */
    getGeoAwareness() {
        return geoAwareness;
    }
    /**
     * Get learning loop
     */
    getLearningLoop() {
        return learningLoop;
    }
}
// Export singleton instance
export const inboxSquared = new InboxSquared();

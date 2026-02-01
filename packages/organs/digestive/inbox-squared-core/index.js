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
// Main Inbox² class
import { GmailApiAdapter } from './adapters/gmailApiAdapter.js';
import { researchEngine } from './logic/researchEngine.js';
import { relevanceEngine } from './logic/relevanceEngine.js';
import { geoAwareness } from './logic/geoAwareness.js';
import { learningLoop } from './logic/learningLoop.js';
import { draftGenerator } from './logic/draftGenerator.js';
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
    async generateDraft(recipientEmail, options = {
        fromName: 'DreamNet Team',
        fromEmail: 'dreamnetgmo@gmail.com',
    }, recipientName, recipientCompany) {
        return await draftGenerator.generateDraft(recipientEmail, options, recipientName, recipientCompany);
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
    /**
     * Send email directly
     */
    async sendEmail(to, subject, body, html, from) {
        if (!this.gmailAdapter) {
            throw new Error('Gmail API not initialized. Direct send requires an adapter.');
        }
        return await this.gmailAdapter.sendEmail(to, subject, body, html, from);
    }
}
// Export singleton instance
export const inboxSquared = new InboxSquared();
//# sourceMappingURL=index.js.map
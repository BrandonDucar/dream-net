"use strict";
/**
 * Inbox² Core - AI-powered communication copilot
 *
 * Four intelligent layers:
 * 1. Research Engine - Gathers 3-5 credible facts
 * 2. SEO + Relevance Layer - Finds trending topics
 * 3. Geo Awareness - Adds local/event personalization
 * 4. Learning Loop - Adjusts based on engagement
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inboxSquared = exports.InboxSquared = void 0;
__exportStar(require("./types"), exports);
__exportStar(require("./adapters/gmailApiAdapter"), exports);
__exportStar(require("./logic/researchEngine"), exports);
__exportStar(require("./logic/relevanceEngine"), exports);
__exportStar(require("./logic/geoAwareness"), exports);
__exportStar(require("./logic/learningLoop"), exports);
__exportStar(require("./logic/draftGenerator"), exports);
// Main Inbox² class
const gmailApiAdapter_1 = require("./adapters/gmailApiAdapter");
const researchEngine_1 = require("./logic/researchEngine");
const relevanceEngine_1 = require("./logic/relevanceEngine");
const geoAwareness_1 = require("./logic/geoAwareness");
const learningLoop_1 = require("./logic/learningLoop");
const draftGenerator_1 = require("./logic/draftGenerator");
class InboxSquared {
    gmailAdapter;
    config;
    constructor(config = {}) {
        this.config = config;
    }
    /**
     * Initialize Gmail API adapter
     */
    initializeGmail(oauth2Client) {
        this.gmailAdapter = new gmailApiAdapter_1.GmailApiAdapter(oauth2Client);
    }
    /**
     * Generate intelligent email draft
     */
    async generateDraft(recipientEmail, recipientName, recipientCompany, options = {
        fromName: 'DreamNet Team',
        fromEmail: 'dreamnetgmo@gmail.com',
    }) {
        return await draftGenerator_1.draftGenerator.generateDraft(recipientEmail, recipientName, recipientCompany, options);
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
        await learningLoop_1.learningLoop.recordEngagement(messageId, metrics);
        return metrics;
    }
    /**
     * Get research engine
     */
    getResearchEngine() {
        return researchEngine_1.researchEngine;
    }
    /**
     * Get relevance engine
     */
    getRelevanceEngine() {
        return relevanceEngine_1.relevanceEngine;
    }
    /**
     * Get geo awareness
     */
    getGeoAwareness() {
        return geoAwareness_1.geoAwareness;
    }
    /**
     * Get learning loop
     */
    getLearningLoop() {
        return learningLoop_1.learningLoop;
    }
}
exports.InboxSquared = InboxSquared;
// Export singleton instance
exports.inboxSquared = new InboxSquared();

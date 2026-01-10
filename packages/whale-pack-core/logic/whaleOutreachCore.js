/**
 * Whale Pack Outreach Core
 * Uses Inbox² for intelligent partner/influencer outreach
 */
import { inboxSquared } from '@dreamnet/inbox-squared-core';
/**
 * Generate outreach email for Whale Pack partner/influencer
 */
export async function generateWhaleOutreachDraft(target, product, audience, options) {
    if (!target.email) {
        return null;
    }
    const draftOptions = {
        fromName: options?.fromName || 'DreamNet Whale Pack',
        fromEmail: options?.fromEmail || 'dreamnetgmo@gmail.com',
        tone: options?.tone || 'casual', // Whale Pack uses casual tone
        includeOptOut: options?.includeOptOut !== false,
        generateVariants: options?.generateVariants || true,
        generateContentTwins: options?.generateContentTwins || false,
    };
    try {
        const draft = await inboxSquared.generateDraft(target.email, draftOptions, target.name, target.company || target.role);
        // Enhance with Whale Pack context
        if (product || audience) {
            const whaleContext = buildWhaleContext(product, audience, target.context);
            draft.body = enhanceBodyWithWhaleContext(draft.body, whaleContext);
        }
        return draft;
    }
    catch (error) {
        console.error('[Whale Pack] Failed to generate Inbox² draft:', error);
        return null;
    }
}
/**
 * Build Whale Pack-specific context
 */
function buildWhaleContext(product, audience, context) {
    const parts = [];
    if (context === 'partnership') {
        parts.push('We\'re exploring partnerships with creators and brands');
    }
    else if (context === 'influencer') {
        parts.push('We\'re looking for influencers to collaborate with');
    }
    else if (context === 'collaboration') {
        parts.push('We\'d love to collaborate on content');
    }
    else if (context === 'sponsorship') {
        parts.push('We\'re offering sponsorship opportunities');
    }
    if (product) {
        parts.push(`for our product: ${product.name}`);
    }
    if (audience) {
        parts.push(`targeting ${audience.name} audience`);
    }
    return parts.join(' ');
}
/**
 * Enhance email body with Whale Pack context
 */
function enhanceBodyWithWhaleContext(body, context) {
    // Insert context after greeting
    const lines = body.split('\n');
    if (lines.length > 1) {
        lines.splice(1, 0, '', context + '.');
    }
    return lines.join('\n');
}
/**
 * Create Gmail draft for Whale Pack outreach
 */
export async function createWhaleGmailDraft(draft) {
    try {
        // Initialize Gmail if needed
        const oauth2Client = getGmailOAuth2Client();
        if (oauth2Client) {
            inboxSquared.initializeGmail(oauth2Client);
            return await inboxSquared.createGmailDraft(draft);
        }
        return null;
    }
    catch (error) {
        console.error('[Whale Pack] Failed to create Gmail draft:', error);
        return null;
    }
}
/**
 * Get Gmail OAuth2 client (helper)
 */
function getGmailOAuth2Client() {
    try {
        const { google } = require('googleapis');
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
        if (!clientId || !clientSecret || !refreshToken) {
            return null;
        }
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
        oauth2Client.setCredentials({ refresh_token: refreshToken });
        return oauth2Client;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=whaleOutreachCore.js.map
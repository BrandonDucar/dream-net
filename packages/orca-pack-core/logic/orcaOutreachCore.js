/**
 * Orca Pack Outreach Core
 * Uses Inbox² for intelligent community/network outreach
 */
import { inboxSquared } from '@dreamnet/inbox-squared-core';
/**
 * Generate outreach email for Orca Pack community/network contact
 */
export async function generateOrcaOutreachDraft(target, idea, theme, options) {
    if (!target.email) {
        return null;
    }
    const draftOptions = {
        fromName: options?.fromName || 'DreamNet Orca Pack',
        fromEmail: options?.fromEmail || 'dreamnetgmo@gmail.com',
        tone: options?.tone || 'consultative', // Orca Pack uses consultative tone
        includeOptOut: options?.includeOptOut !== false,
        generateVariants: options?.generateVariants || true,
        generateContentTwins: options?.generateContentTwins || false,
    };
    try {
        const draft = await inboxSquared.generateDraft(target.email, target.name, target.organization || target.role, draftOptions);
        // Enhance with Orca Pack context
        if (idea || theme) {
            const orcaContext = buildOrcaContext(idea, theme, target.context);
            draft.body = enhanceBodyWithOrcaContext(draft.body, orcaContext);
        }
        return draft;
    }
    catch (error) {
        console.error('[Orca Pack] Failed to generate Inbox² draft:', error);
        return null;
    }
}
/**
 * Build Orca Pack-specific context
 */
function buildOrcaContext(idea, theme, context) {
    const parts = [];
    if (context === 'community') {
        parts.push('We\'re building a community around narrative-driven content');
    }
    else if (context === 'network') {
        parts.push('We\'re expanding our network of creators and storytellers');
    }
    else if (context === 'partnership') {
        parts.push('We\'re exploring partnerships with narrative-focused organizations');
    }
    else if (context === 'collaboration') {
        parts.push('We\'d love to collaborate on narrative projects');
    }
    if (theme) {
        parts.push(`around the theme: ${theme.name}`);
    }
    if (idea) {
        parts.push(`for our idea: ${idea.title}`);
    }
    return parts.join(' ');
}
/**
 * Enhance email body with Orca Pack context
 */
function enhanceBodyWithOrcaContext(body, context) {
    // Insert context after greeting
    const lines = body.split('\n');
    if (lines.length > 1) {
        lines.splice(1, 0, '', context + '.');
    }
    return lines.join('\n');
}
/**
 * Create Gmail draft for Orca Pack outreach
 */
export async function createOrcaGmailDraft(draft) {
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
        console.error('[Orca Pack] Failed to create Gmail draft:', error);
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

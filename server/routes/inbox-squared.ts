/**
 * Inbox² API Routes
 * AI-powered communication copilot endpoints
 */

import { Router } from 'express';
import { inboxSquared } from '@dreamnet/inbox-squared-core';
import { google } from 'googleapis';
import type { DraftGenerationOptions } from '@dreamnet/inbox-squared-core';

const router = Router();

/**
 * Get Gmail OAuth2 client
 */
function getGmailOAuth2Client() {
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

/**
 * Initialize Inbox² with Gmail API
 */
function initializeInboxSquared() {
  const oauth2Client = getGmailOAuth2Client();
  if (oauth2Client) {
    inboxSquared.initializeGmail(oauth2Client);
    return true;
  }
  return false;
}

// Initialize on route load
const gmailInitialized = initializeInboxSquared();

/**
 * POST /api/inbox-squared/generate-draft
 * Generate intelligent email draft using all Inbox² layers
 */
router.post('/generate-draft', async (req, res) => {
  try {
    const { recipientEmail, recipientName, recipientCompany, options } = req.body;

    if (!recipientEmail) {
      return res.status(400).json({ error: 'recipientEmail is required' });
    }

    const draftOptions: DraftGenerationOptions = {
      fromName: options?.fromName || 'DreamNet Team',
      fromEmail: options?.fromEmail || 'dreamnetgmo@gmail.com',
      tone: options?.tone || 'consultative',
      includeOptOut: options?.includeOptOut !== false,
      generateVariants: options?.generateVariants || false,
      generateContentTwins: options?.generateContentTwins || false,
    };

    const draft = await inboxSquared.generateDraft(
      recipientEmail,
      recipientName,
      recipientCompany,
      draftOptions
    );

    res.json({ ok: true, draft });
  } catch (error) {
    console.error('[Inbox²] Error generating draft:', error);
    res.status(500).json({
      error: 'Failed to generate draft',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/inbox-squared/create-gmail-draft
 * Create draft in Gmail using Gmail API
 */
router.post('/create-gmail-draft', async (req, res) => {
  try {
    if (!gmailInitialized) {
      return res.status(503).json({
        error: 'Gmail API not configured',
        message: 'Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN',
      });
    }

    const { draft } = req.body;

    if (!draft || !draft.toEmail || !draft.subject || !draft.body) {
      return res.status(400).json({ error: 'Invalid draft object' });
    }

    const gmailDraftId = await inboxSquared.createGmailDraft(draft);

    res.json({
      ok: true,
      gmailDraftId,
      message: 'Draft created in Gmail',
    });
  } catch (error) {
    console.error('[Inbox²] Error creating Gmail draft:', error);
    res.status(500).json({
      error: 'Failed to create Gmail draft',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/inbox-squared/track-engagement
 * Track email engagement via Gmail API
 */
router.post('/track-engagement', async (req, res) => {
  try {
    if (!gmailInitialized) {
      return res.status(503).json({
        error: 'Gmail API not configured',
      });
    }

    const { messageId } = req.body;

    if (!messageId) {
      return res.status(400).json({ error: 'messageId is required' });
    }

    const metrics = await inboxSquared.trackEngagement(messageId);

    res.json({ ok: true, metrics });
  } catch (error) {
    console.error('[Inbox²] Error tracking engagement:', error);
    res.status(500).json({
      error: 'Failed to track engagement',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/inbox-squared/learning-patterns
 * Get learning patterns from engagement data
 */
router.get('/learning-patterns', async (req, res) => {
  try {
    const patterns = inboxSquared.getLearningLoop().getAllPatterns();
    res.json({ ok: true, patterns });
  } catch (error) {
    console.error('[Inbox²] Error getting patterns:', error);
    res.status(500).json({
      error: 'Failed to get learning patterns',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/inbox-squared/research/:email
 * Get research for a recipient
 */
router.get('/research/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { name, company } = req.query;

    const research = await inboxSquared
      .getResearchEngine()
      .researchRecipient(email, name as string, company as string);

    res.json({ ok: true, research });
  } catch (error) {
    console.error('[Inbox²] Error getting research:', error);
    res.status(500).json({
      error: 'Failed to get research',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/inbox-squared/status
 * Get Inbox² system status
 */
router.get('/status', async (req, res) => {
  res.json({
    ok: true,
    status: {
      gmailApiConfigured: gmailInitialized,
      researchEngineEnabled: true,
      relevanceEngineEnabled: true,
      geoAwarenessEnabled: true,
      learningLoopEnabled: true,
      patternsCount: inboxSquared.getLearningLoop().getAllPatterns().length,
    },
  });
});

export function createInboxSquaredRouter(): Router {
  return router;
}


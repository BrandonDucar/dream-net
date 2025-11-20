/**
 * Website AI Designer API Routes
 * Integrates ChatGPT GPT "Website AI Designer" for automated website generation
 */

import { Router } from 'express';
import { getWebsiteDesigner } from '@dreamnet/website-ai-designer';
import type { WebsiteDesignRequest } from '@dreamnet/website-ai-designer';

const router = Router();

/**
 * POST /api/website-designer/generate
 * Generate a website using Website AI Designer GPT
 */
router.post('/generate', async (req, res) => {
  try {
    const request: WebsiteDesignRequest = req.body;

    if (!request.description) {
      return res.status(400).json({
        success: false,
        error: 'Description is required',
      });
    }

    console.log('[WebsiteDesigner] Generating website:', request.description);

    const designer = getWebsiteDesigner();
    const result = await designer.generateWebsite(request);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[WebsiteDesigner] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate website',
    });
  }
});

/**
 * POST /api/website-designer/generate-code
 * Generate website code (HTML/CSS/JS) ready for deployment
 */
router.post('/generate-code', async (req, res) => {
  try {
    const request: WebsiteDesignRequest = req.body;

    if (!request.description) {
      return res.status(400).json({
        success: false,
        error: 'Description is required',
      });
    }

    console.log('[WebsiteDesigner] Generating website code:', request.description);

    const designer = getWebsiteDesigner();
    const code = await designer.generateWebsiteCode(request);

    res.json({
      success: true,
      code,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[WebsiteDesigner] Code generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate website code',
    });
  }
});

/**
 * GET /api/website-designer/health
 * Check if Website AI Designer is available
 */
router.get('/health', async (req, res) => {
  try {
    const designer = getWebsiteDesigner();
    const hasOpenAI = !!process.env.OPENAI_API_KEY;

    res.json({
      success: true,
      available: hasOpenAI,
      gptId: 'g-rLwPjHrHR',
      message: hasOpenAI 
        ? 'Website AI Designer is ready' 
        : 'OpenAI API key not configured',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;


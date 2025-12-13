import { Router, Request, Response } from 'express';
import { googleAgentStarterPack } from '../integrations/googleAgentStarterPack';

const router = Router();

/**
 * POST /api/google-agent-starter/execute
 * Execute task with Google Agent Starter Pack
 */
router.post('/execute', async (req: Request, res: Response) => {
  try {
    const { task, agent_type, context } = req.body;

    if (!task) {
      return res.status(400).json({ 
        error: 'Task is required',
        example: { task: 'Analyze this code', agent_type: 'react' }
      });
    }

    if (!googleAgentStarterPack.isConfigured()) {
      return res.status(503).json({ 
        error: 'Google Agent Starter Pack not configured',
        message: 'Set GOOGLE_AGENT_STARTER_PACK_URL environment variable',
        docs: 'See docs/GOOGLE_AGENT_STARTER_PACK_INTEGRATION.md'
      });
    }

    const result = await googleAgentStarterPack.executeTask({
      task,
      agent_type,
      context
    });

    res.json(result);
  } catch (error: any) {
    console.error('[Google Agent Starter] Error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Check GOOGLE_AGENT_STARTER_PACK_URL and ensure service is deployed'
    });
  }
});

/**
 * POST /api/google-agent-starter/react
 * Use ReAct agent template
 */
router.post('/react', async (req: Request, res: Response) => {
  try {
    const { task, context } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }

    if (!googleAgentStarterPack.isConfigured()) {
      return res.status(503).json({ 
        error: 'Google Agent Starter Pack not configured',
        message: 'Set GOOGLE_AGENT_STARTER_PACK_URL environment variable'
      });
    }

    const result = await googleAgentStarterPack.reactAgent(task, context);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/google-agent-starter/rag
 * Use RAG agent template
 */
router.post('/rag', async (req: Request, res: Response) => {
  try {
    const { task, context } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }

    if (!googleAgentStarterPack.isConfigured()) {
      return res.status(503).json({ 
        error: 'Google Agent Starter Pack not configured',
        message: 'Set GOOGLE_AGENT_STARTER_PACK_URL environment variable'
      });
    }

    const result = await googleAgentStarterPack.ragAgent(task, context);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/google-agent-starter/multi-agent
 * Use multi-agent template
 */
router.post('/multi-agent', async (req: Request, res: Response) => {
  try {
    const { task, context } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }

    if (!googleAgentStarterPack.isConfigured()) {
      return res.status(503).json({ 
        error: 'Google Agent Starter Pack not configured',
        message: 'Set GOOGLE_AGENT_STARTER_PACK_URL environment variable'
      });
    }

    const result = await googleAgentStarterPack.multiAgent(task, context);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/google-agent-starter/health
 * Check if Google Agent Starter Pack service is available
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    if (!googleAgentStarterPack.isConfigured()) {
      return res.json({
        configured: false,
        message: 'Set GOOGLE_AGENT_STARTER_PACK_URL to enable'
      });
    }

    const isHealthy = await googleAgentStarterPack.healthCheck();
    res.json({
      configured: true,
      healthy: isHealthy,
      message: isHealthy ? 'Service is available' : 'Service is not responding'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


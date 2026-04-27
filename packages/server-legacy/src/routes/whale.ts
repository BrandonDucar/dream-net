/**
 * Whale Pack API Routes
 */

import { Router } from 'express';
import { getAllMetrics } from '../whale/metrics';
import { WHALE_MANIFEST } from '../whale/manifest';
import { processWhaleAction } from '../whale/actions';

const router = Router();

/**
 * GET /api/whale/metrics
 * Returns aggregated metrics from all mini-apps
 */
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await getAllMetrics();
    res.json(metrics);
  } catch (err: any) {
    console.error('Failed to get whale metrics:', err);
    res.status(500).json({ message: 'Failed to get metrics', error: err.message });
  }
});

/**
 * GET /api/whale/manifest
 * Returns the Whale Pack manifest
 */
router.get('/manifest', (req, res) => {
  res.json(WHALE_MANIFEST);
});

/**
 * POST /api/whale/actions
 * Execute a Whale Pack action
 */
router.post('/actions', async (req, res) => {
  try {
    const { appId, action, payload } = req.body;

    if (!appId || !action) {
      return res.status(400).json({ message: 'appId and action are required' });
    }

    const result = await processWhaleAction(appId, action, payload || {});
    res.json(result);
  } catch (err: any) {
    console.error('Failed to process whale action:', err);
    res.status(500).json({ message: 'Failed to process action', error: err.message });
  }
});

export default router;


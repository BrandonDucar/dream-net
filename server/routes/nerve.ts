/**
 * Nerve Fabric API Routes
 * Internal/admin-only endpoints for accessing Nerve event data
 */

import { Router } from "express";
import { NERVE_BUS } from "../../packages/nerve/src/bus";
import { getDreamScopeEvents, getDreamScopeMetrics } from "../../packages/nerve/src/subscribers";

const router = Router();

// GET /api/nerve/stats - Get Nerve Bus statistics (internal/admin)
router.get("/stats", (req, res) => {
  try {
    const stats = NERVE_BUS.getStats();
    res.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/nerve/recent-events - Get recent events for DreamScope (internal/admin)
router.get("/recent-events", (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const events = getDreamScopeEvents(limit);
    
    res.json({
      success: true,
      events,
      count: events.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/nerve/metrics - Get DreamScope metrics (internal/admin)
router.get("/metrics", (req, res) => {
  try {
    const metrics = getDreamScopeMetrics();
    
    res.json({
      success: true,
      metrics,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


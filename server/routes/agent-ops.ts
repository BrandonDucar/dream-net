/**
 * Agent Ops Panel
 * Exposes agent activity for DreamScope/Civic Panel
 */

import { Router, Request, Response } from "express";
import { getRecentAgentActivity, getActivityStats } from "../../packages/agent-gateway/src/activity";
import type { RequestWithIdentity } from "../../packages/dreamnet-control-core/identityResolver";
import { withPort } from "../../packages/port-governor/src/withPort";
import { withGovernance } from "../../packages/dreamnet-control-core/controlCoreMiddleware";

const router = Router();

/**
 * GET /api/agent/ops
 * Get Agent Activity summary (admin-only)
 * Shows recent tool executions, stats, and activity patterns
 */
router.get(
  "/agent/ops",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "CIVIC_PANEL_CORE", requiredOfficeIds: ["FOUNDER"] }),
  async (req: Request, res: Response) => {
  try {
    const r = req as RequestWithIdentity;
    const traceId = r.traceId || "unknown";
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

    const events = getRecentAgentActivity(limit);
    const stats = getActivityStats();

    return res.json({
      success: true,
      traceId,
      count: events.length,
      events,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: "AGENT_OPS_ERROR",
      message: error.message,
      traceId: (req as RequestWithIdentity).traceId || "unknown",
    });
  }
});

export default router;


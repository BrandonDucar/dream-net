/**
 * Grid Lines API
 * Exposes conduit "heat" metrics for DreamScope visualization
 */

import { Router, Request, Response } from "express";
import { computeConduitMetrics } from "@dreamnet/dreamnet-control-core/conduitMetrics";
import type { RequestWithIdentity } from "@dreamnet/dreamnet-control-core/identityResolver";
import { withPort } from "@dreamnet/port-governor/withPort";
import { withGovernance } from "@dreamnet/dreamnet-control-core/controlCoreMiddleware";

const router = Router();

/**
 * GET /api/grid/lines
 * Get conduit metrics for grid visualization
 * Returns all known conduits with static config (port/cluster/tool) and dynamic metrics (usage, heat, status)
 */
router.get(
  "/grid/lines",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "CIVIC_PANEL_CORE", requiredOfficeIds: ["FOUNDER"] }),
  async (req: Request, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const traceId = r.traceId || "unknown";

      const metrics = computeConduitMetrics();

      return res.json({
        success: true,
        traceId,
        count: metrics.length,
        lines: metrics,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({
        error: "GRID_LINES_ERROR",
        message: error.message,
        traceId: (req as RequestWithIdentity).traceId || "unknown",
      });
    }
  }
);

export default router;


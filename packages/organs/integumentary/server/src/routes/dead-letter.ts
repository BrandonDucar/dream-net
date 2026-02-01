/**
 * Dead-Letter Endpoint
 * Exposes dead-letter buffer for admin review
 */

import { Router, Request, Response } from "express";
import {
  getDeadLetterRecords,
  getDeadLetterRecordsByConduit,
  getDeadLetterStats,
} from "@dreamnet/dreamnet-control-core/deadLetter";
import type { RequestWithIdentity } from "@dreamnet/dreamnet-control-core/identityResolver";
import { withPort } from "@dreamnet/port-governor";
import { withGovernance } from "@dreamnet/dreamnet-control-core/controlCoreMiddleware";

const router = Router();

/**
 * GET /api/ops/dead-letter
 * Get dead-letter records (admin-only)
 */
router.get(
  "/ops/dead-letter",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "SHIELD_CORE", requiredCabinetIds: ["SHIELD_CABINET"] }),
  async (req: Request, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const traceId = r.traceId || "unknown";
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const conduitId = req.query.conduitId as string | undefined;

      let records;
      if (conduitId) {
        records = getDeadLetterRecordsByConduit(conduitId);
      } else {
        records = getDeadLetterRecords(limit);
      }

      const stats = getDeadLetterStats();

      return res.json({
        success: true,
        traceId,
        count: records.length,
        records,
        stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({
        error: "DEAD_LETTER_ERROR",
        message: error.message,
        traceId: (req as RequestWithIdentity).traceId || "unknown",
      });
    }
  }
);

export default router;


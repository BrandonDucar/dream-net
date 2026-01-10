/**
 * Shield Risk Panel
 * Exposes risk profiles for DreamScope/Civic Panel
 */

import { Router, Request, Response } from "express";
import { listRiskProfiles, getRiskProfilesByLevel } from "../../packages/shield-core/src/risk";
import type { RequestWithIdentity } from "../../packages/dreamnet-control-core/identityResolver";
import { withPort } from "../../packages/port-governor/src/withPort";
import { withGovernance } from "../../packages/dreamnet-control-core/controlCoreMiddleware";

const router = Router();

/**
 * GET /api/shield/risk
 * Get Shield Risk profiles (admin-only)
 * Shows risk scores, levels, and recent high-risk activity
 */
router.get(
  "/shield/risk",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "SHIELD_CORE", requiredCabinetId: ["SHIELD_CABINET"] }),
  async (req: Request, res: Response) => {
  try {
    const r = req as RequestWithIdentity;
    const traceId = r.traceId || "unknown";
    const filterLevel = req.query.level as string | undefined;

    let profiles = listRiskProfiles();
    
    // Filter by level if specified
    if (filterLevel && ["low", "medium", "high", "critical"].includes(filterLevel)) {
      profiles = getRiskProfilesByLevel(filterLevel as any);
    }

    // Sort by score (highest risk first)
    profiles.sort((a: any, b: any) => b.score - a.score);

    // Calculate summary stats
    const stats = {
      total: listRiskProfiles().length,
      byLevel: {
        low: getRiskProfilesByLevel("low").length,
        medium: getRiskProfilesByLevel("medium").length,
        high: getRiskProfilesByLevel("high").length,
        critical: getRiskProfilesByLevel("critical").length,
      },
      averageScore: profiles.length > 0
        ? profiles.reduce((sum: number, p: any) => sum + p.score, 0) / profiles.length
        : 0,
    };

    return res.json({
      success: true,
      traceId,
      count: profiles.length,
      profiles,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: "SHIELD_RISK_ERROR",
      message: error.message,
      traceId: (req as RequestWithIdentity).traceId || "unknown",
    });
  }
});

export default router;


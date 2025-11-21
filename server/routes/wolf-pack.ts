import { Router } from "express";
import { wolfPack, type FundingSource, type FundingStatus } from "../agents/WolfPack";
import { createWolfPackActivateRouter } from "./wolf-pack-activate";
import { withCluster } from "../../packages/dreamnet-control-core/controlCoreMiddleware";

// Rewards engine is optional
let grantReward: any = null;
try {
  const rewardsModule = require("../../packages/rewards-engine");
  grantReward = rewardsModule.grantReward;
} catch {
  console.warn("[Wolf Pack] @dreamnet/rewards-engine not available");
}

export function createWolfPackRouter(): Router {
  const router = Router();
  
  // Attach WOLF_PACK cluster to all routes in this router
  // This enables Control Core middleware to enforce:
  // - Feature flag: canAccessWolfPack
  // - Rate limits: min(tierLimit, clusterLimit)
  // - Cluster enable/disable
  router.use(withCluster("WOLF_PACK"));

  // Middleware to get user ID (for paid feature)
  const getUserId = (req: any) =>
    (req.headers["x-user-id"] as string) ||
    (req.query.userId as string) ||
    undefined;

  // GET /api/wolf-pack/opportunities - Get all funding opportunities
  router.get("/wolf-pack/opportunities", async (req, res) => {
    try {
      const { source, status } = req.query;
      let opportunities = wolfPack.getOpportunities();

      if (source) {
        opportunities = opportunities.filter((opp) => opp.source === source);
      }
      if (status) {
        opportunities = opportunities.filter((opp) => opp.status === status);
      }

      res.json({ ok: true, opportunities });
    } catch (error) {
      console.error("Failed to get opportunities:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/wolf-pack/discover - Trigger discovery (admin or paid feature)
  router.post("/wolf-pack/discover", async (req, res) => {
    try {
      const userId = getUserId(req);
      // TODO: Check if user has paid feature access
      // For now, allow anyone to trigger discovery

      const opportunities = await wolfPack.discoverOpportunities();
      res.json({ ok: true, opportunities, count: opportunities.length });
    } catch (error) {
      console.error("Failed to discover opportunities:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/wolf-pack/hunt - Create a new funding hunt
  router.post("/wolf-pack/hunt", async (req, res) => {
    try {
      const { targetAmount, targetSources } = req.body;
      const userId = getUserId(req);

      if (!targetAmount || !targetSources || !Array.isArray(targetSources)) {
        return res.status(400).json({
          error: "targetAmount and targetSources (array) are required",
        });
      }

      const hunt = wolfPack.createHunt(targetAmount, targetSources, userId);
      res.json({ ok: true, hunt });
    } catch (error) {
      console.error("Failed to create hunt:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/wolf-pack/hunts - Get all hunts (user's hunts if userId provided)
  router.get("/wolf-pack/hunts", async (req, res) => {
    try {
      const userId = getUserId(req);
      const hunts = wolfPack.getHunts(userId);
      res.json({ ok: true, hunts });
    } catch (error) {
      console.error("Failed to get hunts:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/wolf-pack/hunt/:id - Get specific hunt
  router.get("/wolf-pack/hunt/:id", async (req, res) => {
    try {
      const hunt = wolfPack.getHunt(req.params.id);
      if (!hunt) {
        return res.status(404).json({ error: "Hunt not found" });
      }
      res.json({ ok: true, hunt });
    } catch (error) {
      console.error("Failed to get hunt:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/wolf-pack/hunt/:id/stats - Get hunt statistics
  router.get("/wolf-pack/hunt/:id/stats", async (req, res) => {
    try {
      const stats = wolfPack.getHuntStats(req.params.id);
      if (!stats) {
        return res.status(404).json({ error: "Hunt not found" });
      }
      res.json({ ok: true, stats });
    } catch (error) {
      console.error("Failed to get hunt stats:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/wolf-pack/hunt/:id/opportunity - Add opportunity to hunt
  router.post("/wolf-pack/hunt/:id/opportunity", async (req, res) => {
    try {
      const { opportunityId } = req.body;
      if (!opportunityId) {
        return res.status(400).json({ error: "opportunityId is required" });
      }

      wolfPack.addOpportunityToHunt(req.params.id, opportunityId);
      const hunt = wolfPack.getHunt(req.params.id);
      res.json({ ok: true, hunt });
    } catch (error) {
      console.error("Failed to add opportunity:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // PUT /api/wolf-pack/opportunity/:id/status - Update opportunity status
  router.put("/wolf-pack/opportunity/:id/status", async (req, res) => {
    try {
      const { status, notes } = req.body;
      if (!status) {
        return res.status(400).json({ error: "status is required" });
      }

      wolfPack.updateOpportunityStatus(req.params.id, status, notes);

      // Grant reward for applying (if status is "applied")
      if (status === "applied") {
        const userId = getUserId(req);
        if (userId) {
          if (grantReward) {
            grantReward(userId, "task-complete", {
              deltaDream: 50,
              meta: { type: "funding-application" },
            }).catch((err: any) => {
              console.error("Failed to grant reward:", err);
            });
          }
        }
      }

      res.json({ ok: true });
    } catch (error) {
      console.error("Failed to update status:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/wolf-pack/outreach - Generate outreach message
  router.post("/wolf-pack/outreach", async (req, res) => {
    try {
      const { opportunityId, templateId, variables } = req.body;
      if (!opportunityId || !templateId) {
        return res
          .status(400)
          .json({ error: "opportunityId and templateId are required" });
      }

      const outreach = wolfPack.generateOutreach(
        opportunityId,
        templateId,
        variables || {},
      );
      if (!outreach) {
        return res.status(404).json({ error: "Opportunity or template not found" });
      }

      res.json({ ok: true, outreach });
    } catch (error) {
      console.error("Failed to generate outreach:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Mount activation routes
  router.use(createWolfPackActivateRouter());

  return router;
}


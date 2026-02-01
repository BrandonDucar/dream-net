import { Router } from "express";
import { dreamSnail } from "../snail/DreamSnail";

export function createDreamSnailRouter(): Router {
  const router = Router();

  // GET /api/snail/trail - Get user's trail
  router.get("/snail/trail", async (req, res) => {
    try {
      const userId = (req.headers["x-user-id"] as string) || (req.query.userId as string) || "anonymous";
      const includeEncrypted = req.query.includeEncrypted === "true";
      
      const trails = dreamSnail.getUserTrail(userId, includeEncrypted);
      res.json({ ok: true, trails, count: trails.length });
    } catch (error) {
      console.error("Failed to get snail trail:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // POST /api/snail/trail - Record a trail event
  router.post("/snail/trail", async (req, res) => {
    try {
      const userId = (req.headers["x-user-id"] as string) || (req.body.userId as string) || "anonymous";
      const { eventType, eventData, metadata } = req.body;
      
      if (!eventType) {
        return res.status(400).json({ ok: false, error: "eventType is required" });
      }
      
      const trail = dreamSnail.recordTrail(userId, eventType, eventData || {}, metadata);
      res.json({ ok: true, trail });
    } catch (error) {
      console.error("Failed to record snail trail:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // GET /api/snail/privacy - Get privacy config
  router.get("/snail/privacy", async (req, res) => {
    try {
      const userId = (req.headers["x-user-id"] as string) || (req.query.userId as string) || "anonymous";
      const config = dreamSnail.getPrivacyConfig(userId);
      res.json({ ok: true, config });
    } catch (error) {
      console.error("Failed to get privacy config:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // PUT /api/snail/privacy - Update privacy config
  router.put("/snail/privacy", async (req, res) => {
    try {
      const userId = (req.headers["x-user-id"] as string) || (req.body.userId as string) || "anonymous";
      const updates = req.body;
      
      const config = dreamSnail.updatePrivacyConfig(userId, updates);
      res.json({ ok: true, config });
    } catch (error) {
      console.error("Failed to update privacy config:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // GET /api/snail/insights - Get user insights
  router.get("/snail/insights", async (req, res) => {
    try {
      const userId = (req.headers["x-user-id"] as string) || (req.query.userId as string) || "anonymous";
      const severity = req.query.severity as "low" | "medium" | "high" | "critical" | undefined;
      
      const insights = dreamSnail.getUserInsights(userId, severity);
      res.json({ ok: true, insights, count: insights.length });
    } catch (error) {
      console.error("Failed to get snail insights:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // GET /api/snail/analytics - Get analytics
  router.get("/snail/analytics", async (req, res) => {
    try {
      const userId = (req.headers["x-user-id"] as string) || (req.query.userId as string) || "anonymous";
      const analytics = dreamSnail.getAnalytics(userId);
      res.json({ ok: true, analytics });
    } catch (error) {
      console.error("Failed to get snail analytics:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // GET /api/snail/verify - Verify trail integrity
  router.get("/snail/verify", async (req, res) => {
    try {
      const userId = (req.headers["x-user-id"] as string) || (req.query.userId as string) || "anonymous";
      const verification = dreamSnail.verifyTrailIntegrity(userId);
      res.json({ ok: true, verification });
    } catch (error) {
      console.error("Failed to verify trail:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  return router;
}


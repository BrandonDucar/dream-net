import { Router } from "express";
import { grantReward, getUserBalance, listRewardEvents, getAllBalances } from "../../packages/rewards-engine";
import { recordEvent } from "../../packages/metrics-engine";

// Simple auth middleware for admin routes
function requireOperatorToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const token = process.env.OPERATOR_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "OPERATOR_TOKEN not configured" });
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const providedToken = authHeader.substring(7);
  if (providedToken !== token) {
    return res.status(403).json({ error: "Invalid token" });
  }

  next();
}

// Extract userId from session/auth (simplified for MVP)
function getUserId(req: any): string | null {
  // In production, extract from JWT or session
  // For MVP, use header or query param
  return (req.headers["x-user-id"] as string) || (req.query.userId as string) || null;
}

export function createRewardsRouter(): Router {
  const router = Router();

  // POST /api/rewards/login
  router.post("/rewards/login", async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "User ID required" });
      }

      const balance = await grantReward(userId, "login");
      await recordEvent().catch(console.error);

      res.json({ ok: true, balance });
    } catch (error) {
      console.error("Failed to grant login reward:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/rewards/daily-claim
  router.post("/rewards/daily-claim", async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "User ID required" });
      }

      const balance = await grantReward(userId, "daily-claim");
      await recordEvent().catch(console.error);

      res.json({ ok: true, balance });
    } catch (error) {
      console.error("Failed to grant daily claim:", error);
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // POST /api/rewards/weekly-claim
  router.post("/rewards/weekly-claim", async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "User ID required" });
      }

      const balance = await grantReward(userId, "weekly-claim");
      await recordEvent().catch(console.error);

      res.json({ ok: true, balance });
    } catch (error) {
      console.error("Failed to grant weekly claim:", error);
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // GET /api/rewards/balance
  router.get("/rewards/balance", async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "User ID required" });
      }

      const balance = await getUserBalance(userId);
      res.json({ ok: true, balance });
    } catch (error) {
      console.error("Failed to get balance:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/rewards/history
  router.get("/rewards/history", async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "User ID required" });
      }

      const limit = parseInt(String(req.query.limit ?? "50"), 10) || 50;
      const events = await listRewardEvents(userId, limit);
      res.json({ ok: true, events });
    } catch (error) {
      console.error("Failed to get reward history:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/rewards/leaderboard
  router.get("/rewards/leaderboard", async (req, res) => {
    try {
      const { type = "dream", limit = "100" } = req.query;
      const limitNum = parseInt(String(limit), 10) || 100;

      // Get all balances and sort
      const balances = await getAllBalances();

      let leaderboard;
      if (type === "dream") {
        leaderboard = balances
          .sort((a, b) => b.dream - a.dream)
          .slice(0, limitNum)
          .map((b, i) => ({
            rank: i + 1,
            userId: b.userId,
            dream: b.dream,
            sheep: b.sheep,
            streakDays: b.streakDays || 0,
          }));
      } else if (type === "sheep") {
        leaderboard = balances
          .sort((a, b) => b.sheep - a.sheep)
          .slice(0, limitNum)
          .map((b, i) => ({
            rank: i + 1,
            userId: b.userId,
            dream: b.dream,
            sheep: b.sheep,
            streakDays: b.streakDays || 0,
          }));
      } else if (type === "streak") {
        leaderboard = balances
          .sort((a, b) => (b.streakDays || 0) - (a.streakDays || 0))
          .slice(0, limitNum)
          .map((b, i) => ({
            rank: i + 1,
            userId: b.userId,
            dream: b.dream,
            sheep: b.sheep,
            streakDays: b.streakDays || 0,
          }));
      } else {
        return res.status(400).json({ error: "Invalid type. Use: dream, sheep, or streak" });
      }

      res.json({ ok: true, leaderboard, type });
    } catch (error) {
      console.error("Failed to get leaderboard:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // ============================================
  // ADMIN ROUTES
  // ============================================

  // GET /api/admin/rewards/:userId
  router.get("/admin/rewards/:userId", requireOperatorToken, async (req, res) => {
    try {
      const balance = await getUserBalance(req.params.userId);
      const events = await listRewardEvents(req.params.userId, 50);
      res.json({ ok: true, balance, events });
    } catch (error) {
      console.error("Failed to get user rewards:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/admin/rewards/:userId/adjust
  router.post("/admin/rewards/:userId/adjust", requireOperatorToken, async (req, res) => {
    try {
      const { deltaDream, deltaSheep, reason } = req.body;

      if (deltaDream === undefined && deltaSheep === undefined) {
        return res.status(400).json({ error: "At least one delta (deltaDream or deltaSheep) is required" });
      }

      const balance = await grantReward(req.params.userId, "admin-adjust", {
        deltaDream: deltaDream ?? 0,
        deltaSheep: deltaSheep ?? 0,
        reason,
        meta: { reason, adjustedBy: "admin" },
      });

      res.json({ ok: true, balance });
    } catch (error) {
      console.error("Failed to adjust balance:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}


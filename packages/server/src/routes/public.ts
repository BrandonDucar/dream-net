import { Router } from "express";
import { getMetrics } from "@dreamnet/metrics-engine";

// Cache for public status (30 seconds)
let cachedStatus: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_TTL_MS = 30 * 1000; // 30 seconds

export function createPublicRouter(): Router {
  const router = Router();

  // GET /api/public/status
  router.get("/public/status", async (_req, res) => {
    try {
      const now = Date.now();

      // Return cached data if still valid
      if (cachedStatus && now - cachedStatus.timestamp < CACHE_TTL_MS) {
        return res.json({ ok: true, ...cachedStatus.data });
      }

      // Fetch fresh metrics
      const metrics = await getMetrics();

      const status = {
        phase: metrics.phase,
        uptimePercent: metrics.uptimePercent,
        lastHaloCycle: metrics.haloCyclesToday,
        mediaPublic: metrics.mediaPublic,
        postsQueued: metrics.postsQueued,
        timestamp: new Date().toISOString(),
      };

      // Update cache
      cachedStatus = {
        data: status,
        timestamp: now,
      };

      res.json({ ok: true, ...status });
    } catch (error) {
      console.error("Failed to get public status:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  return router;
}


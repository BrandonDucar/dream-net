import { Router } from "express";
import { getMetrics, getMetricsHistory, updateTaskCounts } from "../../packages/metrics-engine";
import { getGoldenSignals, getEndpointMetrics } from "../middleware/metrics";
import { logger } from "../utils/logger";
// import { operatorApi } from "../../apps/site/src/operator/api"; // Temporarily disabled - app not available

export function createMetricsRouter(): Router {
  const router = Router();

  // GET /api/metrics - Current snapshot (includes golden signals)
  router.get("/metrics", async (_req, res) => {
    try {
      // Update task counts from Squad Builder (disabled for simplified startup)
      try {
        // const tasksRes = await operatorApi.getTasks();
        // const tasks = tasksRes.tasks ?? [];
        // const completed = tasks.filter((t: any) => t.status === "success").length;
        // const pending = tasks.filter(
        //   (t: any) => t.status === "pending" || t.status === "suggested" || t.status === "pending-approval"
        // ).length;
        // updateTaskCounts(completed, pending);
      } catch (err) {
        logger.warn("Failed to fetch tasks for metrics", { error: err instanceof Error ? err.message : String(err) });
      }

      const snapshot = await getMetrics();
      const goldenSignals = getGoldenSignals();
      
      res.json({ 
        ok: true, 
        metrics: snapshot,
        goldenSignals // Include golden signals from middleware
      });
    } catch (error) {
      logger.error("Failed to get metrics", error instanceof Error ? error : new Error(String(error)));
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // GET /api/metrics/golden-signals - Golden signals only (lightweight)
  router.get("/metrics/golden-signals", (_req, res) => {
    try {
      const goldenSignals = getGoldenSignals();
      res.json({ ok: true, ...goldenSignals });
    } catch (error) {
      logger.error("Failed to get golden signals", error instanceof Error ? error : new Error(String(error)));
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // GET /api/metrics/endpoint/:path - Metrics for specific endpoint
  router.get("/metrics/endpoint/:path", (req, res) => {
    try {
      const endpoint = `/${req.params.path}`;
      const endpointMetrics = getEndpointMetrics(endpoint);
      
      if (!endpointMetrics) {
        return res.status(404).json({ 
          ok: false, 
          error: `No metrics found for endpoint: ${endpoint}` 
        });
      }
      
      res.json({ ok: true, endpoint, metrics: endpointMetrics });
    } catch (error) {
      logger.error("Failed to get endpoint metrics", error instanceof Error ? error : new Error(String(error)));
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // GET /api/metrics/history - Daily aggregates
  router.get("/metrics/history", async (req, res) => {
    try {
      const days = parseInt(String(req.query.days ?? "7"), 10) || 7;
      const history = await getMetricsHistory(days);
      res.json({ ok: true, history });
    } catch (error) {
      logger.error("Failed to get metrics history", error instanceof Error ? error : new Error(String(error)));
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  return router;
}


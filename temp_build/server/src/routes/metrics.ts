import { Router } from "express";
import { getMetrics, getMetricsHistory, updateTaskCounts } from "../../packages/metrics-engine";
// import { operatorApi } from "../../apps/site/src/operator/api"; // Temporarily disabled - app not available

export function createMetricsRouter(): Router {
  const router = Router();

  // GET /api/metrics - Current snapshot
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
        console.error("Failed to fetch tasks for metrics:", err);
      }

      const snapshot = await getMetrics();
      res.json({ ok: true, metrics: snapshot });
    } catch (error) {
      console.error("Failed to get metrics:", error);
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
      console.error("Failed to get metrics history:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  return router;
}


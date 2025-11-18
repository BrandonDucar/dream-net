import { Router } from "express";
import { haloEngine } from "@dreamnet/halo-loop";
import { recordHaloCycle } from "@dreamnet/metrics-engine";

export function createHaloRouter(): Router {
  const router = Router();

  router.get("/halo/status", async (_req, res) => {
    const status = await haloEngine.getStatus();
    res.json({ ok: true, status });
  });

  router.post("/halo/run", async (req, res) => {
    const { mode, reason } = req.body as { mode?: "light" | "full"; reason?: string };
    const trigger = reason ? `api:${reason}` : "api";
    const startTime = Date.now();
    const result = await haloEngine.runCycle(trigger, { reason, mode }, mode ?? "full");
    
    // Record HALO cycle in metrics
    await recordHaloCycle({
      success: result.success ?? true,
      timestamp: new Date().toISOString(),
    });
    
    res.json({ ok: true, cycle: result });
  });

  router.get("/halo/history", async (req, res) => {
    const limit = parseInt(String(req.query.limit ?? "20"), 10) || 20;
    const history = await haloEngine.getHistory(limit);
    res.json({ ok: true, history });
  });

  router.get("/halo/weakpoints", (_req, res) => {
    res.json({ ok: true, weakPoints: haloEngine.getWeakPoints() });
  });

  return router;
}



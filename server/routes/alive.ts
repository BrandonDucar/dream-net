import { Router } from "express";
import { runBootSequence, getStatus } from "@dreamnet/alive-mode";
import { recordHeartbeat } from "@dreamnet/metrics-engine";

let booting = false;

export function createAliveRouter(): Router {
  const router = Router();

  router.get("/status", async (_req, res) => {
    const startTime = Date.now();
    const status = await getStatus();
    const latencyMs = Date.now() - startTime;
    
    // Record heartbeat latency
    await recordHeartbeat(latencyMs).catch((err) => {
      console.error("Failed to record heartbeat:", err);
    });
    
    res.json({ ok: true, status });
  });

  router.get("/ping", async (_req, res) => {
    // Lightweight ping endpoint for heartbeat
    const startTime = Date.now();
    const latencyMs = Date.now() - startTime;
    
    // Record heartbeat latency
    await recordHeartbeat(latencyMs).catch((err) => {
      console.error("Failed to record heartbeat:", err);
    });
    
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  router.post("/boot", async (_req, res) => {
    if (booting) {
      res.status(202).json({ ok: false, error: "Boot sequence already running" });
      return;
    }
    booting = true;
    try {
      const status = await runBootSequence();
      res.json({ ok: true, status });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    } finally {
      booting = false;
    }
  });

  return router;
}



import { Router } from "express";
import {
  computeResonanceSnapshot,
  saveResonanceInsights,
  getRecentInsights,
} from "@dreamnet/memory-dna";

export function createResonanceRouter(): Router {
  const router = Router();

  router.get("/insights", async (_req, res) => {
    const insights = await getRecentInsights();
    res.json({ ok: true, insights });
  });

  router.post("/compute", async (_req, res) => {
    const insights = await computeResonanceSnapshot();
    await saveResonanceInsights([...insights, ...(await getRecentInsights())]);
    res.json({ ok: true, insights });
  });

  return router;
}



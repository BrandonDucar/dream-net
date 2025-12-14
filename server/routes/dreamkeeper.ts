/**
 * DreamKeeper API (Agent 4)
 * 
 * Routes for generating and retrieving health specs and surgeon protocols
 */

import { Router, Request, Response } from "express";
import {
  runDreamkeeperAnalysis,
  generateDreamkeeperSpec,
  generateSurgeonProtocols,
} from "../services/DreamkeeperArchitect";
import { getLatestOutput } from "../services/AgentOutputStore";
import { validateDependencies } from "../services/AgentHelpers";

const router = Router();

/**
 * POST /api/dreamkeeper/analyze
 * Run full Agent 4 analysis
 */
router.post("/analyze", async (_req: Request, res: Response) => {
  try {
    const deps = await validateDependencies(4);
    if (!deps.valid) {
      return res.status(400).json({
        ok: false,
        error: "Missing required dependencies",
        missing: deps.missing,
        available: deps.available,
      });
    }

    const { dreamkeeperSpec, surgeonProtocols } = await runDreamkeeperAnalysis();

    res.json({
      ok: true,
      dreamkeeperSpec,
      surgeonProtocols,
      message: "DreamKeeper analysis complete",
    });
  } catch (error: any) {
    console.error("[DreamKeeper API] Error running analysis:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Failed to run DreamKeeper analysis",
    });
  }
});

/**
 * GET /api/dreamkeeper/spec
 * Get latest dreamkeeper spec
 */
router.get("/spec", async (_req: Request, res: Response) => {
  try {
    const output = await getLatestOutput(4, "dreamkeeper_spec");
    if (!output) {
      return res.status(404).json({
        ok: false,
        error: "No dreamkeeper spec found. Generate one first with POST /api/dreamkeeper/analyze",
      });
    }
    res.json({ ok: true, spec: output.data, metadata: { createdAt: output.createdAt, version: output.version } });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message || "Failed to retrieve spec" });
  }
});

/**
 * GET /api/dreamkeeper/protocols
 * Get latest surgeon protocols
 */
router.get("/protocols", async (_req: Request, res: Response) => {
  try {
    const output = await getLatestOutput(4, "surgeon_protocols");
    if (!output) {
      return res.status(404).json({
        ok: false,
        error: "No surgeon protocols found. Generate them first with POST /api/dreamkeeper/analyze",
      });
    }
    res.json({ ok: true, protocols: output.data, metadata: { createdAt: output.createdAt, version: output.version } });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message || "Failed to retrieve protocols" });
  }
});

export default router;


/**
 * Citadel API Routes
 * 
 * Routes for accessing The Citadel (DreamNet strategic command center)
 */

import { Router, Request, Response } from "express";
import { runCitadelOnce } from "../citadel/runCitadelOnce.js";

const router = Router();

/**
 * GET /api/citadel/state
 * Run The Citadel once and return all agent outputs
 */
router.get("/state", async (_req: Request, res: Response) => {
  try {
    const state = await runCitadelOnce();
    
    res.json({
      ok: true,
      ...state,
    });
  } catch (error: any) {
    console.error("[Citadel API] Error running Citadel:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Citadel run failed",
    });
  }
});

export default router;


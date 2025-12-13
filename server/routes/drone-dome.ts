/**
 * Drone Dome API (Agent 2)
 * 
 * Routes for generating and retrieving drone dome reports and commands
 */

import { Router, Request, Response } from "express";
import { runDroneDomeAnalysis, generateDomeReport, generateDomeCommands } from "../services/DroneDomeScanner";
import { getLatestOutput } from "../services/AgentOutputStore";
import { validateDependencies } from "../services/AgentHelpers";

const router = Router();

/**
 * POST /api/drone-dome/analyze
 * Run full Agent 2 analysis (generates both report and commands)
 */
router.post("/analyze", async (_req: Request, res: Response) => {
  try {
    // Validate dependencies
    const deps = await validateDependencies(2);
    if (!deps.valid) {
      return res.status(400).json({
        ok: false,
        error: "Missing required dependencies",
        missing: deps.missing,
        available: deps.available,
        message: "Generate vertex_fusion_snapshot first with POST /api/snapshot/generate",
      });
    }

    const { report, commands } = await runDroneDomeAnalysis();

    res.json({
      ok: true,
      report,
      commands,
      message: "Drone dome analysis complete",
    });
  } catch (error: any) {
    console.error("[Drone Dome API] Error running analysis:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Failed to run drone dome analysis",
    });
  }
});

/**
 * GET /api/drone-dome/report
 * Get latest drone dome report
 */
router.get("/report", async (_req: Request, res: Response) => {
  try {
    const output = await getLatestOutput(2, "drone_dome_report");

    if (!output) {
      return res.status(404).json({
        ok: false,
        error: "No drone dome report found. Generate one first with POST /api/drone-dome/analyze",
      });
    }

    res.json({
      ok: true,
      report: output.data,
      metadata: {
        createdAt: output.createdAt,
        version: output.version,
      },
    });
  } catch (error: any) {
    console.error("[Drone Dome API] Error retrieving report:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Failed to retrieve report",
    });
  }
});

/**
 * GET /api/drone-dome/commands
 * Get latest drone dome commands
 */
router.get("/commands", async (_req: Request, res: Response) => {
  try {
    const output = await getLatestOutput(2, "drone_dome_commands");

    if (!output) {
      return res.status(404).json({
        ok: false,
        error: "No drone dome commands found. Generate them first with POST /api/drone-dome/analyze",
      });
    }

    res.json({
      ok: true,
      commands: output.data,
      metadata: {
        createdAt: output.createdAt,
        version: output.version,
      },
    });
  } catch (error: any) {
    console.error("[Drone Dome API] Error retrieving commands:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Failed to retrieve commands",
    });
  }
});

export default router;


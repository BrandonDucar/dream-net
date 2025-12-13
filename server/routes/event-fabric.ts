/**
 * Event Fabric API (Agent 3)
 * 
 * Routes for generating and retrieving event fabric specs and monitoring blueprints
 */

import { Router, Request, Response } from "express";
import {
  runEventFabricAnalysis,
  generateEventFabricSpec,
  generateMonitoringBlueprint,
} from "../services/EventFabricBuilder";
import { getLatestOutput } from "../services/AgentOutputStore";
import { validateDependencies } from "../services/AgentHelpers";

const router = Router();

/**
 * POST /api/event-fabric/analyze
 * Run full Agent 3 analysis (generates both event fabric spec and monitoring blueprint)
 */
router.post("/analyze", async (_req: Request, res: Response) => {
  try {
    // Validate dependencies
    const deps = await validateDependencies(3);
    if (!deps.valid) {
      return res.status(400).json({
        ok: false,
        error: "Missing required dependencies",
        missing: deps.missing,
        available: deps.available,
        message: "Generate snapshot and drone dome report first",
      });
    }

    const { eventFabricSpec, monitoringBlueprint } = await runEventFabricAnalysis();

    res.json({
      ok: true,
      eventFabricSpec,
      monitoringBlueprint,
      message: "Event fabric analysis complete",
    });
  } catch (error: any) {
    console.error("[Event Fabric API] Error running analysis:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Failed to run event fabric analysis",
    });
  }
});

/**
 * GET /api/event-fabric/spec
 * Get latest event fabric spec
 */
router.get("/spec", async (_req: Request, res: Response) => {
  try {
    const output = await getLatestOutput(3, "event_fabric_spec");

    if (!output) {
      return res.status(404).json({
        ok: false,
        error: "No event fabric spec found. Generate one first with POST /api/event-fabric/analyze",
      });
    }

    res.json({
      ok: true,
      spec: output.data,
      metadata: {
        createdAt: output.createdAt,
        version: output.version,
      },
    });
  } catch (error: any) {
    console.error("[Event Fabric API] Error retrieving spec:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Failed to retrieve spec",
    });
  }
});

/**
 * GET /api/event-fabric/monitoring
 * Get latest monitoring blueprint
 */
router.get("/monitoring", async (_req: Request, res: Response) => {
  try {
    const output = await getLatestOutput(3, "monitoring_blueprint");

    if (!output) {
      return res.status(404).json({
        ok: false,
        error: "No monitoring blueprint found. Generate one first with POST /api/event-fabric/analyze",
      });
    }

    res.json({
      ok: true,
      blueprint: output.data,
      metadata: {
        createdAt: output.createdAt,
        version: output.version,
      },
    });
  } catch (error: any) {
    console.error("[Event Fabric API] Error retrieving blueprint:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Failed to retrieve blueprint",
    });
  }
});

export default router;


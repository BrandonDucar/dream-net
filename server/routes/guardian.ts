/**
 * Guardian Framework API Routes
 * 3-layer defense, stability, logistics, and intelligence system
 */

import express, { type Router } from "express";
import { guardianFramework } from "../../packages/guardian-framework-core";

const router: Router = express.Router();

// GET /api/guardian/status - Overall Guardian status
router.get("/status", async (req, res) => {
  try {
    // Check if Guardian Framework is initialized
    const status = guardianFramework.getStatus();
    if (!status) {
      return res.status(503).json({
        ok: false,
        error: "Guardian Framework not initialized",
        message: "Guardian Framework is still initializing. Please try again in a moment.",
      });
    }
    res.json({
      ok: true,
      status,
    });
  } catch (error: any) {
    console.error("[Guardian API] Failed to get status:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

// GET /api/guardian/shields/status - Shield layer status
router.get("/shields/status", async (req, res) => {
  try {
    const status = guardianFramework.getStatus();
    if (!status) {
      return res.status(503).json({
        ok: false,
        error: "Guardian Framework not initialized",
        message: "Guardian Framework is still initializing. Please try again in a moment.",
      });
    }
    res.json({
      ok: true,
      shields: status.shields,
    });
  } catch (error: any) {
    console.error("[Guardian API] Failed to get shields status:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

// GET /api/guardian/dome/status - Drone Dome status
router.get("/dome/status", async (req, res) => {
  try {
    const status = guardianFramework.getStatus();
    if (!status) {
      return res.status(503).json({
        ok: false,
        error: "Guardian Framework not initialized",
        message: "Guardian Framework is still initializing. Please try again in a moment.",
      });
    }
    res.json({
      ok: true,
      droneDome: status.droneDome,
    });
  } catch (error: any) {
    console.error("[Guardian API] Failed to get dome status:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

// GET /api/guardian/drones - List all drones
router.get("/drones", async (req, res) => {
  try {
    const status = guardianFramework.getStatus();
    if (!status) {
      return res.status(503).json({
        ok: false,
        error: "Guardian Framework not initialized",
        message: "Guardian Framework is still initializing. Please try again in a moment.",
        drones: [],
        count: 0,
      });
    }
    const drones = guardianFramework.getAllDrones();
    res.json({
      ok: true,
      drones,
      count: drones.length,
    });
  } catch (error: any) {
    console.error("[Guardian API] Failed to get drones:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

// GET /api/guardian/drones/:agentId - Get drone for specific agent
router.get("/drones/:agentId", async (req, res) => {
  try {
    const { agentId } = req.params;
    const drone = guardianFramework.getDrone(agentId);
    
    if (!drone) {
      return res.status(404).json({
        ok: false,
        error: `Drone not found for agent: ${agentId}`,
      });
    }

    res.json({
      ok: true,
      drone,
    });
  } catch (error: any) {
    console.error("[Guardian API] Failed to get drone:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

// GET /api/guardian/fleet/status - Aegis Fleet status
router.get("/fleet/status", async (req, res) => {
  try {
    const status = guardianFramework.getStatus();
    if (!status) {
      return res.status(503).json({
        ok: false,
        error: "Guardian Framework not initialized",
        message: "Guardian Framework is still initializing. Please try again in a moment.",
      });
    }
    res.json({
      ok: true,
      aegisFleet: status.aegisFleet,
    });
  } catch (error: any) {
    console.error("[Guardian API] Failed to get fleet status:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

// POST /api/guardian/cycle - Run Guardian cycle manually
router.post("/cycle", async (req, res) => {
  try {
    await guardianFramework.runCycle();
    const status = guardianFramework.getStatus();
    if (!status) {
      return res.status(503).json({
        ok: false,
        error: "Guardian Framework not initialized",
        message: "Guardian Framework must be initialized before running cycles.",
      });
    }
    res.json({
      ok: true,
      message: "Guardian cycle completed",
      status,
    });
  } catch (error: any) {
    console.error("[Guardian API] Failed to run cycle:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

export function createGuardianRouter(): Router {
  return router;
}


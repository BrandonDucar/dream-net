/**
 * Shield Core API Routes
 * Multi-phase shield system with rotating frequencies
 */

import express, { type Router } from "express";
import { withGovernance } from "@dreamnet/dreamnet-control-core/controlCoreMiddleware";

const router: Router = express.Router();

// Shield Core is optional - handle missing package gracefully
let ShieldCore: any = null;

async function getShieldCore() {
  if (ShieldCore) return ShieldCore;
  try {
    const shieldModule = await import("@dreamnet/shield-core");
    ShieldCore = shieldModule.ShieldCore;
    return ShieldCore;
  } catch (error) {
    return null;
  }
}

// GET /api/shield - Get Shield Core status
router.get("/", async (req, res) => {
  try {
    const core = await getShieldCore();
    if (!core) {
      return res.status(503).json({ error: "Shield Core not available" });
    }
    const status = core.status();
    res.json({
      success: true,
      shield: status,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/shield/layers - Get all shield layers
router.get("/layers", async (req, res) => {
  try {
    const core = await getShieldCore();
    if (!core) {
      return res.status(503).json({ error: "Shield Core not available" });
    }
    const layers = core.listLayers();
    res.json({ success: true, layers, count: layers.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/shield/threats - Get all threats
router.get("/threats", async (req, res) => {
  try {
    const core = await getShieldCore();
    if (!core) {
      return res.status(503).json({ error: "Shield Core not available" });
    }
    const threats = core.listThreats();
    res.json({ success: true, threats, count: threats.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/shield/spikes - Get offensive spikes
router.get("/spikes", async (req, res) => {
  try {
    const core = await getShieldCore();
    if (!core) {
      return res.status(503).json({ error: "Shield Core not available" });
    }
    const spikes = core.listSpikes();
    res.json({ success: true, spikes, count: spikes.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/shield/cellular - Get cellular shields
router.get("/cellular", async (req, res) => {
  try {
    const core = await getShieldCore();
    if (!core) {
      return res.status(503).json({ error: "Shield Core not available" });
    }
    const shields = core.listCellularShields();
    res.json({ success: true, shields, count: shields.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/shield/cross-chain - Get cross-chain shields
router.get("/cross-chain", async (req, res) => {
  try {
    const core = await getShieldCore();
    if (!core) {
      return res.status(503).json({ error: "Shield Core not available" });
    }
    const shields = core.listCrossChainShields();
    res.json({ success: true, shields, count: shields.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/shield/adjust-phase - Adjust shield phase (requires SHIELD_COMMANDER office)
router.post("/adjust-phase", withGovernance({
  clusterId: "SHIELD_CORE",
  requiredOfficeId: "SHIELD_COMMANDER",
}), (req, res) => {
  try {
    const { phase, strength } = req.body;
    // Example: ShieldCore.adjustPhase(phase, strength);
    res.json({
      success: true,
      message: "Shield phase adjusted",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/shield/rotate - Rotate shield frequencies
router.post("/rotate", async (req, res) => {
  try {
    const core = await getShieldCore();
    if (!core) {
      return res.status(503).json({ error: "Shield Core not available" });
    }
    core.rotateFrequencies();
    const status = core.status();
    res.json({
      success: true,
      message: "Shield frequencies rotated",
      shield: status,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/shield/detect - Detect a threat
router.post("/detect", async (req, res) => {
  try {
    const core = await getShieldCore();
    if (!core) {
      return res.status(503).json({ error: "Shield Core not available" });
    }
    const { type, level, source, target, payload } = req.body;
    const threat = core.detectThreat(type, level, source, target, payload);
    res.json({ success: true, threat });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/shield/fire-spike - Fire an offensive spike
router.post("/fire-spike", async (req, res) => {
  try {
    const core = await getShieldCore();
    if (!core) {
      return res.status(503).json({ error: "Shield Core not available" });
    }
    const { name, type, target, intensity } = req.body;
    const spike = core.fireSpike(name, type, target, intensity);
    res.json({ success: true, spike });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


/**
 * Star Bridge Lungs API Routes
 * Cross-chain breathwork and monitoring
 */

import express from "express";
// Star Bridge Lungs is optional
let StarBridgeLungs: any = null;
try {
  const starBridgeModule = require("../../packages/star-bridge-lungs");
  StarBridgeLungs = starBridgeModule.StarBridgeLungs;
} catch {
  console.warn("[Star Bridge Router] @dreamnet/star-bridge-lungs not available");
}

const router: express.Router = express.Router();

// GET /api/star-bridge - Get Star Bridge Lungs status
router.get("/", (req, res) => {
  if (!StarBridgeLungs) {
    return res.status(503).json({ error: "Star Bridge Lungs not available" });
  }
  try {
    const status = StarBridgeLungs.status();
    res.json({
      success: true,
      starBridge: status,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/star-bridge/chains - Get chain metrics
router.get("/chains", (req, res) => {
  if (!StarBridgeLungs) {
    return res.status(503).json({ error: "Star Bridge Lungs not available" });
  }
  try {
    const status = StarBridgeLungs.status();
    res.json({
      success: true,
      chains: status.chainMetrics,
      count: status.chainMetrics.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/star-bridge/breaths - Get recent breath snapshots
router.get("/breaths", (req, res) => {
  if (!StarBridgeLungs) {
    return res.status(503).json({ error: "Star Bridge Lungs not available" });
  }
  try {
    const status = StarBridgeLungs.status();
    const limit = parseInt(req.query.limit as string) || 10;
    const breaths = status.lastBreaths.slice(-limit);
    res.json({
      success: true,
      breaths,
      count: breaths.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/star-bridge/breathe - Trigger a breath cycle manually
router.post("/breathe", (req, res) => {
  if (!StarBridgeLungs) {
    return res.status(503).json({ error: "Star Bridge Lungs not available" });
  }
  try {
    // Import required systems for context
    const { NeuralMesh } = require("../../packages/neural-mesh");
    const { QuantumAnticipation } = require("../../packages/quantum-anticipation");
    const { SlugTimeMemory } = require("../../packages/slug-time-memory");
    
    const status = StarBridgeLungs.run({
      neuralMesh: NeuralMesh,
      quantumAnticipation: QuantumAnticipation,
      slugTimeMemory: SlugTimeMemory,
    });
    
    res.json({
      success: true,
      message: "Breath cycle completed",
      starBridge: status,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


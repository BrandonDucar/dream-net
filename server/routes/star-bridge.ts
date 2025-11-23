/**
 * Star Bridge Lungs API Routes
 * Cross-chain breathwork and monitoring
 */

import express from "express";

// Star Bridge Lungs - lazy loaded
let StarBridgeLungs: any = null;
let starBridgeLoadPromise: Promise<any> | null = null;

// Lazy load Star Bridge Lungs (supports both ESM and TypeScript)
async function loadStarBridge(): Promise<any> {
  if (StarBridgeLungs) {
    return StarBridgeLungs;
  }
  
  if (starBridgeLoadPromise) {
    return starBridgeLoadPromise;
  }
  
  starBridgeLoadPromise = (async () => {
    try {
      const starBridgeModule = await import("../../packages/star-bridge-lungs");
      StarBridgeLungs = starBridgeModule.StarBridgeLungs || starBridgeModule.default;
      if (StarBridgeLungs) {
        console.log("[Star Bridge Router] ✅ Star Bridge Lungs loaded");
      }
      return StarBridgeLungs;
    } catch (error) {
      console.warn("[Star Bridge Router] @dreamnet/star-bridge-lungs not available:", error instanceof Error ? error.message : error);
      return null;
    }
  })();
  
  return starBridgeLoadPromise;
}

const router: express.Router = express.Router();

// GET /api/star-bridge - Get Star Bridge Lungs status
router.get("/", async (req, res) => {
  const starBridge = await loadStarBridge();
  if (!starBridge) {
    return res.status(503).json({ error: "Star Bridge Lungs not available" });
  }
  try {
    const status = starBridge.status();
    res.json({
      success: true,
      starBridge: status,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/star-bridge/chains - Get chain metrics
router.get("/chains", async (req, res) => {
  const starBridge = await loadStarBridge();
  if (!starBridge) {
    return res.status(503).json({ error: "Star Bridge Lungs not available" });
  }
  try {
    const status = starBridge.status();
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
router.get("/breaths", async (req, res) => {
  const starBridge = await loadStarBridge();
  if (!starBridge) {
    return res.status(503).json({ error: "Star Bridge Lungs not available" });
  }
  try {
    const status = starBridge.status();
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
router.post("/breathe", async (req, res) => {
  const starBridge = await loadStarBridge();
  if (!starBridge) {
    return res.status(503).json({ error: "Star Bridge Lungs not available" });
  }
  try {
    // Import required systems for context (optional - can be null)
    let NeuralMesh: any = null;
    let QuantumAnticipation: any = null;
    let SlugTimeMemory: any = null;
    
    try {
      const neuralMeshModule = await import("../../packages/neural-mesh");
      NeuralMesh = neuralMeshModule.NeuralMesh;
    } catch {}
    
    try {
      const qalModule = await import("../../packages/quantum-anticipation");
      QuantumAnticipation = qalModule.QuantumAnticipation;
    } catch {}
    
    try {
      const stmModule = await import("../../packages/slug-time-memory");
      SlugTimeMemory = stmModule.SlugTimeMemory;
    } catch {}
    
    const status = starBridge.run({
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


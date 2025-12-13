/**
 * Snapshot API
 * 
 * Routes for generating and retrieving vertex_fusion_snapshot
 */

import { Router, Request, Response } from "express";
import { generateSnapshot } from "../services/SnapshotGenerator";
import { getLatestOutput } from "../services/AgentOutputStore";

const router = Router();

/**
 * POST /api/snapshot/generate
 * Generate a new vertex_fusion_snapshot
 */
router.post("/generate", async (_req: Request, res: Response) => {
  try {
    const snapshot = await generateSnapshot();
    
    res.json({
      ok: true,
      snapshot,
      message: "Snapshot generated successfully",
    });
  } catch (error: any) {
    console.error("[Snapshot API] Error generating snapshot:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Failed to generate snapshot",
    });
  }
});

/**
 * GET /api/snapshot
 * Get the latest vertex_fusion_snapshot
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const output = await getLatestOutput(1, "vertex_fusion_snapshot");
    
    if (!output) {
      return res.status(404).json({
        ok: false,
        error: "No snapshot found. Generate one first with POST /api/snapshot/generate",
      });
    }
    
    res.json({
      ok: true,
      snapshot: output.data,
      metadata: {
        createdAt: output.createdAt,
        version: output.version,
      },
    });
  } catch (error: any) {
    console.error("[Snapshot API] Error retrieving snapshot:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Failed to retrieve snapshot",
    });
  }
});

export default router;


/**
 * Threat Memory API Routes
 * 
 * Threat pattern management
 */

import { Router, Request, Response } from "express";
import DreamMemory from "../../packages/dreamops-constellation/DreamMemory/index.js";
import ThreatMemory from "../../packages/dreamops-constellation/DreamMemory/threatMemory.js";

const router = Router();

let dreamMemory: DreamMemory | null = null;
let threatMemory: ThreatMemory | null = null;

function initialize() {
  if (!dreamMemory) {
    dreamMemory = new DreamMemory();
    threatMemory = new ThreatMemory(dreamMemory);
  }
}

router.use((_req, _res, next) => {
  initialize();
  next();
});

/**
 * POST /api/threat-memory/signature
 * Store threat signature
 */
router.post("/signature", async (req: Request, res: Response) => {
  try {
    const { pattern, metrics, embedding } = req.body;
    
    const signature = await threatMemory!.storeThreatSignature({
      pattern,
      metrics,
      embedding,
    });
    
    res.json({ ok: true, signature });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/threat-memory/response
 * Record threat response
 */
router.post("/response", async (req: Request, res: Response) => {
  try {
    const { threatId, responseStage, actions, success, responseTime } = req.body;
    
    await threatMemory!.recordThreatResponse({
      threatId,
      responseStage,
      actions,
      success,
      responseTime,
      resolvedAt: new Date().toISOString(),
    });
    
    res.json({ ok: true, message: "Response recorded" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/threat-memory/effectiveness/:threatId
 * Get response effectiveness for a threat
 */
router.get("/effectiveness/:threatId", async (req: Request, res: Response) => {
  try {
    const { threatId } = req.params;
    
    const effectiveness = await threatMemory!.getResponseEffectiveness(threatId);
    res.json({ ok: true, effectiveness });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/threat-memory/false-positive
 * Record false positive
 */
router.post("/false-positive", async (req: Request, res: Response) => {
  try {
    const { threatId, reason } = req.body;
    
    const record = await threatMemory!.recordFalsePositive(threatId, reason);
    res.json({ ok: true, record });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/threat-memory/false-negative
 * Record false negative
 */
router.post("/false-negative", async (req: Request, res: Response) => {
  try {
    const { threatId, impact } = req.body;
    
    const record = await threatMemory!.recordFalseNegative(threatId, impact);
    res.json({ ok: true, record });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/threat-memory/signatures
 * Get all threat signatures
 */
router.get("/signatures", async (req: Request, res: Response) => {
  try {
    const signatures = threatMemory!.getAllThreatSignatures();
    res.json({ ok: true, signatures });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/threat-memory/stats
 * Get false positive/negative statistics
 */
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const stats = threatMemory!.getFalsePositiveNegativeStats();
    res.json({ ok: true, stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


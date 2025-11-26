/**
 * Admin Dashboard API Routes
 * Backing APIs for the DreamNet Admin Dashboard
 */

import { Router } from "express";
import { getControlCore } from "../control-core/ControlCore.js";
import type { Request, Response } from "express";

const router = Router();

/**
 * GET /api/admin/overview
 * Returns high-level snapshot including identity, values, destiny alignment
 */
router.get("/overview", async (req: Request, res: Response) => {
  try {
    const controlCore = getControlCore();
    const snapshot = await controlCore.getOverviewSnapshot();
    res.json(snapshot);
  } catch (error: any) {
    console.error("Failed to get overview snapshot:", error);
    res.status(500).json({ 
      error: "Failed to get overview snapshot", 
      message: error.message 
    });
  }
});

/**
 * GET /api/admin/consciousness
 * Returns consciousness and decision data
 */
router.get("/consciousness", async (req: Request, res: Response) => {
  try {
    const controlCore = getControlCore();
    const snapshot = await controlCore.getConsciousnessSnapshot();
    res.json(snapshot);
  } catch (error: any) {
    console.error("Failed to get consciousness snapshot:", error);
    res.status(500).json({ 
      error: "Failed to get consciousness snapshot", 
      message: error.message 
    });
  }
});

/**
 * GET /api/admin/governance/laws
 * Returns Divine Laws and Core Values
 */
router.get("/governance/laws", async (req: Request, res: Response) => {
  try {
    const controlCore = getControlCore();
    const snapshot = await controlCore.getGovernanceSnapshot();
    res.json({
      divineLaws: snapshot.divineLaws,
      coreValues: snapshot.coreValues,
      constraints: snapshot.constraints,
      rights: snapshot.rights,
      balanceRules: snapshot.balanceRules,
    });
  } catch (error: any) {
    console.error("Failed to get governance snapshot:", error);
    res.status(500).json({ 
      error: "Failed to get governance snapshot", 
      message: error.message 
    });
  }
});

/**
 * POST /api/admin/evaluate-action
 * Evaluate a hypothetical action against Divine Laws (read-only evaluation)
 */
router.post("/evaluate-action", async (req: Request, res: Response) => {
  try {
    const controlCore = getControlCore();
    const actionCandidate = req.body;
    
    if (!actionCandidate.type || !actionCandidate.description) {
      return res.status(400).json({ 
        error: "Invalid action candidate", 
        message: "Action must have 'type' and 'description' fields" 
      });
    }
    
    const evaluation = controlCore.evaluateActionAgainstLaws(actionCandidate);
    res.json(evaluation);
  } catch (error: any) {
    console.error("Failed to evaluate action:", error);
    res.status(500).json({ 
      error: "Failed to evaluate action", 
      message: error.message 
    });
  }
});

/**
 * POST /api/admin/classify-event
 * Classify an event as REFLEX or REASON
 */
router.post("/classify-event", async (req: Request, res: Response) => {
  try {
    const controlCore = getControlCore();
    const eventCandidate = req.body;
    
    if (!eventCandidate.type) {
      return res.status(400).json({ 
        error: "Invalid event candidate", 
        message: "Event must have 'type' field" 
      });
    }
    
    // Add timestamp if not provided
    if (!eventCandidate.timestamp) {
      eventCandidate.timestamp = new Date();
    }
    
    const pathway = controlCore.classifyEventPath(eventCandidate);
    res.json({ pathway, event: eventCandidate });
  } catch (error: any) {
    console.error("Failed to classify event:", error);
    res.status(500).json({ 
      error: "Failed to classify event", 
      message: error.message 
    });
  }
});

export default router;

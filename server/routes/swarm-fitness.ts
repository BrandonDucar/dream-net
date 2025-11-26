/**
 * Swarm Fitness API Routes
 * 
 * Fitness metrics and agent performance
 */

import { Router, Request, Response } from "express";
import DreamMemory from "../../packages/dreamops-constellation/DreamMemory/index.js";
import FitnessEvaluator from "../../packages/dreamops-constellation/fitnessEvaluator.js";
import ClonalSelection from "../../packages/dreamops-constellation/selection.js";

const router = Router();

let dreamMemory: DreamMemory | null = null;
let fitnessEvaluator: FitnessEvaluator | null = null;
let clonalSelection: ClonalSelection | null = null;

function initialize() {
  if (!dreamMemory) {
    dreamMemory = new DreamMemory();
    fitnessEvaluator = new FitnessEvaluator(dreamMemory);
    clonalSelection = new ClonalSelection(fitnessEvaluator);
  }
}

router.use((_req, _res, next) => {
  initialize();
  next();
});

/**
 * GET /api/swarm-fitness
 * Get system-wide fitness
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const fitness = await fitnessEvaluator!.evaluateSystemFitness();
    res.json({ ok: true, fitness });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/swarm-fitness/agents
 * Get all agent fitness records
 */
router.get("/agents", async (req: Request, res: Response) => {
  try {
    const agents = fitnessEvaluator!.getAllAgentFitness();
    res.json({ ok: true, agents });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/swarm-fitness/agents/top
 * Get top performing agents
 */
router.get("/agents/top", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const topAgents = fitnessEvaluator!.getTopAgents(limit);
    res.json({ ok: true, agents: topAgents });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/swarm-fitness/agents/:agentId
 * Get fitness for specific agent
 */
router.get("/agents/:agentId", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const fitness = fitnessEvaluator!.getAgentFitness(agentId);
    
    if (!fitness) {
      return res.status(404).json({ error: "Agent fitness not found" });
    }
    
    res.json({ ok: true, fitness });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/swarm-fitness/agents/:agentId
 * Evaluate agent fitness
 */
router.post("/agents/:agentId", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { agentName, metrics } = req.body;
    
    const fitness = await fitnessEvaluator!.evaluateAgentFitness(agentId, agentName, metrics);
    res.json({ ok: true, fitness });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/swarm-fitness/behaviors
 * Get all agent behaviors
 */
router.get("/behaviors", async (req: Request, res: Response) => {
  try {
    const behaviors = clonalSelection!.getAllBehaviors();
    res.json({ ok: true, behaviors });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/swarm-fitness/behaviors/:agentId
 * Get behaviors for an agent
 */
router.get("/behaviors/:agentId", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const behaviors = clonalSelection!.getBehaviorsForAgent(agentId);
    res.json({ ok: true, behaviors });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/swarm-fitness/behaviors/:agentId/best
 * Get best behavior for an agent
 */
router.get("/behaviors/:agentId/best", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const behavior = clonalSelection!.getBestBehavior(agentId);
    
    if (!behavior) {
      return res.status(404).json({ error: "No behavior found for agent" });
    }
    
    res.json({ ok: true, behavior });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


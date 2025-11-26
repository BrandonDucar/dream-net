/**
 * Immune Swarm API Routes
 * 
 * Main API for immune swarm system
 */

import { Router, Request, Response } from "express";
import DreamMemory from "../../packages/dreamops-constellation/DreamMemory/index.js";
import SelfBaseline from "../../packages/dreamops-constellation/BrainHub/selfBaseline.js";
import NonSelfDetector from "../../packages/dreamops-constellation/BrainHub/nonSelfDetector.js";
import DetectorGenerator from "../../packages/dreamops-constellation/BrainHub/detectorGenerator.js";
import StagedResponseSystem from "../../packages/dreamops-constellation/DeployKeeper/stagedResponse.js";
import ResponseRouter from "../../packages/dreamops-constellation/DeployKeeper/responseRouter.js";
import QuarantineSystem from "../../packages/dreamops-constellation/DeployKeeper/quarantine.js";
import ThreatMemory from "../../packages/dreamops-constellation/DreamMemory/threatMemory.js";
import ThreatRecognizer from "../../packages/dreamops-constellation/BrainHub/threatRecognizer.js";
import SwarmEnvironment from "../../packages/dreamops-constellation/swarmEnvironment.js";
import SwarmRules from "../../packages/dreamops-constellation/swarmRules.js";
import FitnessEvaluator from "../../packages/dreamops-constellation/fitnessEvaluator.js";
import ClonalSelection from "../../packages/dreamops-constellation/selection.js";

const router = Router();

// Initialize systems (singleton pattern)
let dreamMemory: DreamMemory | null = null;
let selfBaseline: SelfBaseline | null = null;
let nonSelfDetector: NonSelfDetector | null = null;
let detectorGenerator: DetectorGenerator | null = null;
let stagedResponseSystem: StagedResponseSystem | null = null;
let responseRouter: ResponseRouter | null = null;
let quarantineSystem: QuarantineSystem | null = null;
let threatMemory: ThreatMemory | null = null;
let threatRecognizer: ThreatRecognizer | null = null;
let swarmEnvironment: SwarmEnvironment | null = null;
let swarmRules: SwarmRules | null = null;
let fitnessEvaluator: FitnessEvaluator | null = null;
let clonalSelection: ClonalSelection | null = null;

function initializeSystems() {
  if (!dreamMemory) {
    dreamMemory = new DreamMemory();
    selfBaseline = new SelfBaseline(dreamMemory);
    nonSelfDetector = new NonSelfDetector(selfBaseline);
    detectorGenerator = new DetectorGenerator(selfBaseline);
    stagedResponseSystem = new StagedResponseSystem();
    responseRouter = new ResponseRouter(stagedResponseSystem);
    quarantineSystem = new QuarantineSystem(dreamMemory);
    threatMemory = new ThreatMemory(dreamMemory);
    threatRecognizer = new ThreatRecognizer(threatMemory);
    swarmEnvironment = new SwarmEnvironment(dreamMemory);
    swarmRules = new SwarmRules(swarmEnvironment);
    fitnessEvaluator = new FitnessEvaluator(dreamMemory);
    clonalSelection = new ClonalSelection(fitnessEvaluator);
  }
}

// Initialize on first request
router.use((_req, _res, next) => {
  initializeSystems();
  next();
});

/**
 * POST /api/immune-swarm/detect
 * Detect anomalies
 */
router.post("/detect", async (req: Request, res: Response) => {
  try {
    const { metrics } = req.body;
    if (!metrics || !Array.isArray(metrics)) {
      return res.status(400).json({ error: "metrics array is required" });
    }

    const detections = await nonSelfDetector!.detectAnomalies(metrics);
    res.json({ ok: true, detections });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/immune-swarm/respond
 * Create and execute staged response
 */
router.post("/respond", async (req: Request, res: Response) => {
  try {
    const { anomalyId, severity, confidence, blastRadius, affectedServices } = req.body;
    
    const routing = await responseRouter!.routeAnomaly(
      { id: anomalyId, severity, confidence, deviation: 0, metric: "", category: "service_health", currentValue: 0, baselineValue: 0, timestamp: new Date().toISOString() },
      affectedServices || []
    );

    const response = stagedResponseSystem!.getResponse(routing.responseId);
    if (response) {
      await stagedResponseSystem!.executeResponse(routing.responseId);
    }

    res.json({ ok: true, routing, response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/immune-swarm/quarantine
 * Quarantine a service
 */
router.post("/quarantine", async (req: Request, res: Response) => {
  try {
    const { service, reason, anomalyId } = req.body;
    
    const quarantine = await quarantineSystem!.quarantine(service, reason, anomalyId);
    res.json({ ok: true, quarantine });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/immune-swarm/release
 * Release a service from quarantine
 */
router.post("/release", async (req: Request, res: Response) => {
  try {
    const { service, verified } = req.body;
    
    const released = await quarantineSystem!.release(service, verified);
    res.json({ ok: true, released });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/immune-swarm/threat/recognize
 * Recognize threat from anomaly
 */
router.post("/threat/recognize", async (req: Request, res: Response) => {
  try {
    const { anomaly, additionalMetrics } = req.body;
    
    const match = await threatRecognizer!.recognizeThreat(anomaly, additionalMetrics);
    res.json({ ok: true, match });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/immune-swarm/environment/marker
 * Place environment marker
 */
router.post("/environment/marker", async (req: Request, res: Response) => {
  try {
    const { type, location, value, strength, ttl } = req.body;
    
    const marker = await swarmEnvironment!.placeMarker(type, location, value, strength, ttl);
    res.json({ ok: true, marker });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/immune-swarm/environment/markers
 * Read markers at location
 */
router.get("/environment/markers", async (req: Request, res: Response) => {
  try {
    const { location, type } = req.query;
    
    const markers = await swarmEnvironment!.readMarkers(location as string, type as any);
    res.json({ ok: true, markers });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/immune-swarm/rules/evaluate
 * Evaluate rules for an agent
 */
router.post("/rules/evaluate", async (req: Request, res: Response) => {
  try {
    const { agent, context } = req.body;
    
    await swarmRules!.evaluateRules(agent, context);
    res.json({ ok: true, message: "Rules evaluated" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/immune-swarm/fitness
 * Get system fitness
 */
router.get("/fitness", async (req: Request, res: Response) => {
  try {
    const fitness = await fitnessEvaluator!.evaluateSystemFitness();
    res.json({ ok: true, fitness });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/immune-swarm/fitness/agent
 * Evaluate agent fitness
 */
router.post("/fitness/agent", async (req: Request, res: Response) => {
  try {
    const { agentId, agentName, metrics } = req.body;
    
    const fitness = await fitnessEvaluator!.evaluateAgentFitness(agentId, agentName, metrics);
    res.json({ ok: true, fitness });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/immune-swarm/selection/perform
 * Perform clonal selection
 */
router.post("/selection/perform", async (req: Request, res: Response) => {
  try {
    await clonalSelection!.performSelection();
    res.json({ ok: true, message: "Selection performed" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/immune-swarm/status
 * Get overall system status
 */
router.get("/status", async (req: Request, res: Response) => {
  try {
    const fitness = await fitnessEvaluator!.evaluateSystemFitness();
    const activeQuarantines = quarantineSystem!.getActiveQuarantines();
    const markers = swarmEnvironment!.getAllMarkers();
    
    res.json({
      ok: true,
      fitness: fitness.overall,
      activeQuarantines: activeQuarantines.length,
      environmentMarkers: markers.length,
      trends: fitness.trends,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


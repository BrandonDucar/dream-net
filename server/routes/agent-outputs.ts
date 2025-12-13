/**
 * Agent Outputs API
 * 
 * Routes for storing and retrieving outputs from Vertex AI agents (1-8)
 */

import { Router, Request, Response } from "express";
import {
  storeOutput,
  getLatestOutput,
  getAgentOutputs,
  getAllLatestOutputs,
  getOutputHistory,
  type AgentOutputType,
} from "../services/AgentOutputStore";

const router = Router();

/**
 * POST /api/agent-outputs/:agentId/:outputType
 * Store an agent output
 */
router.post("/:agentId/:outputType", async (req: Request, res: Response) => {
  try {
    const agentId = parseInt(req.params.agentId, 10);
    const outputType = req.params.outputType as AgentOutputType;

    if (isNaN(agentId) || agentId < 1 || agentId > 8) {
      return res.status(400).json({
        ok: false,
        error: "Invalid agent ID. Must be 1-8",
      });
    }

    if (!req.body || !req.body.data) {
      return res.status(400).json({
        ok: false,
        error: "Missing 'data' field in request body",
      });
    }

    const output = await storeOutput(agentId, outputType, req.body.data, req.body.metadata);

    res.json({
      ok: true,
      output,
    });
  } catch (error: any) {
    console.error("[Agent Outputs API] Error storing output:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Failed to store output",
    });
  }
});

/**
 * GET /api/agent-outputs/:agentId/:outputType
 * Get latest output for an agent and output type
 */
router.get("/:agentId/:outputType", async (req: Request, res: Response) => {
  try {
    const agentId = parseInt(req.params.agentId, 10);
    const outputType = req.params.outputType as AgentOutputType;

    if (isNaN(agentId) || agentId < 1 || agentId > 8) {
      return res.status(400).json({
        ok: false,
        error: "Invalid agent ID. Must be 1-8",
      });
    }

    const output = await getLatestOutput(agentId, outputType);

    if (!output) {
      return res.status(404).json({
        ok: false,
        error: "Output not found",
      });
    }

    res.json({
      ok: true,
      output,
    });
  } catch (error: any) {
    console.error("[Agent Outputs API] Error retrieving output:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Failed to retrieve output",
    });
  }
});

/**
 * GET /api/agent-outputs/:agentId
 * Get all latest outputs for an agent
 */
router.get("/:agentId", async (req: Request, res: Response) => {
  try {
    const agentId = parseInt(req.params.agentId, 10);

    if (isNaN(agentId) || agentId < 1 || agentId > 8) {
      return res.status(400).json({
        ok: false,
        error: "Invalid agent ID. Must be 1-8",
      });
    }

    const outputs = await getAgentOutputs(agentId);

    res.json({
      ok: true,
      agentId,
      outputs,
      count: outputs.length,
    });
  } catch (error: any) {
    console.error("[Agent Outputs API] Error retrieving agent outputs:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Failed to retrieve outputs",
    });
  }
});

/**
 * GET /api/agent-outputs
 * Get all latest outputs across all agents
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const allOutputs = await getAllLatestOutputs();

    res.json({
      ok: true,
      outputs: allOutputs,
      agents: Object.keys(allOutputs),
    });
  } catch (error: any) {
    console.error("[Agent Outputs API] Error retrieving all outputs:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Failed to retrieve outputs",
    });
  }
});

/**
 * GET /api/agent-outputs/:agentId/:outputType/history
 * Get history of outputs for an agent and output type
 */
router.get("/:agentId/:outputType/history", async (req: Request, res: Response) => {
  try {
    const agentId = parseInt(req.params.agentId, 10);
    const outputType = req.params.outputType as AgentOutputType;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    if (isNaN(agentId) || agentId < 1 || agentId > 8) {
      return res.status(400).json({
        ok: false,
        error: "Invalid agent ID. Must be 1-8",
      });
    }

    const history = await getOutputHistory(agentId, outputType, limit);

    res.json({
      ok: true,
      agentId,
      outputType,
      history,
      count: history.length,
    });
  } catch (error: any) {
    console.error("[Agent Outputs API] Error retrieving history:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Failed to retrieve history",
    });
  }
});

export default router;


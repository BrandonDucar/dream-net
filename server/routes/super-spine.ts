import { Router } from "express";
import { superSpine } from "../core/SuperSpine";
import type { AgentCapability } from "../core/SuperSpine";

export function createSuperSpineRouter(): Router {
  const router = Router();

  // Middleware to get user ID
  const getUserId = (req: any) =>
    (req.headers["x-user-id"] as string) ||
    (req.query.userId as string) ||
    undefined;

  // GET /api/super-spine/agents - Get all agents
  router.get("/super-spine/agents", async (req, res) => {
    try {
      const { capability, available } = req.query;
      let agents = superSpine.getAllAgents();

      if (capability) {
        agents = superSpine.getAvailableAgents(capability as AgentCapability);
      } else if (available === "true") {
        agents = superSpine.getAvailableAgents();
      }

      res.json({ ok: true, agents });
    } catch (error) {
      console.error("Failed to get agents:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/super-spine/agent/:key - Get specific agent
  router.get("/super-spine/agent/:key", async (req, res) => {
    try {
      const agent = superSpine.getAgent(req.params.key);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }

      // Get stats
      const stats = superSpine.getAgentStats(req.params.key);

      res.json({ ok: true, agent, stats });
    } catch (error) {
      console.error("Failed to get agent:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/super-spine/agent/:key/access - Check user access to agent
  router.get("/super-spine/agent/:key/access", async (req, res) => {
    try {
      const userId = getUserId(req);
      const { trustScore, completedDreams, stakedSheep, hasTokenBoost } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }

      const access = superSpine.checkAgentAccess(
        req.params.key,
        userId,
        parseInt(String(trustScore || 0), 10),
        parseInt(String(completedDreams || 0), 10),
        parseInt(String(stakedSheep || 0), 10),
        hasTokenBoost === "true",
      );

      res.json({ ok: true, ...access });
    } catch (error) {
      console.error("Failed to check access:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/super-spine/subscription - Create agent subscription
  router.post("/super-spine/subscription", async (req, res) => {
    try {
      const { agentKey, period } = req.body;
      const userId = getUserId(req);

      if (!userId || !agentKey) {
        return res.status(400).json({ error: "userId and agentKey are required" });
      }

      const subscription = superSpine.createSubscription(userId, agentKey, period);
      if (!subscription) {
        return res.status(400).json({ error: "Failed to create subscription" });
      }

      res.json({ ok: true, subscription });
    } catch (error) {
      console.error("Failed to create subscription:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/super-spine/subscription/:agentKey - Get user's subscription for agent
  router.get("/super-spine/subscription/:agentKey", async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }

      const subscription = superSpine.getUserSubscription(userId, req.params.agentKey);
      res.json({ ok: true, subscription: subscription || null });
    } catch (error) {
      console.error("Failed to get subscription:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/super-spine/task - Submit task to agent
  router.post("/super-spine/task", async (req, res) => {
    try {
      const { agentKey, type, input } = req.body;
      const userId = getUserId(req);

      if (!agentKey || !type) {
        return res.status(400).json({ error: "agentKey and type are required" });
      }

      // Check access
      const { trustScore, completedDreams, stakedSheep, hasTokenBoost } = req.body;
      const access = superSpine.checkAgentAccess(
        agentKey,
        userId || "anonymous",
        parseInt(String(trustScore || 0), 10),
        parseInt(String(completedDreams || 0), 10),
        parseInt(String(stakedSheep || 0), 10),
        hasTokenBoost === "true",
      );

      if (!access.hasAccess) {
        return res.status(403).json({ error: access.reason || "Access denied" });
      }

      const task = superSpine.submitTask(agentKey, type, input || {}, userId);
      res.json({ ok: true, task });
    } catch (error) {
      console.error("Failed to submit task:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/super-spine/tasks - Get user's tasks
  router.get("/super-spine/tasks", async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }

      const tasks = superSpine.getUserTasks(userId);
      res.json({ ok: true, tasks });
    } catch (error) {
      console.error("Failed to get tasks:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/super-spine/task/:id - Get specific task
  router.get("/super-spine/task/:id", async (req, res) => {
    try {
      const task = superSpine.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json({ ok: true, task });
    } catch (error) {
      console.error("Failed to get task:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}


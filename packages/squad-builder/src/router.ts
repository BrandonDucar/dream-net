import { Router } from "express";
import {
  getAgents,
  registerAgent,
  getSquads,
  getSquadById,
  createSquad,
  updateSquad,
} from "./registry";
import { createTask, getTasks, getTaskById, updateTaskStatus, dispatchTask } from "./orchestrator";

export function createSquadRouter(): Router {
  const router = Router();

  router.get("/squad/agents", (_req, res) => {
    const agents = getAgents();
    res.json({ ok: true, agents });
  });

  router.post("/squad/agents", (req, res) => {
    try {
      const agent = registerAgent(req.body);
      res.json({ ok: true, agent });
    } catch (error) {
      res.status(400).json({ ok: false, error: (error as Error).message });
    }
  });

  router.get("/squad", (_req, res) => {
    const squads = getSquads();
    res.json({ ok: true, squads });
  });

  router.get("/squad/:id", (req, res) => {
    const squad = getSquadById(req.params.id);
    if (!squad) {
      res.status(404).json({ ok: false, error: "Squad not found" });
      return;
    }
    res.json({ ok: true, squad });
  });

  router.post("/squad", (req, res) => {
    try {
      const squad = createSquad(req.body);
      res.json({ ok: true, squad });
    } catch (error) {
      res.status(400).json({ ok: false, error: (error as Error).message });
    }
  });

  router.get("/squad/tasks", (req, res) => {
    const squadId = req.query.squadId as string | undefined;
    const tasks = getTasks(squadId);
    res.json({ ok: true, tasks });
  });

  router.post("/squad/tasks", (req, res) => {
    try {
      const task = createTask(req.body);
      res.json({ ok: true, task });
    } catch (error) {
      res.status(400).json({ ok: false, error: (error as Error).message });
    }
  });

  router.get("/squad/tasks/:id", (req, res) => {
    const task = getTaskById(req.params.id);
    if (!task) {
      res.status(404).json({ ok: false, error: "Task not found" });
      return;
    }
    res.json({ ok: true, task });
  });

  router.post("/squad/tasks/:id/dispatch", async (req, res) => {
    const result = await dispatchTask(req.params.id);
    if (!result.success) {
      res.status(400).json({ ok: false, error: result.error });
      return;
    }
    res.json({ ok: true, agentId: result.agentId });
  });

  return router;
}


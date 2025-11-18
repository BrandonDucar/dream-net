import { Router } from "express";
import { submitGraft, getGrafts } from "@dreamnet/graft-engine";
import { getSquads, getAgents } from "@dreamnet/squad-builder";
import { getTasks, createTask } from "@dreamnet/squad-builder";
import { listWormholes, createWormhole } from "@dreamnet/event-wormholes";
import { getRecentEvents } from "@dreamnet/event-wormholes";
import { listSpores, createSpore } from "@dreamnet/spore-engine";
import { listFabricTasks } from "@dreamnet/dark-fabric";
import { fetchEvents } from "../starbridge/repository";

export function createOperatorRouter(): Router {
  const router = Router();

  router.get("/events/recent", async (req, res) => {
    const limit = parseInt(String(req.query.limit ?? "50"), 10) || 50;
    // Combine Starbridge events and Event Wormhole events
    const starbridgeEvents = await fetchEvents({ limit: Math.floor(limit / 2) });
    const wormholeEvents = getRecentEvents(Math.floor(limit / 2));
    res.json({ ok: true, events: [...starbridgeEvents, ...wormholeEvents] });
  });

  router.get("/graft", async (_req, res) => {
    const grafts = await getGrafts();
    res.json({ ok: true, grafts });
  });

  router.get("/wormholes", (_req, res) => {
    const wormholes = listWormholes();
    res.json({ ok: true, wormholes });
  });

  router.get("/squad", (_req, res) => {
    const squads = getSquads();
    res.json({ ok: true, squads });
  });

  router.get("/squad/agents", (_req, res) => {
    const agents = getAgents();
    res.json({ ok: true, agents });
  });

  router.get("/squad/tasks", (_req, res) => {
    const tasks = getTasks();
    res.json({ ok: true, tasks });
  });

  router.get("/spores", (_req, res) => {
    const spores = listSpores();
    res.json({ ok: true, spores });
  });

  router.get("/fabric/tasks", (_req, res) => {
    const tasks = listFabricTasks();
    res.json({ ok: true, tasks });
  });

  router.post("/operator/actions/new-agent-template", (_req, res) => {
    const task = createTask({
      type: "agent.create.template",
      status: "suggested",
      payload: { roleHint: "Custom", capabilitiesHint: [] },
    });
    res.json({ ok: true, taskId: task.id });
  });

  router.post("/operator/actions/new-endpoint-stub", async (_req, res) => {
    const name = `endpoint-${Date.now()}`;
    const graft = await submitGraft({
      type: "endpoint",
      name,
      path: `/api/grafted/${name}`,
      metadata: {
        response: { ok: true, message: `Hello from ${name}` },
      },
    });
    res.json({ ok: true, graftId: graft.id });
  });

  router.post("/operator/actions/new-prompt-spore", (req, res) => {
    try {
      const spore = createSpore({
        name: req.body.name || "New Prompt Spore",
        description: req.body.description,
        type: "prompt",
        status: "draft",
        content: req.body.content || "You are a helpful AI assistant.",
        metadata: {
          tags: req.body.tags || ["prompt", "template"],
          version: "1.0.0",
        },
      });
      res.json({ ok: true, sporeId: spore.id });
    } catch (error) {
      res.status(400).json({ ok: false, error: (error as Error).message });
    }
  });

  router.post("/operator/actions/new-wormhole", (req, res) => {
    try {
      const wormhole = createWormhole({
        name: req.body.name || "API failure → DeployKeeper",
        from: req.body.from || { sourceType: "api", eventType: "api.endpoint.failed" },
        to: req.body.to || { actionType: "create-task", targetAgentRole: "DeployKeeper" },
        filters: req.body.filters || { minSeverity: "error" },
        enabled: true,
      });
      res.json({ ok: true, wormholeId: wormhole.id });
    } catch (error) {
      res.status(400).json({ ok: false, error: (error as Error).message });
    }
  });

  return router;
}


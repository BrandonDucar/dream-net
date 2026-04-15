import { Router } from "express";
import { submitGraft, getGrafts } from "../../packages/graft-engine";
// import { getSquads, getAgents } from "../../packages/squad-builder"; // Temporarily disabled
// import { getTasks, createTask } from "../../packages/squad-builder"; // Temporarily disabled
// import { listWormholes, createWormhole } from "../../packages/event-wormholes"; // Temporarily disabled
// import { getRecentEvents } from "../../packages/event-wormholes"; // Temporarily disabled
// import { listSpores, createSpore } from "../../packages/spore-engine"; // Temporarily disabled
// import { listFabricTasks } from "../../packages/dark-fabric"; // Temporarily disabled
import { fetchEvents } from "../starbridge/repository";

export function createOperatorRouter(): Router {
  const router = Router();

  router.get("/events/recent", async (req, res) => {
    const limit = parseInt(String(req.query.limit ?? "50"), 10) || 50;
    // Combine Starbridge events (Event Wormhole events disabled for simplified startup)
    const starbridgeEvents = await fetchEvents({ limit });
    res.json({ ok: true, events: starbridgeEvents });
  });

  router.get("/graft", async (_req, res) => {
    const grafts = await getGrafts();
    res.json({ ok: true, grafts });
  });

  router.get("/wormholes", (_req, res) => {
    res.json({ ok: true, wormholes: [], note: "Event wormholes disabled for simplified startup" });
  });

  router.get("/squad", (_req, res) => {
    res.json({ ok: true, squads: [], note: "Squad builder disabled for simplified startup" });
  });

  router.get("/squad/agents", (_req, res) => {
    res.json({ ok: true, agents: [], note: "Squad builder disabled for simplified startup" });
  });

  router.get("/squad/tasks", (_req, res) => {
    res.json({ ok: true, tasks: [], note: "Squad builder disabled for simplified startup" });
  });

  router.get("/spores", (_req, res) => {
    res.json({ ok: true, spores: [], note: "Spore engine disabled for simplified startup" });
  });

  router.get("/fabric/tasks", (_req, res) => {
    res.json({ ok: true, tasks: [], note: "Dark fabric disabled for simplified startup" });
  });

  router.post("/operator/actions/new-agent-template", (_req, res) => {
    res.status(503).json({ ok: false, error: "Squad builder disabled for simplified startup" });
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
    res.status(503).json({ ok: false, error: "Spore engine disabled for simplified startup" });
  });

  router.post("/operator/actions/new-wormhole", (req, res) => {
    res.status(503).json({ ok: false, error: "Event wormholes disabled for simplified startup" });
  });

  return router;
}


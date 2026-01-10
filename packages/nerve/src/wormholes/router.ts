import { Router } from "express";
import { emitEvent, getRecentEvents, getEventById, markEventHandled } from'./eventBus.js';
import {
  listWormholes,
  getWormholeById,
  createWormhole,
  updateWormhole,
  deleteWormhole,
} from'./wormholeRegistry.js';

export function createEventRouter(): Router {
  const router = Router();

  router.get("/events/recent", (req, res) => {
    const limit = parseInt(String(req.query.limit ?? "50"), 10) || 50;
    const events = getRecentEvents(limit);
    res.json({ ok: true, events });
  });

  router.get("/events/:id", (req, res) => {
    const event = getEventById(req.params.id);
    if (!event) {
      res.status(404).json({ ok: false, error: "Event not found" });
      return;
    }
    res.json({ ok: true, event });
  });

  router.post("/events/emit", async (req, res) => {
    try {
      const event = await emitEvent(req.body);
      res.json({ ok: true, event });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  return router;
}

export function createWormholeRouter(): Router {
  const router = Router();

  router.get("/wormholes", (_req, res) => {
    const wormholes = listWormholes();
    res.json({ ok: true, wormholes });
  });

  router.get("/wormholes/:id", (req, res) => {
    const wormhole = getWormholeById(req.params.id);
    if (!wormhole) {
      res.status(404).json({ ok: false, error: "Wormhole not found" });
      return;
    }
    res.json({ ok: true, wormhole });
  });

  router.post("/wormholes", (req, res) => {
    try {
      const wormhole = createWormhole(req.body);
      res.json({ ok: true, wormhole });
    } catch (error) {
      res.status(400).json({ ok: false, error: (error as Error).message });
    }
  });

  router.put("/wormholes/:id", (req, res) => {
    const wormhole = updateWormhole(req.params.id, req.body);
    if (!wormhole) {
      res.status(404).json({ ok: false, error: "Wormhole not found" });
      return;
    }
    res.json({ ok: true, wormhole });
  });

  router.delete("/wormholes/:id", (req, res) => {
    const deleted = deleteWormhole(req.params.id);
    if (!deleted) {
      res.status(404).json({ ok: false, error: "Wormhole not found" });
      return;
    }
    res.json({ ok: true });
  });

  router.post("/wormholes/:id/enable", (req, res) => {
    const wormhole = updateWormhole(req.params.id, { enabled: true });
    if (!wormhole) {
      res.status(404).json({ ok: false, error: "Wormhole not found" });
      return;
    }
    res.json({ ok: true, wormhole });
  });

  router.post("/wormholes/:id/disable", (req, res) => {
    const wormhole = updateWormhole(req.params.id, { enabled: false });
    if (!wormhole) {
      res.status(404).json({ ok: false, error: "Wormhole not found" });
      return;
    }
    res.json({ ok: true, wormhole });
  });

  return router;
}


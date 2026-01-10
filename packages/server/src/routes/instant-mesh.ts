import { Router } from "express";
import { instantMesh } from "../mesh/InstantMesh";

export function createInstantMeshRouter(): Router {
  const router = Router();

  // GET /api/mesh/instant/status - Get instant mesh status
  router.get("/mesh/instant/status", async (req, res) => {
    try {
      const status = instantMesh.getStatus();
      res.json({ ok: true, status });
    } catch (error) {
      console.error("Failed to get instant mesh status:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/mesh/instant/emit - Emit instant event
  router.post("/mesh/instant/emit", async (req, res) => {
    try {
      const { source, target, type, payload } = req.body;
      if (!source || !type) {
        return res.status(400).json({ error: "source and type are required" });
      }

      const event = instantMesh.emit({
        source,
        target,
        type,
        payload: payload || {},
      });

      res.json({ ok: true, event });
    } catch (error) {
      console.error("Failed to emit event:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/mesh/instant/events - Get recent events
  router.get("/mesh/instant/events", async (req, res) => {
    try {
      const limit = parseInt(String(req.query.limit || 100), 10);
      const events = instantMesh.getRecentEvents(limit);
      res.json({ ok: true, events, count: events.length });
    } catch (error) {
      console.error("Failed to get events:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/mesh/hybrids/create - Create agent hybrid
  router.post("/mesh/hybrids/create", async (req, res) => {
    try {
      const { name, parentAgents, capabilities, traits } = req.body;
      if (!name || !parentAgents || !Array.isArray(parentAgents)) {
        return res.status(400).json({ error: "name and parentAgents array are required" });
      }

      const hybrid = instantMesh.createHybrid(
        name,
        parentAgents,
        capabilities || [],
        traits || []
      );

      res.json({ ok: true, hybrid });
    } catch (error) {
      console.error("Failed to create hybrid:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/mesh/hybrids/cross - Cross two agents
  router.post("/mesh/hybrids/cross", async (req, res) => {
    try {
      const { agent1, agent2, name } = req.body;
      if (!agent1 || !agent2) {
        return res.status(400).json({ error: "agent1 and agent2 are required" });
      }

      const hybrid = instantMesh.crossAgents(agent1, agent2, name);
      res.json({ ok: true, hybrid });
    } catch (error) {
      console.error("Failed to cross agents:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/mesh/hybrids/evolve - Evolve hybrid from another
  router.post("/mesh/hybrids/evolve", async (req, res) => {
    try {
      const { parentHybridId, name, newCapabilities, newTraits } = req.body;
      if (!parentHybridId || !name) {
        return res.status(400).json({ error: "parentHybridId and name are required" });
      }

      const hybrid = instantMesh.evolveHybrid(
        parentHybridId,
        name,
        newCapabilities || [],
        newTraits || []
      );

      if (!hybrid) {
        return res.status(404).json({ error: "Parent hybrid not found" });
      }

      res.json({ ok: true, hybrid });
    } catch (error) {
      console.error("Failed to evolve hybrid:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/mesh/hybrids - Get all hybrids
  router.get("/mesh/hybrids", async (req, res) => {
    try {
      const hybrids = instantMesh.getHybrids();
      res.json({ ok: true, hybrids, count: hybrids.length });
    } catch (error) {
      console.error("Failed to get hybrids:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}


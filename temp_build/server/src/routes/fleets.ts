import { Router } from "express";
import { fleetSystem, type FleetType } from "../fleets/FleetSystem";

export function createFleetsRouter(): Router {
  const router = Router();

  // GET /api/fleets - Get all fleets
  router.get("/fleets", async (req, res) => {
    try {
      const fleets = fleetSystem.getAllFleets();
      res.json({ ok: true, fleets });
    } catch (error) {
      console.error("Failed to get fleets:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/fleets/:type - Get specific fleet status
  router.get("/fleets/:type", async (req, res) => {
    try {
      const status = fleetSystem.getFleetStatus(req.params.type as FleetType);
      if (!status) {
        return res.status(404).json({ error: "Fleet not found" });
      }
      res.json({ ok: true, ...status });
    } catch (error) {
      console.error("Failed to get fleet status:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/fleets/:type/deploy - Deploy fleet on mission
  router.post("/fleets/:type/deploy", async (req, res) => {
    try {
      const { objective, target } = req.body;
      if (!objective) {
        return res.status(400).json({ error: "objective is required" });
      }

      const mission = fleetSystem.deployFleet(
        req.params.type as FleetType,
        objective,
        target
      );
      res.json({ ok: true, mission });
    } catch (error) {
      console.error("Failed to deploy fleet:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/fleets/missions/:id/complete - Complete mission
  router.post("/fleets/missions/:id/complete", async (req, res) => {
    try {
      const { results } = req.body;
      fleetSystem.completeMission(req.params.id, results);
      res.json({ ok: true });
    } catch (error) {
      console.error("Failed to complete mission:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/fleets/missions/active - Get active missions
  router.get("/fleets/missions/active", async (req, res) => {
    try {
      const missions = fleetSystem.getActiveMissions();
      res.json({ ok: true, missions });
    } catch (error) {
      console.error("Failed to get active missions:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}


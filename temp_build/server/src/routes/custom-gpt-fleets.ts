import { Router } from "express";
import { customGPTFleetSystem } from "../fleets/CustomGPTFleetSystem";

export function createCustomGPTFleetsRouter(): Router {
  const router = Router();

  // GET /api/custom-gpt-fleets - Get all fleets
  router.get("/custom-gpt-fleets", async (req, res) => {
    try {
      const fleets = customGPTFleetSystem.getAllFleets();
      res.json({ ok: true, fleets });
    } catch (error) {
      console.error("Failed to get custom GPT fleets:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/custom-gpt-fleets/:category - Get specific fleet
  router.get("/custom-gpt-fleets/:category", async (req, res) => {
    try {
      const fleet = customGPTFleetSystem.getFleet(req.params.category);
      if (!fleet) {
        return res.status(404).json({ error: "Fleet not found" });
      }
      res.json({ ok: true, fleet });
    } catch (error) {
      console.error("Failed to get fleet:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/custom-gpts - Get all GPTs
  router.get("/custom-gpts", async (req, res) => {
    try {
      const { category } = req.query;
      const gpts = category
        ? customGPTFleetSystem.getGPTsByCategory(category as string)
        : customGPTFleetSystem.getAllGPTs();
      res.json({ ok: true, gpts, count: gpts.length });
    } catch (error) {
      console.error("Failed to get GPTs:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/custom-gpt-fleets/:category/deploy - Deploy fleet
  router.post("/custom-gpt-fleets/:category/deploy", async (req, res) => {
    try {
      const { objective } = req.body;
      if (!objective) {
        return res.status(400).json({ error: "objective is required" });
      }

      const fleet = customGPTFleetSystem.deployFleet(req.params.category, objective);
      if (!fleet) {
        return res.status(404).json({ error: "Fleet not found" });
      }

      res.json({ ok: true, fleet });
    } catch (error) {
      console.error("Failed to deploy fleet:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/custom-gpt-fleets/stats - Get statistics
  router.get("/custom-gpt-fleets/stats", async (req, res) => {
    try {
      const stats = customGPTFleetSystem.getStatistics();
      res.json({ ok: true, stats });
    } catch (error) {
      console.error("Failed to get stats:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}


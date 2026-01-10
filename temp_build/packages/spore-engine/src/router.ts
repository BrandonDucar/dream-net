import { Router } from "express";
import {
  listSpores,
  getSporeById,
  createSpore,
  updateSpore,
  deleteSpore,
} from "./registry";
import { getSporeLineage, forkSpore, mergeSpore } from "./lineage";
import { deploySpore, revokeSpore, getSporeDistributions, getAgentSpores, getSquadSpores } from "./distribution";

export function createSporeRouter(): Router {
  const router = Router();

  router.get("/spores", (req, res) => {
    const filters = {
      type: req.query.type as any,
      status: req.query.status as any,
      tag: req.query.tag as string,
    };
    const spores = listSpores(filters);
    res.json({ ok: true, spores });
  });

  router.get("/spores/:id", (req, res) => {
    const spore = getSporeById(req.params.id);
    if (!spore) {
      res.status(404).json({ ok: false, error: "Spore not found" });
      return;
    }
    res.json({ ok: true, spore });
  });

  router.post("/spores", (req, res) => {
    try {
      const spore = createSpore(req.body);
      res.json({ ok: true, spore });
    } catch (error) {
      res.status(400).json({ ok: false, error: (error as Error).message });
    }
  });

  router.put("/spores/:id", (req, res) => {
    const spore = updateSpore(req.params.id, req.body);
    if (!spore) {
      res.status(404).json({ ok: false, error: "Spore not found" });
      return;
    }
    res.json({ ok: true, spore });
  });

  router.delete("/spores/:id", (req, res) => {
    const deleted = deleteSpore(req.params.id);
    if (!deleted) {
      res.status(404).json({ ok: false, error: "Spore not found" });
      return;
    }
    res.json({ ok: true });
  });

  router.get("/spores/:id/lineage", (req, res) => {
    const lineage = getSporeLineage(req.params.id);
    if (!lineage) {
      res.status(404).json({ ok: false, error: "Spore not found" });
      return;
    }
    res.json({ ok: true, lineage });
  });

  router.post("/spores/:id/fork", (req, res) => {
    const newName = req.body.name || `Fork of ${req.params.id}`;
    const branchId = req.body.branchId;
    const forked = forkSpore(req.params.id, newName, branchId);
    if (!forked) {
      res.status(404).json({ ok: false, error: "Spore not found" });
      return;
    }
    res.json({ ok: true, spore: forked });
  });

  router.post("/spores/:id/merge", (req, res) => {
    const sourceId = req.body.sourceId;
    if (!sourceId) {
      res.status(400).json({ ok: false, error: "sourceId is required" });
      return;
    }
    const merged = mergeSpore(sourceId, req.params.id);
    if (!merged) {
      res.status(404).json({ ok: false, error: "Spore not found" });
      return;
    }
    res.json({ ok: true, spore: merged });
  });

  router.post("/spores/:id/deploy", async (req, res) => {
    const target = {
      agentId: req.body.agentId,
      squadId: req.body.squadId,
      role: req.body.role,
    };
    const deployedBy = req.body.deployedBy;
    try {
      const distribution = await deploySpore(req.params.id, target, deployedBy);
      if (!distribution) {
        res.status(400).json({ ok: false, error: "Spore not found or not published" });
        return;
      }
      res.json({ ok: true, distribution });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  router.post("/spores/:id/revoke", (req, res) => {
    const target = {
      agentId: req.body.agentId,
      squadId: req.body.squadId,
      role: req.body.role,
    };
    const revoked = revokeSpore(req.params.id, target);
    if (!revoked) {
      res.status(404).json({ ok: false, error: "Distribution not found" });
      return;
    }
    res.json({ ok: true });
  });

  router.get("/spores/:id/distributions", (req, res) => {
    const distributions = getSporeDistributions(req.params.id);
    res.json({ ok: true, distributions });
  });

  router.get("/agents/:agentId/spores", (req, res) => {
    const distributions = getAgentSpores(req.params.agentId);
    res.json({ ok: true, distributions });
  });

  router.get("/squads/:squadId/spores", (req, res) => {
    const distributions = getSquadSpores(req.params.squadId);
    res.json({ ok: true, distributions });
  });

  return router;
}


import { Router } from "express";
import { getMemoryRecord, listMemoryRecords } from "@dreamnet/memory-dna";
import type { EntityType } from "@dreamnet/memory-dna";

const VALID_TYPES: EntityType[] = ["agent", "squad", "endpoint", "spore"];

export function createDnaRouter(): Router {
  const router = Router();

  router.get("/:entityType/:entityId", async (req, res) => {
    const entityType = req.params.entityType as EntityType;
    if (!VALID_TYPES.includes(entityType)) {
      res.status(400).json({ ok: false, error: "Invalid entityType" });
      return;
    }
    const record = await getMemoryRecord(entityType, req.params.entityId);
    if (!record) {
      res.status(404).json({ ok: false, error: "Record not found" });
      return;
    }
    res.json({ ok: true, record });
  });

  router.get("/:entityType", async (req, res) => {
    const entityType = req.params.entityType as EntityType;
    if (!VALID_TYPES.includes(entityType)) {
      res.status(400).json({ ok: false, error: "Invalid entityType" });
      return;
    }
    const records = await listMemoryRecords(entityType);
    res.json({ ok: true, records });
  });

  return router;
}



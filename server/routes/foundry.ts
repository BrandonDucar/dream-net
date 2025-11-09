import { Router } from "express";
import { z } from "zod";
import { StarbridgeSource, StarbridgeTopic, publishInternalEvent } from "../starbridge";
import { createHybrid, ingestTrait, listHybrids, listTraits } from "../foundry/service";

const router = Router();

const traitSchema = z.object({
  name: z.string().min(1),
  source: z.string().min(1),
  vector: z.array(z.number()).optional(),
  metadata: z.record(z.any()).optional(),
});

const hybridSchema = z.object({
  name: z.string().min(1),
  parents: z.array(z.string()).min(1),
  score: z.number().int().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

router.post("/ingest", async (req, res) => {
  const payload = traitSchema.parse(req.body);
  const record = await ingestTrait(payload);

  await publishInternalEvent({
    topic: StarbridgeTopic.System,
    source: StarbridgeSource.Runtime,
    type: "foundry.trait.ingested",
    payload: record,
  });

  res.json({
    ok: true,
    trait: record,
  });
});

router.post("/hybridize", async (req, res) => {
  const payload = hybridSchema.parse(req.body);
  const record = await createHybrid(payload);

  await publishInternalEvent({
    topic: StarbridgeTopic.System,
    source: StarbridgeSource.Runtime,
    type: "foundry.hybrid.proposed",
    payload: record,
  });

  res.json({
    ok: true,
    hybrid: record,
  });
});

router.get("/traits", async (req, res) => {
  const limit = Number.parseInt(String(req.query.limit ?? "20"), 10);
  const records = await listTraits(Number.isNaN(limit) ? 20 : limit);
  res.json({
    ok: true,
    traits: records,
  });
});

router.get("/hybrids", async (req, res) => {
  const limit = Number.parseInt(String(req.query.limit ?? "20"), 10);
  const records = await listHybrids(Number.isNaN(limit) ? 20 : limit);
  res.json({
    ok: true,
    hybrids: records,
  });
});

export default router;

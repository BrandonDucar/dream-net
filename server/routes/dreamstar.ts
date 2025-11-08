import { Router } from "express";
import { z } from "zod";
import { publishInternalEvent, StarbridgeSource, StarbridgeTopic } from "../starbridge";

const router = Router();

const influenceReferenceSchema = z.object({
  title: z.string().optional(),
  url: z.string().url().optional(),
  type: z.enum(["playlist", "track", "stem", "file"]).default("track"),
});

const ingestPayloadSchema = z
  .object({
    artist: z.string().min(1, "artist is required"),
    project: z.string().min(1, "project is required"),
    references: z.array(influenceReferenceSchema).min(1, "provide at least one reference"),
    notes: z.string().optional(),
  })
  .strict();

const generationRequestSchema = z
  .object({
    artist: z.string().min(1),
    project: z.string().min(1),
    influenceWeights: z
      .record(z.string(), z.number().min(0))
      .optional()
      .refine(
        (weights) => !weights || Object.values(weights).some((value) => value > 0),
        "influenceWeights requires at least one non-zero value",
      ),
    deliverables: z.array(z.enum(["mix", "stems", "midi", "sheet"])).default(["mix"]),
    deadline: z.string().datetime().optional(),
    notes: z.string().optional(),
  })
  .strict();

const PIPELINE = [
  {
    phase: "ingestion",
    description: "Upload playlists, stems, or catalogs. Assets are fingerprinted in DreamVault with Merkle proofs.",
  },
  {
    phase: "analysis",
    description:
      "ChronoCache extracts harmonic, rhythmic, lyrical, and production signatures to build influence vectors.",
  },
  {
    phase: "synthesis",
    description:
      "DreamForge orchestrates transformer, diffusion, and audio VAE models to create fully original compositions.",
  },
  {
    phase: "curation",
    description: "Artists review takes, tag favorites, and request targeted variations before approval.",
  },
  {
    phase: "release",
    description: "Exports are mastered, minted as DreamStar releases, and tracked through Royalty Flow Nexus.",
  },
];

router.post("/ingest", async (req, res) => {
  const payload = ingestPayloadSchema.parse(req.body);

  await publishInternalEvent({
    topic: StarbridgeTopic.System,
    source: StarbridgeSource.Runtime,
    type: "dreamstar.ingest.requested",
    payload,
  });

  res.json({
    ok: true,
    message: "DreamStar ingestion queued",
  });
});

router.post("/generate", async (req, res) => {
  const payload = generationRequestSchema.parse(req.body);

  await publishInternalEvent({
    topic: StarbridgeTopic.System,
    source: StarbridgeSource.Runtime,
    type: "dreamstar.generate.requested",
    payload,
  });

  res.json({
    ok: true,
    message: "DreamStar generation mission dispatched",
  });
});

router.get("/pipeline", (_req, res) => {
  res.json({
    ok: true,
    pipeline: PIPELINE,
  });
});

export default router;

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { Router } from "express";
import { join } from "node:path";
import { meshEvents, meshStatus } from "./index";
import { fetchEvents } from "../starbridge";

export function createMeshRouter(): Router {
  const router = Router();

  router.get("/status", (_req, res) => {
    res.json(meshStatus());
  });

  router.get("/events", async (req, res) => {
    const limit = Number.parseInt((req.query.limit as string) ?? "50", 10);
    const includePersisted = req.query.persisted === "true";

    const runtime = meshEvents(limit);

    if (!includePersisted) {
      res.json({ runtime });
      return;
    }

    try {
      const persisted = await fetchEvents({ limit });
      res.json({ runtime, persisted });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch persisted events",
        message: (error as Error).message,
        runtime,
      });
    }
  });

  return router;
}



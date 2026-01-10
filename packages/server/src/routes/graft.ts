import { Router } from "express";
import { randomUUID } from "node:crypto";
import { submitGraft, getGrafts, getGraftById, validateGraft, removeGraft, applyGraft } from "@dreamnet/graft-engine";

const DEFAULT_INTERNAL_URL = `http://127.0.0.1:${process.env.PORT ?? 5000}`;

async function createInstallTask(graftId: string) {
  try {
    await fetch(`${DEFAULT_INTERNAL_URL}/api/squad/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: {
          type: "graft.install",
          payload: { graftId },
          priority: "high",
        },
      }),
    });
  } catch (error) {
    // best-effort only
    console.warn("[graft] Unable to schedule squad task:", (error as Error).message);
  }
}

export function createGraftRouter(): Router {
  const router = Router();

  router.post("/", async (req, res) => {
    const { type, name, path: graftPath, metadata = {} } = req.body ?? {};
    try {
      const graft = await submitGraft({
        id: randomUUID(),
        type,
        name,
        path: graftPath,
        metadata,
      });

      // fire-and-forget squad task
      void createInstallTask(graft.id);

      res.status(201).json({ ok: true, graft });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  router.get("/", async (_req, res) => {
    const grafts = await getGrafts();
    res.json({ ok: true, grafts });
  });

  router.get("/:id", async (req, res) => {
    const graft = await getGraftById(req.params.id);
    if (!graft) {
      res.status(404).json({ ok: false, error: "graft not found" });
      return;
    }
    res.json({ ok: true, graft });
  });

  router.post("/:id/validate", async (req, res) => {
    const graft = await getGraftById(req.params.id);
    if (!graft) {
      res.status(404).json({ ok: false, error: "graft not found" });
      return;
    }
    const result = await validateGraft(graft);
    res.json({ ok: result.ok, issues: result.issues });
  });

  router.post("/:id/install", async (req, res) => {
    try {
      const graft = await applyGraft(req.params.id);
      res.json({ ok: true, graft });
    } catch (error) {
      res.status(400).json({ ok: false, error: (error as Error).message });
    }
  });

  router.delete("/:id", async (req, res) => {
    await removeGraft(req.params.id);
    res.json({ ok: true });
  });

  return router;
}



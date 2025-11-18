import { Router } from "express";
import fs from "node:fs/promises";
import path from "node:path";

const endpointsStore = path.resolve(process.cwd(), "packages/graft-engine/graftedEndpoints.json");

async function loadEndpoints(): Promise<
  Array<{ path: string; response: unknown; metadata?: Record<string, unknown> }>
> {
  try {
    const data = await fs.readFile(endpointsStore, "utf8");
    return JSON.parse(data) as Array<{ path: string; response: unknown; metadata?: Record<string, unknown> }>;
  } catch {
    return [];
  }
}

export function createGraftedRouter(): Router {
  const router = Router();

  router.all("/:slug(*)", async (req, res) => {
    const endpoints = await loadEndpoints();
    const fullPath = `/api/grafted/${req.params.slug}`;
    const endpoint = endpoints.find((entry) => entry.path === fullPath);

    if (!endpoint) {
      res.status(404).json({ ok: false, error: `No grafted endpoint registered at ${fullPath}` });
      return;
    }

    res.json({
      ok: true,
      source: "graft-engine",
      path: endpoint.path,
      payload: endpoint.response,
    });
  });

  return router;
}



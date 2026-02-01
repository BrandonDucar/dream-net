import { Router } from "express";
import { dreamNetOS } from "../core/dreamnet-os";
import type { AgentRunInput } from "../core/types";

export function createAgentRouter(): Router {
  const router = Router();

  router.get("/agents", (_req, res) => {
    res.json({ ok: true, agents: dreamNetOS.listAgents() });
  });

  router.post("/agent", async (req, res) => {
    const body = req.body as Partial<AgentRunInput>;
    if (!body?.agent) {
      res.status(400).json({ ok: false, error: "agent is required" });
      return;
    }
    try {
      const result = await dreamNetOS.runAgent({
        agent: String(body.agent),
        input: body.input,
        userId: body.userId,
        metadata: body.metadata,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  return router;
}



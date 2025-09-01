import { Router, type Request, type Response } from "express";
import { dreamScoreEngine } from "../dream-score-engine";
import { triggerArchiveNow } from "../archive-scheduler";

/**
 * Cron routes for scheduling tasks
 *
 * These endpoints expose idempotent task runners for DreamNet's
 * maintenance jobs.  They are protected by an API key header
 * (x-agent-key) to prevent unauthorized invocation.  Vercel's
 * Cron Jobs can be configured to call these endpoints on a
 * recurring schedule.  See vercel.json for schedule details.
 */
const r = Router();

// Simple authentication guard using AGENT_API_KEY env var
function guard(req: Request, res: Response, next: any) {
  const keyHeader = req.header("x-agent-key");
  const expected = process.env.AGENT_API_KEY;
  if (!expected || keyHeader !== expected) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

/**
 * Trigger a re-score of all dreams.
 * This endpoint calls updateAllDreamScores once per invocation.
 */
r.post("/score", guard, async (_req: Request, res: Response) => {
  await dreamScoreEngine.updateAllDreamScores();
  res.json({ ok: true });
});

/**
 * Trigger archiving of inactive items.
 * Returns counts of archived dreams and cocoons.
 */
r.post("/archive", guard, async (_req: Request, res: Response) => {
  const result = await triggerArchiveNow();
  res.json({ ok: true, result });
});

export default r;

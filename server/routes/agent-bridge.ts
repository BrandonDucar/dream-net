import { Router } from "express";
import { dreamScoreEngine } from "../dream-score-engine";
import { triggerArchiveNow } from "../archive-scheduler";

const r = Router();
const ok = (k?: string) => process.env.AGENT_API_KEY && k === process.env.AGENT_API_KEY;

// Health endpoint
r.get("/health", (req, res) => {
  res.json({ ok: ok(req.header("x-agent-key")), ts: Date.now() });
});

// Unified command endpoint
r.post("/tasks", async (req, res) => {
  if (!ok(req.header("x-agent-key"))) {
    return res.status(401).json({ error: "unauthorized" });
  }
  const { action, payload } = req.body || {};
  if (action === "score_all") {
    await dreamScoreEngine.updateAllDreamScores();
    return res.json({ ok: true });
  }
  if (action === "archive_inactive") {
    const result = await triggerArchiveNow();
    return res.json({ ok: true, result });
  }
  return res.status(400).json({ error: "unknown_action" });
});

// Optional events endpoint
r.post("/events", (req, res) => {
  if (!ok(req.header("x-agent-key"))) {
    return res.status(401).end();
  }
  console.log("AGENT_EVENT", req.body);
  res.json({ ok: true });
});

export default r;

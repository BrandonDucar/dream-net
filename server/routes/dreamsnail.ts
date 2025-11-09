import { Router } from "express";
import { z } from "zod";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { appendTrail, getTrailRoot, verifyTrail, getTrailNodes } from "@packages/dreamsnail-trail/src";
import { latestTrailRoot, listTrailEvents, recordTrailEvent, verifyTrailCommitment } from "../dreamsnail/service";

const router = Router();

const commitSchema = z.object({
  commitment: z.string().min(1, "commitment is required"),
  nullifier: z.string().optional(),
  timestamp: z.number().int().positive().optional(),
});

const verifySchema = z.object({
  commitment: z.string().min(1, "commitment is required"),
});

async function readSpec(): Promise<string> {
  try {
    const specPath = path.resolve(__dirname, "../../ops/dreamsnail.md");
    const buffer = await readFile(specPath, "utf-8");
    return buffer;
  } catch {
    return "DreamSnail spec unavailable. Verify ops/dreamsnail.md exists.";
  }
}

router.get("/spec", async (_req, res) => {
  const doc = await readSpec();
  res.json({
    ok: true,
    spec: doc,
  });
});

router.get("/summary", async (_req, res) => {
  const doc = await readSpec();
  const paragraphs = doc
    .split("\n")
    .filter((line) => line.trim().length > 0 && !line.startsWith("#") && !line.startsWith("```"))
    .slice(0, 6);

  res.json({
    ok: true,
    summary: paragraphs.join(" "),
  });
});

router.get("/roadmap", (_req, res) => {
  res.json({
    ok: true,
    roadmap: [
      "Deploy TrailCommit, DreamSnail, and Verifier contracts on Base testnet.",
      "Mint developer collection, validate zk circuits, and publish DreamSnail explorer UI.",
      "Lock Fibonacci tiers, pin helix assets, and run Trail Challenges for zk badge unlocks.",
      "Launch DreamSnail mainnet mint with VRF reveals and integrate with DreamStar stem unlocks.",
    ],
  });
});

router.post("/commit", async (req, res) => {
  const payload = commitSchema.parse(req.body);
  const node = appendTrail({
    commitment: payload.commitment,
    nullifier: payload.nullifier,
    timestamp: payload.timestamp,
  });

  try {
    await recordTrailEvent({
      commitment: node.commitment,
      nullifier: node.nullifier ?? null,
      root: node.root,
      timestamp: new Date(node.timestamp),
    });
  } catch (error) {
    console.error("[DreamSnail] Failed to persist trail event:", error);
  }

  res.json({
    ok: true,
    root: node.root,
    index: node.index,
    timestamp: node.timestamp,
  });
});

router.post("/verify", async (req, res) => {
  const payload = verifySchema.parse(req.body);
  let record = null;
  try {
    record = await verifyTrailCommitment(payload.commitment);
  } catch (error) {
    console.error("[DreamSnail] Failed to query trail event:", error);
  }

  const valid = Boolean(record) || verifyTrail(payload.commitment);
  res.json({
    ok: valid,
    verified: valid,
    root: record?.root ?? getTrailRoot(),
  });
});

router.get("/trail", async (_req, res) => {
  try {
    const events = await listTrailEvents();
    res.json({ ok: true, events });
  } catch (error) {
    console.error("[DreamSnail] Failed to list trail events:", error);
    res.json({ ok: true, events: getTrailNodes() });
  }
});

router.get("/root", async (_req, res) => {
  try {
    const root = await latestTrailRoot();
    res.json({ ok: true, root: root ?? getTrailRoot() });
  } catch (error) {
    console.error("[DreamSnail] Failed to fetch trail root:", error);
    res.json({ ok: true, root: getTrailRoot() });
  }
});

export default router;

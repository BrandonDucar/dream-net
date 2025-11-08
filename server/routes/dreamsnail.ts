import { Router } from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";

const router = Router();

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

export default router;

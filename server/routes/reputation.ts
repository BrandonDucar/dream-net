import { Router } from "express";
import { addEdge, getLeaderboard, getScore, recomputeScores } from "../reputation/service";

const router = Router();

router.post("/edge", async (req, res) => {
  try {
    const { src, dst, kind, weight, signature } = req.body ?? {};
    if (!src || !dst || !kind) {
      return res.status(400).json({ success: false, error: "src, dst, kind required" });
    }

    await addEdge({ src, dst, kind, weight, signature });
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message ?? "Failed to add edge" });
  }
});

router.get("/score", async (req, res) => {
  const node = String(req.query.node ?? "");
  if (!node) {
    return res.status(400).json({ success: false, error: "node required" });
  }

  const score = await getScore(node);
  if (!score) {
    return res.status(404).json({ success: false, error: "not_found" });
  }

  res.json({ success: true, score });
});

router.post("/recompute", async (_req, res) => {
  await recomputeScores();
  res.json({ success: true });
});

router.get("/leaderboard", async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const leaderboard = await getLeaderboard(limit);
  res.json({ success: true, leaderboard });
});

export default router;

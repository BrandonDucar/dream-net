import { Router } from "express";
import { chronoGet, chronoSet, chronoStats } from "../chronocache/service";

const router = Router();

router.post("/set", async (req, res) => {
  const { key, value } = req.body ?? {};
  if (!key) {
    return res.status(400).json({ success: false, error: "key required" });
  }
  await chronoSet(String(key), value);
  res.status(201).json({ success: true });
});

router.get("/get", async (req, res) => {
  const key = String(req.query.key ?? "");
  if (!key) {
    return res.status(400).json({ success: false, error: "key required" });
  }
  const entry = await chronoGet(key);
  if (!entry) {
    return res.status(404).json({ success: false, error: "not_found" });
  }
  res.json({ success: true, entry });
});

router.get("/stats", async (_req, res) => {
  const stats = await chronoStats();
  res.json({ success: true, stats });
});

export default router;

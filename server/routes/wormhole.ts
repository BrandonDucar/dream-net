import { Router } from "express";
import { fetchEvents } from "../starbridge";
import { StarbridgeTopic } from "../starbridge";

const router = Router();

router.get("/events", async (req, res) => {
  const topicsParam = req.query.topics ? String(req.query.topics) : "";
  const topics = topicsParam
    ? topicsParam
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean)
        .map((topic) => topic as StarbridgeTopic)
    : undefined;

  const limit = req.query.limit ? Number(req.query.limit) : 50;

  const events = await fetchEvents({ topics, limit });
  res.json({
    success: true,
    events,
  });
});

export default router;

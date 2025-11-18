import { Router } from "express";
import { fetchEvents } from "../starbridge";

const router: Router = Router();

router.get("/events", async (req, res) => {
  const topicsParam = req.query.topics ? String(req.query.topics) : "";
  const topics = topicsParam
    ? topicsParam
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean)
        .map((topic) => {
          // Map to valid topic string
          const upperTopic = topic.charAt(0).toUpperCase() + topic.slice(1).toLowerCase();
          const validTopics = ['Governor', 'Deploy', 'System', 'Economy', 'Vault'];
          return validTopics.includes(upperTopic) ? upperTopic : topic;
        }) as ('Governor' | 'Deploy' | 'System' | 'Economy' | 'Vault')[]
    : undefined;

  const limit = req.query.limit ? Number(req.query.limit) : 50;

  const events = await fetchEvents({ topics: topics as any as any, limit });
  res.json({
    success: true,
    events,
  });
});

export default router;

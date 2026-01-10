import { Router } from "express";
import { starbridgeQuerySchema } from "../starbridge/schemas";
import {
  StarbridgeTopic,
  publishExternalEvent,
  fetchEvents,
  subscribeToTopics,
  markEventReplayed,
} from "../starbridge";
import { verifyIngress } from "../starbridge/policy";
import type { StarbridgeEvent } from "../starbridge/types";

const router: Router = Router();

function formatSseEvent(event: StarbridgeEvent) {
  return `data: ${JSON.stringify({
    ...event,
    ts: event.ts.toISOString(),
  })}\n\n`;
}

router.post("/event", async (req, res) => {
  try {
    if (!verifyIngress(req)) {
      return res.status(401).json({ success: false, error: "Invalid signature" });
    }

    await publishExternalEvent(req.body);

    return res.status(202).json({
      success: true,
      message: "Event accepted",
    });
  } catch (error: any) {
    console.error("[StarBridge] Failed to ingest event", error);
    return res.status(400).json({
      success: false,
      error: error?.message ?? "Invalid event payload",
    });
  }
});

router.get("/events", async (req, res) => {
  try {
    const parsedQuery = starbridgeQuerySchema.parse({
      topics: req.query.topics
        ? String(req.query.topics)
            .split(",")
            .map((topic) => topic.trim() as StarbridgeTopic)
            .filter(Boolean)
        : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      since: req.query.since ? String(req.query.since) : undefined,
    });

    const events = await fetchEvents({
      topics: parsedQuery.topics,
      limit: parsedQuery.limit,
      since: parsedQuery.since ? new Date(parsedQuery.since) : undefined,
    });

    return res.json({
      success: true,
      events: events.map((event) => ({
        ...event,
        ts: event.ts,
      })),
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error?.message ?? "Invalid query parameters",
    });
  }
});

router.get("/stream", async (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  res.flushHeaders?.();

  const topicsParam = req.query.topics ? String(req.query.topics) : "";
  const topics = topicsParam
    ? topicsParam
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean)
        .map((topic) => topic as StarbridgeTopic)
    : (Object.values(StarbridgeTopic) as StarbridgeTopic[]);

  const limit = req.query.limit ? Number(req.query.limit) : 100;
  const since = req.query.since ? new Date(String(req.query.since)) : undefined;
  const replay = req.query.replay !== "false";

  const sendEvent = (event: StarbridgeEvent) => {
    res.write(formatSseEvent(event));
  };

  const unsubscribe = subscribeToTopics(topics, sendEvent);

  res.write(": connected\n\n");

  if (replay) {
    try {
      const replayEvents = await fetchEvents({
        topics,
        limit,
        since,
      });

      for (const event of replayEvents.reverse()) {
        sendEvent({
          ...event,
          ts: new Date(event.ts),
          replayed: true,
          topic: event.topic as any,
        } as any);
        await markEventReplayed(event.id);
      }
    } catch (error) {
      console.error("[StarBridge] Failed to fetch replay events", error);
    }
  }

  const heartbeat = setInterval(() => {
    res.write(": ping\n\n");
  }, 15000);

  req.on("close", () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});

export default router;

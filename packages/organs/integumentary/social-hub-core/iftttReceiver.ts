import { Router, Request, Response } from "express";
import { db } from "../db";
import { contentQueue } from "@dreamnet/shared/schema";
import { recordEvent } from "@dreamnet/metrics-engine";
import { eq } from "drizzle-orm";

// Validate IFTTT webhook token
const validateIFTTTToken = (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token || token !== process.env.IFTTT_WEBHOOK_TOKEN) {
    return res.status(401).json({ error: "Invalid IFTTT token" });
  }
  next();
};

/**
 * Handler: New content from Google Sheets via IFTTT
 * POST /api/social/ifttt/new-content
 */
async function handleNewContent(req: Request, res: Response) {
  try {
    const {
      content_id,
      title,
      body,
      media_url,
      hashtags,
      has_on_x,
      has_on_tiktok,
      timestamp,
    } = req.body;

    console.log("[IFTTT] New content received:", { content_id, title });

    // Parse hashtags
    const hashtagArray = hashtags
      ? hashtags.split(",").map((h: string) => h.trim()).filter(Boolean)
      : [];

    // Determine if cross-posting will be needed
    const needsCrossPost =
      (has_on_x === "TRUE" && has_on_tiktok !== "TRUE") ||
      (has_on_tiktok === "TRUE" && has_on_x !== "TRUE");

    // Insert into content queue
    await db.insert(contentQueue).values({
      id: content_id,
      title: title || "",
      body: body || "",
      media_url: media_url || null,
      hashtags: hashtagArray,
      has_on_x: has_on_x === "TRUE",
      has_on_tiktok: has_on_tiktok === "TRUE",
      status: "pending",
      needs_cross_post: needsCrossPost,
      created_at: new Date(timestamp || Date.now()),
      updated_at: new Date(),
    });

    // Record event
    await recordEvent({
      type: "ifttt_new_content",
      source: "google_sheets",
      content_id,
      platforms: [has_on_x === "TRUE" ? "x" : null, has_on_tiktok === "TRUE" ? "tiktok" : null].filter(Boolean),
    }).catch(console.error);

    res.json({
      ok: true,
      message: "Content queued for autonomous posting",
      content_id,
    });
  } catch (error) {
    console.error("[IFTTT] New content handler error:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}

/**
 * Handler: Sync status from Google Sheets
 * POST /api/social/ifttt/sync-status
 */
async function handleSyncStatus(req: Request, res: Response) {
  try {
    const {
      content_id,
      status,
      has_on_x,
      has_on_tiktok,
      x_url,
      tiktok_url,
    } = req.body;

    console.log("[IFTTT] Status sync:", { content_id, status });

    // Update content queue with platform URLs
    await db
      .update(contentQueue)
      .set({
        status: status || "pending",
        has_on_x: has_on_x === "TRUE",
        has_on_tiktok: has_on_tiktok === "TRUE",
        x_post_url: x_url || null,
        tiktok_post_url: tiktok_url || null,
        posted_at_x: x_url ? new Date() : null,
        posted_at_tiktok: tiktok_url ? new Date() : null,
        updated_at: new Date(),
      })
      .where(eq(contentQueue.id, content_id));

    // Record event
    await recordEvent({
      type: "ifttt_sync_status",
      content_id,
      status,
      x_posted: !!x_url,
      tiktok_posted: !!tiktok_url,
    }).catch(console.error);

    res.json({ ok: true, message: "Status synced from Google Sheets" });
  } catch (error) {
    console.error("[IFTTT] Sync status handler error:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}

/**
 * Handler: Cross-post trigger from Google Sheets
 * POST /api/social/ifttt/trigger-cross-post
 */
async function handleCrossPostTrigger(req: Request, res: Response) {
  try {
    const {
      content_id,
      source_platform,
      target_platforms,
    } = req.body;

    console.log("[IFTTT] Cross-post triggered:", {
      content_id,
      source: source_platform,
      targets: target_platforms,
    });

    // Mark content for cross-posting
    await db
      .update(contentQueue)
      .set({
        needs_cross_post: true,
        cross_post_source: source_platform,
        cross_post_targets: target_platforms ? target_platforms.split(",").map((t: string) => t.trim()) : [],
        status: "needs_cross_post",
        updated_at: new Date(),
      })
      .where(eq(contentQueue.id, content_id));

    // Record event
    await recordEvent({
      type: "ifttt_cross_post_trigger",
      content_id,
      source: source_platform,
      targets: target_platforms,
    }).catch(console.error);

    res.json({
      ok: true,
      message: "Cross-post triggered",
      content_id,
    });
  } catch (error) {
    console.error("[IFTTT] Cross-post trigger handler error:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}

/**
 * Health check endpoint
 */
async function handleHealthCheck(req: Request, res: Response) {
  res.json({
    ok: true,
    service: "ifttt-receiver",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Create IFTTT Router
 */
export function createIFTTTRouter(): Router {
  const router = Router();

  // Health check
  router.get("/health", handleHealthCheck);

  // IFTTT webhooks (with token validation)
  router.post(
    "/social/ifttt/new-content",
    validateIFTTTToken,
    handleNewContent
  );
  router.post(
    "/social/ifttt/sync-status",
    validateIFTTTToken,
    handleSyncStatus
  );
  router.post(
    "/social/ifttt/trigger-cross-post",
    validateIFTTTToken,
    handleCrossPostTrigger
  );

  return router;
}

export default createIFTTTRouter;

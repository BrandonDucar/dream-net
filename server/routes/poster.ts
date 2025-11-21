import { Router } from "express";
import { getPostQueueItems, updatePostQueueItem, incrementMediaUsage } from "../../packages/media-vault";
import { recordEvent } from "../../packages/metrics-engine";
import { eq, and, lte } from "drizzle-orm";
import { postQueue } from "@shared/schema";
import { db } from "../db";

// Simple auth middleware for admin routes
function requireOperatorToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const token = process.env.OPERATOR_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "OPERATOR_TOKEN not configured" });
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const providedToken = authHeader.substring(7);
  if (providedToken !== token) {
    return res.status(403).json({ error: "Invalid token" });
  }

  next();
}

// Logs storage (in-memory for MVP)
const posterLogs: Array<{
  timestamp: string;
  action: string;
  orderId?: string;
  platform?: string;
  success: boolean;
  error?: string;
}> = [];

async function postToPlatform(platform: string, mediaId: string, caption: string, hashtags: string[]): Promise<{ success: boolean; postUrl?: string; error?: string }> {
  // Stub implementation - replace with actual platform APIs
  console.log(`[POSTER] Posting to ${platform}:`, { mediaId, caption, hashtags });

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // For now, return a mock URL
  // In production, integrate with:
  // - Twitter/X API
  // - Instagram Graph API
  // - Base social protocols
  const mockUrl = `https://${platform}.com/posts/${Date.now()}`;

  return {
    success: true,
    postUrl: mockUrl,
  };
}

export async function runPosterJob(): Promise<{ processed: number; errors: number }> {
  const now = new Date();
  let processed = 0;
  let errors = 0;

  try {
    // Get scheduled posts that are due
    const scheduledPosts = await db
      .select()
      .from(postQueue)
      .where(and(eq(postQueue.status, "scheduled"), lte(postQueue.scheduled_at, now)));

    for (const post of scheduledPosts) {
      try {
        // Post to platform
        const result = await postToPlatform(post.platform, post.media_id, post.caption || "", post.hashtags || []);

        if (result.success) {
          // Update post status
          await db
            .update(postQueue)
            .set({
              status: "posted",
              post_url: result.postUrl,
              updated_at: new Date(),
            })
            .where(eq(postQueue.id, post.id));

          // Increment media usage
          await incrementMediaUsage(post.media_id);

          // Record metrics
          await recordEvent().catch(console.error);

          posterLogs.push({
            timestamp: new Date().toISOString(),
            action: "post.success",
            orderId: post.id,
            platform: post.platform,
            success: true,
          });

          processed++;
        } else {
          // Mark as failed
          await db
            .update(postQueue)
            .set({
              status: "failed",
              updated_at: new Date(),
            })
            .where(eq(postQueue.id, post.id));

          posterLogs.push({
            timestamp: new Date().toISOString(),
            action: "post.failed",
            orderId: post.id,
            platform: post.platform,
            success: false,
            error: result.error || "Unknown error",
          });

          errors++;
        }
      } catch (error) {
        console.error(`[POSTER] Failed to post ${post.id}:`, error);

        await db
          .update(postQueue)
          .set({
            status: "failed",
            updated_at: new Date(),
          })
          .where(eq(postQueue.id, post.id));

        posterLogs.push({
          timestamp: new Date().toISOString(),
          action: "post.error",
          orderId: post.id,
          platform: post.platform,
          success: false,
          error: (error as Error).message,
        });

        errors++;
      }
    }

    // Keep only last 100 logs
    if (posterLogs.length > 100) {
      posterLogs.splice(0, posterLogs.length - 100);
    }
  } catch (error) {
    console.error("[POSTER] Job failed:", error);
    errors++;
  }

  return { processed, errors };
}

export function createPosterRouter(): Router {
  const router = Router();

  // POST /api/jobs/poster (Vercel cron endpoint)
  router.post("/jobs/poster", async (_req, res) => {
    try {
      const result = await runPosterJob();
      res.json({ ok: true, ...result });
    } catch (error) {
      console.error("Poster job error:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // GET /api/jobs/poster/logs (admin only)
  router.get("/jobs/poster/logs", requireOperatorToken, async (_req, res) => {
    try {
      res.json({ ok: true, logs: posterLogs });
    } catch (error) {
      console.error("Failed to get poster logs:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  return router;
}


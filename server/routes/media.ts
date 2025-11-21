import { Router } from "express";
import multer from "multer";
import { join, dirname } from "node:path";
import { readFile } from "node:fs/promises";
import { ingestFromFile, ingestFromUrl, getMediaById, searchMedia, createPostQueueItem, getPostQueueItems, updatePostQueueItem, incrementMediaUsage, getPublicMedia } from "@dreamnet/media-vault";
import { createSpore } from "@dreamnet/spore-engine";
import { getHashtagsForTags } from "@dreamnet/media-vault/src/vocab";
import { grantReward } from "../../packages/rewards-engine";

const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  storage: multer.memoryStorage(),
});

export function createMediaRouter(): Router {
  const router = Router();

  // Rate limiting (simple in-memory)
  const ingestRateLimit = new Map<string, { count: number; resetAt: number }>();
  const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  const RATE_LIMIT_MAX = 10; // 10 requests per minute

  function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = ingestRateLimit.get(ip);
    
    if (!record || now > record.resetAt) {
      ingestRateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
      return true;
    }
    
    if (record.count >= RATE_LIMIT_MAX) {
      return false;
    }
    
    record.count++;
    return true;
  }

  // POST /api/media/ingest
  router.post("/media/ingest", upload.single("file"), async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    if (!checkRateLimit(ip)) {
      res.status(429).json({ ok: false, error: "Rate limit exceeded" });
      return;
    }

    try {
      const { url, source, title, tags, collections, prompt, model, rights, rating } = req.body;

      if (!source) {
        res.status(400).json({ ok: false, error: "source is required" });
        return;
      }

      let asset;
      if (req.file) {
        // File upload
        asset = await ingestFromFile(
          req.file.buffer,
          req.file.originalname,
          {
            source: source as any,
            title,
            tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : undefined,
            collections: collections ? (Array.isArray(collections) ? collections : JSON.parse(collections)) : undefined,
            prompt,
            model,
            rights: rights as any,
            rating: rating as any,
          },
        );
      } else if (url) {
        // URL ingestion
        asset = await ingestFromUrl(url, {
          source: source as any,
          title,
          tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : undefined,
          collections: collections ? (Array.isArray(collections) ? collections : JSON.parse(collections)) : undefined,
          prompt,
          model,
          rights: rights as any,
          rating: rating as any,
        });
      } else {
        res.status(400).json({ ok: false, error: "Either file or url is required" });
        return;
      }

      // Create Media Spore
      try {
        await createSpore({
          name: `media-${asset.id}`,
          description: `Media asset: ${asset.title}`,
          type: "media",
          status: "published",
          content: JSON.stringify({
            mediaId: asset.id,
            title: asset.title,
            source: asset.source,
            tags: asset.tags,
            collections: asset.collections,
            prompt: asset.credits.prompt,
            model: asset.credits.model,
          }),
          metadata: {
            mediaId: asset.id,
            tags: asset.tags,
            collections: asset.collections,
            source: asset.source,
          },
        });
      } catch (err) {
        console.error("Failed to create Media Spore:", err);
        // Don't fail the ingestion if spore creation fails
      }

      // Grant reward for media upload
      // TODO: Extract userId from auth/session when authentication is implemented
      const userId = (req.headers["x-user-id"] as string) || (req.query.userId as string);
      if (userId) {
        grantReward(userId, "media-upload").catch((err) => {
          console.error("Failed to grant media-upload reward:", err);
          // Don't fail the request if reward fails
        });
      }

      res.json({ ok: true, asset });
    } catch (error) {
      console.error("Media ingestion error:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // GET /api/media/search
  router.get("/media/search", async (req, res) => {
    try {
      const {
        q,
        tags,
        type,
        source,
        collections,
        rating,
        date_from,
        date_to,
        limit,
        offset,
      } = req.query;

      const filters = {
        q: q as string | undefined,
        tags: tags ? (Array.isArray(tags) ? tags : [tags as string]) : undefined,
        type: type as any,
        source: source as any,
        collections: collections ? (Array.isArray(collections) ? collections : [collections as string]) : undefined,
        rating: rating as any,
        date_from: date_from as string | undefined,
        date_to: date_to as string | undefined,
      };

      const results = await searchMedia(filters, parseInt(String(limit ?? "50"), 10), parseInt(String(offset ?? "0"), 10));
      res.json({ ok: true, results, count: results.length });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // GET /api/media/:id
  // GET /api/media/public
  router.get("/media/public", async (req, res) => {
    try {
      const collection = (req.query.collection as string) || "all";
      const limit = parseInt(String(req.query.limit ?? "100"), 10) || 100;
      const offset = parseInt(String(req.query.offset ?? "0"), 10) || 0;

      const media = await getPublicMedia(collection, limit, offset);
      res.json({ ok: true, media, total: media.length });
    } catch (error) {
      console.error("Failed to get public media:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  router.get("/media/:id", async (req, res) => {
    try {
      const asset = await getMediaById(req.params.id);
      if (!asset) {
        res.status(404).json({ ok: false, error: "Media not found" });
        return;
      }
      res.json({ ok: true, asset });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // POST /api/posts/queue
  router.post("/posts/queue", async (req, res) => {
    try {
      const { media_id, platform, caption, hashtags, scheduled_at } = req.body;

      if (!media_id || !platform) {
        res.status(400).json({ ok: false, error: "media_id and platform are required" });
        return;
      }

      // Get media asset to extract hashtags if not provided
      const asset = await getMediaById(media_id);
      if (!asset) {
        res.status(404).json({ ok: false, error: "Media not found" });
        return;
      }

      const finalHashtags = hashtags && hashtags.length > 0 ? hashtags : getHashtagsForTags(asset.tags);

      const queueItem = await createPostQueueItem({
        media_id,
        platform: platform as any,
        status: scheduled_at ? "scheduled" : "draft",
        scheduled_at: scheduled_at ? new Date(scheduled_at).toISOString() : null,
        caption: caption || asset.caption,
        hashtags: finalHashtags,
        post_url: null,
        engagement: null,
      });

      res.json({ ok: true, queueItem });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // GET /api/posts/queue
  router.get("/posts/queue", async (req, res) => {
    try {
      const { status, platform } = req.query;
      const items = await getPostQueueItems({
        status: status as any,
        platform: platform as any,
      });
      res.json({ ok: true, items });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // PUT /api/posts/queue/:id
  router.put("/posts/queue/:id", async (req, res) => {
    try {
      const { status, post_url, engagement } = req.body;
      const updates: any = {};
      
      if (status) updates.status = status;
      if (post_url) updates.post_url = post_url;
      if (engagement) updates.engagement = engagement;

      // If status is "posted", increment media usage
      if (status === "posted") {
        const queueItem = await getPostQueueItems();
        const item = queueItem.find((q) => q.id === req.params.id);
        if (item) {
          await incrementMediaUsage(item.media_id);
        }
      }

      const updated = await updatePostQueueItem(req.params.id, updates);
      if (!updated) {
        res.status(404).json({ ok: false, error: "Queue item not found" });
        return;
      }
      res.json({ ok: true, queueItem: updated });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // Serve media files
  router.get("/media/thumb_320/:id.jpg", async (req, res) => {
    try {
      // Use same logic as ingest.ts to get media root
      const getMediaRoot = (): string => {
        if (process.env.MEDIA_ROOT) {
          if (process.env.MEDIA_ROOT.startsWith("/") || process.env.MEDIA_ROOT.match(/^[A-Z]:/)) {
            return process.env.MEDIA_ROOT;
          }
          return join(process.cwd(), process.env.MEDIA_ROOT);
        }
        const projectRoot = process.cwd();
        if (projectRoot.includes("OneDrive") || projectRoot.includes("Documents")) {
          const parentDir = dirname(projectRoot);
          return join(parentDir, "dream-net-media");
        }
        return join(projectRoot, "media");
      };
      
      const mediaRoot = getMediaRoot();
      const thumbPath = join(mediaRoot, "thumb_320", `${req.params.id}.jpg`);
      const file = await readFile(thumbPath);
      res.setHeader("Content-Type", "image/jpeg");
      res.send(file);
    } catch {
      res.status(404).send("Not found");
    }
  });

  router.get("/media/web_1080/:id.jpg", async (req, res) => {
    try {
      // Use same logic as ingest.ts to get media root
      const getMediaRoot = (): string => {
        if (process.env.MEDIA_ROOT) {
          if (process.env.MEDIA_ROOT.startsWith("/") || process.env.MEDIA_ROOT.match(/^[A-Z]:/)) {
            return process.env.MEDIA_ROOT;
          }
          return join(process.cwd(), process.env.MEDIA_ROOT);
        }
        const projectRoot = process.cwd();
        if (projectRoot.includes("OneDrive") || projectRoot.includes("Documents")) {
          const parentDir = dirname(projectRoot);
          return join(parentDir, "dream-net-media");
        }
        return join(projectRoot, "media");
      };
      
      const mediaRoot = getMediaRoot();
      const webPath = join(mediaRoot, "web_1080", `${req.params.id}.jpg`);
      const file = await readFile(webPath);
      res.setHeader("Content-Type", "image/jpeg");
      res.send(file);
    } catch {
      res.status(404).send("Not found");
    }
  });

  return router;
}


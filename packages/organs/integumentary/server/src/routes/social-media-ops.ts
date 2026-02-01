import { Router } from "express";
import { socialMediaOps, type SocialPlatform } from "../agents/SocialMediaOps";

export function createSocialMediaOpsRouter(): Router {
  const router = Router();

  // POST /api/social-media-ops/initialize - Initialize social media accounts
  router.post("/social-media-ops/initialize", async (req, res) => {
    try {
      const accounts = await socialMediaOps.initializeAccounts();
      res.json({ ok: true, accounts });
    } catch (error) {
      console.error("Failed to initialize social media ops:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/social-media-ops/post - Create and post content
  router.post("/social-media-ops/post", async (req, res) => {
    try {
      const { content, platforms, mediaUrls } = req.body;
      if (!content) {
        return res.status(400).json({ error: "content is required" });
      }

      // Default to all platforms if none specified
      const targetPlatforms: SocialPlatform[] = platforms || ["twitter", "linkedin"];

      const results = [];
      for (const platform of targetPlatforms) {
        const post = await socialMediaOps.createPost(platform, content, mediaUrls);
        results.push(post);
      }

      res.json({
        ok: true,
        message: "Post created",
        posts: results
      });
    } catch (error) {
      console.error("Failed to create post:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/social-media-ops/start - Start auto-posting
  router.post("/social-media-ops/start", async (req, res) => {
    try {
      socialMediaOps.startAutoPosting();

      res.json({
        ok: true,
        message: "Social media automation started",
        status: "active"
      });
    } catch (error) {
      console.error("Failed to start social media ops:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/social-media-ops/status - Get status
  router.get("/social-media-ops/status", async (req, res) => {
    try {
      const accounts = socialMediaOps.getAccounts();
      res.json({ ok: true, accounts });
    } catch (error) {
      console.error("Failed to get status:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/social-media-ops/messages - Get recent posts
  router.get("/social-media-ops/messages", async (req, res) => {
    try {
      const posts = socialMediaOps.getPosts();
      res.json({ ok: true, messages: posts.slice(0, 50) });
    } catch (error) {
      console.error("Failed to get messages:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}


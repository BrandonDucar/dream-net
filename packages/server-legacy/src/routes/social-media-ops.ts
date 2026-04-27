import { Router } from "express";
import CampaignMasterAgent from "../../agents/CampaignMasterAgent.js";

// Initialize Campaign Master Agent (Social Media Ops)
const socialMediaOps = new CampaignMasterAgent();

export function createSocialMediaOpsRouter(): Router {
  const router = Router();

  // POST /api/social-media-ops/initialize - Initialize social media accounts
  router.post("/social-media-ops/initialize", async (req, res) => {
    try {
      const config = req.body.config || {
        focusAreas: ["social_media_automation"],
        platforms: ["LinkedIn", "Twitter", "Facebook", "Instagram", "Threads"],
      };

      const result = await socialMediaOps.initializeCampaign(config);
      res.json({ ok: true, result });
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

      // Activate social media automation if not already active
      if (!socialMediaOps.activeOperations.includes("social_media")) {
        await socialMediaOps.activateSocialMediaAutomation();
      }

      // Post to specified platforms or all
      const targetPlatforms = platforms || ["LinkedIn", "Twitter", "Facebook", "Instagram", "Threads"];
      
      // TODO: Integrate with actual platform APIs
      // For now, log the post
      console.log(`📱 [Social Media Ops] Posting to ${targetPlatforms.join(", ")}:`);
      console.log(`   Content: ${content}`);
      if (mediaUrls) {
        console.log(`   Media: ${mediaUrls.length} files`);
      }

      res.json({
        ok: true,
        message: "Post created and scheduled",
        platforms: targetPlatforms,
        content,
      });
    } catch (error) {
      console.error("Failed to create post:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/social-media-ops/start - Start auto-posting
  router.post("/social-media-ops/start", async (req, res) => {
    try {
      const config = req.body.config || {};
      await socialMediaOps.initializeCampaign({
        focusAreas: ["social_media_automation"],
        ...config,
      });

      res.json({
        ok: true,
        message: "Social media automation started",
        status: socialMediaOps.status,
      });
    } catch (error) {
      console.error("Failed to start social media ops:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/social-media-ops/status - Get status
  router.get("/social-media-ops/status", async (req, res) => {
    try {
      const status = socialMediaOps.getDetailedStatus();
      res.json({ ok: true, status });
    } catch (error) {
      console.error("Failed to get status:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/social-media-ops/messages - Get recent messages
  router.get("/social-media-ops/messages", async (req, res) => {
    try {
      const messages = socialMediaOps.messages || [];
      res.json({ ok: true, messages: messages.slice(0, 50) });
    } catch (error) {
      console.error("Failed to get messages:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}


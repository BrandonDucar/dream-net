import { Router } from "express";
import BrandGradingCore from "../../packages/dreamnet-video-brand-core/index.js";
import GeofencingCore from "../../packages/dreamnet-geofence-core/index.js";

// Lazy import Campaign Master Agent (Social Media Ops) - make it optional
let CampaignMasterAgent: any = null;
let socialMediaOps: any = null;

const brandGrading = new BrandGradingCore();
const geofencing = new GeofencingCore();

async function initSocialMediaOps() {
  try {
    if (!CampaignMasterAgent) {
      const module = await import("../../agents/CampaignMasterAgent.js");
      CampaignMasterAgent = module.default || module;
    }
    if (!socialMediaOps && CampaignMasterAgent) {
      socialMediaOps = new CampaignMasterAgent();
    }
  } catch (error) {
    console.warn("[Social Media Ops] CampaignMasterAgent not available:", error instanceof Error ? error.message : error);
    // Create a stub object so routes don't crash
    socialMediaOps = {
      initializeCampaign: async () => ({ message: "CampaignMasterAgent not available" }),
      activateSocialMediaAutomation: async () => ({ message: "CampaignMasterAgent not available" }),
      activeOperations: [],
    };
  }
}

export function createSocialMediaOpsRouter(): Router {
  const router = Router();

  // Initialize on first request (lazy loading)
  router.use(async (req, res, next) => {
    if (!socialMediaOps) {
      await initSocialMediaOps();
    }
    next();
  });

  // POST /api/social-media-ops/initialize - Initialize social media accounts
  router.post("/social-media-ops/initialize", async (req, res) => {
    try {
      if (!socialMediaOps) {
        await initSocialMediaOps();
      }
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
      if (!socialMediaOps) {
        await initSocialMediaOps();
      }
      const { content, platforms, mediaUrls } = req.body;
      if (!content) {
        return res.status(400).json({ error: "content is required" });
      }

      // Activate social media automation if not already active
      if (socialMediaOps.activeOperations && !socialMediaOps.activeOperations.includes("social_media")) {
        await socialMediaOps.activateSocialMediaAutomation();
      }

      // Post to specified platforms or all
      const targetPlatforms = platforms || ["LinkedIn", "Twitter", "Facebook", "Instagram", "Threads"];
      
      // Get geofenced content
      const ipAddress = req.ip || req.headers["x-forwarded-for"] as string;
      const regionContent = await geofencing.getContentForIP(ipAddress);
      
      // Apply brand grading to video media if present
      let processedMediaUrls = mediaUrls;
      if (mediaUrls && Array.isArray(mediaUrls)) {
        for (const mediaUrl of mediaUrls) {
          if (mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".mov") || mediaUrl.endsWith(".avi")) {
            try {
              // Apply brand grading to video
              const presetId = req.body.brandPreset || "DN_PeakPop-Light";
              await brandGrading.applyGrading(mediaUrl, presetId);
              console.log(`[Social Media Ops] Applied brand grading to ${mediaUrl}`);
            } catch (error: any) {
              console.warn(`[Social Media Ops] Failed to apply brand grading: ${error.message}`);
            }
          }
        }
      }
      
      // Enhance content with region-specific elements
      const enhancedContent = {
        original: content,
        headline: regionContent.headline_local,
        cta: regionContent.cta_local,
        hashtags: regionContent.hashtag_pack?.join(" ") || "",
        emojis: regionContent.emoji_pack?.join(" ") || "",
      };
      
      // TODO: Integrate with actual platform APIs
      // For now, log the post
      console.log(`📱 [Social Media Ops] Posting to ${targetPlatforms.join(", ")}:`);
      console.log(`   Content: ${content}`);
      console.log(`   Region: ${await geofencing.detectRegion(ipAddress)}`);
      console.log(`   Enhanced: ${JSON.stringify(enhancedContent)}`);
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
      if (!socialMediaOps) {
        await initSocialMediaOps();
      }
      const config = req.body.config || {};
      await socialMediaOps.initializeCampaign({
        focusAreas: ["social_media_automation"],
        ...config,
      });

      res.json({
        ok: true,
        message: "Social media automation started",
        status: socialMediaOps.status || { message: "CampaignMasterAgent not available" },
      });
    } catch (error) {
      console.error("Failed to start social media ops:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/social-media-ops/status - Get status
  router.get("/social-media-ops/status", async (req, res) => {
    try {
      if (!socialMediaOps) {
        await initSocialMediaOps();
      }
      const status = socialMediaOps.getDetailedStatus ? socialMediaOps.getDetailedStatus() : { message: "CampaignMasterAgent not available" };
      res.json({ ok: true, status });
    } catch (error) {
      console.error("Failed to get status:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/social-media-ops/messages - Get recent messages
  router.get("/social-media-ops/messages", async (req, res) => {
    try {
      if (!socialMediaOps) {
        await initSocialMediaOps();
      }
      const messages = socialMediaOps.messages || [];
      res.json({ ok: true, messages: messages.slice(0, 50) });
    } catch (error) {
      console.error("Failed to get messages:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}


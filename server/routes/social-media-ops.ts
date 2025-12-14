import { Router } from "express";
import BrandGradingCore from "../../packages/dreamnet-video-brand-core/index.js";
import GeofencingCore from "../../packages/dreamnet-geofence-core/index.js";
import { socialMediaOps } from "../agents/SocialMediaOps.js";

const brandGrading = new BrandGradingCore();
const geofencing = new GeofencingCore();

export function createSocialMediaOpsRouter(): Router {
  const router = Router();

  // POST /api/social-media-ops/initialize - Initialize social media accounts
  router.post("/social-media-ops/initialize", async (req, res) => {
    try {
      const accounts = await socialMediaOps.initializeAccounts();
      res.json({ 
        ok: true, 
        result: {
          accounts,
          message: `Initialized ${accounts.length} social media accounts`
        }
      });
    } catch (error) {
      console.error("Failed to initialize social media ops:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/social-media-ops/post - Create and post content
  router.post("/social-media-ops/post", async (req, res) => {
    try {
      const { content, platforms, mediaUrls, scheduledFor } = req.body;
      if (!content) {
        return res.status(400).json({ error: "content is required" });
      }

      // Map platform names to SocialMediaOpsAgent format
      const platformMap: Record<string, string> = {
        "Twitter": "twitter",
        "LinkedIn": "linkedin",
        "Facebook": "facebook",
        "Instagram": "instagram",
        "Threads": "threads",
        "TikTok": "tiktok",
        "YouTube": "youtube",
      };

      // Post to specified platforms or all
      const targetPlatforms = platforms || ["LinkedIn", "Twitter", "Facebook", "Instagram", "Threads"];
      const normalizedPlatforms = targetPlatforms.map((p: string) => platformMap[p] || p.toLowerCase());
      
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

      // Create posts for each platform
      const posts = [];
      for (const platform of normalizedPlatforms) {
        try {
          const post = await socialMediaOps.createPost(
            platform as any,
            content,
            processedMediaUrls,
            scheduledFor
          );
          posts.push(post);
        } catch (error: any) {
          console.error(`[Social Media Ops] Failed to post to ${platform}:`, error.message);
          posts.push({ platform, error: error.message });
        }
      }

      res.json({
        ok: true,
        message: "Posts created and scheduled",
        platforms: targetPlatforms,
        posts,
        enhancedContent,
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
      
      // Initialize accounts if needed
      await socialMediaOps.initializeAccounts();
      
      // Update config if provided
      if (config.autoPost !== undefined || config.postFrequency) {
        socialMediaOps.updateConfig(config);
      }
      
      // Start auto-posting
      socialMediaOps.startAutoPosting();

      res.json({
        ok: true,
        message: "Social media automation started",
        accounts: socialMediaOps.getAccounts(),
        config: socialMediaOps.config || {},
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
      const posts = socialMediaOps.getPosts();
      
      const status = {
        accounts: accounts.length,
        activeAccounts: accounts.filter(a => a.status === "active").length,
        totalPosts: posts.length,
        postedPosts: posts.filter(p => p.status === "posted").length,
        scheduledPosts: posts.filter(p => p.status === "scheduled").length,
        failedPosts: posts.filter(p => p.status === "failed").length,
        config: socialMediaOps.config,
        platforms: accounts.map(a => ({
          platform: a.platform,
          username: a.username,
          status: a.status,
          lastPostAt: a.lastPostAt,
        })),
      };
      
      res.json({ ok: true, status });
    } catch (error) {
      console.error("Failed to get status:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/social-media-ops/messages - Get recent posts (renamed from messages)
  router.get("/social-media-ops/messages", async (req, res) => {
    try {
      const posts = socialMediaOps.getPosts();
      // Return recent posts sorted by creation date
      const recentPosts = posts
        .sort((a, b) => {
          const aTime = a.metadata?.createdAt ? new Date(a.metadata.createdAt as string).getTime() : 0;
          const bTime = b.metadata?.createdAt ? new Date(b.metadata.createdAt as string).getTime() : 0;
          return bTime - aTime;
        })
        .slice(0, 50)
        .map(post => ({
          id: post.id,
          platform: post.platform,
          content: post.content,
          status: post.status,
          postedAt: post.postedAt,
          engagement: post.engagement,
        }));
      
      res.json({ ok: true, messages: recentPosts });
    } catch (error) {
      console.error("Failed to get messages:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}


import { OrcaPackContext, OrcaPostPlan, OrcaChannel } from "../types";
import { OrcaStore } from "../store/orcaStore";
import { MediaAggregator } from "@dreamnet/social-media-poster";
import type { SocialMediaPoster } from "@dreamnet/social-media-poster";

// Platform mapping
const CHANNEL_TO_PLATFORM: Record<OrcaChannel, string> = {
  x: "twitter",
  farcaster: "farcaster",
  telegram: "telegram",
  instagram: "instagram",
  youtube: "youtube",
  github: "github",
  notion: "notion",
  slack: "slack",
  discord: "discord",
  reddit: "reddit",
  linkedin: "linkedin",
  tiktok: "tiktok",
  other: "twitter", // fallback
};

// Initialize media aggregator (singleton)
let mediaAggregator: MediaAggregator | null = null;
let socialPoster: SocialMediaPoster | null = null;

function getMediaAggregator(): MediaAggregator {
  if (!mediaAggregator) {
    mediaAggregator = new MediaAggregator();
    mediaAggregator.autoConfigure(); // Auto-configure from .env
  }
  return mediaAggregator;
}

async function getSocialPoster(): Promise<SocialMediaPoster | null> {
  if (!socialPoster) {
    try {
      const { SocialMediaPoster } = await import("@dreamnet/social-media-poster");
      socialPoster = new SocialMediaPoster();
    } catch (error) {
      console.warn("[OrcaPosterCore] SocialMediaPoster not available:", error);
      return null;
    }
  }
  return socialPoster;
}

/**
 * Select appropriate media for a post
 */
async function selectMediaForPost(
  plan: OrcaPostPlan,
  contentType: "image" | "video" | "any" = "any"
): Promise<{ url?: string; type?: "image" | "video" } | null> {
  try {
    const aggregator = getMediaAggregator();
    const allMedia = await aggregator.aggregateMedia(50); // Get 50 most recent

    // Filter by type if specified
    const filtered = contentType === "any"
      ? allMedia
      : allMedia.filter((m) => m.type === contentType);

    if (filtered.length === 0) {
      return null;
    }

    // Simple selection: pick most recent matching media
    // TODO: Add smarter selection based on content relevance
    const selected = filtered[0];
    return {
      url: selected.url,
      type: selected.type as "image" | "video",
    };
  } catch (error) {
    console.warn("[OrcaPosterCore] Failed to select media:", error);
    return null;
  }
}

/**
 * Post to a platform using SocialMediaPoster
 */
async function postToPlatform(
  plan: OrcaPostPlan,
  platform: string
): Promise<{ success: boolean; postUrl?: string; error?: string }> {
  const poster = await getSocialPoster();
  if (!poster) {
    return { success: false, error: "SocialMediaPoster not available" };
  }

  try {
    // Determine media type based on platform
    const needsVideo = platform === "youtube" || platform === "tiktok";
    const needsImage = platform === "instagram" || platform === "twitter" || platform === "facebook";

    // Select media if needed
    let mediaUrl: string | undefined;
    if (needsVideo || needsImage) {
      const media = await selectMediaForPost(plan, needsVideo ? "video" : needsImage ? "image" : "any");
      mediaUrl = media?.url;
    }

    // Post based on platform
    switch (platform) {
      case "twitter":
      case "x":
        return await poster.post({
          platform: "twitter",
          content: plan.renderedBody || "",
          mediaUrls: mediaUrl ? [mediaUrl] : undefined,
        });

      case "instagram":
        return await poster.post({
          platform: "instagram",
          content: plan.renderedBody || "",
          mediaUrls: mediaUrl ? [mediaUrl] : undefined,
        });

      case "youtube":
        if (!mediaUrl) {
          return { success: false, error: "YouTube requires a video" };
        }
        return await poster.post({
          platform: "youtube",
          content: plan.renderedBody || "",
          mediaUrls: [mediaUrl],
          type: "video",
          title: plan.renderedTitle || "DreamNet Update",
        });

      case "github":
        return await poster.post({
          platform: "github",
          type: "issue",
          title: plan.renderedTitle || "DreamNet Update",
          content: plan.renderedBody || "",
        });

      case "notion":
        return await poster.post({
          platform: "notion",
          type: "page",
          title: plan.renderedTitle || "DreamNet Update",
          content: plan.renderedBody || "",
        });

      case "slack":
        return await poster.post({
          platform: "slack",
          text: plan.renderedBody || "",
          channel: process.env.SLACK_DEFAULT_CHANNEL,
        });

      case "discord":
        return await poster.post({
          platform: "discord",
          content: plan.renderedBody || "",
          channelId: process.env.DISCORD_DEFAULT_CHANNEL_ID,
        });

      case "telegram":
        return await poster.post({
          platform: "telegram",
          content: plan.renderedBody || "",
        });

      case "reddit":
        return await poster.post({
          platform: "reddit",
          content: plan.renderedBody || "",
          title: plan.renderedTitle,
        });

      case "linkedin":
        return await poster.post({
          platform: "linkedin",
          content: plan.renderedBody || "",
        });

      case "tiktok":
        if (!mediaUrl) {
          return { success: false, error: "TikTok requires a video" };
        }
        return await poster.post({
          platform: "tiktok",
          content: plan.renderedBody || "",
          mediaUrls: [mediaUrl],
        });

      case "farcaster":
        return await poster.post({
          platform: "farcaster",
          content: plan.renderedBody || "",
        });

      default:
        return { success: false, error: `Unsupported platform: ${platform}` };
    }
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
}

/**
 * Real posting implementation (replaces simulation)
 */
export async function executeOrcaPosting(ctx: OrcaPackContext): Promise<void> {
  const plans = OrcaStore.listPlans();
  const now = Date.now();

  // Check if we have API keys configured
  const hasApiKeys = checkApiKeysConfigured();
  if (!hasApiKeys) {
    console.log("[OrcaPosterCore] No API keys configured - running in simulation mode");
    return simulateOrcaPosting(ctx);
  }

  console.log("[OrcaPosterCore] Executing real posts to configured platforms...");

  for (const plan of plans) {
    if (plan.status === "draft" || plan.status === "scheduled") {
      // Check if it's time to post
      if (plan.scheduledAt && plan.scheduledAt > now) {
        continue; // Not time yet
      }

      const platform = CHANNEL_TO_PLATFORM[plan.channel] || "twitter";
      console.log(`[OrcaPosterCore] Posting to ${platform}:`, {
        planId: plan.id,
        channel: plan.channel,
        ideaId: plan.ideaId,
        title: plan.renderedTitle,
      });

      try {
        const result = await postToPlatform(plan, platform);

        if (result.success) {
          const updated: OrcaPostPlan = {
            ...plan,
            status: "posted",
            postedAt: now,
            updatedAt: now,
            failureReason: undefined,
          };
          OrcaStore.upsertPlan(updated);

          console.log(`[OrcaPosterCore] ✅ Successfully posted to ${platform}:`, result.postUrl);

          if (ctx.narrativeField?.add) {
            ctx.narrativeField.add({
              id: `narrative-orca-post-${plan.id}-${now}`,
              timestamp: now,
              title: `Orca Pack post to ${platform}`,
              summary: `Posted idea ${plan.ideaId} to ${plan.channel}. URL: ${result.postUrl || "N/A"}`,
              severity: "info",
              domain: "social",
              tags: ["orca", "social", "post", platform],
              references: [],
              meta: { planId: plan.id, platform, postUrl: result.postUrl },
            });
          }
        } else {
          const updated: OrcaPostPlan = {
            ...plan,
            status: "failed",
            updatedAt: now,
            failureReason: result.error || "Unknown error",
          };
          OrcaStore.upsertPlan(updated);

          console.error(`[OrcaPosterCore] ❌ Failed to post to ${platform}:`, result.error);

          if (ctx.narrativeField?.add) {
            ctx.narrativeField.add({
              id: `narrative-orca-post-failed-${plan.id}-${now}`,
              timestamp: now,
              title: `Orca Pack post failed: ${platform}`,
              summary: `Failed to post idea ${plan.ideaId} to ${plan.channel}: ${result.error}`,
              severity: "warning",
              domain: "social",
              tags: ["orca", "social", "post", "failed", platform],
              references: [],
              meta: { planId: plan.id, platform, error: result.error },
            });
          }
        }
      } catch (error: any) {
        const updated: OrcaPostPlan = {
          ...plan,
          status: "failed",
          updatedAt: now,
          failureReason: error.message || "Unknown error",
        };
        OrcaStore.upsertPlan(updated);

        console.error(`[OrcaPosterCore] ❌ Error posting to ${platform}:`, error);
      }
    }
  }
}

/**
 * Check if API keys are configured for any platform
 */
function checkApiKeysConfigured(): boolean {
  const keysToCheck = [
    "TWITTER_API_KEY",
    "TWITTER_ACCESS_TOKEN",
    "INSTAGRAM_ACCESS_TOKEN",
    "TELEGRAM_BOT_TOKEN",
    "GITHUB_TOKEN",
    "NOTION_TOKEN",
    "SLACK_WEBHOOK_URL",
    "SLACK_BOT_TOKEN",
    "DISCORD_WEBHOOK_URL",
    "DISCORD_BOT_TOKEN",
    "YOUTUBE_REFRESH_TOKEN",
    "REDDIT_CLIENT_ID",
    "LINKEDIN_ACCESS_TOKEN",
    "TIKTOK_ACCESS_TOKEN",
  ];

  return keysToCheck.some((key) => {
    const value = process.env[key];
    return value && value.length > 5 && !value.includes("ENTER_");
  });
}

/**
 * Simulation mode (fallback when no API keys)
 */
export async function simulateOrcaPosting(ctx: OrcaPackContext): Promise<void> {
  const plans = OrcaStore.listPlans();
  const now = Date.now();

  for (const plan of plans) {
    if (plan.status === "draft" || plan.status === "scheduled") {
      console.log("[OrcaPosterCore] Simulated post:", {
        planId: plan.id,
        channel: plan.channel,
        ideaId: plan.ideaId,
        title: plan.renderedTitle,
      });

      const updated: OrcaPostPlan = {
        ...plan,
        status: "posted",
        postedAt: now,
        updatedAt: now,
      };

      OrcaStore.upsertPlan(updated);

      if (ctx.narrativeField?.add) {
        ctx.narrativeField.add({
          id: `narrative-orca-post-${plan.id}-${now}`,
          timestamp: now,
          title: "Orca Pack simulated post",
          summary: `Posted idea ${plan.ideaId} to ${plan.channel}.`,
          severity: "info",
          domain: "social",
          tags: ["orca", "social", "post"],
          references: [],
          meta: { planId: plan.id },
        });
      }
    }
  }
}

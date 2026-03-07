/**
 * Wolf Pack Cross-Post Agent
 * Autonomous cross-platform content distribution
 * Posts content from X to TikTok and vice versa
 */

import { db } from "../db";
import { contentQueue } from "@dreamnet/shared/schema";
import { eq, and, ne } from "drizzle-orm";
import { recordEvent } from "@dreamnet/metrics-engine";

interface CrossPostJob {
  contentId: string;
  sourcePost: {
    platform: "x" | "tiktok";
    url: string;
    mediaUrl?: string;
    caption: string;
  };
  targetPlatforms: ("x" | "tiktok")[];
}

class CrossPostAgent {
  private readonly name = "CrossPostAgent";
  private readonly maxRetries = 3;
  private readonly retryDelayMs = 5000;

  /**
   * Main autonomous loop
   */
  async runCycle(): Promise<{ processed: number; errors: number }> {
    console.log(`[${this.name}] Starting cross-post cycle...`);

    try {
      // Find all content needing cross-posts
      const pendingCrossPosts = await db
        .select()
        .from(contentQueue)
        .where(
          and(
            eq(contentQueue.needs_cross_post, true),
            ne(contentQueue.status, "posted")
          )
        );

      let processed = 0;
      let errors = 0;

      for (const content of pendingCrossPosts) {
        const hasXPost = !!content.x_post_url;
        const hasTTPost = !!content.tiktok_post_url;

        try {
          // If has X but not TikTok, cross-post to TikTok
          if (hasXPost && !hasTTPost) {
            await this.crossPostToTikTok(content);
            processed++;
          }
          // If has TikTok but not X, cross-post to X
          else if (hasTTPost && !hasXPost) {
            await this.crossPostToX(content);
            processed++;
          }
          // If neither, mark as error
          else if (!hasXPost && !hasTTPost) {
            console.warn(
              `[${this.name}] Content ${content.id} has no source posts`
            );
            errors++;
          }
        } catch (error) {
          console.error(
            `[${this.name}] Cross-post failed for ${content.id}:`,
            error
          );
          errors++;
        }
      }

      console.log(
        `[${this.name}] Cycle complete: ${processed} processed, ${errors} errors`
      );

      await recordEvent({
        type: "cross_post_cycle",
        processed,
        errors,
        timestamp: new Date(),
      }).catch(console.error);

      return { processed, errors };
    } catch (error) {
      console.error(`[${this.name}] Cycle error:`, error);
      return { processed: 0, errors: 1 };
    }
  }

  /**
   * Cross-post content to TikTok
   */
  private async crossPostToTikTok(content: any): Promise<void> {
    console.log(
      `[${this.name}] 🎬 Cross-posting to TikTok: ${content.id}`
    );

    const caption = `${content.body}${
      content.hashtags?.length ? "\n\n" + content.hashtags.join(" ") : ""
    }`;

    try {
      // Upload media to TikTok and get video ID
      let videoId: string | undefined;
      if (content.media_url) {
        videoId = await this.uploadMediaToTikTok(content.media_url);
      }

      // Post to TikTok
      const postUrl = await this.postToTikTok(caption, videoId);

      // Update database
      await db
        .update(contentQueue)
        .set({
          has_on_tiktok: true,
          tiktok_post_url: postUrl,
          posted_at_tiktok: new Date(),
          needs_cross_post: false,
          status: "posted",
          updated_at: new Date(),
        })
        .where(eq(contentQueue.id, content.id));

      console.log(
        `[${this.name}] ✅ Cross-posted to TikTok: ${postUrl}`
      );

      await recordEvent({
        type: "cross_post_success",
        content_id: content.id,
        target_platform: "tiktok",
        post_url: postUrl,
      }).catch(console.error);
    } catch (error) {
      console.error(
        `[${this.name}] Failed to cross-post to TikTok: ${error}`
      );

      await recordEvent({
        type: "cross_post_error",
        content_id: content.id,
        target_platform: "tiktok",
        error: (error as Error).message,
      }).catch(console.error);

      throw error;
    }
  }

  /**
   * Cross-post content to X
   */
  private async crossPostToX(content: any): Promise<void> {
    console.log(
      `[${this.name}] 𝕏 Cross-posting to X: ${content.id}`
    );

    const caption = `${content.body}${
      content.hashtags?.length ? "\n\n" + content.hashtags.join(" ") : ""
    }`;

    try {
      // Upload media to X and get media ID
      let mediaId: string | undefined;
      if (content.media_url) {
        mediaId = await this.uploadMediaToX(content.media_url);
      }

      // Post to X
      const postUrl = await this.postToX(caption, mediaId);

      // Update database
      await db
        .update(contentQueue)
        .set({
          has_on_x: true,
          x_post_url: postUrl,
          posted_at_x: new Date(),
          needs_cross_post: false,
          status: "posted",
          updated_at: new Date(),
        })
        .where(eq(contentQueue.id, content.id));

      console.log(
        `[${this.name}] ✅ Cross-posted to X: ${postUrl}`
      );

      await recordEvent({
        type: "cross_post_success",
        content_id: content.id,
        target_platform: "x",
        post_url: postUrl,
      }).catch(console.error);
    } catch (error) {
      console.error(
        `[${this.name}] Failed to cross-post to X: ${error}`
      );

      await recordEvent({
        type: "cross_post_error",
        content_id: content.id,
        target_platform: "x",
        error: (error as Error).message,
      }).catch(console.error);

      throw error;
    }
  }

  /**
   * Post to X (Twitter)
   */
  private async postToX(caption: string, mediaId?: string): Promise<string> {
    const bearerToken = process.env.X_BEARER_TOKEN;
    if (!bearerToken) {
      throw new Error("X API not configured (missing X_BEARER_TOKEN)");
    }

    const payload: any = {
      text: caption,
    };

    if (mediaId) {
      payload.media = { media_ids: [mediaId] };
    }

    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`X API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const tweetId = data.data.id;
    const postUrl = `https://x.com/i/web/status/${tweetId}`;

    return postUrl;
  }

  /**
   * Post to TikTok
   */
  private async postToTikTok(
    caption: string,
    videoId?: string
  ): Promise<string> {
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error(
        "TikTok API not configured (missing TIKTOK_ACCESS_TOKEN)"
      );
    }

    if (!videoId) {
      throw new Error("TikTok post requires video_id");
    }

    const endpoint = process.env.TIKTOK_API_ENDPOINT;
    if (!endpoint) {
      throw new Error(
        "TikTok API not configured (missing TIKTOK_API_ENDPOINT)"
      );
    }

    const payload = {
      video_id: videoId,
      caption: caption,
      visibility_type: "public_to_following",
    };

    const response = await fetch(`${endpoint}/post/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `TikTok API error: ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    const videoIdResponse = data.data.video_id;
    const postUrl = `https://www.tiktok.com/@dreamnet/video/${videoIdResponse}`;

    return postUrl;
  }

  /**
   * Upload media to X
   */
  private async uploadMediaToX(mediaUrl: string): Promise<string> {
    console.log(`[${this.name}] Uploading media to X: ${mediaUrl}`);

    // Download media from URL
    const mediaResponse = await fetch(mediaUrl);
    if (!mediaResponse.ok) {
      throw new Error(`Failed to download media: ${mediaUrl}`);
    }

    const mediaBuffer = await mediaResponse.arrayBuffer();
    const mediaBase64 = Buffer.from(mediaBuffer).toString("base64");

    // Upload to X using media endpoint
    const bearerToken = process.env.X_BEARER_TOKEN;
    if (!bearerToken) {
      throw new Error("X Bearer token not configured");
    }

    const uploadResponse = await fetch(
      "https://upload.twitter.com/i/media/upload.json",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        body: new URLSearchParams({
          media_data: mediaBase64,
        }),
      }
    );

    if (!uploadResponse.ok) {
      throw new Error(
        `X media upload failed: ${uploadResponse.statusText}`
      );
    }

    const uploadData = await uploadResponse.json();
    return uploadData.media_id_string;
  }

  /**
   * Upload media to TikTok
   */
  private async uploadMediaToTikTok(mediaUrl: string): Promise<string> {
    console.log(`[${this.name}] Uploading media to TikTok: ${mediaUrl}`);

    // Download media from URL
    const mediaResponse = await fetch(mediaUrl);
    if (!mediaResponse.ok) {
      throw new Error(`Failed to download media: ${mediaUrl}`);
    }

    const mediaBuffer = await mediaResponse.arrayBuffer();

    // Upload to TikTok using media endpoint
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    const endpoint = process.env.TIKTOK_API_ENDPOINT;

    if (!accessToken || !endpoint) {
      throw new Error("TikTok API not fully configured");
    }

    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append(
      "video",
      new Blob([mediaBuffer], { type: "video/mp4" }),
      "video.mp4"
    );

    const uploadResponse = await fetch(`${endpoint}/video/upload/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(
        `TikTok media upload failed: ${uploadResponse.statusText}`
      );
    }

    const uploadData = await uploadResponse.json();
    return uploadData.data.video_id;
  }
}

export const crossPostAgent = new CrossPostAgent();

export default crossPostAgent;

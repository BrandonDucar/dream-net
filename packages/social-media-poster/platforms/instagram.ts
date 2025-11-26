/**
 * Instagram Graph API Integration
 * 
 * Uses Instagram Graph API (Meta) for posting
 * Docs: https://developers.facebook.com/docs/instagram-api
 * 
 * Requirements:
 * - Instagram Business Account
 * - Facebook Page linked to Instagram
 * - Facebook App with Instagram permissions
 */

import axios from "axios";

export interface InstagramConfig {
  accessToken: string; // Facebook Page Access Token
  instagramBusinessAccountId: string; // Instagram Business Account ID
  pageId?: string; // Facebook Page ID (optional)
}

export class InstagramPoster {
  private config: InstagramConfig;
  private baseUrl = "https://graph.facebook.com/v21.0";

  constructor(config: InstagramConfig) {
    this.config = config;
  }

  /**
   * Post a photo to Instagram
   */
  async postPhoto(imageUrl: string, caption: string): Promise<{ success: boolean; mediaId?: string; permalink?: string; error?: string }> {
    try {
      // Step 1: Create media container
      const createResponse = await axios.post(
        `${this.baseUrl}/${this.config.instagramBusinessAccountId}/media`,
        {
          image_url: imageUrl,
          caption: caption,
          access_token: this.config.accessToken,
        }
      );

      const creationId = createResponse.data.id;

      // Step 2: Publish the media
      const publishResponse = await axios.post(
        `${this.baseUrl}/${this.config.instagramBusinessAccountId}/media_publish`,
        {
          creation_id: creationId,
          access_token: this.config.accessToken,
        }
      );

      const mediaId = publishResponse.data.id;

      // Step 3: Get permalink
      const permalinkResponse = await axios.get(
        `${this.baseUrl}/${mediaId}`,
        {
          params: {
            fields: "permalink",
            access_token: this.config.accessToken,
          },
        }
      );

      return {
        success: true,
        mediaId,
        permalink: permalinkResponse.data.permalink,
      };
    } catch (error: any) {
      console.error("[Instagram] Post failed:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || "Failed to post to Instagram",
      };
    }
  }

  /**
   * Post a video to Instagram
   */
  async postVideo(videoUrl: string, caption: string, thumbnailUrl?: string): Promise<{ success: boolean; mediaId?: string; permalink?: string; error?: string }> {
    try {
      // Step 1: Create media container
      const createResponse = await axios.post(
        `${this.baseUrl}/${this.config.instagramBusinessAccountId}/media`,
        {
          media_type: "REELS", // or "VIDEO" for regular posts
          video_url: videoUrl,
          caption: caption,
          thumb_offset: 0,
          access_token: this.config.accessToken,
        }
      );

      const creationId = createResponse.data.id;

      // Step 2: Check status (videos need processing)
      let status = "IN_PROGRESS";
      let attempts = 0;
      while (status === "IN_PROGRESS" && attempts < 30) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const statusResponse = await axios.get(
          `${this.baseUrl}/${creationId}`,
          {
            params: {
              fields: "status_code",
              access_token: this.config.accessToken,
            },
          }
        );
        status = statusResponse.data.status_code;
        attempts++;
      }

      if (status !== "FINISHED") {
        throw new Error(`Video processing failed: ${status}`);
      }

      // Step 3: Publish the media
      const publishResponse = await axios.post(
        `${this.baseUrl}/${this.config.instagramBusinessAccountId}/media_publish`,
        {
          creation_id: creationId,
          access_token: this.config.accessToken,
        }
      );

      const mediaId = publishResponse.data.id;

      // Step 4: Get permalink
      const permalinkResponse = await axios.get(
        `${this.baseUrl}/${mediaId}`,
        {
          params: {
            fields: "permalink",
            access_token: this.config.accessToken,
          },
        }
      );

      return {
        success: true,
        mediaId,
        permalink: permalinkResponse.data.permalink,
      };
    } catch (error: any) {
      console.error("[Instagram] Video post failed:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || "Failed to post video to Instagram",
      };
    }
  }
}


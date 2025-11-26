/**
 * Facebook Graph API Integration
 * 
 * Uses Facebook Graph API for posting to Facebook Pages
 * Docs: https://developers.facebook.com/docs/graph-api
 */

import axios from "axios";

export interface FacebookConfig {
  accessToken: string; // Page Access Token
  pageId: string; // Facebook Page ID
}

export class FacebookPoster {
  private config: FacebookConfig;
  private baseUrl = "https://graph.facebook.com/v21.0";

  constructor(config: FacebookConfig) {
    this.config = config;
  }

  /**
   * Post to Facebook Page
   */
  async post(content: string, mediaUrl?: string, link?: string): Promise<{ success: boolean; postId?: string; permalink?: string; error?: string }> {
    try {
      const postData: any = {
        message: content,
        access_token: this.config.accessToken,
      };

      // Add link if provided
      if (link) {
        postData.link = link;
      }

      // Add photo if provided
      if (mediaUrl) {
        postData.url = mediaUrl;
      }

      const response = await axios.post(
        `${this.baseUrl}/${this.config.pageId}/feed`,
        postData
      );

      return {
        success: true,
        postId: response.data.id,
        permalink: `https://facebook.com/${response.data.id}`,
      };
    } catch (error: any) {
      console.error("[Facebook] Post failed:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || "Failed to post to Facebook",
      };
    }
  }

  /**
   * Post a photo
   */
  async postPhoto(imageUrl: string, caption: string): Promise<{ success: boolean; postId?: string; permalink?: string; error?: string }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.config.pageId}/photos`,
        {
          url: imageUrl,
          caption: caption,
          access_token: this.config.accessToken,
        }
      );

      return {
        success: true,
        postId: response.data.id,
        permalink: `https://facebook.com/${response.data.id}`,
      };
    } catch (error: any) {
      console.error("[Facebook] Photo post failed:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || "Failed to post photo to Facebook",
      };
    }
  }
}


/**
 * YouTube Platform Integration
 * Posts to: YouTube (videos, shorts, live streams)
 */

import { google, youtube_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { readFileSync, statSync } from "fs";
import axios from "axios";

export interface YouTubePostOptions {
  type: "video" | "short" | "live";
  title: string;
  description: string;
  videoPath?: string; // Local file path
  videoUrl?: string; // Remote URL
  thumbnailPath?: string; // Local thumbnail path
  thumbnailUrl?: string; // Remote thumbnail URL
  tags?: string[];
  categoryId?: string; // YouTube category ID (default: 22 for People & Blogs)
  privacy?: "private" | "unlisted" | "public";
  playlistId?: string; // Add to playlist
}

export interface YouTubeConfig {
  clientId?: string; // OAuth2 Client ID
  clientSecret?: string; // OAuth2 Client Secret
  refreshToken?: string; // OAuth2 Refresh Token
  accessToken?: string; // OAuth2 Access Token (optional, will refresh if needed)
  apiKey?: string; // API Key (for read-only operations)
}

export class YouTubePoster {
  private oauth2Client: OAuth2Client | null = null;
  private youtube: youtube_v3.Youtube | null = null;
  private config: YouTubeConfig;

  constructor(config: YouTubeConfig) {
    this.config = config;
    this.initializeClient();
  }

  private initializeClient(): void {
    if (this.config.clientId && this.config.clientSecret) {
      this.oauth2Client = new google.auth.OAuth2(
        this.config.clientId,
        this.config.clientSecret,
        "http://localhost:3000/oauth/youtube/callback" // Redirect URI
      );

      if (this.config.refreshToken) {
        this.oauth2Client.setCredentials({
          refresh_token: this.config.refreshToken,
        });
      } else if (this.config.accessToken) {
        this.oauth2Client.setCredentials({
          access_token: this.config.accessToken,
        });
      }

      this.youtube = google.youtube({
        version: "v3",
        auth: this.oauth2Client,
      });
    } else if (this.config.apiKey) {
      // Read-only mode with API key
      this.youtube = google.youtube({
        version: "v3",
        auth: this.config.apiKey,
      });
    }
  }

  async post(options: YouTubePostOptions): Promise<{ success: boolean; url?: string; videoId?: string; error?: string }> {
    if (!this.youtube) {
      return { success: false, error: "YouTube client not initialized. Need OAuth2 credentials." };
    }

    if (!this.oauth2Client) {
      return { success: false, error: "OAuth2 required for uploading videos. Use clientId, clientSecret, and refreshToken." };
    }

    try {
      // Ensure we have a valid access token
      await this.refreshAccessTokenIfNeeded();

      switch (options.type) {
        case "video":
        case "short":
          return await this.uploadVideo(options);
        case "live":
          return await this.createLiveStream(options);
        default:
          return { success: false, error: `Unknown post type: ${options.type}` };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private async refreshAccessTokenIfNeeded(): Promise<void> {
    if (!this.oauth2Client) return;

    const credentials = await this.oauth2Client.getAccessToken();
    if (!credentials.token) {
      throw new Error("Failed to get access token. Refresh token may be invalid.");
    }
  }

  private async uploadVideo(
    options: YouTubePostOptions
  ): Promise<{ success: boolean; url?: string; videoId?: string; error?: string }> {
    if (!this.youtube || !this.oauth2Client) {
      return { success: false, error: "YouTube client not initialized" };
    }

    // Get video file
    let videoBuffer: Buffer;
    if (options.videoPath) {
      videoBuffer = readFileSync(options.videoPath);
    } else if (options.videoUrl) {
      const response = await axios.get(options.videoUrl, { responseType: "arraybuffer" });
      videoBuffer = Buffer.from(response.data);
    } else {
      return { success: false, error: "Either videoPath or videoUrl required" };
    }

    // Get thumbnail if provided
    let thumbnailBuffer: Buffer | undefined;
    if (options.thumbnailPath) {
      thumbnailBuffer = readFileSync(options.thumbnailPath);
    } else if (options.thumbnailUrl) {
      const response = await axios.get(options.thumbnailUrl, { responseType: "arraybuffer" });
      thumbnailBuffer = Buffer.from(response.data);
    }

    // Prepare video metadata
    const videoMetadata: youtube_v3.Schema$Video = {
      snippet: {
        title: options.title,
        description: options.description,
        tags: options.tags || [],
        categoryId: options.categoryId || "22", // People & Blogs
      },
      status: {
        privacyStatus: options.privacy || "public",
        selfDeclaredMadeForKids: false,
      },
    };

    // Upload video
    const uploadResponse = await this.youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: videoMetadata,
      media: {
        body: videoBuffer,
      },
    });

    const videoId = uploadResponse.data.id;
    if (!videoId) {
      return { success: false, error: "Video uploaded but no ID returned" };
    }

    // Upload thumbnail if provided
    if (thumbnailBuffer) {
      try {
        await this.youtube.thumbnails.set({
          videoId,
          media: {
            body: thumbnailBuffer,
          },
        });
      } catch (error) {
        console.warn("[YouTube] Failed to upload thumbnail:", error);
        // Don't fail the whole operation if thumbnail fails
      }
    }

    // Add to playlist if specified
    if (options.playlistId) {
      try {
        await this.youtube.playlistItems.insert({
          part: ["snippet"],
          requestBody: {
            snippet: {
              playlistId: options.playlistId,
              resourceId: {
                kind: "youtube#video",
                videoId,
              },
            },
          },
        });
      } catch (error) {
        console.warn("[YouTube] Failed to add to playlist:", error);
      }
    }

    return {
      success: true,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      videoId,
    };
  }

  private async createLiveStream(
    options: YouTubePostOptions
  ): Promise<{ success: boolean; url?: string; videoId?: string; error?: string }> {
    if (!this.youtube || !this.oauth2Client) {
      return { success: false, error: "YouTube client not initialized" };
    }

    // Create live broadcast
    const broadcastResponse = await this.youtube.liveBroadcasts.insert({
      part: ["snippet", "status", "contentDetails"],
      requestBody: {
        snippet: {
          title: options.title,
          description: options.description,
        },
        status: {
          privacyStatus: options.privacy || "public",
          selfDeclaredMadeForKids: false,
        },
        contentDetails: {
          enableAutoStart: false,
          enableAutoStop: false,
        },
      },
    });

    const broadcastId = broadcastResponse.data.id;
    if (!broadcastId) {
      return { success: false, error: "Failed to create live broadcast" };
    }

    // Create live stream (for RTMP URL)
    const streamResponse = await this.youtube.liveStreams.insert({
      part: ["snippet", "cdn"],
      requestBody: {
        snippet: {
          title: options.title,
        },
        cdn: {
          format: "1080p",
          ingestionType: "rtmp",
        },
      },
    });

    const streamId = streamResponse.data.id;
    if (!streamId) {
      return { success: false, error: "Failed to create live stream" };
    }

    // Bind stream to broadcast
    await this.youtube.liveBroadcasts.bind({
      part: ["id", "snippet", "contentDetails", "status"],
      id: broadcastId,
      streamId,
    });

    return {
      success: true,
      url: `https://www.youtube.com/watch?v=${broadcastId}`,
      videoId: broadcastId,
    };
  }

  /**
   * Get OAuth2 authorization URL
   * User needs to visit this URL to authorize the app
   */
  getAuthorizationUrl(): string {
    if (!this.oauth2Client) {
      throw new Error("OAuth2 client not initialized");
    }

    const scopes = [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube",
      "https://www.googleapis.com/auth/youtube.force-ssl",
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent", // Force consent to get refresh token
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokensFromCode(code: string): Promise<{ accessToken: string; refreshToken: string }> {
    if (!this.oauth2Client) {
      throw new Error("OAuth2 client not initialized");
    }

    const { tokens } = await this.oauth2Client.getToken(code);
    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error("Failed to get tokens from authorization code");
    }

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
  }
}


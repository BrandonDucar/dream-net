/**
 * PeerTube P2P Integration
 * 
 * Integrates PeerTube P2P streaming patterns for DreamNet OTT Streaming vertical
 */

import axios, { AxiosInstance } from "axios";

export interface PeerTubeConfig {
  instanceUrl: string;
  apiKey?: string;
}

export interface PeerTubeVideo {
  id: string;
  uuid: string;
  name: string;
  description?: string;
  duration: number;
  thumbnailUrl?: string;
  streamingUrl?: string;
  p2pUrl?: string;
  views: number;
  likes: number;
  publishedAt: string;
  channel: {
    id: string;
    name: string;
    displayName: string;
  };
}

export interface PeerTubeChannel {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  videoCount: number;
  followerCount: number;
}

/**
 * PeerTube Client
 * 
 * Wraps PeerTube P2P streaming patterns
 */
export class PeerTubeClient {
  private client: AxiosInstance;
  private config: PeerTubeConfig;

  constructor(config: PeerTubeConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: `${config.instanceUrl}/api/v1`,
      headers: {
        Authorization: config.apiKey ? `Bearer ${config.apiKey}` : undefined,
      },
    });
  }

  /**
   * Get videos
   */
  async getVideos(limit: number = 20): Promise<PeerTubeVideo[]> {
    try {
      const response = await this.client.get("/videos", {
        params: { count: limit },
      });

      return response.data.data?.map((video: any) => ({
        id: video.id,
        uuid: video.uuid,
        name: video.name,
        description: video.description,
        duration: video.duration,
        thumbnailUrl: video.thumbnailPath ? `${this.config.instanceUrl}${video.thumbnailPath}` : undefined,
        streamingUrl: video.streamingPlaylists?.[0]?.playlistUrl,
        p2pUrl: video.trackerUrls?.[0],
        views: video.views || 0,
        likes: video.likes || 0,
        publishedAt: video.publishedAt,
        channel: {
          id: video.channel.id,
          name: video.channel.name,
          displayName: video.channel.displayName,
        },
      })) || [];
    } catch (error: any) {
      console.error("[PeerTubeClient] Failed to get videos:", error.message);
      return [];
    }
  }

  /**
   * Get video by ID
   */
  async getVideo(videoId: string): Promise<PeerTubeVideo | null> {
    try {
      const response = await this.client.get(`/videos/${videoId}`);
      const video = response.data;

      return {
        id: video.id,
        uuid: video.uuid,
        name: video.name,
        description: video.description,
        duration: video.duration,
        thumbnailUrl: video.thumbnailPath ? `${this.config.instanceUrl}${video.thumbnailPath}` : undefined,
        streamingUrl: video.streamingPlaylists?.[0]?.playlistUrl,
        p2pUrl: video.trackerUrls?.[0],
        views: video.views || 0,
        likes: video.likes || 0,
        publishedAt: video.publishedAt,
        channel: {
          id: video.channel.id,
          name: video.channel.name,
          displayName: video.channel.displayName,
        },
      };
    } catch (error: any) {
      console.error("[PeerTubeClient] Failed to get video:", error.message);
      return null;
    }
  }

  /**
   * Upload video
   */
  async uploadVideo(
    videoFile: File | Buffer,
    metadata: {
      name: string;
      description?: string;
      channelId: string;
      privacy?: number;
    }
  ): Promise<{ success: boolean; videoId?: string; error?: string }> {
    try {
      const formData = new FormData();
      formData.append("videofile", videoFile);
      formData.append("name", metadata.name);
      if (metadata.description) formData.append("description", metadata.description);
      formData.append("channelId", metadata.channelId);
      if (metadata.privacy) formData.append("privacy", metadata.privacy.toString());

      const response = await this.client.post("/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        videoId: response.data.video?.uuid,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get channels
   */
  async getChannels(limit: number = 20): Promise<PeerTubeChannel[]> {
    try {
      const response = await this.client.get("/video-channels", {
        params: { count: limit },
      });

      return response.data.data?.map((channel: any) => ({
        id: channel.id,
        name: channel.name,
        displayName: channel.displayName,
        description: channel.description,
        videoCount: channel.videosCount || 0,
        followerCount: channel.followersCount || 0,
      })) || [];
    } catch (error: any) {
      console.error("[PeerTubeClient] Failed to get channels:", error.message);
      return [];
    }
  }
}


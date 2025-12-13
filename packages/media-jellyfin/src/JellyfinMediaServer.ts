/**
 * Jellyfin Media Server Integration
 * 
 * Integrates Jellyfin media server patterns for DreamNet OTT Streaming vertical
 */

import axios, { AxiosInstance } from "axios";

export interface JellyfinConfig {
  serverUrl: string;
  apiKey?: string;
  username?: string;
  password?: string;
  userId?: string;
}

export interface JellyfinMediaItem {
  id: string;
  name: string;
  type: "Movie" | "Series" | "Episode" | "Music" | "AudioBook" | "Book";
  path?: string;
  imageUrl?: string;
  overview?: string;
  year?: number;
  runtime?: number;
  genres?: string[];
}

export interface JellyfinLibrary {
  id: string;
  name: string;
  type: "movies" | "tvshows" | "music" | "books";
  itemCount?: number;
}

/**
 * Jellyfin Media Server Client
 * 
 * Wraps Jellyfin API patterns for DreamNet media streaming
 */
export class JellyfinMediaServer {
  private client: AxiosInstance;
  private config: JellyfinConfig;
  private accessToken: string | null = null;

  constructor(config: JellyfinConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.serverUrl,
      headers: {
        "X-Emby-Authorization": config.apiKey
          ? `MediaBrowser Client="DreamNet", Device="DreamNet", DeviceId="dreamnet-${Date.now()}", Version="1.0.0", Token="${config.apiKey}"`
          : undefined,
      },
    });
  }

  /**
   * Authenticate with Jellyfin server
   */
  async authenticate(): Promise<{ success: boolean; error?: string }> {
    if (this.config.apiKey) {
      // API key authentication
      this.accessToken = this.config.apiKey;
      return { success: true };
    }

    if (this.config.username && this.config.password) {
      // Username/password authentication
      try {
        const response = await this.client.post("/Users/authenticatebyname", {
          Username: this.config.username,
          Pw: this.config.password,
        });

        this.accessToken = response.data.AccessToken;
        this.config.userId = response.data.User?.Id;
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || "Authentication failed",
        };
      }
    }

    return {
      success: false,
      error: "No authentication method provided",
    };
  }

  /**
   * Get all libraries
   */
  async getLibraries(): Promise<JellyfinLibrary[]> {
    try {
      const response = await this.client.get("/Library/VirtualFolders", {
        headers: {
          Authorization: `MediaBrowser Token="${this.accessToken}"`,
        },
      });

      return response.data.Items?.map((item: any) => ({
        id: item.Id,
        name: item.Name,
        type: this.inferLibraryType(item.CollectionType),
        itemCount: item.ItemCount,
      })) || [];
    } catch (error: any) {
      console.error("[JellyfinMediaServer] Failed to get libraries:", error.message);
      return [];
    }
  }

  /**
   * Get media items from library
   */
  async getMediaItems(
    libraryId?: string,
    limit: number = 50
  ): Promise<JellyfinMediaItem[]> {
    try {
      const params: any = {
        Limit: limit,
        Recursive: true,
        IncludeItemTypes: "Movie,Series,Episode",
      };

      if (libraryId) {
        params.ParentId = libraryId;
      }

      const response = await this.client.get("/Items", {
        params,
        headers: {
          Authorization: `MediaBrowser Token="${this.accessToken}"`,
        },
      });

      return response.data.Items?.map((item: any) => ({
        id: item.Id,
        name: item.Name,
        type: item.Type,
        path: item.Path,
        imageUrl: item.ImageTags?.Primary
          ? `${this.config.serverUrl}/Items/${item.Id}/Images/Primary`
          : undefined,
        overview: item.Overview,
        year: item.ProductionYear,
        runtime: item.RunTimeTicks ? Math.floor(item.RunTimeTicks / 10000000 / 60) : undefined,
        genres: item.Genres || [],
      })) || [];
    } catch (error: any) {
      console.error("[JellyfinMediaServer] Failed to get media items:", error.message);
      return [];
    }
  }

  /**
   * Get media item by ID
   */
  async getMediaItem(itemId: string): Promise<JellyfinMediaItem | null> {
    try {
      const response = await this.client.get(`/Items/${itemId}`, {
        headers: {
          Authorization: `MediaBrowser Token="${this.accessToken}"`,
        },
      });

      const item = response.data;
      return {
        id: item.Id,
        name: item.Name,
        type: item.Type,
        path: item.Path,
        imageUrl: item.ImageTags?.Primary
          ? `${this.config.serverUrl}/Items/${item.Id}/Images/Primary`
          : undefined,
        overview: item.Overview,
        year: item.ProductionYear,
        runtime: item.RunTimeTicks ? Math.floor(item.RunTimeTicks / 10000000 / 60) : undefined,
        genres: item.Genres || [],
      };
    } catch (error: any) {
      console.error("[JellyfinMediaServer] Failed to get media item:", error.message);
      return null;
    }
  }

  /**
   * Get streaming URL for media item
   */
  async getStreamingUrl(
    itemId: string,
    options?: {
      maxWidth?: number;
      maxHeight?: number;
      videoCodec?: string;
      audioCodec?: string;
    }
  ): Promise<string | null> {
    try {
      const params: any = {
        Id: itemId,
        MediaSourceId: itemId,
      };

      if (options?.maxWidth) params.MaxWidth = options.maxWidth;
      if (options?.maxHeight) params.MaxHeight = options.maxHeight;
      if (options?.videoCodec) params.VideoCodec = options.videoCodec;
      if (options?.audioCodec) params.AudioCodec = options.audioCodec;

      // Get playback info
      const response = await this.client.get("/Items/PlaybackInfo", {
        params,
        headers: {
          Authorization: `MediaBrowser Token="${this.accessToken}"`,
        },
      });

      const mediaSource = response.data.MediaSources?.[0];
      if (mediaSource) {
        return `${this.config.serverUrl}/Videos/${itemId}/stream?MediaSourceId=${mediaSource.Id}&api_key=${this.accessToken}`;
      }

      return null;
    } catch (error: any) {
      console.error("[JellyfinMediaServer] Failed to get streaming URL:", error.message);
      return null;
    }
  }

  /**
   * Search media
   */
  async searchMedia(
    query: string,
    limit: number = 20
  ): Promise<JellyfinMediaItem[]> {
    try {
      const response = await this.client.get("/Search/Hints", {
        params: {
          SearchTerm: query,
          Limit: limit,
        },
        headers: {
          Authorization: `MediaBrowser Token="${this.accessToken}"`,
        },
      });

      return response.data.SearchHints?.map((hint: any) => ({
        id: hint.ItemId,
        name: hint.Name,
        type: hint.Type,
        imageUrl: hint.ImageUrl,
      })) || [];
    } catch (error: any) {
      console.error("[JellyfinMediaServer] Failed to search media:", error.message);
      return [];
    }
  }

  /**
   * Infer library type from collection type
   */
  private inferLibraryType(collectionType?: string): "movies" | "tvshows" | "music" | "books" {
    if (!collectionType) return "movies";
    if (collectionType.toLowerCase().includes("movie")) return "movies";
    if (collectionType.toLowerCase().includes("tv") || collectionType.toLowerCase().includes("show")) return "tvshows";
    if (collectionType.toLowerCase().includes("music")) return "music";
    if (collectionType.toLowerCase().includes("book")) return "books";
    return "movies";
  }
}


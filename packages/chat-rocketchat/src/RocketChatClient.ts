/**
 * Rocket.Chat Integration
 * 
 * Integrates Rocket.Chat self-hosted chat patterns for DreamNet Pods vertical
 */

import axios, { AxiosInstance } from "axios";

export interface RocketChatConfig {
  serverUrl: string;
  userId?: string;
  authToken?: string;
}

export interface RocketChatRoom {
  _id: string;
  name?: string;
  t: "c" | "p" | "d" | "l"; // channel, private, direct, livechat
  usernames?: string[];
  topic?: string;
  description?: string;
}

export interface RocketChatMessage {
  _id: string;
  rid: string;
  msg: string;
  ts: string;
  u: {
    _id: string;
    username: string;
    name?: string;
  };
  editedAt?: string;
}

/**
 * Rocket.Chat Client
 * 
 * Wraps Rocket.Chat API for self-hosted chat
 */
export class RocketChatClient {
  private client: AxiosInstance;
  private config: RocketChatConfig;

  constructor(config: RocketChatConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: `${config.serverUrl}/api/v1`,
      headers: {
        "X-User-Id": config.userId,
        "X-Auth-Token": config.authToken,
      },
    });
  }

  /**
   * Login
   */
  async login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.client.post("/login", {
        user: username,
        password,
      });

      this.config.userId = response.data.data.userId;
      this.config.authToken = response.data.data.authToken;
      this.client.defaults.headers["X-User-Id"] = this.config.userId;
      this.client.defaults.headers["X-Auth-Token"] = this.config.authToken;

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get rooms
   */
  async getRooms(): Promise<RocketChatRoom[]> {
    try {
      const response = await this.client.get("/rooms.get");
      return response.data.update || [];
    } catch (error: any) {
      console.error("[RocketChatClient] Failed to get rooms:", error.message);
      return [];
    }
  }

  /**
   * Send message
   */
  async sendMessage(
    roomId: string,
    message: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await this.client.post("/chat.postMessage", {
        roomId,
        text: message,
      });

      return {
        success: true,
        messageId: response.data.message._id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get messages
   */
  async getMessages(
    roomId: string,
    limit: number = 50
  ): Promise<RocketChatMessage[]> {
    try {
      const response = await this.client.get("/channels.messages", {
        params: {
          roomId,
          count: limit,
        },
      });

      return response.data.messages || [];
    } catch (error: any) {
      console.error("[RocketChatClient] Failed to get messages:", error.message);
      return [];
    }
  }
}


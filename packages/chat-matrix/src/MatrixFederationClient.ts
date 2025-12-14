/**
 * Matrix Federation Integration
 * 
 * Integrates Matrix federation patterns for DreamNet Pods vertical
 */

import axios, { AxiosInstance } from "axios";
import { createClient, MatrixClient } from "matrix-js-sdk";

export interface MatrixConfig {
  homeserverUrl: string;
  accessToken?: string;
  userId?: string;
  password?: string;
  deviceId?: string;
}

export interface MatrixRoom {
  id: string;
  name?: string;
  topic?: string;
  members: string[];
  encrypted?: boolean;
}

export interface MatrixMessage {
  id: string;
  roomId: string;
  sender: string;
  content: string;
  timestamp: number;
  type: "m.text" | "m.image" | "m.file" | "m.video" | "m.audio";
}

/**
 * Matrix Federation Client
 * 
 * Wraps Matrix federation patterns for DreamNet decentralized chat
 */
export class MatrixFederationClient {
  private client: MatrixClient | null = null;
  private axiosClient: AxiosInstance;
  private config: MatrixConfig;

  constructor(config: MatrixConfig) {
    this.config = config;
    this.axiosClient = axios.create({
      baseURL: config.homeserverUrl,
    });
  }

  /**
   * Initialize Matrix client
   */
  async initialize(): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.config.accessToken && this.config.userId) {
        // Use existing access token
        this.client = createClient({
          baseUrl: this.config.homeserverUrl,
          accessToken: this.config.accessToken,
          userId: this.config.userId,
          deviceId: this.config.deviceId,
        });
      } else if (this.config.userId && this.config.password) {
        // Login with password
        this.client = createClient({
          baseUrl: this.config.homeserverUrl,
        });

        const response = await this.client.login(
          "m.login.password",
          {
            user: this.config.userId,
            password: this.config.password,
          }
        );

        this.config.accessToken = response.access_token;
        this.config.userId = response.user_id;
        this.config.deviceId = response.device_id;
      } else {
        return {
          success: false,
          error: "No authentication method provided",
        };
      }

      await this.client.startClient();
      console.log("[MatrixFederationClient] Initialized");
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Matrix initialization failed",
      };
    }
  }

  /**
   * Create a room
   */
  async createRoom(
    name: string,
    options?: {
      topic?: string;
      encrypted?: boolean;
      invite?: string[];
    }
  ): Promise<{ success: boolean; roomId?: string; error?: string }> {
    if (!this.client) {
      await this.initialize();
    }

    try {
      const roomId = await this.client!.createRoom({
        name,
        topic: options?.topic,
        encryption: options?.encrypted,
        invite: options?.invite,
      });

      return {
        success: true,
        roomId: roomId.room_id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Join a room
   */
  async joinRoom(roomId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.client) {
      await this.initialize();
    }

    try {
      await this.client!.joinRoom(roomId);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send a message
   */
  async sendMessage(
    roomId: string,
    content: string,
    type: MatrixMessage["type"] = "m.text"
  ): Promise<{ success: boolean; eventId?: string; error?: string }> {
    if (!this.client) {
      await this.initialize();
    }

    try {
      const eventId = await this.client!.sendTextMessage(roomId, content);
      return {
        success: true,
        eventId: eventId.event_id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get room messages
   */
  async getRoomMessages(
    roomId: string,
    limit: number = 50
  ): Promise<MatrixMessage[]> {
    if (!this.client) {
      await this.initialize();
    }

    try {
      const messages = await this.client!.getRoomMessages(roomId, null, limit, "b");
      return messages.chunk.map((event: any) => ({
        id: event.event_id,
        roomId,
        sender: event.sender,
        content: event.content.body,
        timestamp: event.origin_server_ts,
        type: event.content.msgtype || "m.text",
      }));
    } catch (error: any) {
      console.error("[MatrixFederationClient] Failed to get messages:", error.message);
      return [];
    }
  }

  /**
   * Get user rooms
   */
  async getRooms(): Promise<MatrixRoom[]> {
    if (!this.client) {
      await this.initialize();
    }

    try {
      const rooms = this.client!.getRooms();
      return rooms.map((room: any) => ({
        id: room.roomId,
        name: room.name,
        topic: room.topic,
        members: room.getMembers().map((m: any) => m.userId),
        encrypted: room.hasEncryptionStateEvent(),
      }));
    } catch (error: any) {
      console.error("[MatrixFederationClient] Failed to get rooms:", error.message);
      return [];
    }
  }

  /**
   * Invite user to room
   */
  async inviteUser(
    roomId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.client) {
      await this.initialize();
    }

    try {
      await this.client!.invite(roomId, userId);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}


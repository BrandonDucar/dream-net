/**
 * Discord Platform Integration
 * Uses official discord.js SDK
 * Posts to: Channels, DMs, Threads
 */

import { REST, Routes } from "discord.js";
import axios from "axios";

export interface DiscordPostOptions {
  channelId?: string; // Channel ID
  content: string;
  embeds?: any[]; // Discord embeds
  components?: any[]; // Discord components (buttons, etc.)
  threadId?: string; // Thread ID (for posting in thread)
}

export interface DiscordConfig {
  webhookUrl?: string; // For webhook-based posting (simpler)
  botToken?: string; // Bot token (for API-based posting)
  defaultChannelId?: string; // Default channel ID
}

export class DiscordPoster {
  private config: DiscordConfig;
  private rest?: REST;

  constructor(config: DiscordConfig) {
    this.config = config;
    
    // Initialize official Discord.js REST API client
    if (config.botToken) {
      this.rest = new REST().setToken(config.botToken);
    }
  }

  async post(options: DiscordPostOptions): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      if (this.config.webhookUrl) {
        return await this.postViaWebhook(options);
      } else if (this.rest) {
        return await this.postViaAPI(options);
      } else {
        return { success: false, error: "Either webhookUrl or botToken required" };
      }
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  }

  private async postViaWebhook(
    options: DiscordPostOptions
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    const payload: any = {
      content: options.content,
    };

    if (options.embeds) {
      payload.embeds = options.embeds;
    }

    if (options.components) {
      payload.components = options.components;
    }

    try {
      const response = await axios.post(this.config.webhookUrl!, payload);

      if (response.status === 200 || response.status === 204) {
        return {
          success: true,
          url: response.data?.url || "Posted to Discord",
        };
      } else {
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  }

  private async postViaAPI(
    options: DiscordPostOptions
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    if (!this.rest) {
      return { success: false, error: "REST client not initialized" };
    }

    const channelId = options.threadId || options.channelId || this.config.defaultChannelId;
    if (!channelId) {
      return { success: false, error: "Channel ID required" };
    }

    try {
      const payload: any = {
        content: options.content,
      };

      if (options.embeds) {
        payload.embeds = options.embeds;
      }

      if (options.components) {
        payload.components = options.components;
      }

      const message = await this.rest.post(Routes.channelMessages(channelId), {
        body: payload,
      }) as any;

      return {
        success: true,
        url: `https://discord.com/channels/${channelId}/${message.id}`,
      };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  }

  /**
   * Create rich Discord embed
   */
  createEmbed(title: string, description: string, fields?: Array<{ name: string; value: string; inline?: boolean }>): any {
    return {
      title,
      description,
      fields: fields?.map((field) => ({
        name: field.name,
        value: field.value,
        inline: field.inline || false,
      })),
      timestamp: new Date().toISOString(),
      color: 0x00d4ff, // DreamNet blue
    };
  }
}


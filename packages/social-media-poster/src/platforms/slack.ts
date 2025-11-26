/**
 * Slack Platform Integration
 * Uses official @slack/web-api SDK
 * Posts to: Channels, DMs, Threads
 */

import { WebClient } from "@slack/web-api";
import { IncomingWebhook } from "@slack/webhook";

export interface SlackPostOptions {
  channel?: string; // Channel ID or name (e.g., "#general" or "C1234567890")
  text: string;
  blocks?: any[]; // Slack Block Kit blocks
  threadTs?: string; // Thread timestamp (for replying to thread)
  username?: string; // Bot username
  iconEmoji?: string; // Bot icon emoji
}

export interface SlackConfig {
  webhookUrl?: string; // For webhook-based posting (simpler)
  token?: string; // Bot token (for API-based posting)
  defaultChannel?: string; // Default channel
}

export class SlackPoster {
  private config: SlackConfig;
  private webClient?: WebClient;
  private webhook?: IncomingWebhook;

  constructor(config: SlackConfig) {
    this.config = config;
    
    // Initialize official Slack SDK clients
    if (config.token) {
      this.webClient = new WebClient(config.token);
    }
    
    if (config.webhookUrl) {
      this.webhook = new IncomingWebhook(config.webhookUrl);
    }
  }

  async post(options: SlackPostOptions): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      if (this.webhook) {
        return await this.postViaWebhook(options);
      } else if (this.webClient) {
        return await this.postViaAPI(options);
      } else {
        return { success: false, error: "Either webhookUrl or token required" };
      }
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  }

  private async postViaWebhook(
    options: SlackPostOptions
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    if (!this.webhook) {
      return { success: false, error: "Webhook not initialized" };
    }

    const payload: any = {
      text: options.text,
      channel: options.channel || this.config.defaultChannel,
    };

    if (options.blocks) {
      payload.blocks = options.blocks;
    }

    if (options.username) {
      payload.username = options.username;
    }

    if (options.iconEmoji) {
      payload.icon_emoji = options.iconEmoji;
    }

    if (options.threadTs) {
      payload.thread_ts = options.threadTs;
    }

    try {
      await this.webhook.send(payload);
      return {
        success: true,
        url: `https://slack.com/archives/${options.channel || this.config.defaultChannel}`,
      };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  }

  private async postViaAPI(
    options: SlackPostOptions
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    if (!this.webClient) {
      return { success: false, error: "WebClient not initialized" };
    }

    const channel = options.channel || this.config.defaultChannel;
    if (!channel) {
      return { success: false, error: "Channel required" };
    }

    try {
      const result = await this.webClient.chat.postMessage({
        channel,
        text: options.text,
        blocks: options.blocks,
        thread_ts: options.threadTs,
        username: options.username,
        icon_emoji: options.iconEmoji,
      });

      if (result.ok) {
        return {
          success: true,
          url: result.message?.permalink || `https://slack.com/archives/${channel}`,
        };
      } else {
        return { success: false, error: result.error || "Unknown error" };
      }
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  }

  /**
   * Create rich Slack message with Block Kit
   */
  createRichMessage(title: string, content: string, fields?: Array<{ title: string; value: string }>): any[] {
    const blocks: any[] = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: title,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: content,
        },
      },
    ];

    if (fields && fields.length > 0) {
      blocks.push({
        type: "section",
        fields: fields.map((field) => ({
          type: "mrkdwn",
          text: `*${field.title}*\n${field.value}`,
        })),
      });
    }

    return blocks;
  }
}


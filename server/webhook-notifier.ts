/**
 * Webhook Notifier System
 * 
 * Handles webhook-based notifications to Discord/Telegram when cocoons reach 'Active' stage
 * Includes dream name, creator, and contribution link
 */

interface WebhookConfig {
  discord?: {
    webhookUrl: string;
    enabled: boolean;
  };
  telegram?: {
    botToken: string;
    chatId: string;
    enabled: boolean;
  };
}

interface CocoonActiveNotification {
  dreamName: string;
  cocoonTitle: string;
  creator: string;
  dreamId: string;
  cocoonId: string;
  score: number;
  tags: string[];
  contributionUrl: string;
}

export class WebhookNotifier {
  private config: WebhookConfig;

  constructor() {
    this.config = {
      discord: {
        webhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
        enabled: !!process.env.DISCORD_WEBHOOK_URL
      },
      telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || '',
        chatId: process.env.TELEGRAM_CHAT_ID || '',
        enabled: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
      }
    };
  }

  async notifyCocoonActive(notification: CocoonActiveNotification): Promise<void> {
    console.log(`🚀 Webhook trigger: Cocoon "${notification.cocoonTitle}" reached Active stage`);

    const promises = [];

    if (this.config.discord?.enabled) {
      promises.push(this.sendDiscordNotification(notification));
    }

    if (this.config.telegram?.enabled) {
      promises.push(this.sendTelegramNotification(notification));
    }

    if (promises.length === 0) {
      console.log(`⚠️ No webhook endpoints configured. Add DISCORD_WEBHOOK_URL or TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID environment variables.`);
      return;
    }

    await Promise.allSettled(promises);
  }

  private async sendDiscordNotification(notification: CocoonActiveNotification): Promise<void> {
    try {
      const embed = {
        title: "🚀 New Cocoon is Active!",
        description: `**${notification.cocoonTitle}** is now ready for contributions!`,
        color: 0x00ff88, // Electric cyan
        fields: [
          {
            name: "Dream",
            value: notification.dreamName,
            inline: true
          },
          {
            name: "Creator",
            value: `${notification.creator.slice(0, 8)}...`,
            inline: true
          },
          {
            name: "Dream Score",
            value: `${notification.score}/100`,
            inline: true
          },
          {
            name: "Tags",
            value: notification.tags.join(", ") || "None",
            inline: false
          },
          {
            name: "How to Contribute",
            value: `[View Dream Details](${notification.contributionUrl})`,
            inline: false
          }
        ],
        footer: {
          text: "Dream Network • Ready for collaboration"
        },
        timestamp: new Date().toISOString()
      };

      const payload = {
        embeds: [embed],
        content: "📢 A new cocoon is ready for contributors!"
      };

      const response = await fetch(this.config.discord!.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log(`✅ Discord notification sent for cocoon: ${notification.cocoonTitle}`);
      } else {
        console.log(`❌ Discord webhook failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Discord webhook error: ${error}`);
    }
  }

  private async sendTelegramNotification(notification: CocoonActiveNotification): Promise<void> {
    try {
      const message = `🚀 *New Cocoon is Active\\!*

*${this.escapeMarkdown(notification.cocoonTitle)}* is now ready for contributions\\!

🎯 *Dream:* ${this.escapeMarkdown(notification.dreamName)}
👤 *Creator:* \`${notification.creator.slice(0, 8)}\\.\\.\\.\`
⭐ *Score:* ${notification.score}/100
🏷️ *Tags:* ${this.escapeMarkdown(notification.tags.join(", ") || "None")}

[View Dream Details](${notification.contributionUrl})

Ready for collaboration\\! 🤝`;

      const payload = {
        chat_id: this.config.telegram!.chatId,
        text: message,
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: false
      };

      const response = await fetch(`https://api.telegram.org/bot${this.config.telegram!.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log(`✅ Telegram notification sent for cocoon: ${notification.cocoonTitle}`);
      } else {
        const errorData = await response.json();
        console.log(`❌ Telegram webhook failed: ${response.status}`, errorData);
      }
    } catch (error) {
      console.log(`❌ Telegram webhook error: ${error}`);
    }
  }

  private escapeMarkdown(text: string): string {
    // Escape special characters for Telegram MarkdownV2
    return text.replace(/[_*\[\]()~`>#+=|{}.!-]/g, '\\$&');
  }

  // Test webhook endpoints
  async testWebhooks(): Promise<void> {
    const testNotification: CocoonActiveNotification = {
      dreamName: "AI Art Generation Platform",
      cocoonTitle: "AI Art Generation Platform Cocoon",
      creator: "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
      dreamId: "test-dream-123",
      cocoonId: "test-cocoon-123",
      score: 85,
      tags: ["ai", "art", "creative"],
      contributionUrl: `${process.env.REPLIT_URL || 'http://localhost:5000'}/dreams/test-dream-123`
    };

    console.log(`🧪 Testing webhook endpoints...`);
    await this.notifyCocoonActive(testNotification);
  }
}

// Export singleton instance
export const webhookNotifier = new WebhookNotifier();
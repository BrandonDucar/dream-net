/**
 * Alert Sender
 * Sends alerts to Slack, Discord, Email, and webhooks
 */

import type { Alert, AlertChannel, AlertConfig } from "../types";

export class AlertSender {
  private config: AlertConfig;

  constructor(config: AlertConfig) {
    this.config = config;
  }

  async sendAlert(alert: Alert): Promise<{ success: boolean; channel: AlertChannel; error?: string }[]> {
    const results: Array<{ success: boolean; channel: AlertChannel; error?: string }> = [];

    for (const channel of alert.channels) {
      try {
        switch (channel) {
          case "slack":
            if (this.config.slack?.enabled) {
              await this.sendToSlack(alert);
              results.push({ success: true, channel });
            }
            break;
          case "discord":
            if (this.config.discord?.enabled) {
              await this.sendToDiscord(alert);
              results.push({ success: true, channel });
            }
            break;
          case "email":
            if (this.config.email?.enabled) {
              await this.sendToEmail(alert);
              results.push({ success: true, channel });
            }
            break;
          case "webhook":
            if (this.config.webhooks) {
              for (const webhook of this.config.webhooks) {
                if (webhook.enabled) {
                  await this.sendToWebhook(alert, webhook.url, webhook.secret);
                  results.push({ success: true, channel });
                }
              }
            }
            break;
          case "console":
            this.sendToConsole(alert);
            results.push({ success: true, channel });
            break;
        }
      } catch (error: any) {
        results.push({ success: false, channel, error: error.message });
      }
    }

    return results;
  }

  private async sendToSlack(alert: Alert): Promise<void> {
    if (!this.config.slack?.webhookUrl) {
      throw new Error("Slack webhook URL not configured");
    }

    const color = this.getSeverityColor(alert.severity);
    const payload = {
      text: alert.title,
      attachments: [
        {
          color,
          fields: [
            { title: "Severity", value: alert.severity.toUpperCase(), short: true },
            { title: "Cluster", value: alert.clusterId || "N/A", short: true },
            { title: "Message", value: alert.message, short: false },
            { title: "Timestamp", value: new Date(alert.timestamp).toISOString(), short: true },
          ],
          footer: "DreamNet Control Plane",
          ts: Math.floor(alert.timestamp / 1000),
        },
      ],
    };

    const response = await fetch(this.config.slack.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.statusText}`);
    }
  }

  private async sendToDiscord(alert: Alert): Promise<void> {
    if (!this.config.discord?.webhookUrl) {
      throw new Error("Discord webhook URL not configured");
    }

    const color = this.getSeverityColorHex(alert.severity);
    const payload = {
      embeds: [
        {
          title: alert.title,
          description: alert.message,
          color,
          fields: [
            { name: "Severity", value: alert.severity.toUpperCase(), inline: true },
            { name: "Cluster", value: alert.clusterId || "N/A", inline: true },
            { name: "Timestamp", value: new Date(alert.timestamp).toISOString(), inline: false },
          ],
          footer: { text: "DreamNet Control Plane" },
          timestamp: new Date(alert.timestamp).toISOString(),
        },
      ],
    };

    const response = await fetch(this.config.discord.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.statusText}`);
    }
  }

  private async sendToEmail(alert: Alert): Promise<void> {
    // Email sending would use nodemailer or similar
    // For now, just log
    console.log(`📧 [Email Alert] ${alert.severity.toUpperCase()}: ${alert.title} - ${alert.message}`);
    
    // TODO: Implement actual email sending with nodemailer
    // const transporter = nodemailer.createTransport(this.config.email.smtp);
    // await transporter.sendMail({
    //   from: this.config.email.from,
    //   to: alert.metadata?.recipient || "admin@dreamnet.io",
    //   subject: `[${alert.severity.toUpperCase()}] ${alert.title}`,
    //   text: alert.message,
    // });
  }

  private async sendToWebhook(alert: Alert, url: string, secret?: string): Promise<void> {
    const payload = {
      alert: {
        id: alert.id,
        severity: alert.severity,
        title: alert.title,
        message: alert.message,
        clusterId: alert.clusterId,
        timestamp: alert.timestamp,
        metadata: alert.metadata,
      },
      signature: secret ? this.generateSignature(JSON.stringify(alert), secret) : undefined,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret && { "X-Webhook-Secret": secret }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }
  }

  private sendToConsole(alert: Alert): void {
    const emoji = this.getSeverityEmoji(alert.severity);
    console.log(`${emoji} [Alert] ${alert.severity.toUpperCase()}: ${alert.title}`);
    console.log(`   ${alert.message}`);
    if (alert.clusterId) {
      console.log(`   Cluster: ${alert.clusterId}`);
    }
  }

  private getSeverityColor(severity: AlertSeverity): string {
    switch (severity) {
      case "critical":
        return "danger";
      case "error":
        return "warning";
      case "warning":
        return "warning";
      default:
        return "good";
    }
  }

  private getSeverityColorHex(severity: AlertSeverity): number {
    switch (severity) {
      case "critical":
        return 0xff0000; // Red
      case "error":
        return 0xff6600; // Orange
      case "warning":
        return 0xffaa00; // Yellow
      default:
        return 0x00ff00; // Green
    }
  }

  private getSeverityEmoji(severity: AlertSeverity): string {
    switch (severity) {
      case "critical":
        return "🚨";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  }

  private generateSignature(payload: string, secret: string): string {
    // Simple HMAC signature (use crypto in production)
    const crypto = require("crypto");
    return crypto.createHmac("sha256", secret).update(payload).digest("hex");
  }
}


/**
 * DreamNet Email System
 * 
 * Email infrastructure for DreamNet communications:
 * - Grant applications
 * - Outreach automation
 * - System notifications
 * - Fleet communications
 */

import { randomUUID } from "node:crypto";

export type EmailProvider = "resend" | "sendgrid" | "smtp" | "console";

export interface EmailConfig {
  provider: EmailProvider;
  from: string;
  replyTo?: string;
  apiKey?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
}

export interface EmailMessage {
  id: string;
  to: string | string[];
  subject: string;
  body: string;
  html?: string;
  from?: string;
  replyTo?: string;
  status: "pending" | "sent" | "failed";
  sentAt?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

class DreamNetEmail {
  private config: EmailConfig;
  private messages: Map<string, EmailMessage> = new Map();

  constructor() {
    // Default to console for now, can be configured via env
    this.config = {
      provider: (process.env.EMAIL_PROVIDER as EmailProvider) || "console",
      from: process.env.DREAMNET_EMAIL || "dreamnetgmo@gmail.com",
      replyTo: process.env.DREAMNET_REPLY_TO || "dreamnetgmo@gmail.com",
      apiKey: process.env.EMAIL_API_KEY,
    };
  }

  /**
   * Send email
   */
  async sendEmail(
    to: string | string[],
    subject: string,
    body: string,
    html?: string,
    metadata?: Record<string, unknown>
  ): Promise<EmailMessage> {
    const message: EmailMessage = {
      id: randomUUID(),
      to,
      subject,
      body,
      html,
      from: this.config.from,
      replyTo: this.config.replyTo,
      status: "pending",
      metadata,
    };

    this.messages.set(message.id, message);

    try {
      switch (this.config.provider) {
        case "console":
          await this.sendViaConsole(message);
          break;
        case "resend":
          await this.sendViaResend(message);
          break;
        case "sendgrid":
          await this.sendViaSendGrid(message);
          break;
        case "smtp":
          await this.sendViaSMTP(message);
          break;
        default:
          throw new Error(`Unknown email provider: ${this.config.provider}`);
      }

      message.status = "sent";
      message.sentAt = new Date().toISOString();
    } catch (error) {
      message.status = "failed";
      message.error = (error as Error).message;
      console.error(`[DreamNet Email] Failed to send:`, error);
    }

    return message;
  }

  /**
   * Send via console (for development)
   */
  private async sendViaConsole(message: EmailMessage): Promise<void> {
    console.log("\n📧 [DreamNet Email]");
    console.log(`From: ${message.from}`);
    console.log(`To: ${Array.isArray(message.to) ? message.to.join(", ") : message.to}`);
    console.log(`Subject: ${message.subject}`);
    console.log(`Body:\n${message.body}\n`);
    if (message.html) {
      console.log(`HTML:\n${message.html}\n`);
    }
    // Simulate async
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Send via Resend (production)
   */
  private async sendViaResend(message: EmailMessage): Promise<void> {
    if (!this.config.apiKey) {
      throw new Error("Resend API key not configured");
    }

    // TODO: Implement Resend integration
    // const resend = new Resend(this.config.apiKey);
    // await resend.emails.send({
    //   from: message.from!,
    //   to: Array.isArray(message.to) ? message.to : [message.to],
    //   subject: message.subject,
    //   text: message.body,
    //   html: message.html,
    //   reply_to: message.replyTo,
    // });

    // For now, fallback to console
    await this.sendViaConsole(message);
  }

  /**
   * Send via SendGrid (production)
   */
  private async sendViaSendGrid(message: EmailMessage): Promise<void> {
    if (!this.config.apiKey) {
      throw new Error("SendGrid API key not configured");
    }

    // TODO: Implement SendGrid integration
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(this.config.apiKey);
    // await sgMail.send({
    //   to: Array.isArray(message.to) ? message.to : [message.to],
    //   from: message.from!,
    //   subject: message.subject,
    //   text: message.body,
    //   html: message.html,
    //   replyTo: message.replyTo,
    // });

    // For now, fallback to console
    await this.sendViaConsole(message);
  }

  /**
   * Send via SMTP
   */
  private async sendViaSMTP(message: EmailMessage): Promise<void> {
    // TODO: Implement SMTP integration
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransport({
    //   host: this.config.smtpHost,
    //   port: this.config.smtpPort,
    //   auth: {
    //     user: this.config.smtpUser,
    //     pass: this.config.smtpPass,
    //   },
    // });
    // await transporter.sendMail({
    //   from: message.from,
    //   to: Array.isArray(message.to) ? message.to : [message.to],
    //   subject: message.subject,
    //   text: message.body,
    //   html: message.html,
    //   replyTo: message.replyTo,
    // });

    // For now, fallback to console
    await this.sendViaConsole(message);
  }

  /**
   * Generate outreach email from template
   */
  async generateOutreachEmail(
    template: string,
    variables: Record<string, string>
  ): Promise<{ subject: string; body: string; html?: string }> {
    // Get template from Wolf Pack
    const { wolfPack } = await import("../agents/WolfPack");
    
    // For now, use simple template substitution
    let subject = template;
    let body = template;

    for (const [key, value] of Object.entries(variables)) {
      subject = subject.replace(`{{${key}}}`, value);
      body = body.replace(`{{${key}}}`, value);
    }

    return { subject, body };
  }

  /**
   * Get email history
   */
  getEmailHistory(limit = 50): EmailMessage[] {
    return Array.from(this.messages.values())
      .sort((a, b) => {
        const aTime = a.sentAt ? new Date(a.sentAt).getTime() : 0;
        const bTime = b.sentAt ? new Date(b.sentAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, limit);
  }

  /**
   * Configure email provider
   */
  configure(config: Partial<EmailConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton
export const dreamNetEmail = new DreamNetEmail();


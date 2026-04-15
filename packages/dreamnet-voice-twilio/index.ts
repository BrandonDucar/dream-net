/**
 * DreamNet Voice - Twilio SMS
 * Phase 2 - One Mouth: Single voice channel for DreamNet
 */

import { initializeTwilio, sendSMS, getConfig } from "./logic/twilioSender";
import { routeEventToSMS, getMessageStats } from "./logic/messageRouter";
import { formatEventToSMS } from "./logic/messageFormatter";
import type { VoiceStatus, SMSMessage } from "./types";

export const DreamNetVoiceTwilio = {
  /**
   * Initialize Twilio SMS sender
   */
  async init(): Promise<boolean> {
    return initializeTwilio();
  },

  /**
   * Send SMS message directly
   */
  async send(message: SMSMessage): Promise<{ success: boolean; sid?: string; error?: string }> {
    return sendSMS(message);
  },

  /**
   * Route operational event to SMS (main entry point)
   */
  async routeEvent(event: any): Promise<{ sent: boolean; reason?: string }> {
    return routeEventToSMS(event);
  },

  /**
   * Format event to SMS message
   */
  formatEvent(event: any): string {
    return formatEventToSMS(event);
  },

  /**
   * Get status
   */
  status(): VoiceStatus {
    const config = getConfig();
    const stats = getMessageStats();
    
    return {
      enabled: config !== null,
      provider: "twilio",
      messagesSent: stats.totalMessages,
      lastMessageAt: stats.messagesLastDay > 0 ? Date.now() : null,
      configLoaded: config !== null,
    };
  },

  /**
   * Get message statistics
   */
  getStats() {
    return getMessageStats();
  },
};

export * from "./types";
export default DreamNetVoiceTwilio;


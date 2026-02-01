/**
 * DreamNet Voice - Twilio SMS Types
 * Phase 2 - One Mouth: Single voice channel for DreamNet
 */

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string; // Your Twilio phone number
  recipientPhoneNumber: string; // Where to send messages
}

export interface SMSMessage {
  to?: string;
  body: string;
  from?: string;
}

export interface MessageTemplate {
  eventType: string;
  template: (event: any) => string;
  priority: "low" | "medium" | "high" | "critical";
  enabled: boolean;
}

export interface VoiceStatus {
  enabled: boolean;
  provider: "twilio";
  messagesSent: number;
  lastMessageAt: number | null;
  configLoaded: boolean;
}


/**
 * Twilio SMS Sender
 * Uses API Keeper to discover credentials automatically
 */

import { APIKeeperCore } from "@dreamnet/api-keeper-core";
import type { SMSMessage, TwilioConfig } from '../types.js';

let twilioClient: any = null;
let config: TwilioConfig | null = null;

/**
 * Initialize Twilio client using API Keeper discovered credentials
 */
export async function initializeTwilio(): Promise<boolean> {
  try {
    // Try API Keeper first, then fall back to environment variables
    const twilioKeys = APIKeeperCore.listKeysForProvider("twilio");

    let accountSid: string | undefined;
    let authToken: string | undefined;
    let phoneNumber: string | undefined;

    if (twilioKeys.length > 0) {
      // Find Account SID and Auth Token from API Keeper
      const accountSidKey = twilioKeys.find(k => k.name === "Account SID" || k.name.includes("SID"));
      const authTokenKey = twilioKeys.find(k => k.name === "Auth Token" || k.name.includes("AUTH"));
      const phoneNumberKey = twilioKeys.find(k => k.name === "Phone Number" || k.name.includes("PHONE"));

      accountSid = accountSidKey?.key;
      authToken = authTokenKey?.key;
      phoneNumber = phoneNumberKey?.key;
    }

    // Fall back to environment variables if not found in API Keeper
    accountSid = accountSid || process.env.TWILIO_ACCOUNT_SID;
    authToken = authToken || process.env.TWILIO_AUTH_TOKEN;
    phoneNumber = phoneNumber || process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken) {
      console.warn("[Voice:Twilio] Missing required Twilio credentials (SID or Auth Token)");
      console.warn("   💡 Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in environment variables");
      return false;
    }

    // Get recipient phone number from env (default to user's phone: +15613378933)
    const recipientPhoneNumber =
      process.env.DREAMNET_VOICE_RECIPIENT ||
      process.env.TWILIO_RECIPIENT ||
      "+15613378933"; // Default to user's phone number

    if (!recipientPhoneNumber) {
      console.warn("[Voice:Twilio] No recipient phone number configured (DREAMNET_VOICE_RECIPIENT)");
      return false;
    }

    config = {
      accountSid,
      authToken,
      phoneNumber: phoneNumber || "", // Handle optional phoneNumber
      recipientPhoneNumber,
    };

    // Lazy load Twilio SDK
    if (!twilioClient) {
      const twilio = await import("twilio");
      twilioClient = twilio.default(accountSid, authToken);
    }

    console.log(`✅ [Voice:Twilio] Initialized - Sending to ${recipientPhoneNumber}`);
    return true;
  } catch (error: any) {
    console.error("[Voice:Twilio] Failed to initialize:", error.message);
    return false;
  }
}

/**
 * Send SMS message via Twilio
 */
export async function sendSMS(message: SMSMessage): Promise<{ success: boolean; sid?: string; error?: string }> {
  try {
    if (!twilioClient || !config) {
      const initialized = await initializeTwilio();
      if (!initialized) {
        return { success: false, error: "Twilio not initialized" };
      }
    }

    const result = await twilioClient.messages.create({
      body: message.body,
      to: message.to || config!.recipientPhoneNumber,
      from: message.from || config!.phoneNumber,
    });

    console.log(`📱 [Voice:Twilio] SMS sent - SID: ${result.sid}`);
    return { success: true, sid: result.sid };
  } catch (error: any) {
    console.error("[Voice:Twilio] Failed to send SMS:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get current config (for status)
 */
export function getConfig(): TwilioConfig | null {
  return config;
}


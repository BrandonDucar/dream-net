/**
 * Twilio SMS Sender
 * Uses API Keeper to discover credentials automatically
 */
import type { SMSMessage, TwilioConfig } from "../types";
/**
 * Initialize Twilio client using API Keeper discovered credentials
 */
export declare function initializeTwilio(): Promise<boolean>;
/**
 * Send SMS message via Twilio
 */
export declare function sendSMS(message: SMSMessage): Promise<{
    success: boolean;
    sid?: string;
    error?: string;
}>;
/**
 * Get current config (for status)
 */
export declare function getConfig(): TwilioConfig | null;

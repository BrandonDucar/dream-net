/**
 * Real API Integration Stubs
 * Ready for actual API implementations
 */
import { Fly } from "../types";
/**
 * Check Twilio API for SMS messages
 * TODO: Implement real Twilio SDK integration
 */
export declare function checkTwilioAPI(accountSid?: string, authToken?: string, phoneNumber?: string): Promise<Fly[]>;
/**
 * Check Telegram Bot API for messages
 * TODO: Implement real Telegram Bot API integration
 */
export declare function checkTelegramAPI(botToken?: string, chatId?: string): Promise<Fly[]>;
/**
 * Check Twitter API for mentions
 * TODO: Implement real Twitter API v2 integration
 */
export declare function checkTwitterAPI(bearerToken?: string, username?: string): Promise<Fly[]>;
/**
 * Process webhook payload
 */
export declare function processWebhookPayload(source: string, payload: Record<string, any>): Fly;

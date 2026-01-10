/**
 * DreamNet Voice - Twilio SMS
 * Phase 2 - One Mouth: Single voice channel for DreamNet
 */
import type { VoiceStatus, SMSMessage } from "./types";
export declare const DreamNetVoiceTwilio: {
    /**
     * Initialize Twilio SMS sender
     */
    init(): Promise<boolean>;
    /**
     * Send SMS message directly
     */
    send(message: SMSMessage): Promise<{
        success: boolean;
        sid?: string;
        error?: string;
    }>;
    /**
     * Route operational event to SMS (main entry point)
     */
    routeEvent(event: any): Promise<{
        sent: boolean;
        reason?: string;
    }>;
    /**
     * Format event to SMS message
     */
    formatEvent(event: any): string;
    /**
     * Get status
     */
    status(): VoiceStatus;
    /**
     * Get message statistics
     */
    getStats(): {
        messagesLastHour: number;
        messagesLastDay: number;
        totalMessages: number;
        rateLimit: number;
    };
};
export * from "./types";
export default DreamNetVoiceTwilio;

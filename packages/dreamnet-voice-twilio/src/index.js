/**
 * DreamNet Voice - Twilio SMS
 * Phase 2 - One Mouth: Single voice channel for DreamNet
 */
import { initializeTwilio, sendSMS, getConfig } from './logic/twilioSender.js';
import { routeEventToSMS, getMessageStats } from './logic/messageRouter.js';
import { formatEventToSMS } from './logic/messageFormatter.js';
export const DreamNetVoiceTwilio = {
    /**
     * Initialize Twilio SMS sender
     */
    async init() {
        return initializeTwilio();
    },
    /**
     * Send SMS message directly
     */
    async send(message) {
        return sendSMS(message);
    },
    /**
     * Route operational event to SMS (main entry point)
     */
    async routeEvent(event) {
        return routeEventToSMS(event);
    },
    /**
     * Format event to SMS message
     */
    formatEvent(event) {
        return formatEventToSMS(event);
    },
    /**
     * Get status
     */
    status() {
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
export * from './types.js';
export default DreamNetVoiceTwilio;
//# sourceMappingURL=index.js.map
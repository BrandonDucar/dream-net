"use strict";
/**
 * Message Router
 * Filters and routes Spider Web events to Twilio SMS
 * Only sends important messages (not spam)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeEventToSMS = routeEventToSMS;
exports.getMessageStats = getMessageStats;
const twilioSender_1 = require("./twilioSender");
const messageFormatter_1 = require("./messageFormatter");
// Rate limiting: Don't send more than X messages per hour
const RATE_LIMIT_MESSAGES_PER_HOUR = 10;
const messageHistory = [];
/**
 * Check if we should send this message (rate limiting + priority filtering)
 */
function shouldSendMessage(event) {
    // Always send critical events
    if (event.severity === "critical") {
        return true;
    }
    // Check rate limit
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentMessages = messageHistory.filter(m => m.timestamp > oneHourAgo);
    if (recentMessages.length >= RATE_LIMIT_MESSAGES_PER_HOUR) {
        console.log(`[Voice:Router] Rate limit reached (${recentMessages.length}/${RATE_LIMIT_MESSAGES_PER_HOUR} messages/hour)`);
        return false;
    }
    // Filter by priority
    const sendableSeverities = ["critical", "high"];
    if (!sendableSeverities.includes(event.severity)) {
        return false;
    }
    // Filter by event type (only send important events)
    const importantEventTypes = [
        "wolf-pack-win",
        "shield-threat",
        "health_check_failed",
        "kill_switch_enabled",
        "kill_switch_disabled",
        "incident_created",
        "cost_threshold_exceeded",
        "circuit_breaker_tripped",
    ];
    if (!importantEventTypes.some(type => event.type.includes(type))) {
        return false;
    }
    return true;
}
/**
 * Route operational event to SMS
 */
async function routeEventToSMS(event) {
    if (!shouldSendMessage(event)) {
        return { sent: false, reason: "Filtered by router" };
    }
    try {
        const messageBody = (0, messageFormatter_1.formatEventToSMS)(event);
        const result = await (0, twilioSender_1.sendSMS)({
            body: messageBody,
        });
        if (result.success) {
            // Record message in history
            messageHistory.push({
                timestamp: Date.now(),
                eventType: event.type,
            });
            // Clean old history (keep last 24 hours)
            const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
            const filtered = messageHistory.filter(m => m.timestamp > oneDayAgo);
            messageHistory.length = 0;
            messageHistory.push(...filtered);
            console.log(`📱 [Voice:Router] Routed event "${event.type}" to SMS`);
            return { sent: true };
        }
        else {
            return { sent: false, reason: result.error };
        }
    }
    catch (error) {
        console.error("[Voice:Router] Failed to route event to SMS:", error.message);
        return { sent: false, reason: error.message };
    }
}
/**
 * Get message statistics
 */
function getMessageStats() {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return {
        messagesLastHour: messageHistory.filter(m => m.timestamp > oneHourAgo).length,
        messagesLastDay: messageHistory.filter(m => m.timestamp > oneDayAgo).length,
        totalMessages: messageHistory.length,
        rateLimit: RATE_LIMIT_MESSAGES_PER_HOUR,
    };
}

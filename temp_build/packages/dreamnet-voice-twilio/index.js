"use strict";
/**
 * DreamNet Voice - Twilio SMS
 * Phase 2 - One Mouth: Single voice channel for DreamNet
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DreamNetVoiceTwilio = void 0;
const twilioSender_1 = require("./logic/twilioSender");
const messageRouter_1 = require("./logic/messageRouter");
const messageFormatter_1 = require("./logic/messageFormatter");
exports.DreamNetVoiceTwilio = {
    /**
     * Initialize Twilio SMS sender
     */
    async init() {
        return (0, twilioSender_1.initializeTwilio)();
    },
    /**
     * Send SMS message directly
     */
    async send(message) {
        return (0, twilioSender_1.sendSMS)(message);
    },
    /**
     * Route operational event to SMS (main entry point)
     */
    async routeEvent(event) {
        return (0, messageRouter_1.routeEventToSMS)(event);
    },
    /**
     * Format event to SMS message
     */
    formatEvent(event) {
        return (0, messageFormatter_1.formatEventToSMS)(event);
    },
    /**
     * Get status
     */
    status() {
        const config = (0, twilioSender_1.getConfig)();
        const stats = (0, messageRouter_1.getMessageStats)();
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
        return (0, messageRouter_1.getMessageStats)();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.DreamNetVoiceTwilio;

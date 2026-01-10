"use strict";
/**
 * Real API Integration Stubs
 * Ready for actual API implementations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTwilioAPI = checkTwilioAPI;
exports.checkTelegramAPI = checkTelegramAPI;
exports.checkTwitterAPI = checkTwitterAPI;
exports.processWebhookPayload = processWebhookPayload;
const flyCatcher_1 = require("./flyCatcher");
/**
 * Check Twilio API for SMS messages
 * TODO: Implement real Twilio SDK integration
 */
async function checkTwilioAPI(accountSid, authToken, phoneNumber) {
    const flies = [];
    // Real implementation would use Twilio SDK:
    // const client = require('twilio')(accountSid, authToken);
    // const messages = await client.messages.list({ limit: 20 });
    // for (const msg of messages) {
    //   flies.push(createFly("message", "twilio", {
    //     message: msg.body,
    //     from: msg.from,
    //     to: msg.to,
    //     sid: msg.sid,
    //   }, "medium", true));
    // }
    // For now, return empty (will be implemented when API keys are provided)
    if (!accountSid || !authToken) {
        return [];
    }
    return flies;
}
/**
 * Check Telegram Bot API for messages
 * TODO: Implement real Telegram Bot API integration
 */
async function checkTelegramAPI(botToken, chatId) {
    const flies = [];
    // Real implementation would use Telegram Bot API:
    // const TelegramBot = require('node-telegram-bot-api');
    // const bot = new TelegramBot(botToken);
    // const updates = await bot.getUpdates({ offset: lastUpdateId });
    // for (const update of updates) {
    //   if (update.message) {
    //     flies.push(createFly("message", "telegram", {
    //       message: update.message.text,
    //       chatId: update.message.chat.id,
    //       userId: update.message.from.id,
    //     }, "medium", true));
    //   }
    // }
    if (!botToken) {
        return [];
    }
    return flies;
}
/**
 * Check Twitter API for mentions
 * TODO: Implement real Twitter API v2 integration
 */
async function checkTwitterAPI(bearerToken, username) {
    const flies = [];
    // Real implementation would use Twitter API v2:
    // const TwitterApi = require('twitter-api-v2').TwitterApi;
    // const client = new TwitterApi(bearerToken);
    // const mentions = await client.v2.search(`@${username}`, { max_results: 10 });
    // for (const tweet of mentions.data.data) {
    //   flies.push(createFly("mention", "twitter", {
    //     tweet: tweet.text,
    //     username: tweet.author_id,
    //     tweetId: tweet.id,
    //   }, "low", false));
    // }
    if (!bearerToken) {
        return [];
    }
    return flies;
}
/**
 * Process webhook payload
 */
function processWebhookPayload(source, payload) {
    const flyType = payload.type === "funding" ? "webhook" : "webhook";
    const priority = payload.priority === "high" ? "high" : "medium";
    return (0, flyCatcher_1.createFly)(flyType, source, payload, priority, true);
}

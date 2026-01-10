#!/usr/bin/env tsx
"use strict";
/**
 * Demo: Webhook Notification System
 *
 * Demonstrates the webhook-based trigger system for Discord/Telegram notifications
 * when cocoons reach 'Active' stage with dream name, creator, and contribution link
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.demonstrateWebhookSystem = demonstrateWebhookSystem;
var webhook_notifier_1 = require("./webhook-notifier");
function demonstrateWebhookSystem() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n\uD83D\uDD17 Webhook Notification System Demo\n==================================\n\nThis demo shows the webhook trigger system:\n\u2713 Auto-posts when cocoon reaches 'Active' stage\n\u2713 Discord and Telegram bot integration\n\u2713 Includes dream name, creator, contribution link\n\u2713 Rich formatting with embeds and markdown\n\u2713 Environment variable configuration\n  ");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log("\n\uD83C\uDFAF STEP 1: Webhook Configuration");
                    console.log("Environment Variables Needed:");
                    console.log("\u2022 DISCORD_WEBHOOK_URL - Discord webhook URL for channel posting");
                    console.log("\u2022 TELEGRAM_BOT_TOKEN - Telegram bot token from @BotFather");
                    console.log("\u2022 TELEGRAM_CHAT_ID - Target Telegram chat/channel ID");
                    console.log("\u2022 REPLIT_URL - Base URL for contribution links");
                    console.log("\n\uD83E\uDD16 STEP 2: Supported Platforms");
                    console.log("DISCORD:");
                    console.log("\u2022 Rich embed messages with color and fields");
                    console.log("\u2022 Formatted with dream details and contribution links");
                    console.log("\u2022 Electric cyan theme (#00ff88)");
                    console.log("\nTELEGRAM:");
                    console.log("\u2022 MarkdownV2 formatted messages");
                    console.log("\u2022 Escaped special characters for proper display");
                    console.log("\u2022 Inline contribution links");
                    console.log("\n\u26A1 STEP 3: Trigger Mechanism");
                    console.log("Webhook triggers automatically when:");
                    console.log("1. Cocoon stage updates to 'active'");
                    console.log("2. updateCocoon() function is called with stage='active'");
                    console.log("3. triggerCocoonActiveWebhook() executes");
                    console.log("4. Notification sent to all configured platforms");
                    console.log("\n\uD83D\uDCE8 STEP 4: Message Content Structure");
                    console.log("Each notification includes:");
                    console.log("\u2022 Dream name and cocoon title");
                    console.log("\u2022 Creator wallet (truncated for privacy)");
                    console.log("\u2022 Current dream score");
                    console.log("\u2022 Associated tags");
                    console.log("\u2022 Direct contribution link");
                    console.log("\u2022 Call-to-action for collaboration");
                    console.log("\n\uD83E\uDDEA STEP 5: Testing Webhook System");
                    console.log("Running test webhook...");
                    // Test the webhook system
                    return [4 /*yield*/, webhook_notifier_1.webhookNotifier.testWebhooks()];
                case 2:
                    // Test the webhook system
                    _a.sent();
                    console.log("\n\uD83D\uDD04 STEP 6: API Integration");
                    console.log("Available Endpoints:");
                    console.log("\u2022 POST /api/webhooks/test - Test webhook endpoints (admin only)");
                    console.log("\u2022 PATCH /api/cocoons/:id - Update cocoon stage (triggers webhook if active)");
                    console.log("\n\uD83D\uDCCB STEP 7: Discord Setup Instructions");
                    console.log("1. Go to Discord channel settings");
                    console.log("2. Navigate to Integrations > Webhooks");
                    console.log("3. Create New Webhook");
                    console.log("4. Copy webhook URL");
                    console.log("5. Set DISCORD_WEBHOOK_URL environment variable");
                    console.log("\n\uD83D\uDCF1 STEP 8: Telegram Setup Instructions");
                    console.log("1. Message @BotFather on Telegram");
                    console.log("2. Use /newbot command to create bot");
                    console.log("3. Get bot token from @BotFather");
                    console.log("4. Add bot to your channel/group");
                    console.log("5. Get chat ID (use @userinfobot or API)");
                    console.log("6. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID");
                    console.log("\n\uD83D\uDEE1\uFE0F STEP 9: Error Handling");
                    console.log("System includes:");
                    console.log("\u2022 Graceful webhook failures (doesn't break cocoon updates)");
                    console.log("\u2022 Promise.allSettled for concurrent platform posting");
                    console.log("\u2022 Detailed error logging for debugging");
                    console.log("\u2022 Automatic fallback if endpoints are unconfigured");
                    console.log("\n\uD83C\uDFA8 STEP 10: Message Examples");
                    console.log("\nDiscord Embed:");
                    console.log("{\n  \"title\": \"\uD83D\uDE80 New Cocoon is Active!\",\n  \"description\": \"AI Art Generation Platform Cocoon is now ready for contributions!\",\n  \"color\": 0x00ff88,\n  \"fields\": [\n    { \"name\": \"Dream\", \"value\": \"AI Art Generation Platform\" },\n    { \"name\": \"Creator\", \"value\": \"0x742d35...\" },\n    { \"name\": \"Dream Score\", \"value\": \"85/100\" },\n    { \"name\": \"Tags\", \"value\": \"ai, art, creative\" },\n    { \"name\": \"How to Contribute\", \"value\": \"[View Dream Details](link)\" }\n  ]\n}");
                    console.log("\nTelegram Message:");
                    console.log("\uD83D\uDE80 *New Cocoon is Active\\!*\n\n*AI Art Generation Platform Cocoon* is now ready for contributions\\!\n\n\uD83C\uDFAF *Dream:* AI Art Generation Platform  \n\uD83D\uDC64 *Creator:* `0x742d35\\.\\.\\.`\n\u2B50 *Score:* 85/100\n\uD83C\uDFF7\uFE0F *Tags:* ai, art, creative\n\n[View Dream Details](link)\n\nReady for collaboration\\! \uD83E\uDD1D");
                    console.log("\n\u2728 Webhook notification system is fully implemented!");
                    console.log("\nKey Features:");
                    console.log("- Automatic triggers on cocoon stage changes");
                    console.log("- Multi-platform support (Discord + Telegram)");
                    console.log("- Rich formatted messages with all relevant details");
                    console.log("- Robust error handling and logging");
                    console.log("- Easy configuration via environment variables");
                    console.log("- Test endpoints for verification");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log("Demo error: ".concat(error_1));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, demonstrateWebhookSystem()];
                case 1:
                    _a.sent();
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
// Run if called directly
if (import.meta.url === "file://".concat(process.argv[1])) {
    main().catch(console.error);
}

"use strict";
/**
 * Webhook Notifier System
 *
 * Handles webhook-based notifications to Discord/Telegram when cocoons reach 'Active' stage
 * Includes dream name, creator, and contribution link
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
exports.webhookNotifier = exports.WebhookNotifier = void 0;
var WebhookNotifier = /** @class */ (function () {
    function WebhookNotifier() {
        this.config = {
            discord: {
                webhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
                enabled: !!process.env.DISCORD_WEBHOOK_URL
            },
            telegram: {
                botToken: process.env.TELEGRAM_BOT_TOKEN || '',
                chatId: process.env.TELEGRAM_CHAT_ID || '',
                enabled: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
            }
        };
    }
    WebhookNotifier.prototype.notifyCocoonActive = function (notification) {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("\uD83D\uDE80 Webhook trigger: Cocoon \"".concat(notification.cocoonTitle, "\" reached Active stage"));
                        promises = [];
                        if ((_a = this.config.discord) === null || _a === void 0 ? void 0 : _a.enabled) {
                            promises.push(this.sendDiscordNotification(notification));
                        }
                        if ((_b = this.config.telegram) === null || _b === void 0 ? void 0 : _b.enabled) {
                            promises.push(this.sendTelegramNotification(notification));
                        }
                        if (promises.length === 0) {
                            console.log("\u26A0\uFE0F No webhook endpoints configured. Add DISCORD_WEBHOOK_URL or TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID environment variables.");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, Promise.allSettled(promises)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WebhookNotifier.prototype.sendDiscordNotification = function (notification) {
        return __awaiter(this, void 0, void 0, function () {
            var embed, payload, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        embed = {
                            title: "🚀 New Cocoon is Active!",
                            description: "**".concat(notification.cocoonTitle, "** is now ready for contributions!"),
                            color: 0x00ff88, // Electric cyan
                            fields: [
                                {
                                    name: "Dream",
                                    value: notification.dreamName,
                                    inline: true
                                },
                                {
                                    name: "Creator",
                                    value: "".concat(notification.creator.slice(0, 8), "..."),
                                    inline: true
                                },
                                {
                                    name: "Dream Score",
                                    value: "".concat(notification.score, "/100"),
                                    inline: true
                                },
                                {
                                    name: "Tags",
                                    value: notification.tags.join(", ") || "None",
                                    inline: false
                                },
                                {
                                    name: "How to Contribute",
                                    value: "[View Dream Details](".concat(notification.contributionUrl, ")"),
                                    inline: false
                                }
                            ],
                            footer: {
                                text: "Dream Network • Ready for collaboration"
                            },
                            timestamp: new Date().toISOString()
                        };
                        payload = {
                            embeds: [embed],
                            content: "📢 A new cocoon is ready for contributors!"
                        };
                        return [4 /*yield*/, fetch(this.config.discord.webhookUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(payload)
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.ok) {
                            console.log("\u2705 Discord notification sent for cocoon: ".concat(notification.cocoonTitle));
                        }
                        else {
                            console.log("\u274C Discord webhook failed: ".concat(response.status, " ").concat(response.statusText));
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log("\u274C Discord webhook error: ".concat(error_1));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WebhookNotifier.prototype.sendTelegramNotification = function (notification) {
        return __awaiter(this, void 0, void 0, function () {
            var message, payload, response, errorData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        message = "\uD83D\uDE80 *New Cocoon is Active\\!*\n\n*".concat(this.escapeMarkdown(notification.cocoonTitle), "* is now ready for contributions\\!\n\n\uD83C\uDFAF *Dream:* ").concat(this.escapeMarkdown(notification.dreamName), "\n\uD83D\uDC64 *Creator:* `").concat(notification.creator.slice(0, 8), "\\.\\.\\.`\n\u2B50 *Score:* ").concat(notification.score, "/100\n\uD83C\uDFF7\uFE0F *Tags:* ").concat(this.escapeMarkdown(notification.tags.join(", ") || "None"), "\n\n[View Dream Details](").concat(notification.contributionUrl, ")\n\nReady for collaboration\\! \uD83E\uDD1D");
                        payload = {
                            chat_id: this.config.telegram.chatId,
                            text: message,
                            parse_mode: 'MarkdownV2',
                            disable_web_page_preview: false
                        };
                        return [4 /*yield*/, fetch("https://api.telegram.org/bot".concat(this.config.telegram.botToken, "/sendMessage"), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(payload)
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 2];
                        console.log("\u2705 Telegram notification sent for cocoon: ".concat(notification.cocoonTitle));
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, response.json()];
                    case 3:
                        errorData = _a.sent();
                        console.log("\u274C Telegram webhook failed: ".concat(response.status), errorData);
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.log("\u274C Telegram webhook error: ".concat(error_2));
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    WebhookNotifier.prototype.escapeMarkdown = function (text) {
        // Escape special characters for Telegram MarkdownV2
        return text.replace(/[_*\[\]()~`>#+=|{}.!-]/g, '\\$&');
    };
    // Test webhook endpoints
    WebhookNotifier.prototype.testWebhooks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var testNotification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testNotification = {
                            dreamName: "AI Art Generation Platform",
                            cocoonTitle: "AI Art Generation Platform Cocoon",
                            creator: "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
                            dreamId: "test-dream-123",
                            cocoonId: "test-cocoon-123",
                            score: 85,
                            tags: ["ai", "art", "creative"],
                            contributionUrl: "".concat(process.env.REPLIT_URL || 'http://localhost:5000', "/dreams/test-dream-123")
                        };
                        console.log("\uD83E\uDDEA Testing webhook endpoints...");
                        return [4 /*yield*/, this.notifyCocoonActive(testNotification)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return WebhookNotifier;
}());
exports.WebhookNotifier = WebhookNotifier;
// Export singleton instance
exports.webhookNotifier = new WebhookNotifier();

"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.notificationEngine = exports.NotificationEngine = void 0;
var db_1 = require("./db");
var schema_1 = require("@shared/schema");
var drizzle_orm_1 = require("drizzle-orm");
// Placeholder email service
function sendEmail(to, subject, content) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("\uD83D\uDCE7 [EMAIL] To: ".concat(to));
            console.log("\uD83D\uDCE7 [EMAIL] Subject: ".concat(subject));
            console.log("\uD83D\uDCE7 [EMAIL] Content: ".concat(content));
            console.log("\uD83D\uDCE7 [EMAIL] Email sent successfully (placeholder)");
            // In a real implementation, you would integrate with a service like:
            // - SendGrid
            // - Mailgun  
            // - AWS SES
            // - Resend
            // - Nodemailer with SMTP
            return [2 /*return*/, true]; // Simulate successful email send
        });
    });
}
var NotificationEngine = /** @class */ (function () {
    function NotificationEngine() {
    }
    // Create a new notification and optionally send email
    NotificationEngine.prototype.createNotification = function (notification_1) {
        return __awaiter(this, arguments, void 0, function (notification, sendEmailAlert) {
            var createdNotification, emailSent, emailError_1, error_1;
            if (sendEmailAlert === void 0) { sendEmailAlert = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, db_1.db
                                .insert(schema_1.notifications)
                                .values(notification)
                                .returning()];
                    case 1:
                        createdNotification = (_a.sent())[0];
                        console.log("\uD83D\uDD14 Created notification: ".concat(notification.type, " for ").concat(notification.recipientWallet));
                        if (!sendEmailAlert) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this.sendNotificationEmail(createdNotification)];
                    case 3:
                        emailSent = _a.sent();
                        // Update notification with email status
                        return [4 /*yield*/, db_1.db
                                .update(schema_1.notifications)
                                .set({ emailSent: emailSent })
                                .where((0, drizzle_orm_1.eq)(schema_1.notifications.id, createdNotification.id))];
                    case 4:
                        // Update notification with email status
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        emailError_1 = _a.sent();
                        console.error("Failed to send notification email:", emailError_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, createdNotification.id];
                    case 7:
                        error_1 = _a.sent();
                        console.error("Failed to create notification:", error_1);
                        throw error_1;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    // Send email for a notification
    NotificationEngine.prototype.sendNotificationEmail = function (notification) {
        return __awaiter(this, void 0, void 0, function () {
            var subject, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        subject = "Dream Network: ".concat(notification.title);
                        content = "\nHello,\n\n".concat(notification.message, "\n\nYou can view more details in your Dream Network dashboard.\n\nBest regards,\nThe Dream Network Team\n    ").trim();
                        return [4 /*yield*/, sendEmail(notification.recipientWallet, subject, content)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Get unread notifications for a wallet
    NotificationEngine.prototype.getUnreadNotifications = function (walletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.notifications)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.notifications.recipientWallet, walletAddress), (0, drizzle_orm_1.eq)(schema_1.notifications.isRead, false)))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.notifications.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Get all notifications for a wallet (with pagination)
    NotificationEngine.prototype.getNotifications = function (walletAddress_1) {
        return __awaiter(this, arguments, void 0, function (walletAddress, limit, offset) {
            if (limit === void 0) { limit = 20; }
            if (offset === void 0) { offset = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.notifications)
                            .where((0, drizzle_orm_1.eq)(schema_1.notifications.recipientWallet, walletAddress))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.notifications.createdAt))
                            .limit(limit)
                            .offset(offset)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Mark notification(s) as read
    NotificationEngine.prototype.markAsRead = function (notificationIds, walletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_1.notifications)
                            .set({
                            isRead: true,
                            readAt: new Date()
                        })
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.notifications.recipientWallet, walletAddress)))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Mark single notification as read
    NotificationEngine.prototype.markNotificationAsRead = function (notificationId, walletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_1.notifications)
                            .set({
                            isRead: true,
                            readAt: new Date()
                        })
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.notifications.id, notificationId), (0, drizzle_orm_1.eq)(schema_1.notifications.recipientWallet, walletAddress)))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Get notification count for a wallet
    NotificationEngine.prototype.getUnreadCount = function (walletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select({ count: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["count(*)"], ["count(*)"]))).as('count') })
                            .from(schema_1.notifications)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.notifications.recipientWallet, walletAddress), (0, drizzle_orm_1.eq)(schema_1.notifications.isRead, false)))];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, Number(((_a = result[0]) === null || _a === void 0 ? void 0 : _a.count) || 0)];
                }
            });
        });
    };
    // Notification generators for specific events
    NotificationEngine.prototype.notifyDreamApproved = function (dream) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createNotification({
                            recipientWallet: dream.wallet,
                            type: "dream_approved",
                            title: "Dream Approved! 🎉",
                            message: "Your dream \"".concat(dream.title, "\" has been approved and is ready for transformation into a cocoon."),
                            data: {
                                dreamId: dream.id,
                                dreamTitle: dream.title,
                                approvedAt: new Date().toISOString()
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationEngine.prototype.notifyCocoonCreated = function (cocoon, dream) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createNotification({
                            recipientWallet: cocoon.creatorWallet,
                            type: "cocoon_created",
                            title: "Your Dream Became a Cocoon! 🛡️",
                            message: "Your dream \"".concat(dream.title, "\" has evolved into a cocoon and is beginning its transformation journey."),
                            data: {
                                cocoonId: cocoon.id,
                                dreamId: dream.id,
                                cocoonTitle: cocoon.title,
                                stage: cocoon.stage,
                                createdAt: cocoon.createdAt
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationEngine.prototype.notifyCocoonStageUpdated = function (cocoon, oldStage, newStage) {
        return __awaiter(this, void 0, void 0, function () {
            var stageEmojis;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stageEmojis = {
                            seedling: "🌱",
                            incubating: "🐣",
                            metamorphosis: "🦋",
                            emergence: "✨",
                            hatched: "🎭"
                        };
                        return [4 /*yield*/, this.createNotification({
                                recipientWallet: cocoon.creatorWallet,
                                type: "cocoon_stage_updated",
                                title: "Cocoon Evolution: ".concat(newStage, " ").concat(stageEmojis[newStage] || "🔄"),
                                message: "Your cocoon \"".concat(cocoon.title, "\" has evolved from ").concat(oldStage, " to ").concat(newStage, ". The transformation continues!"),
                                data: {
                                    cocoonId: cocoon.id,
                                    cocoonTitle: cocoon.title,
                                    oldStage: oldStage,
                                    newStage: newStage,
                                    updatedAt: new Date().toISOString()
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationEngine.prototype.notifyContributorAdded = function (cocoonId, contributorWallet, role, cocoonTitle) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createNotification({
                            recipientWallet: contributorWallet,
                            type: "contributor_added",
                            title: "Welcome to the Team! \uD83E\uDD1D",
                            message: "You've been added as a ".concat(role, " to the cocoon \"").concat(cocoonTitle, "\". Start collaborating on this amazing project!"),
                            data: {
                                cocoonId: cocoonId,
                                cocoonTitle: cocoonTitle,
                                role: role,
                                addedAt: new Date().toISOString()
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationEngine.prototype.notifyContributorRemoved = function (cocoonId, contributorWallet, role, cocoonTitle) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createNotification({
                            recipientWallet: contributorWallet,
                            type: "contributor_removed",
                            title: "Role Update",
                            message: "Your ".concat(role, " role has been removed from the cocoon \"").concat(cocoonTitle, "\"."),
                            data: {
                                cocoonId: cocoonId,
                                cocoonTitle: cocoonTitle,
                                role: role,
                                removedAt: new Date().toISOString()
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationEngine.prototype.notifyDreamScoreUpdated = function (dream, oldScore, newScore) {
        return __awaiter(this, void 0, void 0, function () {
            var scoreDiff, isImprovement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scoreDiff = newScore - oldScore;
                        isImprovement = scoreDiff > 0;
                        return [4 /*yield*/, this.createNotification({
                                recipientWallet: dream.wallet,
                                type: "dream_score_updated",
                                title: "Dream Score ".concat(isImprovement ? 'Increased' : 'Updated', " ").concat(isImprovement ? '📈' : '📊'),
                                message: "Your dream \"".concat(dream.title, "\" score changed from ").concat(oldScore, " to ").concat(newScore, " (").concat(scoreDiff > 0 ? '+' : '').concat(scoreDiff, " points)."),
                                data: {
                                    dreamId: dream.id,
                                    dreamTitle: dream.title,
                                    oldScore: oldScore,
                                    newScore: newScore,
                                    scoreDiff: scoreDiff,
                                    updatedAt: new Date().toISOString()
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // New notification methods for additional features
    NotificationEngine.prototype.notifyInsufficientScore = function (cocoon) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createNotification({
                            recipientWallet: cocoon.creatorWallet,
                            type: "cocoon_score_insufficient",
                            title: "Score Boost Needed! 🎯",
                            message: "Your cocoon \"".concat(cocoon.title, "\" needs a score of 60+ to progress to Active stage. Current score: ").concat(cocoon.dreamScore || 0, ". Consider adding contributors or building more traction!"),
                            data: {
                                cocoonId: cocoon.id,
                                cocoonTitle: cocoon.title,
                                currentScore: cocoon.dreamScore || 0,
                                requiredScore: 60,
                                notifiedAt: new Date().toISOString()
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationEngine.prototype.notifyNFTMinted = function (cocoon, nftData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createNotification({
                            recipientWallet: cocoon.creatorWallet,
                            type: "nft_minted",
                            title: "NFT Minted Successfully! 🎨✨",
                            message: "Congratulations! Your high-scoring cocoon \"".concat(cocoon.title, "\" has been minted as an NFT. Token ID: ").concat(nftData.tokenId),
                            data: {
                                cocoonId: cocoon.id,
                                cocoonTitle: cocoon.title,
                                nftData: nftData,
                                mintedAt: new Date().toISOString()
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationEngine.prototype.notifyCocoonArchived = function (cocoon) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createNotification({
                            recipientWallet: cocoon.creatorWallet,
                            type: "cocoon_archived",
                            title: "Cocoon Archived Due to Inactivity 📦",
                            message: "Your cocoon \"".concat(cocoon.title, "\" has been archived due to inactivity. You can contact support to restore it if needed."),
                            data: {
                                cocoonId: cocoon.id,
                                cocoonTitle: cocoon.title,
                                archivedAt: new Date().toISOString()
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return NotificationEngine;
}());
exports.NotificationEngine = NotificationEngine;
// Export singleton instance
exports.notificationEngine = new NotificationEngine();
var templateObject_1;

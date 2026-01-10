#!/usr/bin/env tsx
"use strict";
/**
 * Demo: Simple Notifications System
 *
 * Demonstrates the in-memory notifications array with:
 * - Stage change notifications
 * - NFT minting notifications
 * - Contributor addition notifications
 * - Console log delivery simulation
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.demoNotifications = demoNotifications;
var storage_1 = require("./storage");
var simple_notifications_1 = require("./simple-notifications");
var TEST_WALLET = "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e";
function demoNotifications() {
    return __awaiter(this, void 0, void 0, function () {
        var dream, cocoon, stages, currentStage, _i, stages_1, newStage, testContributors, _a, testContributors_1, contributor, updatedCocoon, highScoreCocoon, notifications, unreadCount, firstNotif, finalUnreadCount, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("\n\uD83D\uDD14 Simple Notifications System Demo\n==================================\nTesting in-memory notifications with console delivery simulation\n\nDemo Wallet: ".concat(TEST_WALLET, "\n  "));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 20, , 21]);
                    // 1. Create a test dream and evolve it to cocoon
                    console.log("\n\uD83D\uDCCD Step 1: Creating test dream and cocoon...");
                    return [4 /*yield*/, storage_1.storage.createDream({
                            wallet: TEST_WALLET,
                            title: "Notification Test Dream",
                            description: "A dream to test the notification system",
                            tags: ["test", "notifications"],
                            urgency: 8,
                            origin: "test"
                        })];
                case 2:
                    dream = _b.sent();
                    console.log("   \u2705 Created dream: ".concat(dream.title));
                    // Set a high score to enable progression
                    return [4 /*yield*/, storage_1.storage.updateDreamScore(dream.id, 75, {
                            originality: 80,
                            traction: 70,
                            collaboration: 75,
                            updates: 75
                        })];
                case 3:
                    // Set a high score to enable progression
                    _b.sent();
                    return [4 /*yield*/, storage_1.storage.createCocoon({
                            dreamId: dream.id,
                            title: dream.title,
                            description: dream.description,
                            creatorWallet: TEST_WALLET
                        })];
                case 4:
                    cocoon = _b.sent();
                    console.log("   \u2705 Created cocoon: ".concat(cocoon.title));
                    // 2. Test stage progression notifications
                    console.log("\n\uD83D\uDCCD Step 2: Testing stage change notifications...");
                    stages = ["incubating", "active", "metamorphosis", "emergence", "complete"];
                    currentStage = "seedling";
                    _i = 0, stages_1 = stages;
                    _b.label = 5;
                case 5:
                    if (!(_i < stages_1.length)) return [3 /*break*/, 10];
                    newStage = stages_1[_i];
                    console.log("\n   \uD83D\uDD04 Progressing from ".concat(currentStage, " to ").concat(newStage, "..."));
                    return [4 /*yield*/, storage_1.storage.updateCocoon(cocoon.id, { stage: newStage })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, storage_1.storage.logCocoonStageChange(cocoon.id, currentStage, newStage, "demo")];
                case 7:
                    _b.sent();
                    currentStage = newStage;
                    // Short delay to see console output clearly
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 8:
                    // Short delay to see console output clearly
                    _b.sent();
                    _b.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 5];
                case 10:
                    // 3. Test contributor notifications
                    console.log("\n\uD83D\uDCCD Step 3: Testing contributor addition notifications...");
                    testContributors = [
                        { wallet: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", role: "Builder" },
                        { wallet: "0x8ba1f109551bD432803012645Hac136c9.5928e", role: "Artist" },
                        { wallet: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", role: "Coder" }
                    ];
                    _a = 0, testContributors_1 = testContributors;
                    _b.label = 11;
                case 11:
                    if (!(_a < testContributors_1.length)) return [3 /*break*/, 15];
                    contributor = testContributors_1[_a];
                    console.log("\n   \uD83D\uDC65 Adding ".concat(contributor.role, ": ").concat(contributor.wallet.slice(0, 8), "..."));
                    return [4 /*yield*/, storage_1.storage.addContributor(cocoon.id, contributor.wallet, contributor.role)];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 13:
                    _b.sent();
                    _b.label = 14;
                case 14:
                    _a++;
                    return [3 /*break*/, 11];
                case 15:
                    // 4. Test NFT minting notification (cocoon should already be complete with score 75)
                    console.log("\n\uD83D\uDCCD Step 4: Testing NFT minting (need score 80+)...");
                    // Update cocoon to have score 85 to trigger minting
                    return [4 /*yield*/, storage_1.storage.updateCocoon(cocoon.id, {})];
                case 16:
                    // Update cocoon to have score 85 to trigger minting
                    _b.sent();
                    return [4 /*yield*/, storage_1.storage.getCocoon(cocoon.id)];
                case 17:
                    updatedCocoon = _b.sent();
                    if (!updatedCocoon) return [3 /*break*/, 19];
                    highScoreCocoon = __assign(__assign({}, updatedCocoon), { dreamScore: 85 });
                    console.log("\n   \uD83C\uDFAF Testing mint with score ".concat(highScoreCocoon.dreamScore, "..."));
                    return [4 /*yield*/, storage_1.storage.checkAndMintNFT(highScoreCocoon)];
                case 18:
                    _b.sent();
                    _b.label = 19;
                case 19:
                    // 5. Display all notifications for the test wallet
                    console.log("\n\uD83D\uDCCD Step 5: Checking notifications for ".concat(TEST_WALLET.slice(0, 8), "..."));
                    notifications = simple_notifications_1.simpleNotifications.getNotifications(TEST_WALLET, 20);
                    unreadCount = simple_notifications_1.simpleNotifications.getUnreadCount(TEST_WALLET);
                    console.log("\n\uD83D\uDCEC Notification Summary:");
                    console.log("   Total notifications: ".concat(notifications.length));
                    console.log("   Unread notifications: ".concat(unreadCount));
                    console.log("\n\uD83D\uDCCB Recent Notifications:");
                    notifications.slice(0, 5).forEach(function (notif, index) {
                        console.log("".concat(index + 1, ". [").concat(notif.type, "] ").concat(notif.message));
                        console.log("   Time: ".concat(notif.timestamp.toISOString()));
                        console.log("   Read: ".concat(notif.read ? '✅' : '❌'));
                        console.log("   ID: ".concat(notif.id, "\n"));
                    });
                    // 6. Test marking notifications as read
                    console.log("\uD83D\uDCCD Step 6: Testing mark as read functionality...");
                    if (notifications.length > 0) {
                        firstNotif = notifications[0];
                        console.log("\n   \uD83D\uDCD6 Marking notification ".concat(firstNotif.id, " as read..."));
                        simple_notifications_1.simpleNotifications.markAsRead(firstNotif.id);
                        console.log("\n   \uD83D\uDCDA Marking all remaining notifications as read...");
                        simple_notifications_1.simpleNotifications.markAllAsRead(TEST_WALLET);
                    }
                    // 7. Display final notification status
                    console.log("\n\uD83D\uDCCD Final Status:");
                    finalUnreadCount = simple_notifications_1.simpleNotifications.getUnreadCount(TEST_WALLET);
                    console.log("   Unread notifications: ".concat(finalUnreadCount));
                    console.log("\n\uD83C\uDF89 Notifications demo completed successfully!");
                    console.log("\n\uD83D\uDCA1 API Endpoints available:");
                    console.log("   GET /api/simple-notifications (with x-wallet-address header)");
                    console.log("   PATCH /api/simple-notifications/:id/read");
                    console.log("   PATCH /api/simple-notifications/mark-all-read");
                    return [3 /*break*/, 21];
                case 20:
                    error_1 = _b.sent();
                    console.error("\u274C Demo failed:", error_1);
                    throw error_1;
                case 21: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Starting notifications system demo...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, demoNotifications()];
                case 2:
                    _a.sent();
                    process.exit(0);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Demo failed:", error_2);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Run if called directly
if (import.meta.url === "file://".concat(process.argv[1])) {
    main().catch(console.error);
}

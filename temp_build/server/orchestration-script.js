#!/usr/bin/env tsx
"use strict";
/**
 * Master Orchestration Script for Dream Network Testing
 *
 * This script simulates the complete lifecycle:
 * 1. Seeds new dreams
 * 2. Evolves them to cocoons
 * 3. Calculates scores
 * 4. Adds contributors
 * 5. Simulates lifecycle stage transitions
 * 6. Sends notifications
 * 7. Triggers NFT minting if eligible
 * 8. Outputs garden feed
 *
 * Runs 3 cycles with 15-second intervals
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOrchestration = main;
var storage_1 = require("./storage");
var notification_engine_1 = require("./notification-engine");
var dream_scoring_1 = require("./dream-scoring");
var ai_scoring_1 = require("./ai-scoring");
// Test data generators
var DREAM_NAMES = [
    "Neural Symphony",
    "Quantum Cascade",
    "Digital Metamorphosis",
    "Ethereal Framework",
    "Crystalline Protocol",
    "Infinite Recursion",
    "Plasma Dreams",
    "Holographic Vision",
    "Temporal Flux",
    "Prismatic Reality"
];
var DREAM_TAGS = [
    ["ai", "music", "synthesis"],
    ["quantum", "computing", "cryptography"],
    ["virtual", "reality", "gaming"],
    ["blockchain", "defi", "protocol"],
    ["machine-learning", "vision", "art"],
    ["biotech", "neural", "interface"],
    ["space", "exploration", "simulation"],
    ["climate", "sustainability", "green"],
    ["social", "network", "community"],
    ["automation", "robotics", "iot"]
];
var TEST_WALLETS = [
    "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "0x8ba1f109551bD432803012645Hac136c9.5928e",
    "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359"
];
var CONTRIBUTOR_ROLES = [
    "Builder", "Artist", "Coder", "Visionary", "Promoter"
];
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
function getRandomElements(array, count) {
    var shuffled = __spreadArray([], array, true).sort(function () { return 0.5 - Math.random(); });
    return shuffled.slice(0, count);
}
function seedTestDreams() {
    return __awaiter(this, arguments, void 0, function (count) {
        var dreamIds, i, dream, _a, aiScore, aiTags, updatedDream, _b, dreamScore, scoreBreakdown;
        if (count === void 0) { count = 3; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("\uD83C\uDF31 Seeding ".concat(count, " test dreams..."));
                    dreamIds = [];
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!(i < count)) return [3 /*break*/, 8];
                    return [4 /*yield*/, storage_1.storage.createDream({
                            wallet: getRandomElement(TEST_WALLETS),
                            title: getRandomElement(DREAM_NAMES),
                            description: "An innovative dream exploring the boundaries of ".concat(getRandomElement(["technology", "art", "science", "creativity", "collaboration"]), ". This project aims to revolutionize how we think about digital experiences."),
                            tags: getRandomElement(DREAM_TAGS),
                            urgency: Math.floor(Math.random() * 10) + 1,
                            origin: getRandomElement(["hackathon", "research", "startup", "personal_project", "community"])
                        })];
                case 2:
                    dream = _c.sent();
                    _a = (0, ai_scoring_1.calculateAIScore)(dream), aiScore = _a.aiScore, aiTags = _a.aiTags;
                    return [4 /*yield*/, storage_1.storage.updateDreamAIScore(dream.id, aiScore, aiTags)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, storage_1.storage.updateDreamMetrics(dream.id, {
                            views: Math.floor(Math.random() * 1000),
                            likes: Math.floor(Math.random() * 100),
                            comments: Math.floor(Math.random() * 50),
                            editCount: Math.floor(Math.random() * 10),
                            uniquenessScore: Math.floor(Math.random() * 100)
                        })];
                case 4:
                    updatedDream = _c.sent();
                    _b = (0, dream_scoring_1.calculateDreamScore)(updatedDream), dreamScore = _b.dreamScore, scoreBreakdown = _b.scoreBreakdown;
                    return [4 /*yield*/, storage_1.storage.updateDreamScore(dream.id, dreamScore, scoreBreakdown)];
                case 5:
                    _c.sent();
                    // Approve the dream
                    return [4 /*yield*/, storage_1.storage.updateDreamStatus(dream.id, "approved", "admin")];
                case 6:
                    // Approve the dream
                    _c.sent();
                    dreamIds.push(dream.id);
                    console.log("  \u2705 Created dream: ".concat(dream.title, " (Score: ").concat(dreamScore, ")"));
                    _c.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/, dreamIds];
            }
        });
    });
}
function evolveToCocoons(dreamIds) {
    return __awaiter(this, void 0, void 0, function () {
        var cocoonIds, _i, dreamIds_1, dreamId, dream, cocoon, cocoonData, updatedCocoon;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\uD83D\uDC23 Evolving ".concat(dreamIds.length, " dreams to cocoons..."));
                    cocoonIds = [];
                    _i = 0, dreamIds_1 = dreamIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < dreamIds_1.length)) return [3 /*break*/, 12];
                    dreamId = dreamIds_1[_i];
                    return [4 /*yield*/, storage_1.storage.getDream(dreamId)];
                case 2:
                    dream = _a.sent();
                    if (!dream)
                        return [3 /*break*/, 11];
                    return [4 /*yield*/, storage_1.storage.createCocoon({
                            dreamId: dream.id,
                            title: dream.title,
                            description: dream.description,
                            creatorWallet: dream.wallet,
                            evolutionNotes: ["Evolved from dream on ".concat(new Date().toISOString())]
                        })];
                case 3:
                    cocoon = _a.sent();
                    // Copy score from dream
                    return [4 /*yield*/, storage_1.storage.updateCocoon(cocoon.id, {
                            stage: "incubating"
                        })];
                case 4:
                    // Copy score from dream
                    _a.sent();
                    return [4 /*yield*/, storage_1.storage.getCocoon(cocoon.id)];
                case 5:
                    cocoonData = _a.sent();
                    if (!cocoonData) return [3 /*break*/, 8];
                    return [4 /*yield*/, storage_1.storage.updateCocoon(cocoon.id, { stage: "incubating" })];
                case 6:
                    _a.sent();
                    updatedCocoon = __assign(__assign({}, cocoonData), { dreamScore: dream.dreamScore });
                    return [4 /*yield*/, storage_1.storage.updateCocoon(cocoon.id, {})];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [4 /*yield*/, storage_1.storage.updateDreamStatus(dreamId, "evolved", "admin")];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, notification_engine_1.notificationEngine.notifyCocoonCreated(cocoon, dream)];
                case 10:
                    _a.sent();
                    cocoonIds.push(cocoon.id);
                    console.log("  \uD83E\uDD8B Created cocoon: ".concat(cocoon.title));
                    _a.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 1];
                case 12: return [2 /*return*/, cocoonIds];
            }
        });
    });
}
function addContributors(cocoonIds) {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_1, _i, cocoonIds_1, cocoonId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\uD83E\uDD1D Adding contributors to cocoons...");
                    _loop_1 = function (cocoonId) {
                        var cocoon, contributorCount, selectedWallets, _b, selectedWallets_1, wallet, contributor, error_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, storage_1.storage.getCocoon(cocoonId)];
                                case 1:
                                    cocoon = _c.sent();
                                    if (!cocoon)
                                        return [2 /*return*/, "continue"];
                                    contributorCount = Math.floor(Math.random() * 3) + 1;
                                    selectedWallets = getRandomElements(TEST_WALLETS.filter(function (w) { return w !== cocoon.creatorWallet; }), contributorCount);
                                    _b = 0, selectedWallets_1 = selectedWallets;
                                    _c.label = 2;
                                case 2:
                                    if (!(_b < selectedWallets_1.length)) return [3 /*break*/, 8];
                                    wallet = selectedWallets_1[_b];
                                    contributor = {
                                        wallet: wallet,
                                        role: getRandomElement(CONTRIBUTOR_ROLES),
                                        joinedAt: new Date().toISOString()
                                    };
                                    _c.label = 3;
                                case 3:
                                    _c.trys.push([3, 6, , 7]);
                                    return [4 /*yield*/, storage_1.storage.addCocoonContributor(cocoonId, contributor, "admin")];
                                case 4:
                                    _c.sent();
                                    return [4 /*yield*/, notification_engine_1.notificationEngine.notifyContributorAdded(cocoonId, wallet, contributor.role, cocoon.title)];
                                case 5:
                                    _c.sent();
                                    console.log("    \uD83D\uDC65 Added ".concat(contributor.role, ": ").concat(wallet.slice(0, 8), "..."));
                                    return [3 /*break*/, 7];
                                case 6:
                                    error_1 = _c.sent();
                                    console.log("    \u26A0\uFE0F  Failed to add contributor: ".concat(error_1));
                                    return [3 /*break*/, 7];
                                case 7:
                                    _b++;
                                    return [3 /*break*/, 2];
                                case 8: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, cocoonIds_1 = cocoonIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < cocoonIds_1.length)) return [3 /*break*/, 4];
                    cocoonId = cocoonIds_1[_i];
                    return [5 /*yield**/, _loop_1(cocoonId)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function simulateLifecycle(cocoonIds) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, cocoonIds_2, cocoonId, cocoon, newScore, stages, currentStageIndex, progressSteps, i, oldStage, newStage, nftData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\u26A1 Simulating lifecycle progression...");
                    _i = 0, cocoonIds_2 = cocoonIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < cocoonIds_2.length)) return [3 /*break*/, 13];
                    cocoonId = cocoonIds_2[_i];
                    return [4 /*yield*/, storage_1.storage.getCocoon(cocoonId)];
                case 2:
                    cocoon = _a.sent();
                    if (!cocoon)
                        return [3 /*break*/, 12];
                    newScore = Math.floor(Math.random() * 100) + 20;
                    return [4 /*yield*/, storage_1.storage.updateCocoon(cocoon.id, {})];
                case 3:
                    _a.sent();
                    stages = ["incubating", "active", "metamorphosis", "emergence", "complete"];
                    currentStageIndex = stages.indexOf(cocoon.stage);
                    progressSteps = newScore >= 60 ? (newScore >= 80 ? 2 : 1) : 0;
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < progressSteps && currentStageIndex < stages.length - 1)) return [3 /*break*/, 12];
                    oldStage = stages[currentStageIndex];
                    newStage = stages[currentStageIndex + 1];
                    if (!(oldStage === "incubating" && newStage === "active" && newScore < 60)) return [3 /*break*/, 6];
                    return [4 /*yield*/, notification_engine_1.notificationEngine.notifyInsufficientScore(cocoon)];
                case 5:
                    _a.sent();
                    console.log("    \uD83D\uDEAB Score too low for progression: ".concat(newScore, "/60"));
                    return [3 /*break*/, 12];
                case 6: return [4 /*yield*/, storage_1.storage.updateCocoon(cocoonId, { stage: newStage })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, storage_1.storage.logCocoonStageChange(cocoonId, oldStage, newStage, "admin")];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, notification_engine_1.notificationEngine.notifyCocoonStageUpdated(__assign(__assign({}, cocoon), { stage: newStage }), oldStage, newStage)];
                case 9:
                    _a.sent();
                    console.log("    \uD83D\uDD04 ".concat(cocoon.title, ": ").concat(oldStage, " \u2192 ").concat(newStage, " (Score: ").concat(newScore, ")"));
                    currentStageIndex++;
                    if (!(newStage === "complete" && newScore >= 80)) return [3 /*break*/, 11];
                    nftData = {
                        name: "Cocoon of ".concat(cocoon.title),
                        contractAddress: "0x" + Math.random().toString(16).substr(2, 40),
                        tokenId: Math.floor(Math.random() * 10000),
                        mintedAt: new Date().toISOString(),
                        owner: cocoon.creatorWallet
                    };
                    return [4 /*yield*/, notification_engine_1.notificationEngine.notifyNFTMinted(cocoon, nftData)];
                case 10:
                    _a.sent();
                    console.log("    \uD83C\uDFA8 NFT Minted! Token ID: ".concat(nftData.tokenId));
                    _a.label = 11;
                case 11:
                    i++;
                    return [3 /*break*/, 4];
                case 12:
                    _i++;
                    return [3 /*break*/, 1];
                case 13: return [2 /*return*/];
            }
        });
    });
}
function outputGardenFeed() {
    return __awaiter(this, void 0, void 0, function () {
        var gardenData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\uD83C\uDF38 Current Garden Feed:");
                    return [4 /*yield*/, storage_1.storage.getGardenFeed({
                            sortBy: 'lastUpdated',
                            order: 'desc',
                            limit: 20,
                            offset: 0
                        })];
                case 1:
                    gardenData = _a.sent();
                    console.log("\n\uD83D\uDCCA Garden Summary (".concat(gardenData.length, " items):"));
                    gardenData.forEach(function (item, index) {
                        var emoji = item.type === 'dream' ? '💭' : '🦋';
                        var status = item.type === 'dream' ? "Status: ".concat(item.status) : "Stage: ".concat(item.stage);
                        console.log("".concat(index + 1, ". ").concat(emoji, " ").concat(item.title));
                        console.log("   ".concat(status, " | Score: ").concat(item.score, " | Tags: [").concat(item.tags.join(', '), "]"));
                        console.log("   Creator: ".concat(item.creatorWallet.slice(0, 8), "... | Contributors: ").concat(item.contributors.length));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function runCycle(cycleNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var dreamIds, cocoonIds, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n\uD83D\uDE80 Starting Cycle ".concat(cycleNumber, "/3"));
                    console.log("\u23F0 ".concat(new Date().toLocaleTimeString()));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, seedTestDreams(3)];
                case 2:
                    dreamIds = _a.sent();
                    return [4 /*yield*/, evolveToCocoons(dreamIds)];
                case 3:
                    cocoonIds = _a.sent();
                    // 3. Add contributors
                    return [4 /*yield*/, addContributors(cocoonIds)];
                case 4:
                    // 3. Add contributors
                    _a.sent();
                    // 4. Simulate lifecycle
                    return [4 /*yield*/, simulateLifecycle(cocoonIds)];
                case 5:
                    // 4. Simulate lifecycle
                    _a.sent();
                    // 5. Output garden feed
                    return [4 /*yield*/, outputGardenFeed()];
                case 6:
                    // 5. Output garden feed
                    _a.sent();
                    console.log("\u2705 Cycle ".concat(cycleNumber, " completed successfully!"));
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    console.error("\u274C Cycle ".concat(cycleNumber, " failed:"), error_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var cycle, metrics;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n\uD83C\uDF1F Dream Network Master Orchestration Script\n============================================\nRunning 3 cycles with 15-second intervals\nEach cycle: Seed \u2192 Evolve \u2192 Contribute \u2192 Progress \u2192 Report\n  ");
                    cycle = 1;
                    _a.label = 1;
                case 1:
                    if (!(cycle <= 3)) return [3 /*break*/, 5];
                    return [4 /*yield*/, runCycle(cycle)];
                case 2:
                    _a.sent();
                    if (!(cycle < 3)) return [3 /*break*/, 4];
                    console.log("\n\u23F3 Waiting 15 seconds before next cycle...\n");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 15000); })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    cycle++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log("\n\uD83C\uDF89 All cycles completed! Check the garden for results.");
                    console.log("\uD83D\uDCCB Final Statistics:");
                    return [4 /*yield*/, storage_1.storage.getDashboardMetrics()];
                case 6:
                    metrics = _a.sent();
                    console.log("   Dreams: ".concat(metrics.totalDreams));
                    console.log("   Cocoons: ".concat(metrics.activeCocoons));
                    console.log("   Cores: ".concat(metrics.dreamCores));
                    console.log("   Wallets: ".concat(metrics.totalWallets));
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
// Run the script if called directly
if (require.main === module) {
    main().catch(console.error);
}

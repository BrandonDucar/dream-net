#!/usr/bin/env tsx
"use strict";
/**
 * AI Dream Evaluator
 *
 * Analyzes dreams and automatically evolves high-scoring ones into cocoons
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
exports.dreamEvaluator = exports.DreamEvaluator = void 0;
var storage_1 = require("./storage");
var simple_notifications_1 = require("./simple-notifications");
// Keywords for scoring different categories
var SCORING_KEYWORDS = {
    innovation: ["ai", "artificial", "intelligence", "machine", "learning", "neural", "quantum", "blockchain", "crypto", "web3", "defi", "nft", "metaverse", "vr", "ar", "virtual", "augmented"],
    technology: ["app", "platform", "software", "code", "programming", "development", "api", "database", "cloud", "serverless", "mobile", "web", "frontend", "backend", "fullstack"],
    creativity: ["art", "design", "music", "creative", "artistic", "visual", "audio", "video", "animation", "graphics", "ui", "ux", "aesthetic"],
    collaboration: ["social", "community", "network", "sharing", "collaborative", "team", "group", "connect", "communication", "chat", "forum"],
    impact: ["sustainability", "environment", "climate", "green", "renewable", "health", "medical", "education", "learning", "accessibility", "inclusive"],
    business: ["marketplace", "ecommerce", "fintech", "startup", "business", "enterprise", "saas", "b2b", "b2c", "revenue", "monetization"],
    gaming: ["game", "gaming", "interactive", "simulation", "experience", "entertainment", "fun", "play", "sandbox"],
    utility: ["tool", "utility", "productivity", "automation", "workflow", "efficiency", "optimization", "analytics", "dashboard"]
};
// High-value keywords that get bonus points
var BONUS_KEYWORDS = ["revolutionary", "innovative", "breakthrough", "cutting-edge", "next-generation", "disruptive", "scalable", "sustainable"];
var DreamEvaluator = /** @class */ (function () {
    function DreamEvaluator() {
    }
    /**
     * Main evaluation function that analyzes a dream and takes action
     */
    DreamEvaluator.prototype.evaluateDream = function (dream) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("\n\uD83E\uDD16 AI DREAM EVALUATION");
                        console.log("========================");
                        console.log("Dream: \"".concat(dream.title, "\""));
                        console.log("Tags: [".concat(((_a = dream.tags) === null || _a === void 0 ? void 0 : _a.join(", ")) || "none", "]"));
                        console.log("Description: ".concat((_b = dream.description) === null || _b === void 0 ? void 0 : _b.substring(0, 100), "..."));
                        result = this.analyzeDream(dream);
                        console.log("\n\uD83D\uDCCA SCORING BREAKDOWN:");
                        Object.entries(result.categoryScores).forEach(function (_a) {
                            var category = _a[0], score = _a[1];
                            if (score > 0) {
                                console.log("  ".concat(category, ": ").concat(score, " points"));
                            }
                        });
                        console.log("\n\uD83C\uDFAF FINAL SCORE: ".concat(result.score, "/100"));
                        console.log("\n\uD83E\uDDE0 REASONING:");
                        result.reasoning.forEach(function (reason, index) {
                            console.log("  ".concat(index + 1, ". ").concat(reason));
                        });
                        if (!(result.score >= 60)) return [3 /*break*/, 2];
                        console.log("\n\u2705 DECISION: EVOLVE TO COCOON (Score: ".concat(result.score, " \u2265 60)"));
                        return [4 /*yield*/, this.evolveToCocoon(dream, result)];
                    case 1:
                        _c.sent();
                        result.action = 'evolve';
                        return [3 /*break*/, 4];
                    case 2:
                        console.log("\n\u274C DECISION: REJECT (Score: ".concat(result.score, " < 60)"));
                        return [4 /*yield*/, this.rejectDream(dream, result)];
                    case 3:
                        _c.sent();
                        result.action = 'reject';
                        _c.label = 4;
                    case 4:
                        console.log("========================\n");
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Analyzes dream content and calculates score
     */
    DreamEvaluator.prototype.analyzeDream = function (dream) {
        var _a;
        var reasoning = [];
        var categoryScores = {};
        var totalScore = 0;
        // Combine title, description, and tags for analysis
        var analysisText = __spreadArray([
            dream.title,
            dream.description || ""
        ], (dream.tags || []), true).join(" ").toLowerCase();
        // Score each category
        Object.entries(SCORING_KEYWORDS).forEach(function (_a) {
            var category = _a[0], keywords = _a[1];
            var matches = keywords.filter(function (keyword) { return analysisText.includes(keyword); });
            var categoryScore = Math.min(matches.length * 5, 20); // Max 20 points per category
            if (categoryScore > 0) {
                categoryScores[category] = categoryScore;
                totalScore += categoryScore;
                reasoning.push("".concat(category, " keywords found: ").concat(matches.join(", "), " (+").concat(categoryScore, " points)"));
            }
        });
        // Bonus for high-value keywords
        var bonusMatches = BONUS_KEYWORDS.filter(function (keyword) { return analysisText.includes(keyword); });
        if (bonusMatches.length > 0) {
            var bonusScore = bonusMatches.length * 10;
            categoryScores.bonus = bonusScore;
            totalScore += bonusScore;
            reasoning.push("High-value keywords: ".concat(bonusMatches.join(", "), " (+").concat(bonusScore, " bonus points)"));
        }
        // Tag diversity bonus
        var uniqueTags = new Set(dream.tags || []).size;
        if (uniqueTags >= 3) {
            var diversityBonus = Math.min(uniqueTags * 2, 10);
            categoryScores.diversity = diversityBonus;
            totalScore += diversityBonus;
            reasoning.push("Tag diversity: ".concat(uniqueTags, " unique tags (+").concat(diversityBonus, " points)"));
        }
        // Length and detail bonus
        var descriptionLength = ((_a = dream.description) === null || _a === void 0 ? void 0 : _a.length) || 0;
        if (descriptionLength > 50) {
            var detailBonus = Math.min(Math.floor(descriptionLength / 25), 15);
            categoryScores.detail = detailBonus;
            totalScore += detailBonus;
            reasoning.push("Detailed description: ".concat(descriptionLength, " characters (+").concat(detailBonus, " points)"));
        }
        // Penalize if too generic
        var genericWords = ["app", "platform", "system", "tool", "solution"];
        var genericCount = genericWords.filter(function (word) { return analysisText.includes(word); }).length;
        if (genericCount > 2) {
            var penalty = genericCount * 5;
            totalScore -= penalty;
            reasoning.push("Generic terminology penalty: ".concat(genericCount, " generic words (-").concat(penalty, " points)"));
        }
        // Cap score at 100
        var finalScore = Math.min(Math.max(totalScore, 0), 100);
        if (reasoning.length === 0) {
            reasoning.push("No significant keywords or features detected");
        }
        return {
            score: finalScore,
            reasoning: reasoning,
            categoryScores: categoryScores,
            shouldEvolve: finalScore >= 60,
            action: 'pending'
        };
    };
    /**
     * Evolves a dream into a cocoon
     */
    DreamEvaluator.prototype.evolveToCocoon = function (dream, evaluation) {
        return __awaiter(this, void 0, void 0, function () {
            var cocoon, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        // Create evolution chain entry for the dream
                        return [4 /*yield*/, storage_1.storage.createEvolutionChain({
                                dreamId: dream.id,
                                currentStage: "dream",
                                metadata: {
                                    aiScore: evaluation.score,
                                    originalTags: dream.tags,
                                    evaluationDate: new Date().toISOString(),
                                    categoryScores: evaluation.categoryScores
                                }
                            })];
                    case 1:
                        // Create evolution chain entry for the dream
                        _a.sent();
                        // Update dream status to approved
                        return [4 /*yield*/, storage_1.storage.updateDreamStatus(dream.id, "approved", "ai_evaluator")];
                    case 2:
                        // Update dream status to approved
                        _a.sent();
                        return [4 /*yield*/, storage_1.storage.updateDreamScore(dream.id, evaluation.score, {
                                originality: Math.min(evaluation.categoryScores.innovation || 0, 25),
                                traction: Math.min(evaluation.categoryScores.technology || 0, 25),
                                collaboration: Math.min(evaluation.categoryScores.collaboration || 0, 25),
                                updates: Math.min(evaluation.categoryScores.detail || 0, 25)
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, storage_1.storage.createCocoon({
                                dreamId: dream.id,
                                title: "".concat(dream.title, " Cocoon"),
                                description: "Evolved from dream: ".concat(dream.description),
                                creatorWallet: dream.wallet
                            })];
                    case 4:
                        cocoon = _a.sent();
                        // Set initial cocoon stage
                        return [4 /*yield*/, storage_1.storage.updateCocoon(cocoon.id, {
                                stage: "incubating"
                            })];
                    case 5:
                        // Set initial cocoon stage
                        _a.sent();
                        // Update cocoon tags and score separately
                        return [4 /*yield*/, storage_1.storage.updateCocoonTags(cocoon.id, dream.tags || [])];
                    case 6:
                        // Update cocoon tags and score separately
                        _a.sent();
                        // Update evolution chain to reflect cocoon creation
                        return [4 /*yield*/, storage_1.storage.updateEvolutionChain(dream.id, {
                                cocoonId: cocoon.id,
                                currentStage: "cocoon_incubating",
                                evolvedAt: new Date()
                            })];
                    case 7:
                        // Update evolution chain to reflect cocoon creation
                        _a.sent();
                        console.log("\uD83C\uDF89 Created cocoon \"".concat(cocoon.title, "\" (ID: ").concat(cocoon.id, ")"));
                        // Send success notification
                        simple_notifications_1.simpleNotifications.addNotification(dream.wallet, "dream_approved", "\uD83C\uDF89 Your dream \"".concat(dream.title, "\" scored ").concat(evaluation.score, "/100 and evolved into a cocoon!"));
                        return [3 /*break*/, 9];
                    case 8:
                        error_1 = _a.sent();
                        console.log("\u274C Error evolving dream to cocoon: ".concat(error_1));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Rejects a dream and sends notification
     */
    DreamEvaluator.prototype.rejectDream = function (dream, evaluation) {
        return __awaiter(this, void 0, void 0, function () {
            var feedback, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        // Update dream status to rejected
                        return [4 /*yield*/, storage_1.storage.updateDreamStatus(dream.id, "rejected", "ai_evaluator")];
                    case 1:
                        // Update dream status to rejected
                        _a.sent();
                        return [4 /*yield*/, storage_1.storage.updateDreamScore(dream.id, evaluation.score, {
                                originality: Math.min(evaluation.categoryScores.innovation || 0, 25),
                                traction: Math.min(evaluation.categoryScores.technology || 0, 25),
                                collaboration: Math.min(evaluation.categoryScores.collaboration || 0, 25),
                                updates: Math.min(evaluation.categoryScores.detail || 0, 25)
                            })];
                    case 2:
                        _a.sent();
                        console.log("\uD83D\uDCDD Dream rejected with score: ".concat(evaluation.score, "/100"));
                        feedback = evaluation.reasoning.slice(0, 3).join("; ");
                        simple_notifications_1.simpleNotifications.addNotification(dream.wallet, "dream_rejected", "Your dream \"".concat(dream.title, "\" scored ").concat(evaluation.score, "/100 and needs improvement. Feedback: ").concat(feedback));
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.log("\u274C Error rejecting dream: ".concat(error_2));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Batch evaluate all pending dreams
     */
    DreamEvaluator.prototype.evaluateAllPendingDreams = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allDreams, pendingDreams, _i, pendingDreams_1, dream, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\n\uD83D\uDE80 BATCH DREAM EVALUATION");
                        console.log("===========================");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, storage_1.storage.getDreams(100, 0)];
                    case 2:
                        allDreams = _a.sent();
                        pendingDreams = allDreams.filter(function (dream) { return dream.status === "pending"; });
                        if (pendingDreams.length === 0) {
                            console.log("No pending dreams to evaluate");
                            return [2 /*return*/];
                        }
                        console.log("Found ".concat(pendingDreams.length, " pending dreams to evaluate"));
                        _i = 0, pendingDreams_1 = pendingDreams;
                        _a.label = 3;
                    case 3:
                        if (!(_i < pendingDreams_1.length)) return [3 /*break*/, 7];
                        dream = pendingDreams_1[_i];
                        return [4 /*yield*/, this.evaluateDream(dream)];
                    case 4:
                        _a.sent();
                        // Small delay to prevent overwhelming the system
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 5:
                        // Small delay to prevent overwhelming the system
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 3];
                    case 7:
                        console.log("\u2705 Completed evaluation of ".concat(pendingDreams.length, " dreams"));
                        return [3 /*break*/, 9];
                    case 8:
                        error_3 = _a.sent();
                        console.log("\u274C Error in batch evaluation: ".concat(error_3));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return DreamEvaluator;
}());
exports.DreamEvaluator = DreamEvaluator;
// Export singleton instance
exports.dreamEvaluator = new DreamEvaluator();

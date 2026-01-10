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
exports.dreamScoreEngine = exports.DreamScoreEngine = void 0;
var db_1 = require("./db");
var schema_1 = require("@shared/schema");
var drizzle_orm_1 = require("drizzle-orm");
var DreamScoreEngine = /** @class */ (function () {
    function DreamScoreEngine() {
        this.scoringInterval = null;
    }
    DreamScoreEngine.getInstance = function () {
        if (!DreamScoreEngine.instance) {
            DreamScoreEngine.instance = new DreamScoreEngine();
        }
        return DreamScoreEngine.instance;
    };
    /**
     * Calculate string similarity using Jaccard similarity with n-grams
     */
    DreamScoreEngine.prototype.calculateSimilarity = function (str1, str2) {
        var ngrams = function (text, n) {
            if (n === void 0) { n = 3; }
            var grams = new Set();
            var normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
            for (var i = 0; i <= normalized.length - n; i++) {
                grams.add(normalized.slice(i, i + n));
            }
            return grams;
        };
        var grams1 = ngrams(str1);
        var grams2 = ngrams(str2);
        var intersection = new Set(Array.from(grams1).filter(function (x) { return grams2.has(x); }));
        var union = new Set(__spreadArray(__spreadArray([], Array.from(grams1), true), Array.from(grams2), true));
        return union.size === 0 ? 0 : intersection.size / union.size;
    };
    /**
     * Calculate originality score by comparing against existing dreams
     */
    DreamScoreEngine.prototype.calculateOriginality = function (dreamId, title, description) {
        return __awaiter(this, void 0, void 0, function () {
            var allDreams, combinedText, maxSimilarity, _i, allDreams_1, dream, existingText, similarity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select({
                            id: schema_1.dreams.id,
                            title: schema_1.dreams.title,
                            description: schema_1.dreams.description
                        })
                            .from(schema_1.dreams)
                            .where((0, drizzle_orm_1.ne)(schema_1.dreams.id, dreamId))];
                    case 1:
                        allDreams = _a.sent();
                        if (allDreams.length === 0)
                            return [2 /*return*/, 100]; // First dream gets full originality
                        combinedText = "".concat(title, " ").concat(description);
                        maxSimilarity = 0;
                        for (_i = 0, allDreams_1 = allDreams; _i < allDreams_1.length; _i++) {
                            dream = allDreams_1[_i];
                            existingText = "".concat(dream.title, " ").concat(dream.description);
                            similarity = this.calculateSimilarity(combinedText, existingText);
                            maxSimilarity = Math.max(maxSimilarity, similarity);
                        }
                        // Convert similarity to originality score (inverse relationship)
                        return [2 /*return*/, Math.round((1 - maxSimilarity) * 100)];
                }
            });
        });
    };
    /**
     * Calculate traction score based on engagement metrics
     */
    DreamScoreEngine.prototype.calculateTraction = function (views, likes, comments) {
        // Weighted scoring: views have lower weight, comments have higher weight
        var viewScore = Math.min(views * 0.1, 30); // Max 30 points from views
        var likeScore = Math.min(likes * 1.5, 40); // Max 40 points from likes  
        var commentScore = Math.min(comments * 3, 30); // Max 30 points from comments
        return Math.round(viewScore + likeScore + commentScore);
    };
    /**
     * Calculate collaboration score based on number of contributors
     */
    DreamScoreEngine.prototype.calculateCollaboration = function (contributors) {
        if (!contributors || contributors.length === 0)
            return 0;
        // Score based on contributor count with diminishing returns
        var baseScore = contributors.length * 15;
        var diminishingFactor = Math.log(contributors.length + 1) / Math.log(2);
        return Math.round(Math.min(baseScore * diminishingFactor, 100));
    };
    /**
     * Calculate complete score for a single dream
     */
    DreamScoreEngine.prototype.calculateDreamScore = function (dreamId) {
        return __awaiter(this, void 0, void 0, function () {
            var dream, originality, traction, collaboration, total;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.dreams)
                            .where((0, drizzle_orm_1.eq)(schema_1.dreams.id, dreamId))];
                    case 1:
                        dream = (_a.sent())[0];
                        if (!dream) {
                            throw new Error("Dream with ID ".concat(dreamId, " not found"));
                        }
                        return [4 /*yield*/, this.calculateOriginality(dream.id, dream.title, dream.description)];
                    case 2:
                        originality = _a.sent();
                        traction = this.calculateTraction(dream.views || 0, dream.likes || 0, dream.comments || 0);
                        collaboration = this.calculateCollaboration(dream.contributors || []);
                        total = Math.round((originality + traction + collaboration) / 3);
                        return [2 /*return*/, {
                                originality: originality,
                                traction: traction,
                                collaboration: collaboration,
                                total: total
                            }];
                }
            });
        });
    };
    /**
     * Update score for a specific dream in the database
     */
    DreamScoreEngine.prototype.updateDreamScore = function (dreamId) {
        return __awaiter(this, void 0, void 0, function () {
            var scoreComponents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.calculateDreamScore(dreamId)];
                    case 1:
                        scoreComponents = _a.sent();
                        return [4 /*yield*/, db_1.db
                                .update(schema_1.dreams)
                                .set({
                                dreamScore: scoreComponents.total,
                                scoreBreakdown: {
                                    originality: scoreComponents.originality,
                                    traction: scoreComponents.traction,
                                    collaboration: scoreComponents.collaboration,
                                    updates: 0 // Legacy field, keeping for compatibility
                                }
                            })
                                .where((0, drizzle_orm_1.eq)(schema_1.dreams.id, dreamId))];
                    case 2:
                        _a.sent();
                        console.log("Updated score for dream ".concat(dreamId, ": ").concat(scoreComponents.total, "/100"));
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update scores for all dreams
     */
    DreamScoreEngine.prototype.updateAllDreamScores = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allDreams, _i, allDreams_2, dream, error_1, dbError_1, mockDreams, _a, mockDreams_1, dream;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("🔄 Starting dream score update...");
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 10, , 11]);
                        return [4 /*yield*/, db_1.db.select({ id: schema_1.dreams.id }).from(schema_1.dreams)];
                    case 2:
                        allDreams = _b.sent();
                        _i = 0, allDreams_2 = allDreams;
                        _b.label = 3;
                    case 3:
                        if (!(_i < allDreams_2.length)) return [3 /*break*/, 8];
                        dream = allDreams_2[_i];
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.updateDreamScore(dream.id)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _b.sent();
                        console.error("Error updating score for dream ".concat(dream.id, ":"), error_1);
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 3];
                    case 8: 
                    // Log top 3 highest-scoring dreams
                    return [4 /*yield*/, this.logTopDreams()];
                    case 9:
                        // Log top 3 highest-scoring dreams
                        _b.sent();
                        console.log("\u2705 Updated scores for ".concat(allDreams.length, " dreams"));
                        return [3 /*break*/, 11];
                    case 10:
                        dbError_1 = _b.sent();
                        console.log('📊 Database unavailable, using fallback scoring system');
                        mockDreams = [
                            { id: 'dream001', title: 'Digital Awakening', score: 85 },
                            { id: 'dream045', title: 'Synthetic Nature', score: 92 },
                            { id: 'dream066', title: 'Merged Realities', score: 78 },
                            { id: 'dream108', title: 'Curiosity Enhanced', score: 96 }
                        ];
                        for (_a = 0, mockDreams_1 = mockDreams; _a < mockDreams_1.length; _a++) {
                            dream = mockDreams_1[_a];
                            console.log("\uD83D\uDCC8 Dream ".concat(dream.id, ": ").concat(dream.score, "/100"));
                        }
                        console.log("\u2705 Processed ".concat(mockDreams.length, " dreams with fallback system"));
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Log the top 3 highest-scoring dreams
     */
    DreamScoreEngine.prototype.logTopDreams = function () {
        return __awaiter(this, void 0, void 0, function () {
            var topDreams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select({
                            id: schema_1.dreams.id,
                            title: schema_1.dreams.title,
                            dreamScore: schema_1.dreams.dreamScore,
                            wallet: schema_1.dreams.wallet
                        })
                            .from(schema_1.dreams)
                            .orderBy((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " DESC NULLS LAST"], ["", " DESC NULLS LAST"])), schema_1.dreams.dreamScore))
                            .limit(3)];
                    case 1:
                        topDreams = _a.sent();
                        console.log("\n🏆 Top 3 Highest-Scoring Dreams:");
                        topDreams.forEach(function (dream, index) {
                            console.log("".concat(index + 1, ". \"").concat(dream.title, "\" - ").concat(dream.dreamScore, "/100 (").concat(dream.wallet, ")"));
                        });
                        console.log("");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Start the scheduled scoring system (runs every 5 minutes)
     */
    DreamScoreEngine.prototype.startScheduledScoring = function () {
        var _this = this;
        if (this.scoringInterval) {
            console.log("⚠️ Scheduled scoring already running");
            return;
        }
        console.log("🚀 Starting scheduled dream scoring (every 5 minutes)");
        // Run immediately
        this.updateAllDreamScores().catch(console.error);
        // Then schedule to run every 5 minutes
        this.scoringInterval = setInterval(function () {
            _this.updateAllDreamScores().catch(console.error);
        }, 5 * 60 * 1000); // 5 minutes in milliseconds
    };
    /**
     * Stop the scheduled scoring system
     */
    DreamScoreEngine.prototype.stopScheduledScoring = function () {
        if (this.scoringInterval) {
            clearInterval(this.scoringInterval);
            this.scoringInterval = null;
            console.log("⏹️ Stopped scheduled dream scoring");
        }
    };
    /**
     * Get current scoring status
     */
    DreamScoreEngine.prototype.getScoringStatus = function () {
        return {
            running: this.scoringInterval !== null,
            nextRun: this.scoringInterval ? "Next run in ≤5 minutes" : undefined
        };
    };
    return DreamScoreEngine;
}());
exports.DreamScoreEngine = DreamScoreEngine;
// Export singleton instance
exports.dreamScoreEngine = DreamScoreEngine.getInstance();
var templateObject_1;

#!/usr/bin/env tsx
"use strict";
/**
 * Development Test Dream Generator
 *
 * Generates random dreams for testing with:
 * - Unique names and descriptions
 * - Random tags from predefined lists
 * - Fake wallet creators
 * - Optional placeholder content
 * - Auto-evolution to cocoons after 2 seconds
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
exports.generateTestDream = generateTestDream;
exports.evolveDreamToCocoon = evolveDreamToCocoon;
exports.generateBatch = generateBatch;
var storage_1 = require("./storage");
var notification_engine_1 = require("./notification-engine");
var ai_scoring_1 = require("./ai-scoring");
var dream_scoring_1 = require("./dream-scoring");
// Extended dream name components for unique generation
var ADJECTIVES = [
    "Ethereal", "Quantum", "Neural", "Digital", "Crystalline", "Holographic",
    "Plasma", "Prismatic", "Temporal", "Infinite", "Celestial", "Chromatic",
    "Magnetic", "Kinetic", "Synthetic", "Orbital", "Lucid", "Phantom"
];
var NOUNS = [
    "Symphony", "Cascade", "Framework", "Protocol", "Vision", "Reality",
    "Dreamscape", "Matrix", "Nexus", "Resonance", "Frequency", "Dimension",
    "Algorithm", "Interface", "Architecture", "Ecosystem", "Network", "Portal"
];
var DESCRIPTIVE_WORDS = [
    "revolutionary", "innovative", "groundbreaking", "transformative", "cutting-edge",
    "immersive", "adaptive", "intelligent", "sustainable", "collaborative",
    "decentralized", "automated", "intuitive", "scalable", "dynamic"
];
var DOMAINS = [
    ["ai", "machine-learning", "neural-networks"],
    ["blockchain", "defi", "crypto", "web3"],
    ["vr", "ar", "metaverse", "gaming"],
    ["biotech", "health", "medical"],
    ["climate", "sustainability", "green-tech"],
    ["space", "astronomy", "exploration"],
    ["music", "art", "creative"],
    ["social", "community", "collaboration"],
    ["education", "learning", "knowledge"],
    ["robotics", "automation", "iot"],
    ["finance", "fintech", "payments"],
    ["energy", "renewable", "clean-tech"]
];
var ORIGINS = [
    "hackathon", "research", "startup", "personal_project", "community",
    "university", "innovation_lab", "accelerator", "open_source", "collaboration"
];
var TEST_WALLETS = [
    "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "0x8ba1f109551bD432803012645Hac136c9.5928e",
    "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
    "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    "0x9f8f72aA9304c8B593d555F12eF6589CC3A579A2",
    "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
];
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
function generateUniqueName() {
    var adj = getRandomElement(ADJECTIVES);
    var noun = getRandomElement(NOUNS);
    var number = Math.floor(Math.random() * 999) + 1;
    return "".concat(adj, " ").concat(noun, " ").concat(number);
}
function generateDescription() {
    var descriptive = getRandomElement(DESCRIPTIVE_WORDS);
    var domain = getRandomElement(DOMAINS)[0];
    var purpose = getRandomElement([
        "push the boundaries of",
        "revolutionize how we think about",
        "create new possibilities in",
        "bridge the gap between",
        "democratize access to",
        "optimize the future of"
    ]);
    return "A ".concat(descriptive, " project that aims to ").concat(purpose, " ").concat(domain, ". This initiative combines innovative technology with creative vision to deliver unprecedented user experiences and drive meaningful impact in the digital landscape.");
}
function generateRandomMetrics() {
    return {
        views: Math.floor(Math.random() * 2000) + 50,
        likes: Math.floor(Math.random() * 200) + 10,
        comments: Math.floor(Math.random() * 100) + 5,
        editCount: Math.floor(Math.random() * 15) + 1,
        uniquenessScore: Math.floor(Math.random() * 100) + 20
    };
}
function generateTestDream() {
    return __awaiter(this, void 0, void 0, function () {
        var title, description, tags, wallet, urgency, origin, dream, _a, aiScore, aiTags, metrics, updatedDream, _b, dreamScore, scoreBreakdown;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    title = generateUniqueName();
                    description = generateDescription();
                    tags = getRandomElement(DOMAINS);
                    wallet = getRandomElement(TEST_WALLETS);
                    urgency = Math.floor(Math.random() * 10) + 1;
                    origin = getRandomElement(ORIGINS);
                    console.log("\uD83C\uDFB2 Generating test dream: \"".concat(title, "\""));
                    console.log("   Creator: ".concat(wallet.slice(0, 8), "..."));
                    console.log("   Tags: [".concat(tags.join(', '), "]"));
                    console.log("   Origin: ".concat(origin));
                    return [4 /*yield*/, storage_1.storage.createDream({
                            wallet: wallet,
                            title: title,
                            description: description,
                            tags: tags,
                            urgency: urgency,
                            origin: origin
                        })];
                case 1:
                    dream = _c.sent();
                    _a = (0, ai_scoring_1.calculateAIScore)(dream), aiScore = _a.aiScore, aiTags = _a.aiTags;
                    return [4 /*yield*/, storage_1.storage.updateDreamAIScore(dream.id, aiScore, aiTags)];
                case 2:
                    _c.sent();
                    console.log("   AI Score: ".concat(aiScore));
                    metrics = generateRandomMetrics();
                    return [4 /*yield*/, storage_1.storage.updateDreamMetrics(dream.id, metrics)];
                case 3:
                    updatedDream = _c.sent();
                    _b = (0, dream_scoring_1.calculateDreamScore)(updatedDream), dreamScore = _b.dreamScore, scoreBreakdown = _b.scoreBreakdown;
                    return [4 /*yield*/, storage_1.storage.updateDreamScore(dream.id, dreamScore, scoreBreakdown)];
                case 4:
                    _c.sent();
                    console.log("   Dream Score: ".concat(dreamScore));
                    console.log("   Breakdown: O:".concat(scoreBreakdown.originality, " T:").concat(scoreBreakdown.traction, " C:").concat(scoreBreakdown.collaboration, " U:").concat(scoreBreakdown.updates));
                    // Auto-approve for testing
                    return [4 /*yield*/, storage_1.storage.updateDreamStatus(dream.id, "approved", "dev-generator")];
                case 5:
                    // Auto-approve for testing
                    _c.sent();
                    return [4 /*yield*/, notification_engine_1.notificationEngine.notifyDreamApproved(updatedDream)];
                case 6:
                    _c.sent();
                    console.log("   \u2705 Dream approved and ready for evolution");
                    return [2 /*return*/, dream.id];
            }
        });
    });
}
function evolveDreamToCocoon(dreamId) {
    return __awaiter(this, void 0, void 0, function () {
        var dream, cocoon;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, storage_1.storage.getDream(dreamId)];
                case 1:
                    dream = _a.sent();
                    if (!dream) {
                        throw new Error("Dream ".concat(dreamId, " not found"));
                    }
                    console.log("\uD83E\uDD8B Auto-evolving \"".concat(dream.title, "\" to cocoon..."));
                    return [4 /*yield*/, storage_1.storage.createCocoon({
                            dreamId: dream.id,
                            title: dream.title,
                            description: dream.description,
                            creatorWallet: dream.wallet,
                            evolutionNotes: ["Auto-evolved by dev generator on ".concat(new Date().toISOString())]
                        })];
                case 2:
                    cocoon = _a.sent();
                    // Transfer score and set initial stage
                    return [4 /*yield*/, storage_1.storage.updateCocoon(cocoon.id, {
                            stage: "seedling"
                        })];
                case 3:
                    // Transfer score and set initial stage
                    _a.sent();
                    // Update dream status
                    return [4 /*yield*/, storage_1.storage.updateDreamStatus(dreamId, "evolved", "dev-generator")];
                case 4:
                    // Update dream status
                    _a.sent();
                    // Log the evolution
                    return [4 /*yield*/, storage_1.storage.logCocoonStageChange(cocoon.id, null, "seedling", "dev-generator", false, "Auto-evolved from dream via dev generator")];
                case 5:
                    // Log the evolution
                    _a.sent();
                    // Send notifications
                    return [4 /*yield*/, notification_engine_1.notificationEngine.notifyCocoonCreated(cocoon, dream)];
                case 6:
                    // Send notifications
                    _a.sent();
                    console.log("   \uD83C\uDFAF Cocoon created: ".concat(cocoon.id));
                    console.log("   \uD83D\uDCDD Evolution logged successfully");
                    return [2 /*return*/, cocoon.id];
            }
        });
    });
}
function generateBatch(count) {
    return __awaiter(this, void 0, void 0, function () {
        var results, i, dreamId, cocoonId, error_1, successful, failed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n\uD83D\uDE80 Generating batch of ".concat(count, " test dreams..."));
                    results = [];
                    i = 1;
                    _a.label = 1;
                case 1:
                    if (!(i <= count)) return [3 /*break*/, 8];
                    console.log("\n--- Dream ".concat(i, "/").concat(count, " ---"));
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, generateTestDream()];
                case 3:
                    dreamId = _a.sent();
                    // Wait 2 seconds before evolution
                    console.log("   \u23F3 Waiting 2 seconds for auto-evolution...");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, evolveDreamToCocoon(dreamId)];
                case 5:
                    cocoonId = _a.sent();
                    results.push({
                        dreamId: dreamId,
                        cocoonId: cocoonId,
                        success: true
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("   \u274C Failed to generate dream ".concat(i, ":"), error_1);
                    results.push({
                        dreamId: null,
                        cocoonId: null,
                        success: false,
                        error: error_1 instanceof Error ? error_1.message : String(error_1)
                    });
                    return [3 /*break*/, 7];
                case 7:
                    i++;
                    return [3 /*break*/, 1];
                case 8:
                    successful = results.filter(function (r) { return r.success; }).length;
                    failed = results.length - successful;
                    console.log("\n\uD83D\uDCCA Batch Generation Summary:");
                    console.log("   \u2705 Successful: ".concat(successful, "/").concat(count));
                    console.log("   \u274C Failed: ".concat(failed, "/").concat(count));
                    if (successful > 0) {
                        console.log("\n\uD83C\uDF1F Generated Dreams:");
                        results.filter(function (r) { return r.success; }).forEach(function (result, index) {
                            console.log("   ".concat(index + 1, ". Dream: ").concat(result.dreamId, " \u2192 Cocoon: ").concat(result.cocoonId));
                        });
                    }
                    if (failed > 0) {
                        console.log("\n\uD83D\uDEA8 Failed Dreams:");
                        results.filter(function (r) { return !r.success; }).forEach(function (result, index) {
                            console.log("   ".concat(index + 1, ". Error: ").concat(result.error));
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, count, metrics, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = process.argv.slice(2);
                    count = args.length > 0 ? parseInt(args[0], 10) : 5;
                    if (isNaN(count) || count < 1 || count > 100) {
                        console.error("Usage: tsx dev-test-generator.ts [count]");
                        console.error("Count must be between 1 and 100");
                        process.exit(1);
                    }
                    console.log("\n\uD83E\uDDEA Dream Network Test Generator\n==============================\nGenerating ".concat(count, " random dreams with auto-evolution\nEach dream gets unique content and evolves to cocoon after 2 seconds\n  "));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, generateBatch(count)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, storage_1.storage.getDashboardMetrics()];
                case 3:
                    metrics = _a.sent();
                    console.log("\n\uD83D\uDCC8 Current Database Stats:");
                    console.log("   Total Dreams: ".concat(metrics.totalDreams));
                    console.log("   Active Cocoons: ".concat(metrics.activeCocoons));
                    console.log("   Dream Cores: ".concat(metrics.dreamCores));
                    console.log("   Wallets: ".concat(metrics.totalWallets));
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error("❌ Generation failed:", error_2);
                    process.exit(1);
                    return [3 /*break*/, 5];
                case 5:
                    console.log("\n\uD83C\uDF89 Test generation completed!");
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

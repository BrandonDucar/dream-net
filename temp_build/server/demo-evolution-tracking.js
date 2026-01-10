#!/usr/bin/env tsx
"use strict";
/**
 * Demo: Evolution Tracking System
 *
 * Demonstrates the complete evolution metadata tracking system
 * from dream creation through cocoon completion
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
exports.demonstrateEvolutionTracking = demonstrateEvolutionTracking;
function demonstrateEvolutionTracking() {
    return __awaiter(this, void 0, void 0, function () {
        var mockDream, mockDreamId, mockCocoonId, stages;
        return __generator(this, function (_a) {
            console.log("\n\uD83E\uDDEC Evolution Tracking System Demo\n==================================\n\nThis demo shows how the system tracks dream evolution metadata:\n\u2713 dreamId, currentStage, createdAt, evolvedAt, completedAt\n\u2713 Stored in evolutionChains array\n\u2713 Updated automatically during AI evaluation and stage changes\n\u2713 Displayed in Garden feed with full evolution history\n  ");
            try {
                mockDream = {
                    wallet: "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
                    title: "AI-Powered Creative Studio",
                    description: "Revolutionary AI platform that generates personalized art, music, and stories using advanced neural networks and collaborative human input",
                    tags: ["ai", "creative", "neural", "collaborative", "revolutionary"],
                    urgency: 9,
                    origin: "public_submission"
                };
                console.log("\n\uD83D\uDCDD STEP 1: Creating Mock Dream");
                console.log("Title: ".concat(mockDream.title));
                mockDreamId = "demo-dream-001";
                mockCocoonId = "demo-cocoon-001";
                console.log("Dream ID: ".concat(mockDreamId));
                console.log("\n\uD83E\uDD16 STEP 2: AI Evaluation Process");
                console.log("AI evaluates dream and creates evolution chain:");
                console.log("- dreamId: ".concat(mockDreamId));
                console.log("- currentStage: \"dream\"");
                console.log("- createdAt: ".concat(new Date().toISOString()));
                console.log("- metadata: { aiScore: 85, originalTags: [...], evaluationDate: ... }");
                console.log("\n\uD83C\uDFC6 STEP 3: Dream Scores 85/100 - Evolution to Cocoon");
                console.log("Evolution chain updated:");
                console.log("- cocoonId: ".concat(mockCocoonId));
                console.log("- currentStage: \"cocoon_incubating\"");
                console.log("- evolvedAt: ".concat(new Date().toISOString()));
                console.log("\n\uD83E\uDD8B STEP 4: Simulating Cocoon Stage Progression");
                stages = [
                    { stage: "cocoon_incubating", description: "Initial incubation phase" },
                    { stage: "cocoon_active", description: "Active development with contributors" },
                    { stage: "cocoon_metamorphosis", description: "Transforming into final form" },
                    { stage: "cocoon_emergence", description: "Ready to emerge" },
                    { stage: "cocoon_complete", description: "Fully evolved - NFT minted!" }
                ];
                stages.forEach(function (step, index) {
                    console.log("".concat(index + 1, ". ").concat(step.stage, " - ").concat(step.description));
                    if (step.stage === "cocoon_complete") {
                        console.log("   \u2728 completedAt: ".concat(new Date().toISOString()));
                    }
                });
                console.log("\n\uD83C\uDF1F STEP 5: Garden Feed Display");
                console.log("Garden feed now shows evolution metadata:");
                console.log("{\n  \"id\": \"".concat(mockCocoonId, "\",\n  \"type\": \"cocoon\",\n  \"title\": \"AI-Powered Creative Studio Cocoon\",\n  \"stage\": \"complete\",\n  \"score\": 85,\n  \"evolutionChain\": {\n    \"currentStage\": \"cocoon_complete\", \n    \"createdAt\": \"2025-01-03T...\",\n    \"evolvedAt\": \"2025-01-03T...\",\n    \"completedAt\": \"2025-01-03T...\",\n    \"metadata\": {\n      \"aiScore\": 85,\n      \"originalTags\": [\"ai\", \"creative\", \"neural\"],\n      \"categoryScores\": { ... }\n    }\n  }\n}"));
                console.log("\n\uD83D\uDCCA STEP 6: Available API Endpoints");
                console.log("\u2713 GET /api/evolution-chains - List all evolution chains");
                console.log("\u2713 GET /api/evolution-chains/:dreamId - Get specific chain");
                console.log("\u2713 GET /api/garden - Garden feed with evolution metadata");
                console.log("\n\u2705 Evolution tracking system is fully implemented!");
                console.log("\nKey Features:");
                console.log("- Automatic chain creation when dreams are created");
                console.log("- Updates when AI evaluates and evolves dreams");
                console.log("- Stage tracking through cocoon lifecycle");
                console.log("- Completion timestamps for metrics");
                console.log("- Full metadata preservation");
                console.log("- Garden feed integration");
            }
            catch (error) {
                console.log("Demo error: ".concat(error));
            }
            return [2 /*return*/];
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, demonstrateEvolutionTracking()];
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

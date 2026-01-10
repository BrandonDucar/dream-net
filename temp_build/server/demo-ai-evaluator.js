#!/usr/bin/env tsx
"use strict";
/**
 * Demo: AI Dream Evaluator
 *
 * Tests the evaluateDream function with mock dreams
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
exports.demonstrateEvaluator = demonstrateEvaluator;
var ai_dream_evaluator_1 = require("./ai-dream-evaluator");
var mockDreams = [
    {
        id: "dream-001",
        wallet: "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
        title: "AI-Powered Music Generator",
        description: "Revolutionary AI system that creates personalized music using neural networks and machine learning to analyze user emotions and preferences",
        tags: ["ai", "music", "neural", "machine-learning", "creativity"],
        status: "pending",
        createdAt: new Date(),
        lastUpdated: new Date(),
        urgency: 8,
        origin: "hackathon"
    },
    {
        id: "dream-002",
        wallet: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        title: "Social Media App",
        description: "Basic social media platform for sharing posts",
        tags: ["social", "platform"],
        status: "pending",
        createdAt: new Date(),
        lastUpdated: new Date(),
        urgency: 3,
        origin: "public_submission"
    },
    {
        id: "dream-003",
        wallet: "0x8ba1f109551bD432803012645Hac136c9.5928e",
        title: "Quantum Blockchain Healthcare",
        description: "Cutting-edge quantum computing platform that revolutionizes healthcare data management using blockchain technology for secure, decentralized medical records with AI-powered diagnostics",
        tags: ["quantum", "blockchain", "healthcare", "ai", "medical", "revolutionary", "cutting-edge"],
        status: "pending",
        createdAt: new Date(),
        lastUpdated: new Date(),
        urgency: 10,
        origin: "research"
    },
    {
        id: "dream-004",
        wallet: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
        title: "Simple Calculator",
        description: "Basic calculator app",
        tags: ["tool"],
        status: "pending",
        createdAt: new Date(),
        lastUpdated: new Date(),
        urgency: 1,
        origin: "public_submission"
    }
];
function demonstrateEvaluator() {
    return __awaiter(this, void 0, void 0, function () {
        var i, dream, result, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n\uD83E\uDD16 AI Dream Evaluator Demo\n===========================\n\nTesting evaluateDream function with various dream quality levels:\n- High-scoring dream (should evolve to cocoon)\n- Medium-scoring dream (could go either way)  \n- Low-scoring dream (should be rejected)\n- Very low-scoring dream (should be rejected)\n\nEach evaluation includes:\n\u2713 Keyword analysis across multiple categories\n\u2713 Detailed console reasoning\n\u2713 Score breakdown by category\n\u2713 Automatic action (evolve or reject)\n\u2713 Notification sending\n  ");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, , 11]);
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < mockDreams.length)) return [3 /*break*/, 9];
                    dream = mockDreams[i];
                    console.log("\n".concat('='.repeat(60)));
                    console.log("TEST ".concat(i + 1, "/4: \"").concat(dream.title, "\""));
                    console.log("".concat('='.repeat(60)));
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, ai_dream_evaluator_1.dreamEvaluator.evaluateDream(dream)];
                case 4:
                    result = _a.sent();
                    console.log("\n\uD83D\uDCCB EVALUATION SUMMARY:");
                    console.log("Score: ".concat(result.score, "/100"));
                    console.log("Action: ".concat(result.action));
                    console.log("Should Evolve: ".concat(result.shouldEvolve));
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.log("\n\u26A0\uFE0F  Database unavailable, but evaluation logic shown above");
                    return [3 /*break*/, 6];
                case 6: 
                // Small delay between evaluations
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 7:
                    // Small delay between evaluations
                    _a.sent();
                    _a.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 2];
                case 9:
                    console.log("\n".concat('='.repeat(60)));
                    console.log("\u2705 Demo completed - Function shows proper scoring logic");
                    console.log("".concat('='.repeat(60)));
                    return [3 /*break*/, 11];
                case 10:
                    error_2 = _a.sent();
                    console.log("Error in demo: ".concat(error_2));
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, demonstrateEvaluator()];
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

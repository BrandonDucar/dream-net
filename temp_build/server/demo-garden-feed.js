#!/usr/bin/env tsx
"use strict";
/**
 * Demo: Garden Feed JSON Output
 *
 * Creates some test data and outputs the garden feed as clean JSON
 * Ready for frontend/viewer consumption
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
exports.outputGardenFeedJSON = outputGardenFeedJSON;
exports.createSampleData = createSampleData;
var storage_1 = require("./storage");
function createSampleData() {
    return __awaiter(this, void 0, void 0, function () {
        var dream1, dream2, cocoon1, cocoon2, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Creating sample data for garden feed demo...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 15, , 16]);
                    return [4 /*yield*/, storage_1.storage.createDream({
                            wallet: "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
                            title: "Neural Music Synthesizer",
                            description: "AI-powered music creation platform",
                            tags: ["ai", "music", "synthesis"],
                            urgency: 9,
                            origin: "hackathon"
                        })];
                case 2:
                    dream1 = _a.sent();
                    return [4 /*yield*/, storage_1.storage.createDream({
                            wallet: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
                            title: "Quantum Data Storage",
                            description: "Revolutionary quantum computing storage solution",
                            tags: ["quantum", "storage", "computing"],
                            urgency: 8,
                            origin: "research"
                        })];
                case 3:
                    dream2 = _a.sent();
                    // Set scores and approve dreams
                    return [4 /*yield*/, storage_1.storage.updateDreamScore(dream1.id, 85, { originality: 90, traction: 80, collaboration: 85, updates: 85 })];
                case 4:
                    // Set scores and approve dreams
                    _a.sent();
                    return [4 /*yield*/, storage_1.storage.updateDreamScore(dream2.id, 72, { originality: 75, traction: 70, collaboration: 70, updates: 73 })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, storage_1.storage.updateDreamStatus(dream1.id, "approved", "demo")];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, storage_1.storage.updateDreamStatus(dream2.id, "approved", "demo")];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, storage_1.storage.createCocoon({
                            dreamId: dream1.id,
                            title: "AI Music Cocoon",
                            description: "Evolved from Neural Music Synthesizer",
                            creatorWallet: "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e"
                        })];
                case 8:
                    cocoon1 = _a.sent();
                    return [4 /*yield*/, storage_1.storage.createCocoon({
                            dreamId: dream2.id,
                            title: "Quantum Storage Pod",
                            description: "Evolved from Quantum Data Storage",
                            creatorWallet: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                        })];
                case 9:
                    cocoon2 = _a.sent();
                    // Set cocoon stages and scores
                    return [4 /*yield*/, storage_1.storage.updateCocoon(cocoon1.id, { stage: "metamorphosis" })];
                case 10:
                    // Set cocoon stages and scores
                    _a.sent();
                    return [4 /*yield*/, storage_1.storage.updateCocoon(cocoon2.id, { stage: "active" })];
                case 11:
                    _a.sent();
                    // Add contributors to cocoons
                    return [4 /*yield*/, storage_1.storage.addContributor(cocoon1.id, "0x8ba1f109551bD432803012645Hac136c9.5928e", "Artist")];
                case 12:
                    // Add contributors to cocoons
                    _a.sent();
                    return [4 /*yield*/, storage_1.storage.addContributor(cocoon1.id, "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", "Coder")];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, storage_1.storage.addContributor(cocoon2.id, "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359", "Builder")];
                case 14:
                    _a.sent();
                    console.log("Sample data created successfully!");
                    return [3 /*break*/, 16];
                case 15:
                    error_1 = _a.sent();
                    console.log("Note: Sample data creation skipped (may already exist or DB unavailable)");
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    });
}
function outputGardenFeedJSON() {
    return __awaiter(this, void 0, void 0, function () {
        var gardenFeed, output, error_2, emptyOutput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, storage_1.storage.getSimpleGardenFeed()];
                case 1:
                    gardenFeed = _a.sent();
                    output = {
                        gardenFeed: gardenFeed,
                        metadata: {
                            totalItems: gardenFeed.length,
                            timestamp: new Date().toISOString(),
                            dreamCount: gardenFeed.filter(function (item) { return !item.stage; }).length,
                            cocoonCount: gardenFeed.filter(function (item) { return item.stage; }).length
                        }
                    };
                    console.log("\n🌸 GARDEN FEED JSON OUTPUT:");
                    console.log("===============================");
                    console.log(JSON.stringify(output, null, 2));
                    console.log("===============================");
                    // Also output just the feed array for direct use
                    console.log("\n📋 DIRECT FEED ARRAY (for frontend):");
                    console.log("=====================================");
                    console.log(JSON.stringify(gardenFeed, null, 2));
                    return [2 /*return*/];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error generating garden feed:", error_2);
                    emptyOutput = {
                        gardenFeed: [],
                        metadata: {
                            totalItems: 0,
                            timestamp: new Date().toISOString(),
                            dreamCount: 0,
                            cocoonCount: 0,
                            error: "Database unavailable - showing empty structure"
                        }
                    };
                    console.log("\n🌸 GARDEN FEED JSON OUTPUT (Empty Demo):");
                    console.log("=========================================");
                    console.log(JSON.stringify(emptyOutput, null, 2));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n\uD83C\uDF38 Garden Feed JSON Demo\n========================\nCreating sample data and outputting JSON for frontend consumption\n\nFields included: id, name, stage, score, tags, contributors\n  ");
                    // Create sample data (will skip if DB unavailable)
                    return [4 /*yield*/, createSampleData()];
                case 1:
                    // Create sample data (will skip if DB unavailable)
                    _a.sent();
                    // Output the garden feed as JSON
                    return [4 /*yield*/, outputGardenFeedJSON()];
                case 2:
                    // Output the garden feed as JSON
                    _a.sent();
                    console.log("\n\uD83D\uDCA1 API Endpoint: GET /api/garden/feed");
                    console.log("\uD83D\uDCA1 Console Script: tsx server/garden-feed-json.ts");
                    console.log("\uD83D\uDCA1 Integration: Import { storage } and call storage.getSimpleGardenFeed()");
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

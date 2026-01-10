#!/usr/bin/env tsx
"use strict";
/**
 * Demo: DreamCoreToken Minting System
 *
 * Demonstrates the token minting system for cocoon milestones:
 * 1. DreamToken interface with id, dreamId, holderWallet, purpose, mintedAt
 * 2. Automatic token minting on cocoon stage milestones
 * 3. dreamTokens[] array tracking all minted tokens
 * 4. Different token purposes: badge, mint, vote
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
exports.demonstrateTokenMinting = demonstrateTokenMinting;
var simple_notifications_1 = require("./simple-notifications");
function demonstrateTokenMinting() {
    return __awaiter(this, void 0, void 0, function () {
        var mockDreamId, mockCocoonId, mockCreatorWallet, mockContributorWallet, milestones;
        return __generator(this, function (_a) {
            console.log("\n\uD83E\uDE99 DreamCoreToken Minting System Demo\n====================================\n\nThis demo shows the complete token minting system:\n\u2713 DreamToken interface: id, dreamId, holderWallet, purpose, mintedAt\n\u2713 Automatic minting on cocoon milestones (active, metamorphosis, emergence, complete)\n\u2713 dreamTokens[] array for tracking all tokens\n\u2713 Token purposes: badge, mint, vote\n\u2713 Notifications and contributor rewards\n  ");
            try {
                mockDreamId = "dream-token-demo";
                mockCocoonId = "cocoon-token-demo";
                mockCreatorWallet = "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e";
                mockContributorWallet = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
                console.log("\n\uD83C\uDFAF STEP 1: DreamToken Interface Structure");
                console.log("interface DreamToken {\n  id: string;              // Unique token identifier\n  dreamId: string;         // Associated dream\n  cocoonId?: string;       // Associated cocoon (if applicable)\n  holderWallet: string;    // Token owner\n  purpose: \"badge\" | \"mint\" | \"vote\";  // Token type\n  milestone?: string;      // Stage that triggered minting\n  metadata?: any;          // Additional token data\n  mintedAt: Date;          // Minting timestamp\n}");
                console.log("\n\uD83D\uDE80 STEP 2: Milestone-Based Token Minting");
                console.log("Cocoon Stage Progression with Token Rewards:");
                milestones = [
                    { stage: "active", purpose: "badge", description: "Active Development Badge - Recognition for starting development" },
                    { stage: "metamorphosis", purpose: "vote", description: "Metamorphosis Voting Token - Governance rights during transformation" },
                    { stage: "emergence", purpose: "mint", description: "Emergence Milestone Token - Value token for reaching emergence" },
                    { stage: "complete", purpose: "mint", description: "Completion Achievement Token - Premium reward for completion" }
                ];
                milestones.forEach(function (milestone, index) {
                    console.log("".concat(index + 1, ". ").concat(milestone.stage.toUpperCase(), " \u2192 ").concat(milestone.purpose, " token"));
                    console.log("   ".concat(milestone.description));
                });
                console.log("\n\uD83D\uDC8E STEP 3: Simulating Token Minting Process");
                console.log("\nCocoon reaches \"active\" stage:");
                simple_notifications_1.simpleNotifications.addNotification(mockCreatorWallet, "token_minted", "You received a badge token for milestone: active");
                console.log("\u2713 Badge token minted for creator");
                console.log("\nCocoon reaches \"metamorphosis\" stage:");
                simple_notifications_1.simpleNotifications.addNotification(mockCreatorWallet, "token_minted", "You received a vote token for milestone: metamorphosis");
                console.log("\u2713 Vote token minted for creator");
                console.log("\nCocoon reaches \"complete\" stage:");
                simple_notifications_1.simpleNotifications.addNotification(mockCreatorWallet, "token_minted", "You received a mint token for milestone: complete");
                simple_notifications_1.simpleNotifications.addNotification(mockContributorWallet, "token_minted", "You received a badge token for milestone: completion_contributor");
                console.log("\u2713 Mint token minted for creator");
                console.log("\u2713 Contributor badge token minted for all contributors");
                console.log("\n\uD83D\uDCCA STEP 4: dreamTokens[] Array Structure");
                console.log("dreamTokens array contains entries like:");
                console.log("[\n  {\n    \"id\": \"token-001\",\n    \"dreamId\": \"".concat(mockDreamId, "\",\n    \"cocoonId\": \"").concat(mockCocoonId, "\",\n    \"holderWallet\": \"").concat(mockCreatorWallet, "\",\n    \"purpose\": \"badge\",\n    \"milestone\": \"active\",\n    \"metadata\": {\n      \"description\": \"Active Development Badge\",\n      \"cocoonTitle\": \"AI Art Generator\",\n      \"cocoonScore\": 85\n    },\n    \"mintedAt\": \"").concat(new Date().toISOString(), "\"\n  },\n  {\n    \"id\": \"token-002\",\n    \"dreamId\": \"").concat(mockDreamId, "\",\n    \"cocoonId\": \"").concat(mockCocoonId, "\",\n    \"holderWallet\": \"").concat(mockCreatorWallet, "\",\n    \"purpose\": \"vote\",\n    \"milestone\": \"metamorphosis\",\n    \"metadata\": { ... },\n    \"mintedAt\": \"").concat(new Date().toISOString(), "\"\n  }\n]"));
                console.log("\n\uD83C\uDFAE STEP 5: Token Purpose Types");
                console.log("\u2022 BADGE tokens: Recognition and achievement tracking");
                console.log("  - Active development participation");
                console.log("  - Contributor recognition");
                console.log("  - Milestone completion");
                console.log("\n\u2022 MINT tokens: Value-bearing tokens for trading/rewards");
                console.log("  - Emergence milestone rewards");
                console.log("  - Completion achievement tokens");
                console.log("  - High-value contributor rewards");
                console.log("\n\u2022 VOTE tokens: Governance and decision-making rights");
                console.log("  - Metamorphosis stage voting");
                console.log("  - Community governance participation");
                console.log("  - Project direction influence");
                console.log("\n\uD83D\uDCE1 STEP 6: API Endpoints");
                console.log("\u2713 POST /api/tokens/mint - Manual token minting (admin only)");
                console.log("\u2713 GET /api/tokens - Get tokens by wallet/dream/purpose");
                console.log("\u2713 GET /api/tokens/holder/:wallet - Get all tokens for wallet");
                console.log("\n\uD83D\uDD04 STEP 7: Automatic Integration");
                console.log("Token minting is automatically triggered when:");
                console.log("\u2022 Cocoon stage changes to milestone stages");
                console.log("\u2022 checkAndMintMilestoneTokens() called in updateCocoon()");
                console.log("\u2022 Notifications sent to token recipients");
                console.log("\u2022 Full audit trail maintained in database");
                console.log("\n\uD83C\uDF89 STEP 8: Example Token Holdings");
                console.log("After a full cocoon lifecycle, a creator might have:");
                console.log("\u2022 1x Active Badge Token");
                console.log("\u2022 1x Metamorphosis Vote Token");
                console.log("\u2022 1x Emergence Mint Token");
                console.log("\u2022 1x Completion Mint Token");
                console.log("\nContributors might have:");
                console.log("\u2022 1x Completion Contributor Badge Token");
                console.log("\n\u2728 DreamCoreToken system is fully implemented!");
                console.log("\nKey Features:");
                console.log("- Automatic milestone-based minting");
                console.log("- Multiple token purposes (badge, mint, vote)");
                console.log("- Complete metadata tracking");
                console.log("- Notification integration");
                console.log("- API endpoints for token management");
                console.log("- Contributor reward system");
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
                case 0: return [4 /*yield*/, demonstrateTokenMinting()];
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

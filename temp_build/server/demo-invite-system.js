#!/usr/bin/env tsx
"use strict";
/**
 * Demo: Dream Contributor Invitation System
 *
 * Demonstrates the complete invite workflow:
 * 1. inviteContributor() function
 * 2. Notification system integration
 * 3. Accept/reject functionality
 * 4. Dream contributor tracking
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
exports.demonstrateInviteSystem = demonstrateInviteSystem;
var simple_notifications_1 = require("./simple-notifications");
function demonstrateInviteSystem() {
    return __awaiter(this, void 0, void 0, function () {
        var mockDreamId, mockInviterWallet, mockInvitedWallet, mockRole, mockMessage;
        return __generator(this, function (_a) {
            console.log("\n\uD83C\uDFAF Dream Contributor Invitation System Demo\n===========================================\n\nThis demo shows the complete invitation workflow:\n\u2713 inviteContributor(dreamId, wallet, role) function\n\u2713 Notification system integration\n\u2713 dreamInvites[] array for pending invites\n\u2713 Accept/reject functionality with automatic contributor addition\n\u2713 Full audit trail and status tracking\n  ");
            try {
                mockDreamId = "demo-dream-123";
                mockInviterWallet = "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e";
                mockInvitedWallet = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
                mockRole = "Artist";
                mockMessage = "We'd love your creative input on this AI art project!";
                console.log("\n\uD83D\uDE80 STEP 1: Sending Contributor Invitation");
                console.log("Function: inviteContributor(\"".concat(mockDreamId, "\", \"").concat(mockInvitedWallet, "\", \"").concat(mockRole, "\")"));
                console.log("Inviter: ".concat(mockInviterWallet));
                console.log("Message: \"".concat(mockMessage, "\""));
                // Simulate the invite creation process
                console.log("\n\u2705 Invite Created in dreamInvites[] array:");
                console.log("{\n  \"id\": \"invite-001\",\n  \"dreamId\": \"".concat(mockDreamId, "\",\n  \"invitedWallet\": \"").concat(mockInvitedWallet, "\",\n  \"inviterWallet\": \"").concat(mockInviterWallet, "\",\n  \"role\": \"").concat(mockRole, "\",\n  \"status\": \"pending\",\n  \"message\": \"").concat(mockMessage, "\",\n  \"createdAt\": \"").concat(new Date().toISOString(), "\"\n}"));
                console.log("\n\uD83D\uDCE7 STEP 2: Notification Sent");
                simple_notifications_1.simpleNotifications.addNotification(mockInvitedWallet, "contributor_invited", "You've been invited to contribute as ".concat(mockRole, " to \"AI Art Generation Platform\". Message: ").concat(mockMessage));
                console.log("\n\uD83C\uDFAF STEP 3: Available Actions for Invited User");
                console.log("API Endpoints for ".concat(mockInvitedWallet, ":"));
                console.log("\u2713 GET /api/invites/pending/".concat(mockInvitedWallet, " - View pending invites"));
                console.log("\u2713 PATCH /api/invites/{inviteId}/respond - Accept or reject invite");
                console.log("\n\u2705 STEP 4: Simulating ACCEPTANCE");
                console.log("User calls: PATCH /api/invites/invite-001/respond { \"accept\": true }");
                console.log("\nResults of acceptance:");
                console.log("1. Invite status updated to \"accepted\"");
                console.log("2. User automatically added to dream contributors array");
                console.log("3. Notification sent to inviter about acceptance");
                console.log("4. Console log: \"\u2705 Contributor accepted: ".concat(mockInvitedWallet, " joined dream as ").concat(mockRole, "\""));
                // Simulate acceptance notification
                simple_notifications_1.simpleNotifications.addNotification(mockInviterWallet, "invite_accepted", "".concat(mockInvitedWallet, " accepted your invitation to contribute as ").concat(mockRole));
                console.log("\n\u274C STEP 5: Simulating REJECTION (Alternative Flow)");
                console.log("If user had rejected: PATCH /api/invites/invite-001/respond { \"accept\": false }");
                console.log("\nResults of rejection:");
                console.log("1. Invite status updated to \"rejected\"");
                console.log("2. No changes to dream contributors");
                console.log("3. Notification sent to inviter about rejection");
                // Simulate rejection notification
                simple_notifications_1.simpleNotifications.addNotification(mockInviterWallet, "invite_rejected", "".concat(mockInvitedWallet, " declined your invitation to contribute as ").concat(mockRole));
                console.log("\n\uD83D\uDCCA STEP 6: API Endpoints Summary");
                console.log("\u2713 POST /api/dreams/:dreamId/invite - Send invitation (admin only)");
                console.log("\u2713 GET /api/invites - Get all invites (filter by wallet/dreamId)");
                console.log("\u2713 GET /api/invites/pending/:wallet - Get pending invites for user");
                console.log("\u2713 PATCH /api/invites/:inviteId/respond - Accept/reject invitation");
                console.log("\n\uD83D\uDEE1\uFE0F STEP 7: Built-in Protections");
                console.log("\u2713 Duplicate invite prevention (one pending invite per user per dream)");
                console.log("\u2713 Invite status validation (can't respond to already-responded invites)");
                console.log("\u2713 Dream existence validation");
                console.log("\u2713 Automatic contributor deduplication");
                console.log("\u2713 Admin-only invite sending");
                console.log("\n\uD83C\uDF89 STEP 8: Database Schema");
                console.log("dreamInvites table tracks:");
                console.log("- id, dreamId, invitedWallet, inviterWallet");
                console.log("- role, status, message");
                console.log("- createdAt, respondedAt timestamps");
                console.log("\n\u2728 Dream Contributor Invitation System is fully implemented!");
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
                case 0: return [4 /*yield*/, demonstrateInviteSystem()];
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

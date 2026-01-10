"use strict";
/**
 * Inbox² API Routes
 * AI-powered communication copilot endpoints
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
exports.createInboxSquaredRouter = createInboxSquaredRouter;
var express_1 = require("express");
// Dynamic import to avoid ESM resolution issues
var inboxSquared = null;
var DraftGenerationOptions = null;
function getInboxSquared() {
    return __awaiter(this, void 0, void 0, function () {
        var module_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!inboxSquared) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../../packages/inbox-squared-core/index.ts'); })];
                case 1:
                    module_1 = _a.sent();
                    inboxSquared = new module_1.InboxSquared();
                    DraftGenerationOptions = module_1.DraftGenerationOptions;
                    _a.label = 2;
                case 2: return [2 /*return*/, { inboxSquared: inboxSquared, DraftGenerationOptions: DraftGenerationOptions }];
            }
        });
    });
}
var googleapis_1 = require("googleapis");
var router = (0, express_1.Router)();
/**
 * Get Gmail OAuth2 client
 */
function getGmailOAuth2Client() {
    var clientId = process.env.GOOGLE_CLIENT_ID;
    var clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    var refreshToken = process.env.GMAIL_REFRESH_TOKEN;
    if (!clientId || !clientSecret || !refreshToken) {
        return null;
    }
    var oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    return oauth2Client;
}
/**
 * Initialize Inbox² with Gmail API
 */
function initializeInboxSquared() {
    return __awaiter(this, void 0, void 0, function () {
        var oauth2Client, inbox;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    oauth2Client = getGmailOAuth2Client();
                    if (!oauth2Client) return [3 /*break*/, 2];
                    return [4 /*yield*/, getInboxSquared()];
                case 1:
                    inbox = (_a.sent()).inboxSquared;
                    inbox.initializeGmail(oauth2Client);
                    return [2 /*return*/, true];
                case 2: return [2 /*return*/, false];
            }
        });
    });
}
// Initialize on route load (async initialization)
var gmailInitialized = false;
initializeInboxSquared().then(function (initialized) {
    gmailInitialized = initialized;
}).catch(function () {
    gmailInitialized = false;
});
/**
 * POST /api/inbox-squared/generate-draft
 * Generate intelligent email draft using all Inbox² layers
 */
router.post('/generate-draft', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, recipientEmail, recipientName, recipientCompany, options, draftOptions, inbox, draft, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, recipientEmail = _a.recipientEmail, recipientName = _a.recipientName, recipientCompany = _a.recipientCompany, options = _a.options;
                if (!recipientEmail) {
                    return [2 /*return*/, res.status(400).json({ error: 'recipientEmail is required' })];
                }
                draftOptions = {
                    fromName: (options === null || options === void 0 ? void 0 : options.fromName) || 'DreamNet Team',
                    fromEmail: (options === null || options === void 0 ? void 0 : options.fromEmail) || 'dreamnetgmo@gmail.com',
                    tone: (options === null || options === void 0 ? void 0 : options.tone) || 'consultative',
                    includeOptOut: (options === null || options === void 0 ? void 0 : options.includeOptOut) !== false,
                    generateVariants: (options === null || options === void 0 ? void 0 : options.generateVariants) || false,
                    generateContentTwins: (options === null || options === void 0 ? void 0 : options.generateContentTwins) || false,
                };
                return [4 /*yield*/, getInboxSquared()];
            case 1:
                inbox = (_b.sent()).inboxSquared;
                return [4 /*yield*/, inbox.generateDraft(recipientEmail, recipientName, recipientCompany, draftOptions)];
            case 2:
                draft = _b.sent();
                res.json({ ok: true, draft: draft });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error('[Inbox²] Error generating draft:', error_1);
                res.status(500).json({
                    error: 'Failed to generate draft',
                    details: error_1 instanceof Error ? error_1.message : 'Unknown error',
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/inbox-squared/create-gmail-draft
 * Create draft in Gmail using Gmail API
 */
router.post('/create-gmail-draft', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var draft, inbox, gmailDraftId, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!gmailInitialized) {
                    return [2 /*return*/, res.status(503).json({
                            error: 'Gmail API not configured',
                            message: 'Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN',
                        })];
                }
                draft = req.body.draft;
                if (!draft || !draft.toEmail || !draft.subject || !draft.body) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid draft object' })];
                }
                return [4 /*yield*/, getInboxSquared()];
            case 1:
                inbox = (_a.sent()).inboxSquared;
                return [4 /*yield*/, inbox.createGmailDraft(draft)];
            case 2:
                gmailDraftId = _a.sent();
                res.json({
                    ok: true,
                    gmailDraftId: gmailDraftId,
                    message: 'Draft created in Gmail',
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('[Inbox²] Error creating Gmail draft:', error_2);
                res.status(500).json({
                    error: 'Failed to create Gmail draft',
                    details: error_2 instanceof Error ? error_2.message : 'Unknown error',
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/inbox-squared/track-engagement
 * Track email engagement via Gmail API
 */
router.post('/track-engagement', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var messageId, inbox, metrics, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!gmailInitialized) {
                    return [2 /*return*/, res.status(503).json({
                            error: 'Gmail API not configured',
                        })];
                }
                messageId = req.body.messageId;
                if (!messageId) {
                    return [2 /*return*/, res.status(400).json({ error: 'messageId is required' })];
                }
                return [4 /*yield*/, getInboxSquared()];
            case 1:
                inbox = (_a.sent()).inboxSquared;
                return [4 /*yield*/, inbox.trackEngagement(messageId)];
            case 2:
                metrics = _a.sent();
                res.json({ ok: true, metrics: metrics });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('[Inbox²] Error tracking engagement:', error_3);
                res.status(500).json({
                    error: 'Failed to track engagement',
                    details: error_3 instanceof Error ? error_3.message : 'Unknown error',
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/inbox-squared/learning-patterns
 * Get learning patterns from engagement data
 */
router.get('/learning-patterns', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var inbox, patterns, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getInboxSquared()];
            case 1:
                inbox = (_a.sent()).inboxSquared;
                patterns = inbox.getLearningLoop().getAllPatterns();
                res.json({ ok: true, patterns: patterns });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('[Inbox²] Error getting patterns:', error_4);
                res.status(500).json({
                    error: 'Failed to get learning patterns',
                    details: error_4 instanceof Error ? error_4.message : 'Unknown error',
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/inbox-squared/research/:email
 * Get research for a recipient
 */
router.get('/research/:email', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, _a, name_1, company, inbox, research, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                email = req.params.email;
                _a = req.query, name_1 = _a.name, company = _a.company;
                return [4 /*yield*/, getInboxSquared()];
            case 1:
                inbox = (_b.sent()).inboxSquared;
                return [4 /*yield*/, inbox
                        .getResearchEngine()
                        .researchRecipient(email, name_1, company)];
            case 2:
                research = _b.sent();
                res.json({ ok: true, research: research });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                console.error('[Inbox²] Error getting research:', error_5);
                res.status(500).json({
                    error: 'Failed to get research',
                    details: error_5 instanceof Error ? error_5.message : 'Unknown error',
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/inbox-squared/status
 * Get Inbox² system status
 */
router.get('/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _b = (_a = res).json;
                _c = {
                    ok: true
                };
                _d = {
                    gmailApiConfigured: gmailInitialized,
                    researchEngineEnabled: true,
                    relevanceEngineEnabled: true,
                    geoAwarenessEnabled: true,
                    learningLoopEnabled: true
                };
                return [4 /*yield*/, getInboxSquared()];
            case 1:
                _b.apply(_a, [(_c.status = (_d.patternsCount = (_e.sent()).inboxSquared.getLearningLoop().getAllPatterns().length,
                        _d),
                        _c)]);
                return [2 /*return*/];
        }
    });
}); });
function createInboxSquaredRouter() {
    return router;
}

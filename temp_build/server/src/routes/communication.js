"use strict";
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
exports.registerCommunicationRoutes = registerCommunicationRoutes;
var express_1 = require("express");
// Get feature flag mode from database or environment
function getCommMode(service) {
    return __awaiter(this, void 0, void 0, function () {
        var envMode;
        return __generator(this, function (_a) {
            try {
                envMode = process.env["".concat(service.toUpperCase(), "_MODE")];
                if (envMode && ['off', 'sim', 'draft', 'live'].includes(envMode)) {
                    return [2 /*return*/, envMode];
                }
                // TODO: Add feature_flags table query when schema is available
                // const result = await db.select()
                //   .from(feature_flags)
                //   .where(eq(feature_flags.flag_key, `${service}.mode`))
                //   .limit(1);
                // 
                // if (result.length > 0) {
                //   const mode = result[0].value?.mode;
                //   if (mode && ['off', 'sim', 'draft', 'live'].includes(mode)) {
                //     return mode as 'off' | 'sim' | 'draft' | 'live';
                //   }
                // }
                // Default based on key presence
                if (service === 'twilio') {
                    return [2 /*return*/, process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN ? 'draft' : 'off'];
                }
                else {
                    return [2 /*return*/, process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? 'draft' : 'off'];
                }
            }
            catch (error) {
                console.error("[".concat(service.toUpperCase(), "] Error getting mode:"), error);
                return [2 /*return*/, 'off'];
            }
            return [2 /*return*/];
        });
    });
}
// Store communication artifact
function storeCommArtifact(kind, ref, data) {
    return __awaiter(this, void 0, void 0, function () {
        var artifact;
        return __generator(this, function (_a) {
            try {
                artifact = {
                    id: "artifact_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)),
                    created_at: new Date().toISOString()
                };
                console.log("[COMM] Artifact stored: ".concat(kind, " | ").concat(ref, " | ").concat(JSON.stringify(data)));
                return [2 /*return*/, artifact];
            }
            catch (error) {
                console.error('[COMM] Error storing artifact:', error);
                throw error;
            }
            return [2 /*return*/];
        });
    });
}
// Basic auth middleware (placeholder for Replit Auth)
var requireReplitAuth = function (req, res, next) {
    // TODO: Replace with actual Replit Auth check
    var authToken = req.headers['authorization'] || req.headers['x-auth-token'];
    if (!authToken && process.env.NODE_ENV === 'production') {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};
function registerCommunicationRoutes(app) {
    // ==================== SMS COMMUNICATION ====================
    var _this = this;
    app.post('/api/comm/sms', requireReplitAuth, express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, to, body, mode, artifact, sid, token, from, axios, response, twilioError_1, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 10, , 11]);
                    _a = req.body || {}, to = _a.to, body = _a.body;
                    if (!to || !body) {
                        return [2 /*return*/, res.status(400).json({ error: "to_and_body_required" })];
                    }
                    return [4 /*yield*/, getCommMode('twilio')];
                case 1:
                    mode = _b.sent();
                    if (!(mode === "draft" || mode === "sim")) return [3 /*break*/, 3];
                    return [4 /*yield*/, storeCommArtifact('twilio.outbound.draft', to, { to: to, body: body })];
                case 2:
                    artifact = _b.sent();
                    return [2 /*return*/, res.json({
                            mode: mode,
                            draft_artifact: artifact,
                            message: "SMS stored as ".concat(mode, " artifact - no actual send")
                        })];
                case 3:
                    if (!(mode === "live")) return [3 /*break*/, 9];
                    sid = process.env.TWILIO_ACCOUNT_SID;
                    token = process.env.TWILIO_AUTH_TOKEN;
                    from = process.env.TWILIO_PHONE_NUMBER;
                    if (!sid || !token || !from) {
                        return [2 /*return*/, res.status(503).json({
                                error: "twilio_credentials_missing",
                                missing: [!sid ? 'TWILIO_ACCOUNT_SID' : null, !token ? 'TWILIO_AUTH_TOKEN' : null, !from ? 'TWILIO_PHONE_NUMBER' : null].filter(Boolean)
                            })];
                    }
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 8, , 9]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('axios'); })];
                case 5:
                    axios = _b.sent();
                    return [4 /*yield*/, axios.default.post("https://api.twilio.com/2010-04-01/Accounts/".concat(sid, "/Messages.json"), new URLSearchParams({ To: to, From: from, Body: body }).toString(), {
                            auth: { username: sid, password: token },
                            headers: { "Content-Type": "application/x-www-form-urlencoded" }
                        })];
                case 6:
                    response = _b.sent();
                    return [4 /*yield*/, storeCommArtifact('twilio.outbound', to, response.data)];
                case 7:
                    _b.sent();
                    return [2 /*return*/, res.json({
                            mode: mode,
                            sid: response.data.sid,
                            status: response.data.status,
                            message: "SMS sent successfully"
                        })];
                case 8:
                    twilioError_1 = _b.sent();
                    console.error('[COMM] Twilio API error:', twilioError_1);
                    return [2 /*return*/, res.status(500).json({
                            error: "twilio_api_failed",
                            details: twilioError_1 instanceof Error ? twilioError_1.message : 'Unknown error'
                        })];
                case 9:
                    res.status(503).json({ error: "twilio_off", mode: mode });
                    return [3 /*break*/, 11];
                case 10:
                    error_1 = _b.sent();
                    console.error('[COMM] SMS error:', error_1);
                    res.status(500).json({
                        error: 'sms_failed',
                        details: error_1 instanceof Error ? error_1.message : 'Unknown error'
                    });
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); });
    // ==================== EMAIL COMMUNICATION ====================
    app.post('/api/comm/email', requireReplitAuth, express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, to, subject, body, from, mode, artifact, clientId, clientSecret, refreshToken, google, oauth2Client, gmail, emailLines, email, encodedEmail, response, gmailError_1, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 10, , 11]);
                    _a = req.body || {}, to = _a.to, subject = _a.subject, body = _a.body, from = _a.from;
                    if (!to || !subject || !body) {
                        return [2 /*return*/, res.status(400).json({
                                error: "to_subject_body_required",
                                required: ['to', 'subject', 'body']
                            })];
                    }
                    return [4 /*yield*/, getCommMode('gmail')];
                case 1:
                    mode = _b.sent();
                    if (!(mode === "draft" || mode === "sim")) return [3 /*break*/, 3];
                    return [4 /*yield*/, storeCommArtifact('gmail.send.draft', to, {
                            to: to,
                            subject: subject,
                            body: body,
                            from: from || 'noreply@dreamnet.ink'
                        })];
                case 2:
                    artifact = _b.sent();
                    return [2 /*return*/, res.json({
                            mode: mode,
                            draft_artifact: artifact,
                            message: "Email stored as ".concat(mode, " artifact - no actual send")
                        })];
                case 3:
                    if (!(mode === "live")) return [3 /*break*/, 9];
                    clientId = process.env.GOOGLE_CLIENT_ID;
                    clientSecret = process.env.GOOGLE_CLIENT_SECRET;
                    refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
                    if (!clientId || !clientSecret || !refreshToken) {
                        return [2 /*return*/, res.status(503).json({
                                error: "gmail_credentials_missing",
                                missing: [
                                    !clientId ? 'GOOGLE_CLIENT_ID' : null,
                                    !clientSecret ? 'GOOGLE_CLIENT_SECRET' : null,
                                    !refreshToken ? 'GOOGLE_REFRESH_TOKEN' : null
                                ].filter(Boolean)
                            })];
                    }
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 8, , 9]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('googleapis'); })];
                case 5:
                    google = (_b.sent()).google;
                    oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
                    oauth2Client.setCredentials({ refresh_token: refreshToken });
                    gmail = google.gmail({ version: 'v1', auth: oauth2Client });
                    emailLines = [
                        "To: ".concat(to),
                        "Subject: ".concat(subject),
                        "From: ".concat(from || 'noreply@dreamnet.ink'),
                        '',
                        body
                    ];
                    email = emailLines.join('\r\n');
                    encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
                    return [4 /*yield*/, gmail.users.messages.send({
                            userId: 'me',
                            requestBody: {
                                raw: encodedEmail
                            }
                        })];
                case 6:
                    response = _b.sent();
                    return [4 /*yield*/, storeCommArtifact('gmail.send', to, {
                            messageId: response.data.id,
                            to: to,
                            subject: subject,
                            from: from || 'noreply@dreamnet.ink',
                            threadId: response.data.threadId
                        })];
                case 7:
                    _b.sent();
                    return [2 /*return*/, res.json({
                            mode: mode,
                            messageId: response.data.id,
                            threadId: response.data.threadId,
                            message: "Email sent successfully"
                        })];
                case 8:
                    gmailError_1 = _b.sent();
                    console.error('[COMM] Gmail API error:', gmailError_1);
                    return [2 /*return*/, res.status(500).json({
                            error: "gmail_api_failed",
                            details: gmailError_1 instanceof Error ? gmailError_1.message : 'Unknown error'
                        })];
                case 9:
                    res.status(503).json({ error: "gmail_off", mode: mode });
                    return [3 /*break*/, 11];
                case 10:
                    error_2 = _b.sent();
                    console.error('[COMM] Email error:', error_2);
                    res.status(500).json({
                        error: 'email_failed',
                        details: error_2 instanceof Error ? error_2.message : 'Unknown error'
                    });
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); });
    // ==================== COMMUNICATION STATUS ====================
    app.get('/api/comm/status', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var twilioMode, gmailMode, status_1, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getCommMode('twilio')];
                case 1:
                    twilioMode = _a.sent();
                    return [4 /*yield*/, getCommMode('gmail')];
                case 2:
                    gmailMode = _a.sent();
                    status_1 = {
                        sms: {
                            mode: twilioMode,
                            enabled: twilioMode !== 'off',
                            has_credentials: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
                            endpoints: {
                                send: '/api/comm/sms',
                                webhook: '/api/twilio/sms'
                            }
                        },
                        email: {
                            mode: gmailMode,
                            enabled: gmailMode !== 'off',
                            has_credentials: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
                            endpoints: {
                                send: '/api/comm/email'
                            }
                        },
                        timestamp: new Date().toISOString()
                    };
                    res.json(status_1);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('[COMM] Status error:', error_3);
                    res.status(500).json({
                        error: 'Failed to get communication status',
                        details: error_3 instanceof Error ? error_3.message : 'Unknown error'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // ==================== COMMUNICATION TEST ====================
    app.get('/api/comm/test', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var twilioMode, gmailMode, tests, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getCommMode('twilio')];
                case 1:
                    twilioMode = _a.sent();
                    return [4 /*yield*/, getCommMode('gmail')];
                case 2:
                    gmailMode = _a.sent();
                    tests = {
                        sms: {
                            mode: twilioMode,
                            credentials_present: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
                            test_endpoint: '/api/comm/sms',
                            test_payload: { to: '+1234567890', body: 'Test message' }
                        },
                        email: {
                            mode: gmailMode,
                            credentials_present: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
                            test_endpoint: '/api/comm/email',
                            test_payload: { to: 'test@example.com', subject: 'Test', body: 'Test email' }
                        },
                        overall_status: {
                            sms_ready: twilioMode !== 'off',
                            email_ready: gmailMode !== 'off',
                            any_live: twilioMode === 'live' || gmailMode === 'live'
                        }
                    };
                    res.json(tests);
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error('[COMM] Test error:', error_4);
                    res.status(500).json({
                        error: 'Communication test failed',
                        details: error_4 instanceof Error ? error_4.message : 'Unknown error'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    console.log('📧 [COMMUNICATION] SMS and Email routes registered with Reality Contract compliance');
}

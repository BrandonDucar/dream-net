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
exports.registerTwilioRoutes = registerTwilioRoutes;
var crypto_1 = require("crypto");
var express_1 = require("express");
// Twilio webhook signature verification
function verifyTwilioSignature(req) {
    var twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    if (!twilioAuthToken)
        return false;
    var url = process.env.PUBLIC_URL + req.originalUrl;
    var signature = req.headers["x-twilio-signature"];
    var params = req.body || {};
    // Build the data string as Twilio does
    var data = Object.keys(params)
        .sort()
        .reduce(function (acc, key) { return acc + key + params[key]; }, url);
    var expectedSignature = crypto_1.default
        .createHmac("sha1", twilioAuthToken)
        .update(Buffer.from(data, "utf8"))
        .digest("base64");
    return signature === expectedSignature;
}
// Get feature flag mode from database or environment
function getTwilioMode() {
    return __awaiter(this, void 0, void 0, function () {
        var envMode;
        return __generator(this, function (_a) {
            try {
                envMode = process.env.TWILIO_MODE;
                if (envMode && ['off', 'sim', 'draft', 'live'].includes(envMode)) {
                    return [2 /*return*/, envMode];
                }
                // TODO: Add feature_flags table query when schema is available
                // const result = await db.select()
                //   .from(feature_flags)
                //   .where(eq(feature_flags.flag_key, 'twilio.mode'))
                //   .limit(1);
                // 
                // if (result.length > 0) {
                //   const mode = result[0].value?.mode;
                //   if (mode && ['off', 'sim', 'draft', 'live'].includes(mode)) {
                //     return mode as 'off' | 'sim' | 'draft' | 'live';
                //   }
                // }
                // Default based on key presence
                return [2 /*return*/, process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN ? 'draft' : 'off'];
            }
            catch (error) {
                console.error('[Twilio] Error getting mode:', error);
                return [2 /*return*/, 'off'];
            }
            return [2 /*return*/];
        });
    });
}
// Store SMS artifact
function storeSMSArtifact(kind, ref, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // TODO: Add to artifacts table when schema is available
                // await db.insert(artifacts).values({
                //   kind,
                //   ref,
                //   data: JSON.stringify(data),
                //   created_at: new Date()
                // });
                // For now, log to console with structured format
                console.log("[Twilio] SMS Artifact: ".concat(kind, " | ").concat(ref, " | ").concat(JSON.stringify(data)));
            }
            catch (error) {
                console.error('[Twilio] Error storing SMS artifact:', error);
            }
            return [2 /*return*/];
        });
    });
}
function registerTwilioRoutes(app) {
    var _this = this;
    // Twilio webhook endpoint for inbound SMS
    app.post('/api/twilio/sms', express_1.default.urlencoded({ extended: false }), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var shouldVerify, mode, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    shouldVerify = process.env.TWILIO_VERIFY === "true";
                    if (shouldVerify && !verifyTwilioSignature(req)) {
                        console.warn('[Twilio] Invalid webhook signature');
                        return [2 /*return*/, res.status(403).json({ error: 'Invalid signature' })];
                    }
                    // Store inbound SMS
                    return [4 /*yield*/, storeSMSArtifact('twilio.inbound', req.body.From, req.body)];
                case 1:
                    // Store inbound SMS
                    _a.sent();
                    return [4 /*yield*/, getTwilioMode()];
                case 2:
                    mode = _a.sent();
                    response = '';
                    switch (mode) {
                        case 'live':
                            response = "<Response><Message>Thanks, we got your message.</Message></Response>";
                            break;
                        case 'draft':
                            response = "<Response><Message>Test mode: Message received</Message></Response>";
                            break;
                        case 'sim':
                            response = "<Response><Message>Simulation: Auto-reply active</Message></Response>";
                            break;
                        case 'off':
                        default:
                            response = "<Response></Response>";
                            break;
                    }
                    console.log("[Twilio] SMS received from ".concat(req.body.From, " in ").concat(mode, " mode"));
                    res.type('text/xml').send(response);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('[Twilio] SMS webhook error:', error_1);
                    res.status(500).type('text/xml').send('<Response></Response>');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Twilio test endpoint for Reality Contract
    app.get('/api/twilio/test', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var accountSid, authToken, phoneNumber, mode, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    accountSid = process.env.TWILIO_ACCOUNT_SID;
                    authToken = process.env.TWILIO_AUTH_TOKEN;
                    phoneNumber = process.env.TWILIO_PHONE_NUMBER;
                    if (!accountSid || !authToken) {
                        return [2 /*return*/, res.status(503).json({
                                enabled: false,
                                error: 'Twilio credentials not configured',
                                missing: [
                                    !accountSid ? 'TWILIO_ACCOUNT_SID' : null,
                                    !authToken ? 'TWILIO_AUTH_TOKEN' : null
                                ].filter(Boolean)
                            })];
                    }
                    return [4 /*yield*/, getTwilioMode()];
                case 1:
                    mode = _a.sent();
                    res.json({
                        enabled: true,
                        status: mode,
                        provider: 'Twilio',
                        account_sid: accountSid.substring(0, 8) + '...',
                        phone_number: phoneNumber || 'Not configured',
                        webhook_url: "".concat(req.protocol, "://").concat(req.get('host'), "/api/twilio/sms"),
                        verification_enabled: process.env.TWILIO_VERIFY === 'true',
                        last_test: new Date().toISOString()
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('[Twilio] Test endpoint error:', error_2);
                    res.status(500).json({
                        enabled: false,
                        error: 'Twilio test failed',
                        details: error_2 instanceof Error ? error_2.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Send SMS endpoint (for outbound messages)
    app.post('/api/twilio/send', express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, to, message, accountSid, authToken, fromNumber, mode, twilio, client, result, twilioError_1, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, , 10]);
                    _a = req.body, to = _a.to, message = _a.message;
                    if (!to || !message) {
                        return [2 /*return*/, res.status(400).json({
                                error: 'Missing required fields: to, message'
                            })];
                    }
                    accountSid = process.env.TWILIO_ACCOUNT_SID;
                    authToken = process.env.TWILIO_AUTH_TOKEN;
                    fromNumber = process.env.TWILIO_PHONE_NUMBER;
                    if (!accountSid || !authToken || !fromNumber) {
                        return [2 /*return*/, res.status(503).json({
                                error: 'Twilio not configured',
                                missing: [
                                    !accountSid ? 'TWILIO_ACCOUNT_SID' : null,
                                    !authToken ? 'TWILIO_AUTH_TOKEN' : null,
                                    !fromNumber ? 'TWILIO_PHONE_NUMBER' : null
                                ].filter(Boolean)
                            })];
                    }
                    return [4 /*yield*/, getTwilioMode()];
                case 1:
                    mode = _b.sent();
                    if (mode === 'off') {
                        return [2 /*return*/, res.status(503).json({
                                error: 'Twilio SMS is disabled',
                                mode: mode
                            })];
                    }
                    if (!(mode === 'sim')) return [3 /*break*/, 3];
                    // Simulate sending without actual API call
                    return [4 /*yield*/, storeSMSArtifact('twilio.outbound.sim', to, { to: to, message: message, mode: 'simulated' })];
                case 2:
                    // Simulate sending without actual API call
                    _b.sent();
                    return [2 /*return*/, res.json({
                            success: true,
                            mode: 'simulated',
                            message_sid: "SM_sim_".concat(Date.now()),
                            to: to,
                            from: fromNumber,
                            body: message
                        })];
                case 3:
                    _b.trys.push([3, 7, , 8]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('twilio'); })];
                case 4:
                    twilio = _b.sent();
                    client = twilio.default(accountSid, authToken);
                    return [4 /*yield*/, client.messages.create({
                            body: message,
                            from: fromNumber,
                            to: to
                        })];
                case 5:
                    result = _b.sent();
                    return [4 /*yield*/, storeSMSArtifact('twilio.outbound', to, {
                            message_sid: result.sid,
                            to: to,
                            from: fromNumber,
                            body: message,
                            status: result.status
                        })];
                case 6:
                    _b.sent();
                    res.json({
                        success: true,
                        mode: mode,
                        message_sid: result.sid,
                        to: to,
                        from: fromNumber,
                        body: message,
                        status: result.status
                    });
                    return [3 /*break*/, 8];
                case 7:
                    twilioError_1 = _b.sent();
                    console.error('[Twilio] Send error:', twilioError_1);
                    res.status(500).json({
                        error: 'Failed to send SMS',
                        details: twilioError_1 instanceof Error ? twilioError_1.message : 'Twilio API error'
                    });
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_3 = _b.sent();
                    console.error('[Twilio] Send endpoint error:', error_3);
                    res.status(500).json({
                        error: 'SMS send failed',
                        details: error_3 instanceof Error ? error_3.message : 'Unknown error'
                    });
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); });
    // Twilio status endpoint
    app.get('/api/twilio/status', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var mode, hasCredentials, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getTwilioMode()];
                case 1:
                    mode = _a.sent();
                    hasCredentials = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
                    res.json({
                        enabled: mode !== 'off',
                        mode: mode,
                        has_credentials: hasCredentials,
                        webhook_verification: process.env.TWILIO_VERIFY === 'true',
                        endpoints: {
                            inbound: '/api/twilio/sms',
                            outbound: '/api/twilio/send',
                            test: '/api/twilio/test'
                        },
                        timestamp: new Date().toISOString()
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error('[Twilio] Status error:', error_4);
                    res.status(500).json({
                        error: 'Failed to get Twilio status',
                        details: error_4 instanceof Error ? error_4.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    console.log('📱 [TWILIO] SMS integration routes registered with Reality Contract compliance');
}

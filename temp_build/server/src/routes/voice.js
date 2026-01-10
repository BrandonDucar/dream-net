"use strict";
/**
 * DreamNet Voice API Routes
 * Phase 2 - One Mouth: Twilio SMS integration
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
var express_1 = require("express");
var router = (0, express_1.Router)();
// DreamNet Voice Twilio is optional
var DreamNetVoiceTwilio = null;
try {
    var voiceModule = require("../../packages/dreamnet-voice-twilio");
    DreamNetVoiceTwilio = voiceModule.DreamNetVoiceTwilio;
}
catch (_a) {
    console.warn("[Voice Router] @dreamnet/dreamnet-voice-twilio not available");
}
// Operational bridge is optional
var bridgeToSpiderWeb = null;
try {
    var bridgeModule = require("../../packages/dreamnet-operational-bridge");
    bridgeToSpiderWeb = bridgeModule.bridgeToSpiderWeb;
}
catch (_b) {
    console.warn("[Voice Router] @dreamnet/dreamnet-operational-bridge not available");
}
// GET /api/voice/status - Get Voice status
router.get("/status", function (req, res) {
    if (!DreamNetVoiceTwilio) {
        return res.status(503).json({ error: "DreamNet Voice Twilio not available" });
    }
    try {
        var status_1 = DreamNetVoiceTwilio.status();
        var stats = DreamNetVoiceTwilio.getStats();
        res.json({
            success: true,
            status: status_1,
            stats: stats,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/voice/test - Send test SMS
router.post("/test", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var message, testMessage, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!DreamNetVoiceTwilio) {
                    return [2 /*return*/, res.status(503).json({ error: "DreamNet Voice Twilio not available" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                message = req.body.message;
                testMessage = message || "🧪 Test message from DreamNet Voice";
                return [4 /*yield*/, DreamNetVoiceTwilio.send({
                        body: testMessage,
                    })];
            case 2:
                result = _a.sent();
                if (result.success) {
                    res.json({
                        success: true,
                        message: "Test SMS sent",
                        sid: result.sid,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: result.error,
                    });
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.status(500).json({ error: error_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// POST /api/voice/send - Send custom SMS
router.post("/send", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, body, to, result, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!DreamNetVoiceTwilio) {
                    return [2 /*return*/, res.status(503).json({ error: "DreamNet Voice Twilio not available" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = req.body, body = _a.body, to = _a.to;
                if (!body) {
                    return [2 /*return*/, res.status(400).json({ error: "Message body required" })];
                }
                return [4 /*yield*/, DreamNetVoiceTwilio.send({
                        body: body,
                        to: to,
                    })];
            case 2:
                result = _b.sent();
                if (result.success) {
                    res.json({
                        success: true,
                        message: "SMS sent",
                        sid: result.sid,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: result.error,
                    });
                }
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                res.status(500).json({ error: error_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// POST /api/voice/trigger-event - Manually trigger an event to test routing
router.post("/trigger-event", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, severity, message, metadata, event_1;
    return __generator(this, function (_b) {
        try {
            _a = req.body, type = _a.type, severity = _a.severity, message = _a.message, metadata = _a.metadata;
            event_1 = {
                type: type || "test_event",
                severity: severity || "medium",
                message: message || "Test event from Voice API",
                metadata: metadata || {},
                timestamp: Date.now(),
            };
            // Bridge to Spider Web (which will route to Voice)
            bridgeToSpiderWeb(event_1);
            res.json({
                success: true,
                message: "Event triggered",
                event: event_1,
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;

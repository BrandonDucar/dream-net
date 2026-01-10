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
exports.smsRouter = void 0;
var express_1 = require("express");
var sms_1 = require("../../lib/sms");
var router = (0, express_1.Router)();
exports.smsRouter = router;
// SMS opt-in endpoint
router.post('/opt-in', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var phone, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                phone = req.body.phone;
                if (!phone) {
                    return [2 /*return*/, res.status(400).json({ error: 'Missing phone number' })];
                }
                // Store phone number in database or external service
                console.log("\uD83D\uDCF2 New SMS opt-in: ".concat(phone));
                // Send welcome SMS
                return [4 /*yield*/, (0, sms_1.sendDreamCallSMS)(phone, 'welcome', 'Welcome to Dream Network! You\'ll get notified when your dreams need attention.')];
            case 1:
                // Send welcome SMS
                _a.sent();
                res.status(200).json({ success: true });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('SMS opt-in error:', error_1);
                res.status(500).json({ error: 'Failed to process opt-in' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// SMS webhook endpoint for Twilio
router.post('/webhook', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var incoming, from;
    var _a;
    return __generator(this, function (_b) {
        try {
            incoming = (_a = req.body.Body) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
            from = req.body.From;
            if (incoming === 'yes') {
                console.log("\u2705 Dream agent triggered for ".concat(from));
                // Trigger agent, update DB, etc.
            }
            else if (incoming === 'later') {
                console.log("\u23F0 Reschedule request from ".concat(from));
                // Log for reminder system
            }
            else if (incoming === 'stop') {
                console.log("\u274C Unsubscribed: ".concat(from));
                // Remove from SMS list
            }
            else {
                console.log("\uD83E\uDD16 Unknown reply from ".concat(from, ": ").concat(incoming));
            }
            res.setHeader('Content-Type', 'text/xml');
            res.status(200).send('<Response></Response>');
        }
        catch (error) {
            console.error('SMS webhook error:', error);
            res.status(500).send('<Response></Response>');
        }
        return [2 /*return*/];
    });
}); });
// Test endpoint to send dream notification
router.post('/test-dream-call', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, phone, dreamId, message, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, phone = _a.phone, dreamId = _a.dreamId, message = _a.message;
                if (!phone || !dreamId || !message) {
                    return [2 /*return*/, res.status(400).json({ error: 'Missing required fields' })];
                }
                return [4 /*yield*/, (0, sms_1.sendDreamCallSMS)(phone, dreamId, message)];
            case 1:
                _b.sent();
                res.status(200).json({ success: true, message: 'Dream call SMS sent' });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Test dream call error:', error_2);
                res.status(500).json({ error: 'Failed to send dream call SMS' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });

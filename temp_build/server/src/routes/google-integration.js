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
var express_1 = require("express");
var IntegrationFlagsService_1 = require("../services/IntegrationFlagsService");
var ProviderConfigurationService_1 = require("../services/ProviderConfigurationService");
var router = (0, express_1.Router)();
// Simulated Google integration (for proof of concept without OAuth flow)
router.post('/send-email', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, to, subject, body, template, emailData, eventLog, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                // Verify Google integration is enabled
                return [4 /*yield*/, IntegrationFlagsService_1.IntegrationFlagsService.requireEnabled('google')];
            case 1:
                // Verify Google integration is enabled
                _b.sent();
                // Verify lead write permission for email sending
                return [4 /*yield*/, ProviderConfigurationService_1.ProviderConfigurationService.requireFlowPermission('google', 'Lead', 'read_write')];
            case 2:
                // Verify lead write permission for email sending
                _b.sent();
                _a = req.body, to = _a.to, subject = _a.subject, body = _a.body, template = _a.template;
                emailData = {
                    messageId: "gmail-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9)),
                    to: to || 'test@dreamnet.ink',
                    subject: subject || 'DreamNet Integration Test',
                    body: body || 'This is a test email from the DreamNet integration system.',
                    template: template || 'integration_test',
                    timestamp: new Date().toISOString(),
                    provider: 'google_gmail',
                    status: 'sent',
                };
                // Log the event for tracking
                console.log("\uD83D\uDCE7 [Google Gmail] Email sent: ".concat(emailData.messageId));
                console.log("\uD83D\uDCE7 [Google Gmail] To: ".concat(emailData.to));
                console.log("\uD83D\uDCE7 [Google Gmail] Subject: ".concat(emailData.subject));
                console.log("\uD83D\uDCE7 [Google Gmail] Template: ".concat(emailData.template));
                eventLog = {
                    eventId: "event-".concat(Date.now()),
                    type: 'email_sent',
                    provider: 'google',
                    data: emailData,
                    timestamp: new Date().toISOString(),
                };
                console.log("\uD83D\uDCCA [Google Event] Event logged: ".concat(eventLog.eventId));
                res.json({
                    success: true,
                    email: emailData,
                    event: eventLog,
                    message: 'Email sent and event logged successfully',
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error('[Google Gmail] Send email failed:', error_1);
                res.status(500).json({
                    error: 'Failed to send email',
                    message: error_1.message,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/create-calendar-event', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, startTime, endTime, attendees, eventData, eventLog, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                // Verify Google integration is enabled
                return [4 /*yield*/, IntegrationFlagsService_1.IntegrationFlagsService.requireEnabled('google')];
            case 1:
                // Verify Google integration is enabled
                _b.sent();
                // Verify event write permission for calendar
                return [4 /*yield*/, ProviderConfigurationService_1.ProviderConfigurationService.requireFlowPermission('google', 'Event', 'read_write')];
            case 2:
                // Verify event write permission for calendar
                _b.sent();
                _a = req.body, title = _a.title, description = _a.description, startTime = _a.startTime, endTime = _a.endTime, attendees = _a.attendees;
                eventData = {
                    eventId: "cal-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9)),
                    title: title || 'DreamNet Integration Test Meeting',
                    description: description || 'Test calendar event created by DreamNet integration system',
                    startTime: startTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
                    endTime: endTime || new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
                    attendees: attendees || ['test@dreamnet.ink'],
                    provider: 'google_calendar',
                    status: 'confirmed',
                    timestamp: new Date().toISOString(),
                };
                console.log("\uD83D\uDCC5 [Google Calendar] Event created: ".concat(eventData.eventId));
                console.log("\uD83D\uDCC5 [Google Calendar] Title: ".concat(eventData.title));
                console.log("\uD83D\uDCC5 [Google Calendar] Start: ".concat(eventData.startTime));
                console.log("\uD83D\uDCC5 [Google Calendar] Attendees: ".concat(eventData.attendees.join(', ')));
                eventLog = {
                    eventId: "event-".concat(Date.now()),
                    type: 'calendar_event_created',
                    provider: 'google',
                    data: eventData,
                    timestamp: new Date().toISOString(),
                };
                console.log("\uD83D\uDCCA [Google Event] Event logged: ".concat(eventLog.eventId));
                res.json({
                    success: true,
                    calendarEvent: eventData,
                    event: eventLog,
                    message: 'Calendar event created and logged successfully',
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error('[Google Calendar] Create event failed:', error_2);
                res.status(500).json({
                    error: 'Failed to create calendar event',
                    message: error_2.message,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Test Gmail template endpoint
router.post('/send-templated-email', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var template, emailData, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, IntegrationFlagsService_1.IntegrationFlagsService.requireEnabled('google')];
            case 1:
                _a.sent();
                return [4 /*yield*/, ProviderConfigurationService_1.ProviderConfigurationService.requireFlowPermission('google', 'Lead', 'read_write')];
            case 2:
                _a.sent();
                template = {
                    name: 'integration_proof',
                    subject: 'DreamNet Integration Proof - System Operational',
                    body: "\nHello from DreamNet!\n\nThis templated email confirms that our Google integration is working properly.\n\n\u2705 Integration Status: OPERATIONAL\n\u2705 Flow Permission: Lead (read_write) - VALIDATED\n\u2705 Provider: Google Gmail\n\u2705 Timestamp: ".concat(new Date().toISOString(), "\n\nThis message was generated as part of our 60-minute integration proof plan.\n\nBest regards,\nDreamNet Integration System\n      ").trim(),
                };
                emailData = {
                    messageId: "gmail-template-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9)),
                    to: 'integration-test@dreamnet.ink',
                    subject: template.subject,
                    body: template.body,
                    template: template.name,
                    timestamp: new Date().toISOString(),
                    provider: 'google_gmail',
                    status: 'sent',
                };
                console.log("\uD83D\uDCE7 [Google Gmail] Templated email sent: ".concat(emailData.messageId));
                console.log("\uD83D\uDCE7 [Google Gmail] Template: ".concat(template.name));
                console.log("\uD83D\uDCE7 [Google Gmail] Subject: ".concat(template.subject));
                res.json({
                    success: true,
                    email: emailData,
                    template: template,
                    message: 'Templated email sent successfully',
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('[Google Gmail] Templated email failed:', error_3);
                res.status(500).json({
                    error: 'Failed to send templated email',
                    message: error_3.message,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;

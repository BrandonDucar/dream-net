"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
// System wakeup service is optional
var systemWakeupService = null;
try {
    var wakeupModule = require('../services/SystemWideWakeupService');
    systemWakeupService = wakeupModule.systemWakeupService;
}
catch (_a) {
    console.warn("[System Wakeup Router] System wakeup service not available");
}
// Initiate system-wide wakeup
router.post('/wakeup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, systemWakeupService.initiateSystemWideWakeup()];
            case 1:
                result = _a.sent();
                res.json(__assign({ success: true, message: 'System-wide wakeup initiated' }, result));
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('System wakeup error:', error_1);
                res.status(500).json({
                    success: false,
                    error: 'Failed to initiate system wakeup'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get system status
router.get('/status', function (req, res) {
    if (!systemWakeupService) {
        return res.status(503).json({ error: "System wakeup service not available" });
    }
    try {
        var status_1 = systemWakeupService.getSystemStatus();
        res.json({
            success: true,
            systemStatus: status_1
        });
    }
    catch (error) {
        console.error('System status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get system status'
        });
    }
});
// Enter Sweet Spot Mode
router.post('/sweet-spot', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!systemWakeupService) {
                    return [2 /*return*/, res.status(503).json({ error: "System wakeup service not available" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, systemWakeupService.enterSweetSpotMode()];
            case 2:
                _a.sent();
                res.json({
                    success: true,
                    message: 'Sweet Spot Lock Mode activated'
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('Sweet spot mode error:', error_2);
                res.status(500).json({
                    success: false,
                    error: 'Failed to activate Sweet Spot Mode'
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// System wakeup events (Server-Sent Events)
router.get('/events', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });
    var sendEvent = function (event, data) {
        res.write("event: ".concat(event, "\n"));
        res.write("data: ".concat(JSON.stringify(data), "\n\n"));
    };
    // Listen to wakeup service events
    var eventHandlers = {
        wakeupInitiated: function (data) { return sendEvent('wakeupInitiated', data); },
        sequenceStarted: function (data) { return sendEvent('sequenceStarted', data); },
        sequenceCompleted: function (data) { return sendEvent('sequenceCompleted', data); },
        componentWaking: function (data) { return sendEvent('componentWaking', data); },
        componentActive: function (data) { return sendEvent('componentActive', data); },
        integrationActivated: function (data) { return sendEvent('integrationActivated', data); },
        sweetSpotOptimized: function (data) { return sendEvent('sweetSpotOptimized', data); },
        sweetSpotModeActivated: function (data) { return sendEvent('sweetSpotModeActivated', data); },
        systemWakeupComplete: function (data) { return sendEvent('systemWakeupComplete', data); }
    };
    Object.entries(eventHandlers).forEach(function (_a) {
        var event = _a[0], handler = _a[1];
        systemWakeupService.on(event, handler);
    });
    // Cleanup on client disconnect
    req.on('close', function () {
        Object.entries(eventHandlers).forEach(function (_a) {
            var event = _a[0], handler = _a[1];
            systemWakeupService.removeListener(event, handler);
        });
    });
    // Send initial status
    sendEvent('initialStatus', systemWakeupService.getSystemStatus());
});
exports.default = router;

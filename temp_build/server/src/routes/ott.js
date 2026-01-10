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
var OTTService_1 = require("../services/OTTService");
var router = (0, express_1.Router)();
// ==================== OTT PUBLISHING ENDPOINTS ====================
// Over-The-Top media publishing and analytics system
// Publish content to OTT platforms
router.post('/api/ott/publish', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clientId, publishRequest, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                clientId = req.headers['x-client-id'] || 'unknown';
                publishRequest = req.body;
                // Validate request
                if (!publishRequest || typeof publishRequest !== 'object') {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid request body',
                            required: ['asset_id', 'channel']
                        })];
                }
                return [4 /*yield*/, OTTService_1.ottService.publish(publishRequest, clientId)];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('📺 [OTT] Publish endpoint error:', error_1.message);
                res.status(400).json({
                    error: error_1.message,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Record OTT metrics and analytics
router.post('/api/ott/metrics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clientId, metricData, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                clientId = req.headers['x-client-id'] || 'unknown';
                metricData = req.body;
                // Validate request
                if (!metricData || typeof metricData !== 'object') {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid request body',
                            required: ['event', 'asset_id', 'ts']
                        })];
                }
                return [4 /*yield*/, OTTService_1.ottService.recordMetric(metricData, clientId)];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('📺 [OTT] Metrics endpoint error:', error_2.message);
                res.status(400).json({
                    error: error_2.message,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get OTT configuration
router.get('/api/ott/config', function (req, res) {
    try {
        var config = OTTService_1.ottService.getConfig();
        res.json({
            ok: true,
            config: config,
            supported_events: ['playback_start', 'complete', 'dwell'],
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('📺 [OTT] Config endpoint error:', error.message);
        res.status(500).json({ error: 'Failed to get OTT configuration' });
    }
});
// Get OTT analytics and statistics
router.get('/api/ott/stats', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stats, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, OTTService_1.ottService.getStats()];
            case 1:
                stats = _a.sent();
                res.json({
                    ok: true,
                    stats: stats,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('📺 [OTT] Stats endpoint error:', error_3.message);
                res.status(500).json({ error: 'Failed to get OTT statistics' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Cleanup old OTT events (admin protected)
router.post('/api/ott/cleanup', function (req, res) {
    var _a;
    try {
        var adminToken = req.headers['x-admin-token'];
        if (!adminToken || adminToken !== (process.env.ADMIN_TOKEN || 'dreamnet_admin_2025')) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        var retentionDays = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.retention_days) || 30;
        var cleanedCount = OTTService_1.ottService.cleanup(retentionDays);
        console.log("\uD83D\uDCFA [OTT] Manual cleanup performed by admin - ".concat(cleanedCount, " events removed"));
        res.json({
            ok: true,
            cleaned_events: cleanedCount,
            retention_days: retentionDays,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('📺 [OTT] Cleanup endpoint error:', error.message);
        res.status(500).json({ error: 'Failed to cleanup OTT events' });
    }
});
// Desktop application update information endpoint
router.get('/api/desktop/update/info', function (req, res) {
    try {
        var baseUrl = "".concat(req.protocol, "://").concat(req.get('host'));
        res.json({
            latest: "1.0.0",
            notes: "Initial GA",
            url: "".concat(baseUrl, "/downloads/desktop/dreamnet-1.0.0.exe")
        });
        console.log('🖥️ [Desktop] Update info requested - serving v1.0.0 download URL');
    }
    catch (error) {
        console.error('🖥️ [Desktop] Update info error:', error.message);
        res.status(500).json({ error: 'Failed to get desktop update info' });
    }
});
exports.default = router;

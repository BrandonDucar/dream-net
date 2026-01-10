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
var ExperienceManager_1 = require("../services/ExperienceManager");
var router = (0, express_1.Router)();
// Get overall experience status
router.get('/experiences/status', function (req, res) {
    try {
        var status_1 = ExperienceManager_1.experienceManager.getExperienceStatus();
        res.json({
            success: true,
            status: status_1,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('🌐 [Experiences] Error getting status:', error);
        res.status(500).json({ success: false, error: 'Failed to get experience status' });
    }
});
// Web Experience Routes
router.get('/experiences/web', function (req, res) {
    try {
        var webExperience = ExperienceManager_1.experienceManager.getWebExperience();
        res.json({
            success: true,
            web_experience: webExperience,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('🌐 [Experiences] Error getting web experience:', error);
        res.status(500).json({ success: false, error: 'Failed to get web experience' });
    }
});
router.post('/experiences/web/health-check', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var isHealthy, webExperience, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ExperienceManager_1.experienceManager.performHealthCheck()];
            case 1:
                isHealthy = _a.sent();
                webExperience = ExperienceManager_1.experienceManager.getWebExperience();
                res.json({
                    success: true,
                    healthy: isHealthy,
                    web_experience: webExperience,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('🌐 [Experiences] Error performing health check:', error_1);
                res.status(500).json({ success: false, error: 'Failed to perform health check' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put('/experiences/web/config', function (req, res) {
    try {
        var updates = req.body;
        ExperienceManager_1.experienceManager.updateWebConfig(updates);
        res.json({
            success: true,
            message: 'Web configuration updated',
            web_experience: ExperienceManager_1.experienceManager.getWebExperience(),
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('🌐 [Experiences] Error updating web config:', error);
        res.status(500).json({ success: false, error: 'Failed to update web configuration' });
    }
});
// OTT Experience Routes
router.get('/experiences/ott/channels', function (req, res) {
    try {
        var channels = ExperienceManager_1.experienceManager.getOTTChannels();
        res.json({
            success: true,
            channels: channels,
            count: channels.length,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('📺 [Experiences] Error getting OTT channels:', error);
        res.status(500).json({ success: false, error: 'Failed to get OTT channels' });
    }
});
router.get('/experiences/ott/channels/:channelId', function (req, res) {
    try {
        var channelId = req.params.channelId;
        var channel = ExperienceManager_1.experienceManager.getOTTChannel(channelId);
        if (!channel) {
            return res.status(404).json({ success: false, error: 'Channel not found' });
        }
        res.json({
            success: true,
            channel: channel,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('📺 [Experiences] Error getting OTT channel:', error);
        res.status(500).json({ success: false, error: 'Failed to get OTT channel' });
    }
});
router.post('/experiences/ott/channels', function (req, res) {
    try {
        var channel = req.body;
        if (!channel.id || !channel.name || !channel.platform) {
            return res.status(400).json({
                success: false,
                error: 'id, name, and platform are required'
            });
        }
        ExperienceManager_1.experienceManager.addOTTChannel(__assign(__assign({}, channel), { status: channel.status || 'active', content_count: channel.content_count || 0 }));
        res.json({
            success: true,
            message: 'OTT channel added successfully',
            channel: channel,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('📺 [Experiences] Error adding OTT channel:', error);
        res.status(500).json({ success: false, error: 'Failed to add OTT channel' });
    }
});
router.post('/experiences/ott/publish', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, asset_id, channel_id, title, scheduled_time, publishId, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, type = _a.type, asset_id = _a.asset_id, channel_id = _a.channel_id, title = _a.title, scheduled_time = _a.scheduled_time;
                if (!type || !asset_id || !channel_id || !title) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'type, asset_id, channel_id, and title are required'
                        })];
                }
                if (type === 'scheduled' && !scheduled_time) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'scheduled_time is required for scheduled publishing'
                        })];
                }
                return [4 /*yield*/, ExperienceManager_1.experienceManager.publishContent({
                        type: type,
                        asset_id: asset_id,
                        channel_id: channel_id,
                        title: title,
                        scheduled_time: scheduled_time
                    })];
            case 1:
                publishId = _b.sent();
                res.json({
                    success: true,
                    message: 'Content publishing initiated',
                    publish_id: publishId,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('📺 [Experiences] Error publishing content:', error_2);
                res.status(500).json({ success: false, error: 'Failed to publish content' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/experiences/ott/publish/:publishId', function (req, res) {
    try {
        var publishId = req.params.publishId;
        var publishing = ExperienceManager_1.experienceManager.getPublishingStatus(publishId);
        if (!publishing) {
            return res.status(404).json({ success: false, error: 'Publishing record not found' });
        }
        res.json({
            success: true,
            publishing: publishing,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('📺 [Experiences] Error getting publishing status:', error);
        res.status(500).json({ success: false, error: 'Failed to get publishing status' });
    }
});
router.get('/experiences/ott/publishing', function (req, res) {
    try {
        var publishing = ExperienceManager_1.experienceManager.getAllPublishing();
        res.json({
            success: true,
            publishing: publishing,
            count: publishing.length,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('📺 [Experiences] Error getting all publishing:', error);
        res.status(500).json({ success: false, error: 'Failed to get publishing records' });
    }
});
// OTT Telemetry Routes
router.post('/experiences/ott/telemetry', function (req, res) {
    try {
        var telemetry = req.body;
        if (!telemetry.event_type || !telemetry.asset_id || !telemetry.channel_id || !telemetry.device_type) {
            return res.status(400).json({
                success: false,
                error: 'event_type, asset_id, channel_id, and device_type are required'
            });
        }
        var telemetryRecord = __assign(__assign({}, telemetry), { timestamp: telemetry.timestamp || new Date().toISOString() });
        ExperienceManager_1.experienceManager.recordTelemetry(telemetryRecord);
        res.json({
            success: true,
            message: 'Telemetry recorded',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('📊 [Experiences] Error recording telemetry:', error);
        res.status(500).json({ success: false, error: 'Failed to record telemetry' });
    }
});
router.get('/experiences/ott/telemetry/stats', function (req, res) {
    try {
        var timeframe = req.query.timeframe;
        var validTimeframes = ['hour', 'day', 'week'];
        var selectedTimeframe = validTimeframes.includes(timeframe)
            ? timeframe
            : 'hour';
        var stats = ExperienceManager_1.experienceManager.getTelemetryStats(selectedTimeframe);
        res.json({
            success: true,
            stats: stats,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('📊 [Experiences] Error getting telemetry stats:', error);
        res.status(500).json({ success: false, error: 'Failed to get telemetry statistics' });
    }
});
// Desktop Experience Routes
router.get('/experiences/desktop/capabilities', function (req, res) {
    try {
        var capabilities = ExperienceManager_1.experienceManager.getDesktopCapabilities();
        res.json({
            success: true,
            capabilities: capabilities,
            count: capabilities.length,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('💻 [Experiences] Error getting desktop capabilities:', error);
        res.status(500).json({ success: false, error: 'Failed to get desktop capabilities' });
    }
});
router.get('/experiences/desktop/capabilities/:platform', function (req, res) {
    try {
        var platform = req.params.platform;
        if (!['windows', 'macos'].includes(platform)) {
            return res.status(400).json({
                success: false,
                error: 'Platform must be "windows" or "macos"'
            });
        }
        var capability = ExperienceManager_1.experienceManager.getDesktopCapability(platform);
        if (!capability) {
            return res.status(404).json({ success: false, error: 'Platform capability not found' });
        }
        res.json({
            success: true,
            capability: capability,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('💻 [Experiences] Error getting desktop capability:', error);
        res.status(500).json({ success: false, error: 'Failed to get desktop capability' });
    }
});
router.post('/experiences/desktop/deeplink', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, platform, url, success, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, platform = _a.platform, url = _a.url;
                if (!platform || !url) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'platform and url are required'
                        })];
                }
                if (!['windows', 'macos'].includes(platform)) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Platform must be "windows" or "macos"'
                        })];
                }
                return [4 /*yield*/, ExperienceManager_1.experienceManager.executeDeeplink(platform, url)];
            case 1:
                success = _b.sent();
                res.json({
                    success: success,
                    message: success ? 'Deeplink executed successfully' : 'Deeplink execution failed',
                    platform: platform,
                    url: url,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error('💻 [Experiences] Error executing deeplink:', error_3);
                res.status(500).json({ success: false, error: 'Failed to execute deeplink' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/experiences/desktop/notification', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, platform, title, message, actionUrl, success, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, platform = _a.platform, title = _a.title, message = _a.message, actionUrl = _a.actionUrl;
                if (!platform || !title || !message) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'platform, title, and message are required'
                        })];
                }
                if (!['windows', 'macos'].includes(platform)) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Platform must be "windows" or "macos"'
                        })];
                }
                return [4 /*yield*/, ExperienceManager_1.experienceManager.sendDesktopNotification(platform, title, message, actionUrl)];
            case 1:
                success = _b.sent();
                res.json({
                    success: success,
                    message: success ? 'Notification sent successfully' : 'Notification sending failed',
                    platform: platform,
                    title: title,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                console.error('💻 [Experiences] Error sending notification:', error_4);
                res.status(500).json({ success: false, error: 'Failed to send notification' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/experiences/desktop/verify', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var results, capabilities, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ExperienceManager_1.experienceManager.verifyDesktopCapabilities()];
            case 1:
                results = _a.sent();
                capabilities = ExperienceManager_1.experienceManager.getDesktopCapabilities();
                res.json({
                    success: true,
                    verification_results: results,
                    capabilities: capabilities,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('💻 [Experiences] Error verifying capabilities:', error_5);
                res.status(500).json({ success: false, error: 'Failed to verify desktop capabilities' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;

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
Object.defineProperty(exports, "__esModule", { value: true });
// Eye in the Sky - Server Routes for Video Monitoring
var express_1 = require("express");
var multer_1 = require("multer");
var path_1 = require("path");
var fs_1 = require("fs");
var router = express_1.default.Router();
// Configure multer for video uploads
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        var uploadDir = path_1.default.join(process.cwd(), 'monitoring-data', 'videos');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        var timestamp = new Date().toISOString().replace(/:/g, '-');
        cb(null, "".concat(timestamp, "_").concat(file.originalname));
    }
});
var upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only video and image files allowed'));
        }
    }
});
// Store monitoring events in memory (within sweet spot)
var monitoringEvents = [];
var monitoringStats = {
    totalVideos: 0,
    totalScreenshots: 0,
    totalEvents: 0,
    storageUsed: 0
};
// Upload video recording
router.post('/upload-video', upload.single('video'), function (req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file provided' });
        }
        var event_1 = {
            id: "video_".concat(Date.now()),
            timestamp: new Date(),
            type: 'video_upload',
            context: req.body.context || 'unknown',
            filename: req.file.filename,
            size: req.file.size,
            path: req.file.path
        };
        monitoringEvents.push(event_1);
        monitoringStats.totalVideos++;
        monitoringStats.totalEvents++;
        monitoringStats.storageUsed += req.file.size;
        console.log("\uD83D\uDC41\uFE0F [EyeInTheSky] Video uploaded: ".concat(req.file.filename));
        res.json({
            success: true,
            eventId: event_1.id,
            message: 'Video uploaded successfully'
        });
    }
    catch (error) {
        console.error('Video upload error:', error);
        res.status(500).json({ error: 'Video upload failed' });
    }
});
// Upload screenshot
router.post('/upload-screenshot', function (req, res) {
    try {
        var _a = req.body, screenshot = _a.screenshot, context_1 = _a.context, metadata = _a.metadata;
        if (!screenshot) {
            return res.status(400).json({ error: 'No screenshot data provided' });
        }
        // Save screenshot to disk
        var timestamp = new Date().toISOString().replace(/:/g, '-');
        var filename = "screenshot_".concat(timestamp, ".jpg");
        var screenshotDir = path_1.default.join(process.cwd(), 'monitoring-data', 'screenshots');
        if (!fs_1.default.existsSync(screenshotDir)) {
            fs_1.default.mkdirSync(screenshotDir, { recursive: true });
        }
        // Remove data URL prefix and save
        var base64Data = screenshot.replace(/^data:image\/\w+;base64,/, '');
        var filepath = path_1.default.join(screenshotDir, filename);
        fs_1.default.writeFileSync(filepath, base64Data, 'base64');
        var event_2 = {
            id: "screenshot_".concat(Date.now()),
            timestamp: new Date(),
            type: 'screenshot_upload',
            context: context_1 || 'unknown',
            filename: filename,
            path: filepath,
            metadata: metadata || {}
        };
        monitoringEvents.push(event_2);
        monitoringStats.totalScreenshots++;
        monitoringStats.totalEvents++;
        res.json({
            success: true,
            eventId: event_2.id,
            message: 'Screenshot saved successfully'
        });
    }
    catch (error) {
        console.error('Screenshot upload error:', error);
        res.status(500).json({ error: 'Screenshot upload failed' });
    }
});
// Log monitoring event
router.post('/log-event', function (req, res) {
    try {
        var event_3 = __assign({ id: "event_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)), timestamp: new Date() }, req.body);
        monitoringEvents.push(event_3);
        monitoringStats.totalEvents++;
        // Keep only last 1000 events to stay within sweet spot
        if (monitoringEvents.length > 1000) {
            monitoringEvents = monitoringEvents.slice(-1000);
        }
        res.json({
            success: true,
            eventId: event_3.id
        });
    }
    catch (error) {
        console.error('Event logging error:', error);
        res.status(500).json({ error: 'Event logging failed' });
    }
});
// Get monitoring dashboard data
router.get('/dashboard', function (req, res) {
    try {
        var recentEvents = monitoringEvents.slice(-50); // Last 50 events
        var dashboard = {
            stats: monitoringStats,
            recentEvents: recentEvents,
            systemHealth: {
                monitoring: 'active',
                events: monitoringEvents.length,
                lastEvent: monitoringEvents.length > 0 ? monitoringEvents[monitoringEvents.length - 1].timestamp : null
            }
        };
        res.json({ success: true, dashboard: dashboard });
    }
    catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Dashboard data failed' });
    }
});
// Get specific monitoring data
router.get('/events', function (req, res) {
    try {
        var _a = req.query, context_2 = _a.context, type_1 = _a.type, _b = _a.limit, limit = _b === void 0 ? 100 : _b;
        var filteredEvents = monitoringEvents;
        if (context_2) {
            filteredEvents = filteredEvents.filter(function (e) { return e.context === context_2; });
        }
        if (type_1) {
            filteredEvents = filteredEvents.filter(function (e) { return e.type === type_1; });
        }
        var events = filteredEvents.slice(-Number(limit));
        res.json({
            success: true,
            events: events,
            total: filteredEvents.length
        });
    }
    catch (error) {
        console.error('Events query error:', error);
        res.status(500).json({ error: 'Events query failed' });
    }
});
// Export monitoring data
router.get('/export', function (req, res) {
    try {
        var exportData = {
            stats: monitoringStats,
            events: monitoringEvents,
            exportTime: new Date(),
            systemInfo: {
                nodeVersion: process.version,
                platform: process.platform,
                uptime: process.uptime()
            }
        };
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=monitoring-export.json');
        res.json(exportData);
    }
    catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Export failed' });
    }
});
// Clear monitoring data (admin only)
router.post('/clear', function (req, res) {
    try {
        monitoringEvents = [];
        monitoringStats = {
            totalVideos: 0,
            totalScreenshots: 0,
            totalEvents: 0,
            storageUsed: 0
        };
        console.log('👁️ [EyeInTheSky] Monitoring data cleared');
        res.json({ success: true, message: 'Monitoring data cleared' });
    }
    catch (error) {
        console.error('Clear data error:', error);
        res.status(500).json({ error: 'Clear data failed' });
    }
});
exports.default = router;

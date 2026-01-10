"use strict";
/**
 * Nerve Fabric API Routes
 * Internal/admin-only endpoints for accessing Nerve event data
 */
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var bus_1 = require("../../packages/nerve/src/bus");
var subscribers_1 = require("../../packages/nerve/src/subscribers");
var router = (0, express_1.Router)();
// GET /api/nerve/stats - Get Nerve Bus statistics (internal/admin)
router.get("/stats", function (req, res) {
    try {
        var stats = bus_1.NERVE_BUS.getStats();
        res.json({
            success: true,
            stats: stats,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/nerve/recent-events - Get recent events for DreamScope (internal/admin)
router.get("/recent-events", function (req, res) {
    try {
        var limit = parseInt(req.query.limit) || 100;
        var events = (0, subscribers_1.getDreamScopeEvents)(limit);
        res.json({
            success: true,
            events: events,
            count: events.length,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/nerve/metrics - Get DreamScope metrics (internal/admin)
router.get("/metrics", function (req, res) {
    try {
        var metrics = (0, subscribers_1.getDreamScopeMetrics)();
        res.json({
            success: true,
            metrics: metrics,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;

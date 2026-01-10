"use strict";
/**
 * Control Plane API Routes
 * Global kill-switch and per-cluster rate limiting
 */
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dreamnet_control_core_1 = require("../../packages/dreamnet-control-core");
var passportGate_1 = require("../middleware/passportGate");
var router = express_1.default.Router();
// GET /api/control - Get full control config (requires operator tier)
router.get("/", (0, passportGate_1.createPassportGate)("operator"), function (req, res) {
    try {
        var config = dreamnet_control_core_1.DreamNetControlCore.getConfig();
        res.json({
            success: true,
            config: config,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/control/kill-switch - Get kill-switch state
router.get("/kill-switch", function (req, res) {
    try {
        var state = dreamnet_control_core_1.DreamNetControlCore.getKillSwitchState();
        res.json({
            success: true,
            killSwitch: state,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/control/kill-switch/enable - Enable global kill-switch (requires architect tier)
router.post("/kill-switch/enable", (0, passportGate_1.createPassportGate)("architect"), function (req, res) {
    try {
        var _a = req.body, reason = _a.reason, disabledBy = _a.disabledBy;
        dreamnet_control_core_1.DreamNetControlCore.enableGlobalKillSwitch(reason, disabledBy);
        res.json({
            success: true,
            message: "Global kill-switch enabled",
            state: dreamnet_control_core_1.DreamNetControlCore.getKillSwitchState(),
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/control/kill-switch/disable - Disable global kill-switch (requires architect tier)
router.post("/kill-switch/disable", (0, passportGate_1.createPassportGate)("architect"), function (req, res) {
    try {
        var reason = req.body.reason;
        dreamnet_control_core_1.DreamNetControlCore.disableGlobalKillSwitch(reason);
        res.json({
            success: true,
            message: "Global kill-switch disabled",
            state: dreamnet_control_core_1.DreamNetControlCore.getKillSwitchState(),
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/control/cluster/:clusterId/enable - Enable cluster
router.post("/cluster/:clusterId/enable", function (req, res) {
    try {
        var clusterId = req.params.clusterId;
        var reason = req.body.reason;
        dreamnet_control_core_1.DreamNetControlCore.enableCluster(clusterId, reason);
        res.json({
            success: true,
            message: "Cluster ".concat(clusterId, " enabled"),
            clusterId: clusterId,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/control/cluster/:clusterId/disable - Disable cluster
router.post("/cluster/:clusterId/disable", function (req, res) {
    try {
        var clusterId = req.params.clusterId;
        var _a = req.body, reason = _a.reason, disabledBy = _a.disabledBy;
        dreamnet_control_core_1.DreamNetControlCore.disableCluster(clusterId, reason, disabledBy);
        res.json({
            success: true,
            message: "Cluster ".concat(clusterId, " disabled"),
            clusterId: clusterId,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/control/cluster/:clusterId/rate-limit - Get cluster rate limit
router.get("/cluster/:clusterId/rate-limit", function (req, res) {
    try {
        var clusterId = req.params.clusterId;
        var limit = dreamnet_control_core_1.DreamNetControlCore.getRateLimit(clusterId);
        var check = dreamnet_control_core_1.DreamNetControlCore.checkRateLimit(clusterId);
        res.json({
            success: true,
            clusterId: clusterId,
            limit: limit,
            current: check,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/control/cluster/:clusterId/rate-limit - Set cluster rate limit
router.post("/cluster/:clusterId/rate-limit", function (req, res) {
    try {
        var clusterId = req.params.clusterId;
        var _a = req.body, requestsPerMinute = _a.requestsPerMinute, requestsPerHour = _a.requestsPerHour, requestsPerDay = _a.requestsPerDay, enabled = _a.enabled;
        dreamnet_control_core_1.DreamNetControlCore.setRateLimit({
            clusterId: clusterId,
            requestsPerMinute: requestsPerMinute || 60,
            requestsPerHour: requestsPerHour || 1000,
            requestsPerDay: requestsPerDay || 10000,
            enabled: enabled !== false,
        });
        res.json({
            success: true,
            message: "Rate limit updated for ".concat(clusterId),
            limit: dreamnet_control_core_1.DreamNetControlCore.getRateLimit(clusterId),
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/control/cluster/:clusterId/circuit-breaker/trip - Trip circuit breaker
router.post("/cluster/:clusterId/circuit-breaker/trip", function (req, res) {
    try {
        var clusterId = req.params.clusterId;
        var autoResetAfter = req.body.autoResetAfter;
        dreamnet_control_core_1.DreamNetControlCore.tripCircuitBreaker(clusterId, autoResetAfter);
        res.json({
            success: true,
            message: "Circuit breaker tripped for ".concat(clusterId),
            clusterId: clusterId,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/control/cluster/:clusterId/circuit-breaker/reset - Reset circuit breaker
router.post("/cluster/:clusterId/circuit-breaker/reset", function (req, res) {
    try {
        var clusterId = req.params.clusterId;
        dreamnet_control_core_1.DreamNetControlCore.resetCircuitBreaker(clusterId);
        res.json({
            success: true,
            message: "Circuit breaker reset for ".concat(clusterId),
            clusterId: clusterId,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;

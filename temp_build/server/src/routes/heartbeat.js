"use strict";
/**
 * Heartbeat API Routes
 * Phase 1 - Eyes: Unified view of DreamNet's status
 */
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dreamnet_os_core_1 = require("../../packages/dreamnet-os-core");
var dream_state_core_1 = require("../../packages/dream-state-core");
var spider_web_core_1 = require("../../packages/spider-web-core");
var shield_core_1 = require("../../packages/shield-core");
var wolf_pack_1 = require("../../packages/wolf-pack");
var dreamnet_control_core_1 = require("../../packages/dreamnet-control-core");
var router = express_1.default.Router();
// GET /api/heartbeat - Get unified DreamNet status (Phase 1 - Eyes)
router.get("/", function (req, res) {
    var _a, _b;
    try {
        var osStatus = dreamnet_os_core_1.default.status();
        var stats = dreamnet_os_core_1.default.getHealthStats();
        var activeAlerts = dreamnet_os_core_1.default.getActiveAlerts();
        var trends = dreamnet_os_core_1.default.detectTrends();
        // Get status from all major systems
        var dreamState = dream_state_core_1.default.status();
        var spiderWeb = spider_web_core_1.default.status();
        var shield = shield_core_1.default.status();
        var wolfPack = wolf_pack_1.default.status();
        var control = dreamnet_control_core_1.default.getConfig();
        // Try to get Whale/Orca Pack status (may not exist yet)
        var whalePack = null;
        var orcaPack = null;
        try {
            var WhalePackCore = require("../../packages/whale-pack-core").WhalePackCore;
            whalePack = ((_a = WhalePackCore === null || WhalePackCore === void 0 ? void 0 : WhalePackCore.status) === null || _a === void 0 ? void 0 : _a.call(WhalePackCore)) || null;
        }
        catch (e) {
            // Whale Pack not available
        }
        try {
            var OrcaPackCore = require("../../packages/orca-pack-core").OrcaPackCore;
            orcaPack = ((_b = OrcaPackCore === null || OrcaPackCore === void 0 ? void 0 : OrcaPackCore.status) === null || _b === void 0 ? void 0 : _b.call(OrcaPackCore)) || null;
        }
        catch (e) {
            // Orca Pack not available
        }
        res.json({
            success: true,
            timestamp: Date.now(),
            heartbeat: {
                lastRunAt: osStatus.lastRunAt,
                snapshot: osStatus.snapshot,
                stats: stats,
                activeAlerts: activeAlerts.length,
                trends: trends.length,
            },
            // Phase 1 - Eyes: All major system statuses
            dreamState: {
                passportCount: dreamState.passportCount,
                departmentCount: dreamState.departmentCount,
                proposalCount: dreamState.proposalCount,
                recentActionCount: dreamState.recentActionCount,
                lastRunAt: dreamState.lastRunAt,
            },
            spiderWeb: {
                threadCount: spiderWeb.threadCount,
                activeThreadCount: spiderWeb.activeThreadCount,
                flyCount: spiderWeb.flyCount,
                sensorCount: spiderWeb.sensorCount,
                lastRunAt: spiderWeb.lastRunAt,
            },
            shield: {
                status: shield.status,
                layerCount: shield.layerCount,
                activeThreats: shield.activeThreats,
                neutralizedThreats: shield.neutralizedThreats,
                spikesFired: shield.spikesFired,
                lastRunAt: shield.lastRunAt,
            },
            packs: {
                wolf: {
                    activeTargets: wolfPack.activeTargets,
                    totalStrikes: wolfPack.totalStrikes,
                    lastStrikeAt: wolfPack.lastStrikeAt,
                },
                whale: whalePack ? {
                    status: whalePack.status || "unknown",
                    metrics: whalePack.metrics || {},
                } : null,
                orca: orcaPack ? {
                    status: orcaPack.status || "unknown",
                    metrics: orcaPack.metrics || {},
                } : null,
            },
            control: {
                globalKillSwitch: control.killSwitch.globalKillSwitch,
                clusterStates: Object.keys(control.killSwitch.clusterStates).length,
                rateLimits: control.rateLimits.length,
                circuitBreakers: Object.keys(control.circuitBreakers).length,
                lastUpdatedAt: control.killSwitch.lastUpdatedAt,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/heartbeat/snapshot - Get current snapshot
router.get("/snapshot", function (req, res) {
    try {
        var snapshot = dreamnet_os_core_1.default.getSnapshot();
        res.json({ success: true, snapshot: snapshot });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/heartbeat/alerts - Get alerts
router.get("/alerts", function (req, res) {
    try {
        var limit = parseInt(req.query.limit) || 50;
        var activeOnly = req.query.active === "true";
        if (activeOnly) {
            var alerts = dreamnet_os_core_1.default.getActiveAlerts();
            res.json({ success: true, alerts: alerts, count: alerts.length });
        }
        else {
            var alerts = dreamnet_os_core_1.default.getRecentAlerts(limit);
            res.json({ success: true, alerts: alerts, count: alerts.length });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/heartbeat/alerts/:id/resolve - Resolve an alert
router.post("/alerts/:id/resolve", function (req, res) {
    try {
        var resolved = dreamnet_os_core_1.default.resolveAlert(req.params.id);
        if (resolved) {
            res.json({ success: true, message: "Alert resolved" });
        }
        else {
            res.status(404).json({ error: "Alert not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/heartbeat/trends - Get health trends
router.get("/trends", function (req, res) {
    try {
        var trends = dreamnet_os_core_1.default.detectTrends();
        res.json({ success: true, trends: trends, count: trends.length });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/heartbeat/history - Get health history
router.get("/history", function (req, res) {
    try {
        var limit = parseInt(req.query.limit) || 100;
        var history_1 = dreamnet_os_core_1.default.getHealthHistory(limit);
        res.json({ success: true, history: history_1, count: history_1.length });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/heartbeat/stats - Get health statistics
router.get("/stats", function (req, res) {
    try {
        var stats = dreamnet_os_core_1.default.getHealthStats();
        res.json({ success: true, stats: stats });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/heartbeat/recovery - Get recovery actions
router.get("/recovery", function (req, res) {
    try {
        var snapshot = dreamnet_os_core_1.default.getSnapshot();
        var actions = dreamnet_os_core_1.default.generateRecoveryActions(snapshot.subsystems);
        res.json({ success: true, actions: actions, count: actions.length });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/heartbeat/integration-gaps - Get integration gaps
router.get("/integration-gaps", function (req, res) {
    try {
        // This would need context, but for now return detected gaps
        var gaps = dreamnet_os_core_1.default.getIntegrationGaps();
        res.json({ success: true, gaps: gaps, count: gaps.length });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;

"use strict";
/**
 * Jaggy API Routes
 * The Silent Sentinel's interface
 * Works alone, answers to few
 */
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var jaggy_core_1 = require("../../packages/jaggy-core");
var router = express_1.default.Router();
// GET /api/jaggy - Get Jaggy's status (authorized only)
router.get("/", function (req, res) {
    try {
        var status_1 = jaggy_core_1.default.status();
        res.json({
            success: true,
            jaggy: status_1,
            message: "🐱 Jaggy is watching...",
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/jaggy/hunts - Get active hunts
router.get("/hunts", function (req, res) {
    try {
        var hunts = jaggy_core_1.default.getActiveHunts();
        res.json({ success: true, hunts: hunts, count: hunts.length });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/jaggy/territories - Get territories Jaggy watches
router.get("/territories", function (req, res) {
    try {
        var territories = jaggy_core_1.default.getTerritories();
        res.json({ success: true, territories: territories, count: territories.length });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/jaggy/memories - Get Jaggy's memories
router.get("/memories", function (req, res) {
    try {
        var memories = jaggy_core_1.default.getMemories();
        res.json({ success: true, memories: memories, count: memories.length });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/jaggy/alerts - Get alerts (authorized only)
router.get("/alerts", function (req, res) {
    try {
        // Check authorization (Jaggy answers to few)
        var authorized = req.headers["x-jaggy-authorized"] === "true" ||
            req.headers["x-admin"] === "true";
        var alerts = jaggy_core_1.default.getAlerts(authorized);
        res.json({ success: true, alerts: alerts, count: alerts.length });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/jaggy/prowl - Make Jaggy prowl territories
router.post("/prowl", function (req, res) {
    try {
        jaggy_core_1.default.prowlTerritories();
        res.json({ success: true, message: "🐱 Jaggy is prowling..." });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/jaggy/fame - Increase Jaggy's Base fame
router.post("/fame", function (req, res) {
    try {
        var amount = parseFloat(req.body.amount) || 1;
        jaggy_core_1.default.increaseFame(amount);
        var status_2 = jaggy_core_1.default.status();
        res.json({
            success: true,
            message: "\uD83D\uDC51 Jaggy's Base fame increased!",
            baseFame: status_2.baseFame,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;

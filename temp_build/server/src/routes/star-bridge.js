"use strict";
/**
 * Star Bridge Lungs API Routes
 * Cross-chain breathwork and monitoring
 */
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
// Star Bridge Lungs is optional
var StarBridgeLungs = null;
try {
    var starBridgeModule = require("../../packages/star-bridge-lungs");
    StarBridgeLungs = starBridgeModule.StarBridgeLungs;
}
catch (_a) {
    console.warn("[Star Bridge Router] @dreamnet/star-bridge-lungs not available");
}
var router = express_1.default.Router();
// GET /api/star-bridge - Get Star Bridge Lungs status
router.get("/", function (req, res) {
    if (!StarBridgeLungs) {
        return res.status(503).json({ error: "Star Bridge Lungs not available" });
    }
    try {
        var status_1 = StarBridgeLungs.status();
        res.json({
            success: true,
            starBridge: status_1,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/star-bridge/chains - Get chain metrics
router.get("/chains", function (req, res) {
    if (!StarBridgeLungs) {
        return res.status(503).json({ error: "Star Bridge Lungs not available" });
    }
    try {
        var status_2 = StarBridgeLungs.status();
        res.json({
            success: true,
            chains: status_2.chainMetrics,
            count: status_2.chainMetrics.length,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/star-bridge/breaths - Get recent breath snapshots
router.get("/breaths", function (req, res) {
    if (!StarBridgeLungs) {
        return res.status(503).json({ error: "Star Bridge Lungs not available" });
    }
    try {
        var status_3 = StarBridgeLungs.status();
        var limit = parseInt(req.query.limit) || 10;
        var breaths = status_3.lastBreaths.slice(-limit);
        res.json({
            success: true,
            breaths: breaths,
            count: breaths.length,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/star-bridge/breathe - Trigger a breath cycle manually
router.post("/breathe", function (req, res) {
    if (!StarBridgeLungs) {
        return res.status(503).json({ error: "Star Bridge Lungs not available" });
    }
    try {
        // Import required systems for context
        var NeuralMesh = require("../../packages/neural-mesh").NeuralMesh;
        var QuantumAnticipation = require("../../packages/quantum-anticipation").QuantumAnticipation;
        var SlugTimeMemory = require("../../packages/slug-time-memory").SlugTimeMemory;
        var status_4 = StarBridgeLungs.run({
            neuralMesh: NeuralMesh,
            quantumAnticipation: QuantumAnticipation,
            slugTimeMemory: SlugTimeMemory,
        });
        res.json({
            success: true,
            message: "Breath cycle completed",
            starBridge: status_4,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;

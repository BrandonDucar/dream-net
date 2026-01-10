"use strict";
/**
 * Billable Actions API Routes
 * Two-phase commit pattern for financial operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var billable_1 = require("../middleware/billable");
var router = express_1.default.Router();
// GET /api/billable/stats - Get billable action statistics
router.get("/stats", function (req, res) {
    try {
        var stats = (0, billable_1.getBillableStats)();
        res.json({
            success: true,
            stats: stats,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/billable/:actionId - Get billable action status
router.get("/:actionId", function (req, res) {
    try {
        var actionId = req.params.actionId;
        var action = (0, billable_1.getBillableAction)(actionId);
        if (!action) {
            return res.status(404).json({
                success: false,
                error: "Action not found",
            });
        }
        res.json({
            success: true,
            action: action,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;

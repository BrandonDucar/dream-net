"use strict";
/**
 * Audit API Routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dreamnet_audit_core_1 = require("../../packages/dreamnet-audit-core");
var passportGate_1 = require("../middleware/passportGate");
var router = (0, express_1.Router)();
// GET /api/audit - Query audit logs (requires operator tier)
router.get("/", (0, passportGate_1.createPassportGate)("operator"), function (req, res) {
    try {
        var query = {
            userId: req.query.userId,
            walletAddress: req.query.walletAddress,
            action: req.query.action,
            clusterId: req.query.clusterId,
            startTime: req.query.startTime ? parseInt(req.query.startTime) : undefined,
            endTime: req.query.endTime ? parseInt(req.query.endTime) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit) : 100,
            offset: req.query.offset ? parseInt(req.query.offset) : 0,
        };
        var logs = dreamnet_audit_core_1.DreamNetAuditCore.queryLogs(query);
        res.json({ success: true, logs: logs, count: logs.length });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/audit/stats - Get audit statistics (requires operator tier)
router.get("/stats", (0, passportGate_1.createPassportGate)("operator"), function (req, res) {
    try {
        var stats = dreamnet_audit_core_1.DreamNetAuditCore.getStats();
        res.json({ success: true, stats: stats });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/audit/export - Export audit logs (requires architect tier)
router.post("/export", (0, passportGate_1.createPassportGate)("architect"), function (req, res) {
    try {
        var query = req.body.query;
        var logs = dreamnet_audit_core_1.DreamNetAuditCore.exportLogs(query);
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", "attachment; filename=\"audit-".concat(Date.now(), ".json\""));
        res.json(logs);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;

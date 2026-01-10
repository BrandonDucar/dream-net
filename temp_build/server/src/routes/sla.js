"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
// SLA service is optional
var slaService = null;
try {
    var slaModule = require('../services/SLAService');
    slaService = slaModule.slaService;
}
catch (_a) {
    console.warn("[SLA Router] SLA service not available");
}
// Get SLA status and metrics
router.get('/api/sla/status', function (req, res) {
    try {
        var status_1 = slaService.getSLAStatus();
        res.json(status_1);
    }
    catch (error) {
        console.error('📊 [SLA] Status endpoint error:', error.message);
        res.status(500).json({ error: 'Failed to get SLA status' });
    }
});
// Get SLA configuration
router.get('/api/sla/config', function (req, res) {
    try {
        var config = slaService.getConfiguration();
        res.json({
            ok: true,
            config: config,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('📊 [SLA] Config endpoint error:', error.message);
        res.status(500).json({ error: 'Failed to get SLA configuration' });
    }
});
// Record a custom metric (for testing or manual monitoring)
router.post('/api/sla/metric', function (req, res) {
    if (!slaService) {
        return res.status(503).json({ error: "SLA service not available" });
    }
    try {
        var _a = req.body, metric_name = _a.metric_name, value = _a.value, unit = _a.unit;
        if (!metric_name || value === undefined) {
            return res.status(400).json({ error: 'Missing required fields: metric_name and value' });
        }
        slaService.recordMetric(metric_name, parseFloat(value), unit || '');
        res.json({
            ok: true,
            recorded: { metric_name: metric_name, value: value, unit: unit },
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('📊 [SLA] Metric recording error:', error.message);
        res.status(500).json({ error: 'Failed to record metric' });
    }
});
// Acknowledge an alert
router.post('/api/sla/acknowledge', function (req, res) {
    if (!slaService) {
        return res.status(503).json({ error: "SLA service not available" });
    }
    try {
        var alert_id = req.body.alert_id;
        if (!alert_id) {
            return res.status(400).json({ error: 'Missing required field: alert_id' });
        }
        var acknowledged = slaService.acknowledgeAlert(alert_id);
        if (acknowledged) {
            res.json({
                ok: true,
                alert_id: alert_id,
                status: 'acknowledged',
                timestamp: new Date().toISOString()
            });
        }
        else {
            res.status(404).json({ error: 'Alert not found' });
        }
    }
    catch (error) {
        console.error('📊 [SLA] Acknowledge error:', error.message);
        res.status(500).json({ error: 'Failed to acknowledge alert' });
    }
});
// Simulate a failure (admin protected, for testing)
router.post('/api/sla/simulate', function (req, res) {
    if (!slaService) {
        return res.status(503).json({ error: "SLA service not available" });
    }
    try {
        var adminToken = req.headers['x-admin-token'];
        if (!adminToken || adminToken !== (process.env.ADMIN_TOKEN || 'dreamnet_admin_2025')) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        var _a = req.body, metric_name = _a.metric_name, value = _a.value;
        if (!metric_name || value === undefined) {
            return res.status(400).json({ error: 'Missing required fields: metric_name and value' });
        }
        slaService.simulateFailure(metric_name, parseFloat(value));
        console.log("\uD83E\uDDEA [SLA] Admin simulated failure: ".concat(metric_name, " = ").concat(value));
        res.json({
            ok: true,
            simulated: { metric_name: metric_name, value: value },
            message: 'Failure simulation triggered',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('📊 [SLA] Simulation error:', error.message);
        res.status(500).json({ error: 'Failed to simulate failure' });
    }
});
exports.default = router;

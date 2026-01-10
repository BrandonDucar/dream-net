"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
// Synthetic monitoring is optional
var syntheticMonitoring = null;
try {
    var syntheticModule = require('../services/SyntheticMonitoring');
    syntheticMonitoring = syntheticModule.syntheticMonitoring;
}
catch (_a) {
    console.warn("[Synthetic Router] Synthetic monitoring not available");
}
// Get all synthetic checks
router.get('/synthetic/checks', function (req, res) {
    try {
        var checks = syntheticMonitoring.getAllChecks();
        var overallStatus = syntheticMonitoring.getOverallStatus();
        res.json({
            success: true,
            checks: checks,
            overall_status: overallStatus,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('🔍 [Synthetic] Error getting checks:', error);
        res.status(500).json({ success: false, error: 'Failed to get synthetic checks' });
    }
});
// Get specific check details
router.get('/synthetic/checks/:checkId', function (req, res) {
    if (!syntheticMonitoring) {
        return res.status(503).json({ error: "Synthetic monitoring not available" });
    }
    try {
        var checkId = req.params.checkId;
        var check = syntheticMonitoring.getCheck(checkId);
        if (!check) {
            return res.status(404).json({ success: false, error: 'Check not found' });
        }
        var results = syntheticMonitoring.getResults(checkId, 20);
        var stats = syntheticMonitoring.getAvailabilityStats(checkId);
        res.json({
            success: true,
            check: check,
            recent_results: results,
            availability_stats: stats,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('🔍 [Synthetic] Error getting check details:', error);
        res.status(500).json({ success: false, error: 'Failed to get check details' });
    }
});
// Add new synthetic check
router.post('/synthetic/checks', function (req, res) {
    if (!syntheticMonitoring) {
        return res.status(503).json({ error: "Synthetic monitoring not available" });
    }
    try {
        var _a = req.body, id = _a.id, name_1 = _a.name, endpoint = _a.endpoint, method = _a.method, interval_seconds = _a.interval_seconds, timeout_ms = _a.timeout_ms, expected_status = _a.expected_status, headers = _a.headers, body = _a.body;
        if (!id || !name_1 || !endpoint) {
            return res.status(400).json({
                success: false,
                error: 'id, name, and endpoint are required'
            });
        }
        var check = {
            id: id,
            name: name_1,
            endpoint: endpoint,
            method: method || 'GET',
            interval_seconds: interval_seconds || 60,
            timeout_ms: timeout_ms || 5000,
            expected_status: expected_status || 200,
            headers: headers || {},
            body: body,
            enabled: true
        };
        syntheticMonitoring.addCheck(check);
        res.json({
            success: true,
            message: 'Synthetic check added successfully',
            check: check
        });
    }
    catch (error) {
        console.error('🔍 [Synthetic] Error adding check:', error);
        res.status(500).json({ success: false, error: 'Failed to add synthetic check' });
    }
});
// Update synthetic check
router.put('/synthetic/checks/:checkId', function (req, res) {
    if (!syntheticMonitoring) {
        return res.status(503).json({ error: "Synthetic monitoring not available" });
    }
    try {
        var checkId = req.params.checkId;
        var updates = req.body;
        var existingCheck = syntheticMonitoring.getCheck(checkId);
        if (!existingCheck) {
            return res.status(404).json({ success: false, error: 'Check not found' });
        }
        syntheticMonitoring.updateCheck(checkId, updates);
        var updatedCheck = syntheticMonitoring.getCheck(checkId);
        res.json({
            success: true,
            message: 'Synthetic check updated successfully',
            check: updatedCheck
        });
    }
    catch (error) {
        console.error('🔍 [Synthetic] Error updating check:', error);
        res.status(500).json({ success: false, error: 'Failed to update synthetic check' });
    }
});
// Enable/disable synthetic check
router.post('/synthetic/checks/:checkId/:action', function (req, res) {
    if (!syntheticMonitoring) {
        return res.status(503).json({ error: "Synthetic monitoring not available" });
    }
    try {
        var _a = req.params, checkId = _a.checkId, action = _a.action;
        if (!['enable', 'disable'].includes(action)) {
            return res.status(400).json({
                success: false,
                error: 'Action must be "enable" or "disable"'
            });
        }
        var check = syntheticMonitoring.getCheck(checkId);
        if (!check) {
            return res.status(404).json({ success: false, error: 'Check not found' });
        }
        if (action === 'enable') {
            syntheticMonitoring.enableCheck(checkId);
        }
        else {
            syntheticMonitoring.disableCheck(checkId);
        }
        res.json({
            success: true,
            message: "Check ".concat(action, "d successfully"),
            check_id: checkId,
            enabled: action === 'enable'
        });
    }
    catch (error) {
        console.error("\uD83D\uDD0D [Synthetic] Error ".concat(req.params.action, "ing check:"), error);
        res.status(500).json({ success: false, error: "Failed to ".concat(req.params.action, " check") });
    }
});
// Delete synthetic check
router.delete('/synthetic/checks/:checkId', function (req, res) {
    if (!syntheticMonitoring) {
        return res.status(503).json({ error: "Synthetic monitoring not available" });
    }
    try {
        var checkId = req.params.checkId;
        var check = syntheticMonitoring.getCheck(checkId);
        if (!check) {
            return res.status(404).json({ success: false, error: 'Check not found' });
        }
        syntheticMonitoring.removeCheck(checkId);
        res.json({
            success: true,
            message: 'Synthetic check deleted successfully',
            check_id: checkId
        });
    }
    catch (error) {
        console.error('🔍 [Synthetic] Error deleting check:', error);
        res.status(500).json({ success: false, error: 'Failed to delete synthetic check' });
    }
});
// Get results for specific check
router.get('/synthetic/checks/:checkId/results', function (req, res) {
    if (!syntheticMonitoring) {
        return res.status(503).json({ error: "Synthetic monitoring not available" });
    }
    try {
        var checkId = req.params.checkId;
        var limit = req.query.limit;
        var check = syntheticMonitoring.getCheck(checkId);
        if (!check) {
            return res.status(404).json({ success: false, error: 'Check not found' });
        }
        var results = syntheticMonitoring.getResults(checkId, limit ? parseInt(limit) : 50);
        var stats = syntheticMonitoring.getAvailabilityStats(checkId);
        res.json({
            success: true,
            check_id: checkId,
            check_name: check.name,
            results: results,
            availability_stats: stats,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('🔍 [Synthetic] Error getting results:', error);
        res.status(500).json({ success: false, error: 'Failed to get check results' });
    }
});
// Get overall synthetic monitoring status
router.get('/synthetic/status', function (req, res) {
    if (!syntheticMonitoring) {
        return res.status(503).json({ error: "Synthetic monitoring not available" });
    }
    try {
        var overallStatus = syntheticMonitoring.getOverallStatus();
        var checks = syntheticMonitoring.getAllChecks();
        // Get summary of each check
        var checkSummaries = checks.map(function (check) {
            var _a, _b;
            return ({
                id: check.id,
                name: check.name,
                endpoint: check.endpoint,
                enabled: check.enabled,
                last_check: check.last_check,
                last_success: (_a = check.last_result) === null || _a === void 0 ? void 0 : _a.success,
                response_time: (_b = check.last_result) === null || _b === void 0 ? void 0 : _b.response_time_ms,
                availability: syntheticMonitoring.getAvailabilityStats(check.id).uptime
            });
        });
        res.json({
            success: true,
            overall_status: overallStatus,
            checks: checkSummaries,
            summary: {
                total_checks: checks.length,
                enabled_checks: checks.filter(function (c) { return c.enabled; }).length,
                healthy_checks: checks.filter(function (c) { var _a; return (_a = c.last_result) === null || _a === void 0 ? void 0 : _a.success; }).length,
                average_response_time: checks
                    .filter(function (c) { var _a; return (_a = c.last_result) === null || _a === void 0 ? void 0 : _a.response_time_ms; })
                    .reduce(function (sum, c) { var _a; return sum + (((_a = c.last_result) === null || _a === void 0 ? void 0 : _a.response_time_ms) || 0); }, 0) /
                    Math.max(1, checks.filter(function (c) { var _a; return (_a = c.last_result) === null || _a === void 0 ? void 0 : _a.response_time_ms; }).length)
            },
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('🔍 [Synthetic] Error getting status:', error);
        res.status(500).json({ success: false, error: 'Failed to get synthetic monitoring status' });
    }
});
exports.default = router;

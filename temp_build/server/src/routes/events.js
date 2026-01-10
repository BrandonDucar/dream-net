"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var EventSystem_1 = require("../services/EventSystem");
var router = (0, express_1.Router)();
// Get events with filtering
router.get('/events', function (req, res) {
    try {
        var _a = req.query, type = _a.type, owner = _a.owner, limit = _a.limit, since = _a.since;
        var filter = {};
        if (type)
            filter.type = type;
        if (owner)
            filter.owner = owner;
        if (limit)
            filter.limit = parseInt(limit);
        if (since)
            filter.since = since;
        var events = EventSystem_1.eventSystem.getEvents(filter);
        res.json({
            success: true,
            events: events,
            count: events.length,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('📧 [Events] Error getting events:', error);
        res.status(500).json({ success: false, error: 'Failed to get events' });
    }
});
// Get event statistics
router.get('/events/stats', function (req, res) {
    try {
        var stats = EventSystem_1.eventSystem.getEventStats();
        res.json({
            success: true,
            stats: stats,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('📧 [Events] Error getting stats:', error);
        res.status(500).json({ success: false, error: 'Failed to get event stats' });
    }
});
// Emit deployment success event
router.post('/events/deploy/green', function (req, res) {
    try {
        var _a = req.body, deployment_id = _a.deployment_id, url = _a.url;
        if (!deployment_id || !url) {
            return res.status(400).json({
                success: false,
                error: 'deployment_id and url are required'
            });
        }
        EventSystem_1.eventSystem.emitDeployGreen(deployment_id, url);
        res.json({
            success: true,
            message: 'Deploy green event emitted',
            event: { deployment_id: deployment_id, url: url }
        });
    }
    catch (error) {
        console.error('📧 [Events] Error emitting deploy green:', error);
        res.status(500).json({ success: false, error: 'Failed to emit deploy green event' });
    }
});
// Emit deployment rollback event
router.post('/events/deploy/rollback', function (req, res) {
    try {
        var _a = req.body, deployment_id = _a.deployment_id, reason = _a.reason, rollback_version = _a.rollback_version;
        if (!deployment_id || !reason) {
            return res.status(400).json({
                success: false,
                error: 'deployment_id and reason are required'
            });
        }
        EventSystem_1.eventSystem.emitDeployFailedRollback(deployment_id, reason, rollback_version);
        res.json({
            success: true,
            message: 'Deploy rollback event emitted',
            event: { deployment_id: deployment_id, reason: reason, rollback_version: rollback_version }
        });
    }
    catch (error) {
        console.error('📧 [Events] Error emitting deploy rollback:', error);
        res.status(500).json({ success: false, error: 'Failed to emit deploy rollback event' });
    }
});
// Emit synthetic monitoring success
router.post('/events/synthetic/ok', function (req, res) {
    try {
        var _a = req.body, check_id = _a.check_id, endpoint = _a.endpoint, response_time_ms = _a.response_time_ms, status_code = _a.status_code;
        if (!check_id || !endpoint || !response_time_ms || !status_code) {
            return res.status(400).json({
                success: false,
                error: 'check_id, endpoint, response_time_ms, and status_code are required'
            });
        }
        EventSystem_1.eventSystem.emitSyntheticOk(check_id, endpoint, response_time_ms, status_code);
        res.json({
            success: true,
            message: 'Synthetic OK event emitted',
            event: { check_id: check_id, endpoint: endpoint, response_time_ms: response_time_ms, status_code: status_code }
        });
    }
    catch (error) {
        console.error('📧 [Events] Error emitting synthetic OK:', error);
        res.status(500).json({ success: false, error: 'Failed to emit synthetic OK event' });
    }
});
// Emit lead capture event
router.post('/events/lead/captured', function (req, res) {
    try {
        var _a = req.body, source = _a.source, lead_data = _a.lead_data, utm = _a.utm;
        if (!source || !lead_data) {
            return res.status(400).json({
                success: false,
                error: 'source and lead_data are required'
            });
        }
        EventSystem_1.eventSystem.emitLeadCaptured(source, lead_data, utm);
        res.json({
            success: true,
            message: 'Lead captured event emitted',
            event: { source: source, lead_data: lead_data, utm: utm }
        });
    }
    catch (error) {
        console.error('📧 [Events] Error emitting lead captured:', error);
        res.status(500).json({ success: false, error: 'Failed to emit lead captured event' });
    }
});
// Emit metals price tick
router.post('/events/metals/price-tick', function (req, res) {
    try {
        var _a = req.body, symbol = _a.symbol, price = _a.price, change = _a.change, change_percent = _a.change_percent;
        if (!symbol || price === undefined || change === undefined || change_percent === undefined) {
            return res.status(400).json({
                success: false,
                error: 'symbol, price, change, and change_percent are required'
            });
        }
        EventSystem_1.eventSystem.emitMetalsPriceTick(symbol, price, change, change_percent);
        res.json({
            success: true,
            message: 'Metals price tick event emitted',
            event: { symbol: symbol, price: price, change: change, change_percent: change_percent }
        });
    }
    catch (error) {
        console.error('📧 [Events] Error emitting metals price tick:', error);
        res.status(500).json({ success: false, error: 'Failed to emit metals price tick event' });
    }
});
// Emit metals alert
router.post('/events/metals/alert', function (req, res) {
    try {
        var _a = req.body, symbol = _a.symbol, rule = _a.rule, dir = _a.dir, price = _a.price, threshold = _a.threshold, user_id = _a.user_id;
        if (!symbol || !rule || !dir || price === undefined || threshold === undefined) {
            return res.status(400).json({
                success: false,
                error: 'symbol, rule, dir, price, and threshold are required'
            });
        }
        if (!['up', 'down'].includes(dir)) {
            return res.status(400).json({
                success: false,
                error: 'dir must be "up" or "down"'
            });
        }
        EventSystem_1.eventSystem.emitMetalsAlert(symbol, rule, dir, price, threshold, user_id);
        res.json({
            success: true,
            message: 'Metals alert event emitted',
            event: { symbol: symbol, rule: rule, dir: dir, price: price, threshold: threshold, user_id: user_id }
        });
    }
    catch (error) {
        console.error('📧 [Events] Error emitting metals alert:', error);
        res.status(500).json({ success: false, error: 'Failed to emit metals alert event' });
    }
});
// Emit OTT publish event
router.post('/events/ott/publish', function (req, res) {
    try {
        var _a = req.body, asset_id = _a.asset_id, channel = _a.channel, title = _a.title, duration_seconds = _a.duration_seconds, platforms = _a.platforms;
        if (!asset_id || !channel || !title || !duration_seconds || !Array.isArray(platforms)) {
            return res.status(400).json({
                success: false,
                error: 'asset_id, channel, title, duration_seconds, and platforms array are required'
            });
        }
        EventSystem_1.eventSystem.emitOTTPublish(asset_id, channel, title, duration_seconds, platforms);
        res.json({
            success: true,
            message: 'OTT publish event emitted',
            event: { asset_id: asset_id, channel: channel, title: title, duration_seconds: duration_seconds, platforms: platforms }
        });
    }
    catch (error) {
        console.error('📧 [Events] Error emitting OTT publish:', error);
        res.status(500).json({ success: false, error: 'Failed to emit OTT publish event' });
    }
});
// Emit operations paused event
router.post('/events/ops/paused', function (req, res) {
    try {
        var _a = req.body, reason = _a.reason, initiated_by = _a.initiated_by, affected_services = _a.affected_services, estimated_duration = _a.estimated_duration;
        if (!reason || !initiated_by || !Array.isArray(affected_services)) {
            return res.status(400).json({
                success: false,
                error: 'reason, initiated_by, and affected_services array are required'
            });
        }
        EventSystem_1.eventSystem.emitOpsPaused(reason, initiated_by, affected_services, estimated_duration);
        res.json({
            success: true,
            message: 'Operations paused event emitted',
            event: { reason: reason, initiated_by: initiated_by, affected_services: affected_services, estimated_duration: estimated_duration }
        });
    }
    catch (error) {
        console.error('📧 [Events] Error emitting ops paused:', error);
        res.status(500).json({ success: false, error: 'Failed to emit ops paused event' });
    }
});
// Emit operations resumed event
router.post('/events/ops/resumed', function (req, res) {
    try {
        var _a = req.body, initiated_by = _a.initiated_by, affected_services = _a.affected_services;
        if (!initiated_by || !Array.isArray(affected_services)) {
            return res.status(400).json({
                success: false,
                error: 'initiated_by and affected_services array are required'
            });
        }
        EventSystem_1.eventSystem.emitOpsResumed(initiated_by, affected_services);
        res.json({
            success: true,
            message: 'Operations resumed event emitted',
            event: { initiated_by: initiated_by, affected_services: affected_services }
        });
    }
    catch (error) {
        console.error('📧 [Events] Error emitting ops resumed:', error);
        res.status(500).json({ success: false, error: 'Failed to emit ops resumed event' });
    }
});
// Get events by business owner
router.get('/events/owner/:owner', function (req, res) {
    try {
        var owner = req.params.owner;
        var _a = req.query, limit = _a.limit, since = _a.since;
        if (!['Auric', 'Sentinel', 'Flux', 'DreamOps'].includes(owner)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid owner. Must be Auric, Sentinel, Flux, or DreamOps'
            });
        }
        var filter = { owner: owner };
        if (limit)
            filter.limit = parseInt(limit);
        if (since)
            filter.since = since;
        var events = EventSystem_1.eventSystem.getEvents(filter);
        res.json({
            success: true,
            owner: owner,
            events: events,
            count: events.length,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error("\uD83D\uDCE7 [Events] Error getting events for owner:", error);
        res.status(500).json({ success: false, error: 'Failed to get owner events' });
    }
});
// Clear all events (admin only)
router.delete('/events', function (req, res) {
    try {
        EventSystem_1.eventSystem.clearEvents();
        console.log('📧 [Events] All events cleared');
        res.json({
            success: true,
            message: 'All events cleared',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('📧 [Events] Error clearing events:', error);
        res.status(500).json({ success: false, error: 'Failed to clear events' });
    }
});
exports.default = router;

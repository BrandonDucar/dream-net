"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dreamkeeperCore_1 = require("../../lib/dreamkeeperCore");
var defenseBots_1 = require("../../lib/defenseBots");
var aiSurgeonAgents_1 = require("../../lib/aiSurgeonAgents");
var evolutionEngine_1 = require("../../lib/evolutionEngine");
var router = (0, express_1.Router)();
// Process incoming dream events
router.post('/dream-event', function (req, res) {
    var _a;
    try {
        var dreamEvent = req.body;
        console.log("\uD83D\uDCE5 Processing dream event: ".concat(dreamEvent.event, " from ").concat(dreamEvent.initiator));
        // Process through DREAMKEEPER Core
        dreamkeeperCore_1.DREAMKEEPER_CORE.processDreamEvent(dreamEvent);
        // Check for security threats
        defenseBots_1.DreamDefenseNet.analyzeDreamEvent(dreamEvent);
        // Schedule surgeon analysis if needed
        if ((_a = dreamEvent.metadata.emotions) === null || _a === void 0 ? void 0 : _a.includes('chaos')) {
            aiSurgeonAgents_1.SurgeonAgent.scheduleDreamAnalysis(dreamEvent);
        }
        // Trigger evolution analysis
        if (dreamEvent.event === 'dream_submitted') {
            evolutionEngine_1.EvolutionEngine.analyzeNewDream(dreamEvent);
        }
        res.json({
            status: 'processed',
            dreamId: "dream_".concat(Date.now()),
            systems_notified: ['dreamkeeper', 'defense', 'surgeon', 'evolution'],
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Error processing dream event:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to process dream event'
        });
    }
});
// Get recent dream events
router.get('/dream-events', function (req, res) {
    var recentEvents = dreamkeeperCore_1.DREAMKEEPER_CORE.getDreamEvents();
    res.json({
        events: recentEvents,
        count: recentEvents.length,
        last_updated: new Date().toISOString()
    });
});
exports.default = router;

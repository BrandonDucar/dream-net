"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
// import { dreamNetworkEngine } from '../services/DreamNetworkEngine.js'; // File not found - disabled
var router = (0, express_1.Router)();
// Placeholder dreamNetworkEngine until service is implemented
var dreamNetworkEngine = {
    getDreamState: function () { return ({ initialized: false, note: 'DreamNetworkEngine service not available' }); },
    getDreamSeeds: function () { return []; },
    getNightmareNetwork: function () { return ({ nodes: [], edges: [] }); },
};
// Dream state endpoints
router.get('/state', function (req, res) {
    try {
        var dreamState = dreamNetworkEngine.getDreamState();
        res.json({ success: true, state: dreamState });
    }
    catch (error) {
        console.error('Error fetching dream state:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch dream state' });
    }
});
router.get('/seeds', function (req, res) {
    try {
        var seeds = dreamNetworkEngine.getDreamSeeds();
        res.json({ success: true, seeds: seeds });
    }
    catch (error) {
        console.error('Error fetching dream seeds:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch dream seeds' });
    }
});
router.get('/nightmare-network', function (req, res) {
    try {
        var network = dreamNetworkEngine.getNightmareNetwork();
        res.json({ success: true, network: network });
    }
    catch (error) {
        console.error('Error fetching nightmare network:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch nightmare network' });
    }
});
router.get('/dimensions', function (req, res) {
    try {
        var dimensions = dreamNetworkEngine.getDreamDimensions();
        res.json({ success: true, dimensions: dimensions });
    }
    catch (error) {
        console.error('Error fetching dream dimensions:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch dream dimensions' });
    }
});
router.get('/archetypal-forces', function (req, res) {
    try {
        var forces = dreamNetworkEngine.getArchetypalForces();
        res.json({ success: true, forces: forces });
    }
    catch (error) {
        console.error('Error fetching archetypal forces:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch archetypal forces' });
    }
});
router.get('/status', function (req, res) {
    try {
        var status_1 = dreamNetworkEngine.getStatus();
        res.json({ success: true, status: status_1 });
    }
    catch (error) {
        console.error('Error fetching dream network status:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch dream network status' });
    }
});
// Dream control endpoints
router.post('/seed', function (req, res) {
    try {
        var seedData = req.body;
        var newSeed = dreamNetworkEngine.addDreamSeed(seedData);
        res.json({ success: true, seed: newSeed });
    }
    catch (error) {
        console.error('Error adding dream seed:', error);
        res.status(500).json({ success: false, error: 'Failed to add dream seed' });
    }
});
router.post('/phase', function (req, res) {
    try {
        var phase = req.body.phase;
        dreamNetworkEngine.setDreamPhase(phase);
        res.json({ success: true, message: "Dream phase set to ".concat(phase) });
    }
    catch (error) {
        console.error('Error setting dream phase:', error);
        res.status(500).json({ success: false, error: 'Failed to set dream phase' });
    }
});
// Creator Studio endpoints
var dreams = [];
router.post('/', function (req, res) {
    try {
        var _a = req.body, name_1 = _a.name, description = _a.description, tags = _a.tags, primaryPorts = _a.primaryPorts, creator = _a.creator;
        if (!name_1 || !description || !creator) {
            return res.status(400).json({ success: false, error: 'name, description, and creator are required' });
        }
        var dream = {
            id: "dream-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9)),
            name: name_1,
            description: description,
            tags: tags || [],
            primaryPorts: primaryPorts || [],
            creator: creator.toLowerCase(),
            createdAt: new Date().toISOString(),
        };
        dreams.push(dream);
        res.json({ success: true, dream: dream });
    }
    catch (error) {
        console.error('Error creating dream:', error);
        res.status(500).json({ success: false, error: 'Failed to create dream' });
    }
});
router.get('/created-by/:address', function (req, res) {
    try {
        var address = req.params.address;
        var normalizedAddress_1 = address.toLowerCase();
        var userDreams = dreams.filter(function (d) { return d.creator === normalizedAddress_1; });
        res.json({ success: true, dreams: userDreams });
    }
    catch (error) {
        console.error('Error fetching dreams:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch dreams' });
    }
});
exports.default = router;

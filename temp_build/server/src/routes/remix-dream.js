"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var shared_dream_storage_1 = require("./shared-dream-storage");
var router = express_1.default.Router();
// Your exact pattern implementation
router.post('/', function (req, res) {
    var _a = req.body, originalId = _a.originalId, wallet = _a.wallet;
    var original = (0, shared_dream_storage_1.loadDream)(originalId);
    if (!original || !wallet) {
        return res.status(400).json({ success: false, error: 'Missing data' });
    }
    var newId = "remix-".concat(Date.now());
    var remix = __assign(__assign({}, original), { id: newId, title: "".concat(original.title, " (Remix)"), lineage: {
            ancestors: [original.id]
        }, createdByAgent: 'LUCID', wallet: wallet, remix: true, createdAt: new Date().toISOString(), bountyId: original.bountyId || original.id, forkedFrom: original.id });
    (0, shared_dream_storage_1.saveDream)(newId, remix);
    return res.json({ success: true, newDreamId: newId });
});
// Additional endpoint to get available dreams for remixing
router.get('/available-dreams', function (req, res) {
    var dreams = (0, shared_dream_storage_1.getAllDreams)().map(function (dream) { return ({
        id: dream.id,
        title: dream.title,
        type: dream.type,
        createdByAgent: dream.createdByAgent
    }); });
    res.json({ dreams: dreams });
});
// Get specific dream details
router.get('/dream/:id', function (req, res) {
    var id = req.params.id;
    var dream = (0, shared_dream_storage_1.loadDream)(id);
    if (!dream) {
        return res.status(404).json({ success: false, error: 'Dream not found' });
    }
    res.json({ success: true, dream: dream });
});
// Your exact pattern for getting dream by ID
router.get('/:id', function (req, res) {
    var id = req.params.id;
    var dream = (0, shared_dream_storage_1.loadDream)(id);
    if (!dream)
        return res.status(404).json({ error: 'Dream not found' });
    res.json(dream);
});
exports.default = router;

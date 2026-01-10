"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = require("fs");
var path_1 = require("path");
var router = express_1.default.Router();
router.get('/:slug', function (req, res) {
    var slug = req.params.slug;
    try {
        // Try shared directory first
        var sharedPath = path_1.default.resolve(__dirname, "../data/shared/".concat(slug, ".json"));
        if (fs_1.default.existsSync(sharedPath)) {
            var content = fs_1.default.readFileSync(sharedPath, 'utf8');
            return res.json(JSON.parse(content));
        }
        // Try data directory
        var dataPath = path_1.default.resolve(__dirname, "../data/".concat(slug, ".json"));
        if (fs_1.default.existsSync(dataPath)) {
            var content = fs_1.default.readFileSync(dataPath, 'utf8');
            return res.json(JSON.parse(content));
        }
        return res.status(404).json({ error: 'Dream not found' });
    }
    catch (error) {
        console.error('Get dream error:', error);
        return res.status(500).json({ error: 'Failed to load dream' });
    }
});
exports.default = router;

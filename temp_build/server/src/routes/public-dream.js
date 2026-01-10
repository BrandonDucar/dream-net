"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = require("fs");
var path_1 = require("path");
var router = express_1.default.Router();
router.get('/:slug', function (req, res) {
    var slug = req.params.slug;
    var filePath = path_1.default.resolve(__dirname, "../data/shared/".concat(slug, ".json"));
    if (!fs_1.default.existsSync(filePath)) {
        return res.status(404).json({ message: 'Dream not found.' });
    }
    var content = fs_1.default.readFileSync(filePath, 'utf-8');
    var dreamCore = JSON.parse(content);
    // Increment view count
    dreamCore.views = (dreamCore.views || 0) + 1;
    fs_1.default.writeFileSync(filePath, JSON.stringify(dreamCore, null, 2));
    return res.json(dreamCore);
});
exports.default = router;

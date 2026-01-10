"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = require("fs");
var path_1 = require("path");
var router = express_1.default.Router();
router.get('/', function (req, res) {
    var dir = path_1.default.resolve(__dirname, '../data');
    var fusions = [];
    for (var _i = 0, _a = fs_1.default.readdirSync(dir); _i < _a.length; _i++) {
        var file = _a[_i];
        if (!file.endsWith('.json'))
            continue;
        var content = fs_1.default.readFileSync(path_1.default.join(dir, file), 'utf-8');
        try {
            var parsed = JSON.parse(content);
            if (parsed.evolution === 'Fusion')
                fusions.push(parsed);
        }
        catch (_b) { }
    }
    res.json(fusions);
});
exports.default = router;

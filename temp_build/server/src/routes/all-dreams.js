"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = require("fs");
var path_1 = require("path");
var router = express_1.default.Router();
router.get('/', function (req, res) {
    var dir = path_1.default.resolve(__dirname, '../data');
    var files = fs_1.default.readdirSync(dir);
    var dreams = [];
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        if (!file.endsWith('.json'))
            continue;
        var content = fs_1.default.readFileSync(path_1.default.join(dir, file), 'utf-8');
        try {
            var parsed = JSON.parse(content);
            if (parsed.id)
                dreams.push(parsed);
        }
        catch (_a) { }
    }
    res.json(dreams);
});
exports.default = router;

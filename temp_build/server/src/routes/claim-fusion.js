"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = require("fs");
var path_1 = require("path");
var router = express_1.default.Router();
router.post('/', function (req, res) {
    var _a = req.body, id = _a.id, wallet = _a.wallet;
    var dir = path_1.default.resolve(__dirname, '../data');
    var files = fs_1.default.readdirSync(dir);
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var filePath = path_1.default.join(dir, file);
        var content = fs_1.default.readFileSync(filePath, 'utf-8');
        try {
            var parsed = JSON.parse(content);
            if (parsed.id === id) {
                parsed.claimed = true;
                parsed.owner = wallet;
                fs_1.default.writeFileSync(filePath, JSON.stringify(parsed, null, 2));
                return res.json({ status: 'success', message: 'Fusion claimed and saved!' });
            }
        }
        catch (_b) { }
    }
    res.status(404).json({ status: 'error', message: 'Dream not found' });
});
exports.default = router;

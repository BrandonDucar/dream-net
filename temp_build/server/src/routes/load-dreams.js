"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = require("fs");
var path_1 = require("path");
var router = express_1.default.Router();
router.get('/:wallet', function (req, res) {
    var wallet = req.params.wallet;
    if (!wallet) {
        return res.status(400).json({ error: 'Wallet address required' });
    }
    try {
        var dataDir_1 = path_1.default.resolve(__dirname, '../data');
        if (!fs_1.default.existsSync(dataDir_1)) {
            return res.json({ dreams: [] });
        }
        var files = fs_1.default.readdirSync(dataDir_1);
        var walletFiles = files.filter(function (f) { return f.startsWith("".concat(wallet, "-")) && f.endsWith('.json'); });
        var dreams = walletFiles.map(function (filename) {
            var filepath = path_1.default.join(dataDir_1, filename);
            var content = fs_1.default.readFileSync(filepath, 'utf8');
            return JSON.parse(content);
        });
        return res.json({ dreams: dreams });
    }
    catch (error) {
        console.error('Load dreams error:', error);
        return res.status(500).json({ error: 'Failed to load dreams' });
    }
});
exports.default = router;

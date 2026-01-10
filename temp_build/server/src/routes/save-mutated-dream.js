"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = require("fs");
var path_1 = require("path");
var router = express_1.default.Router();
router.post('/', function (req, res) {
    var _a = req.body, dream = _a.dream, wallet = _a.wallet;
    if (!dream || !wallet) {
        return res.status(400).json({ status: 'error', message: 'Missing dream or wallet.' });
    }
    var filePath = path_1.default.resolve(__dirname, "../data/".concat(wallet, "-dream.json"));
    fs_1.default.writeFileSync(filePath, JSON.stringify(dream, null, 2));
    return res.json({ status: 'success' });
});
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = require("fs");
var path_1 = require("path");
var router = express_1.default.Router();
router.get('/', function (req, res) {
    var walletAddress = req.query.walletAddress;
    if (!walletAddress) {
        return res.status(400).json({ message: 'Missing walletAddress' });
    }
    var filePath = path_1.default.resolve(__dirname, "../data/".concat(walletAddress, "-dream.json"));
    if (!fs_1.default.existsSync(filePath)) {
        return res.json({ status: 'error', message: 'No saved dream found for that wallet.' });
    }
    var content = fs_1.default.readFileSync(filePath, 'utf-8');
    var dreamCore = JSON.parse(content);
    return res.json({ status: 'success', dreamCore: dreamCore });
});
exports.default = router;

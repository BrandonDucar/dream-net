"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var LUCID_1 = require("../agents/LUCID");
var router = express_1.default.Router();
router.post('/', function (req, res) {
    var input = req.body;
    try {
        var result = (0, LUCID_1.lucidV1)(input);
        return res.json({
            status: "success",
            routedTo: result.nextAgent,
            instructions: result.instructions,
            fallbackOptions: result.fallbackOptions
        });
    }
    catch (err) {
        console.error("🧠 LUCID error:", err);
        return res.status(500).json({ error: 'LUCID routing failed.' });
    }
});
exports.default = router;

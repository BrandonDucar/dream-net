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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var crypto_1 = require("crypto");
var router = express_1.default.Router();
router.post('/', function (req, res) {
    var _a;
    var originalDream = req.body.originalDream;
    if (!originalDream) {
        return res.status(400).json({ message: 'Missing dream' });
    }
    var mutated = __assign(__assign({}, originalDream), { id: crypto_1.default.randomUUID(), tags: __spreadArray(__spreadArray([], originalDream.tags, true), ['remixed'], false), score: Math.min(100, (originalDream.score || 60) + 5), trustLevel: 'Pending', evolution: 'Seed', mutatedAt: new Date().toISOString(), lineage: {
            parent: originalDream.id || null,
            ancestors: __spreadArray(__spreadArray([], (((_a = originalDream.lineage) === null || _a === void 0 ? void 0 : _a.ancestors) || []), true), [originalDream.id || 'root'], false)
        } });
    return res.json({ status: 'success', mutatedDream: mutated });
});
exports.default = router;

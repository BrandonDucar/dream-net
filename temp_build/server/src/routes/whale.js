"use strict";
/**
 * Whale Pack API Routes
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var metrics_1 = require("../whale/metrics");
var manifest_1 = require("../whale/manifest");
var actions_1 = require("../whale/actions");
var router = (0, express_1.Router)();
/**
 * GET /api/whale/metrics
 * Returns aggregated metrics from all mini-apps
 */
router.get('/metrics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var metrics, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, metrics_1.getAllMetrics)()];
            case 1:
                metrics = _a.sent();
                res.json(metrics);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.error('Failed to get whale metrics:', err_1);
                res.status(500).json({ message: 'Failed to get metrics', error: err_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/whale/manifest
 * Returns the Whale Pack manifest
 */
router.get('/manifest', function (req, res) {
    res.json(manifest_1.WHALE_MANIFEST);
});
/**
 * POST /api/whale/actions
 * Execute a Whale Pack action
 */
router.post('/actions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, appId, action, payload, result, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, appId = _a.appId, action = _a.action, payload = _a.payload;
                if (!appId || !action) {
                    return [2 /*return*/, res.status(400).json({ message: 'appId and action are required' })];
                }
                return [4 /*yield*/, (0, actions_1.processWhaleAction)(appId, action, payload || {})];
            case 1:
                result = _b.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                console.error('Failed to process whale action:', err_2);
                res.status(500).json({ message: 'Failed to process action', error: err_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;

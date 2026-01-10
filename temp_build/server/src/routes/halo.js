"use strict";
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
exports.createHaloRouter = createHaloRouter;
var express_1 = require("express");
var halo_loop_1 = require("../../packages/halo-loop");
var metrics_engine_1 = require("../../packages/metrics-engine");
function createHaloRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    router.get("/halo/status", function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
        var status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, halo_loop_1.haloEngine.getStatus()];
                case 1:
                    status = _a.sent();
                    res.json({ ok: true, status: status });
                    return [2 /*return*/];
            }
        });
    }); });
    router.post("/halo/run", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, mode, reason, trigger, startTime, result;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = req.body, mode = _a.mode, reason = _a.reason;
                    trigger = reason ? "api:".concat(reason) : "api";
                    startTime = Date.now();
                    return [4 /*yield*/, halo_loop_1.haloEngine.runCycle(trigger, { reason: reason, mode: mode }, mode !== null && mode !== void 0 ? mode : "full")];
                case 1:
                    result = _c.sent();
                    // Record HALO cycle in metrics
                    return [4 /*yield*/, (0, metrics_engine_1.recordHaloCycle)({
                            success: (_b = result.success) !== null && _b !== void 0 ? _b : true,
                            timestamp: new Date().toISOString(),
                        })];
                case 2:
                    // Record HALO cycle in metrics
                    _c.sent();
                    res.json({ ok: true, cycle: result });
                    return [2 /*return*/];
            }
        });
    }); });
    router.get("/halo/history", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var limit, history;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    limit = parseInt(String((_a = req.query.limit) !== null && _a !== void 0 ? _a : "20"), 10) || 20;
                    return [4 /*yield*/, halo_loop_1.haloEngine.getHistory(limit)];
                case 1:
                    history = _b.sent();
                    res.json({ ok: true, history: history });
                    return [2 /*return*/];
            }
        });
    }); });
    router.get("/halo/weakpoints", function (_req, res) {
        res.json({ ok: true, weakPoints: halo_loop_1.haloEngine.getWeakPoints() });
    });
    return router;
}

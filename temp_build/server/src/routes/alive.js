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
exports.createAliveRouter = createAliveRouter;
var express_1 = require("express");
var alive_mode_1 = require("../../packages/alive-mode");
var metrics_engine_1 = require("../../packages/metrics-engine");
var booting = false;
function createAliveRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    router.get("/status", function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
        var startTime, status, latencyMs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    return [4 /*yield*/, (0, alive_mode_1.getStatus)()];
                case 1:
                    status = _a.sent();
                    latencyMs = Date.now() - startTime;
                    // Record heartbeat latency
                    return [4 /*yield*/, (0, metrics_engine_1.recordHeartbeat)(latencyMs).catch(function (err) {
                            console.error("Failed to record heartbeat:", err);
                        })];
                case 2:
                    // Record heartbeat latency
                    _a.sent();
                    res.json({ ok: true, status: status });
                    return [2 /*return*/];
            }
        });
    }); });
    router.get("/ping", function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
        var startTime, latencyMs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    latencyMs = Date.now() - startTime;
                    // Record heartbeat latency
                    return [4 /*yield*/, (0, metrics_engine_1.recordHeartbeat)(latencyMs).catch(function (err) {
                            console.error("Failed to record heartbeat:", err);
                        })];
                case 1:
                    // Record heartbeat latency
                    _a.sent();
                    res.json({ ok: true, timestamp: new Date().toISOString() });
                    return [2 /*return*/];
            }
        });
    }); });
    router.post("/boot", function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
        var status_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (booting) {
                        res.status(202).json({ ok: false, error: "Boot sequence already running" });
                        return [2 /*return*/];
                    }
                    booting = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, alive_mode_1.runBootSequence)()];
                case 2:
                    status_1 = _a.sent();
                    res.json({ ok: true, status: status_1 });
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    res.status(500).json({ ok: false, error: error_1.message });
                    return [3 /*break*/, 5];
                case 4:
                    booting = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    return router;
}

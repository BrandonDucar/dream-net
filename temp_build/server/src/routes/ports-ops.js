"use strict";
/**
 * Ports Ops Panel
 * Exposes port health + Env/API/Vercel ops for DreamScope/Civic Panel
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
var siwe_auth_1 = require("../siwe-auth");
var ports_1 = require("../../packages/port-governor/src/ports");
var bus_1 = require("../../packages/nerve/src/bus");
var envClassifier_1 = require("../../packages/env-keeper-core/logic/envClassifier");
var summary_1 = require("../../packages/api-keeper-core/summary");
var summary_2 = require("../../packages/dreamnet-vercel-agent/summary");
var router = (0, express_1.Router)();
/**
 * GET /api/ports/ops
 * Get Ports Ops Panel summary (admin-only)
 * Shows port definitions, Env Keeper, API Keeper, Vercel Agent, and Nerve Fabric stats
 */
router.get("/ports/ops", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, traceId, ports, secretDescriptors, internalDescriptors, publicDescriptors, envSummary, apiKeeper, vercelAgent, nerveStats, error_1, _a, _b, error_2;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 6, , 7]);
                r = req;
                traceId = r.traceId || "unknown";
                ports = Object.values(ports_1.PORT_PROFILES).map(function (p) {
                    var _a, _b;
                    return ({
                        id: p.id,
                        name: p.name,
                        label: p.name,
                        description: p.description,
                        direction: p.direction,
                        allowedTiers: p.allowedTiers,
                        requiredOfficeIds: (_a = p.requiredOfficeIds) !== null && _a !== void 0 ? _a : [],
                        requiredCabinetIds: (_b = p.requiredCabinetIds) !== null && _b !== void 0 ? _b : [],
                        priorityLane: p.priorityLane,
                        limits: p.limits,
                        defaultSampleRate: p.defaultSampleRate,
                        clusterId: p.clusterId,
                    });
                });
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 5]);
                secretDescriptors = (0, envClassifier_1.getDescriptorsBySensitivity)("secret");
                internalDescriptors = (0, envClassifier_1.getDescriptorsBySensitivity)("internal");
                publicDescriptors = (0, envClassifier_1.getDescriptorsBySensitivity)("public");
                envSummary = {
                    total: secretDescriptors.length + internalDescriptors.length + publicDescriptors.length,
                    secretCount: secretDescriptors.length,
                    internalCount: internalDescriptors.length,
                    publicCount: publicDescriptors.length,
                };
                apiKeeper = (0, summary_1.getApiKeeperSummary)();
                return [4 /*yield*/, (0, summary_2.getVercelAgentSummary)()];
            case 2:
                vercelAgent = _d.sent();
                nerveStats = bus_1.NERVE_BUS.getStats();
                return [2 /*return*/, res.json({
                        success: true,
                        traceId: traceId,
                        ports: ports,
                        envKeeper: envSummary,
                        apiKeeper: apiKeeper,
                        vercelAgent: vercelAgent,
                        nerveStats: nerveStats,
                        timestamp: new Date().toISOString(),
                    })];
            case 3:
                error_1 = _d.sent();
                _b = (_a = res).json;
                _c = {
                    success: true,
                    traceId: traceId,
                    ports: ports,
                    envKeeper: {
                        total: 0,
                        secretCount: 0,
                        internalCount: 0,
                        publicCount: 0,
                        error: "Env Keeper not initialized",
                    },
                    apiKeeper: (0, summary_1.getApiKeeperSummary)()
                };
                return [4 /*yield*/, (0, summary_2.getVercelAgentSummary)()];
            case 4: 
            // If Env Keeper not initialized, return partial data
            return [2 /*return*/, _b.apply(_a, [(_c.vercelAgent = _d.sent(),
                        _c.nerveStats = bus_1.NERVE_BUS.getStats(),
                        _c.timestamp = new Date().toISOString(),
                        _c)])];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_2 = _d.sent();
                res.status(500).json({
                    error: "PORTS_OPS_ERROR",
                    message: error_2.message,
                    traceId: req.traceId || "unknown",
                });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.default = router;

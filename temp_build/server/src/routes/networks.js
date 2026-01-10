"use strict";
/**
 * Networks API
 * Exposes network blueprint information and bootstrap status
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
var index_1 = require("../../packages/network-blueprints/src/index");
var withPort_1 = require("../../packages/port-governor/src/withPort");
var controlCoreMiddleware_1 = require("../../packages/dreamnet-control-core/controlCoreMiddleware");
var router = (0, express_1.Router)();
/**
 * GET /api/networks/blueprints
 * List all registered network blueprints
 */
router.get("/networks/blueprints", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "CIVIC_PANEL_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, traceId, blueprints;
    return __generator(this, function (_a) {
        try {
            r = req;
            traceId = r.traceId || "unknown";
            blueprints = (0, index_1.listBlueprints)();
            return [2 /*return*/, res.json({
                    success: true,
                    traceId: traceId,
                    count: blueprints.length,
                    blueprints: blueprints.map(function (bp) { return ({
                        id: bp.id,
                        label: bp.label,
                        slug: bp.slug,
                        primaryDomain: bp.primaryDomain,
                        description: bp.description,
                        version: bp.version,
                    }); }),
                })];
        }
        catch (error) {
            res.status(500).json({
                error: "NETWORKS_ERROR",
                message: error.message,
                traceId: req.traceId || "unknown",
            });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/networks/active
 * Get the currently active network blueprint
 */
router.get("/networks/active", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "CIVIC_PANEL_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, traceId, blueprints, active;
    var _a;
    return __generator(this, function (_b) {
        try {
            r = req;
            traceId = r.traceId || "unknown";
            blueprints = (0, index_1.listBlueprints)();
            active = (_a = blueprints.find(function (bp) { return bp.id === "DREAMNET_CORE"; })) !== null && _a !== void 0 ? _a : blueprints[0];
            return [2 /*return*/, res.json({
                    success: true,
                    traceId: traceId,
                    active: active
                        ? {
                            id: active.id,
                            label: active.label,
                            slug: active.slug,
                            primaryDomain: active.primaryDomain,
                            description: active.description,
                            version: active.version,
                        }
                        : null,
                })];
        }
        catch (error) {
            res.status(500).json({
                error: "NETWORKS_ERROR",
                message: error.message,
                traceId: req.traceId || "unknown",
            });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/networks/blueprint/:id
 * Get a specific blueprint by ID
 */
router.get("/networks/blueprint/:id", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "CIVIC_PANEL_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, traceId, blueprintId, blueprint;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        try {
            r = req;
            traceId = r.traceId || "unknown";
            blueprintId = req.params.id;
            blueprint = (0, index_1.getBlueprint)(blueprintId);
            if (!blueprint) {
                return [2 /*return*/, res.status(404).json({
                        error: "BLUEPRINT_NOT_FOUND",
                        traceId: traceId,
                        blueprintId: blueprintId,
                    })];
            }
            return [2 /*return*/, res.json({
                    success: true,
                    traceId: traceId,
                    blueprint: {
                        id: blueprint.id,
                        label: blueprint.label,
                        slug: blueprint.slug,
                        primaryDomain: blueprint.primaryDomain,
                        description: blueprint.description,
                        version: blueprint.version,
                        citizens: ((_a = blueprint.citizens) === null || _a === void 0 ? void 0 : _a.length) || 0,
                        agents: ((_b = blueprint.agents) === null || _b === void 0 ? void 0 : _b.length) || 0,
                        dreams: ((_c = blueprint.dreams) === null || _c === void 0 ? void 0 : _c.length) || 0,
                        ports: ((_d = blueprint.ports) === null || _d === void 0 ? void 0 : _d.length) || 0,
                        conduits: ((_e = blueprint.conduits) === null || _e === void 0 ? void 0 : _e.length) || 0,
                    },
                })];
        }
        catch (error) {
            res.status(500).json({
                error: "NETWORKS_ERROR",
                message: error.message,
                traceId: req.traceId || "unknown",
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;

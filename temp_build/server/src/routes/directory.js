"use strict";
/**
 * Directory API
 * Exposes lookup and listing APIs for DreamNet entities
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
var registry_1 = require("../../packages/directory/src/registry");
var withPort_1 = require("../../packages/port-governor/src/withPort");
var controlCoreMiddleware_1 = require("../../packages/dreamnet-control-core/controlCoreMiddleware");
var router = (0, express_1.Router)();
/**
 * GET /api/directory/entity/:id
 * Get a specific directory entry by ID
 */
router.get("/directory/entity/:id", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "CIVIC_PANEL_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, id, entry;
    return __generator(this, function (_a) {
        try {
            r = req;
            id = req.params.id;
            entry = (0, registry_1.getEntry)(id);
            if (!entry) {
                return [2 /*return*/, res.status(404).json({
                        traceId: r.traceId,
                        error: "NOT_FOUND",
                        id: id,
                    })];
            }
            return [2 /*return*/, res.json({
                    success: true,
                    traceId: r.traceId,
                    entry: entry,
                })];
        }
        catch (error) {
            res.status(500).json({
                error: "DIRECTORY_ERROR",
                message: error.message,
                traceId: req.traceId || "unknown",
            });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/directory/citizens
 * List all citizens
 */
router.get("/directory/citizens", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "CIVIC_PANEL_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, entries;
    return __generator(this, function (_a) {
        try {
            r = req;
            entries = (0, registry_1.listEntriesByType)("citizen");
            return [2 /*return*/, res.json({
                    success: true,
                    traceId: r.traceId,
                    count: entries.length,
                    citizens: entries,
                })];
        }
        catch (error) {
            res.status(500).json({
                error: "DIRECTORY_ERROR",
                message: error.message,
                traceId: req.traceId || "unknown",
            });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/directory/agents
 * List all agents
 */
router.get("/directory/agents", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "CIVIC_PANEL_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, entries;
    return __generator(this, function (_a) {
        try {
            r = req;
            entries = (0, registry_1.listEntriesByType)("agent");
            return [2 /*return*/, res.json({
                    success: true,
                    traceId: r.traceId,
                    count: entries.length,
                    agents: entries,
                })];
        }
        catch (error) {
            res.status(500).json({
                error: "DIRECTORY_ERROR",
                message: error.message,
                traceId: req.traceId || "unknown",
            });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/directory/dreams
 * List all dreams
 */
router.get("/directory/dreams", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "CIVIC_PANEL_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, entries;
    return __generator(this, function (_a) {
        try {
            r = req;
            entries = (0, registry_1.listEntriesByType)("dream");
            return [2 /*return*/, res.json({
                    success: true,
                    traceId: r.traceId,
                    count: entries.length,
                    dreams: entries,
                })];
        }
        catch (error) {
            res.status(500).json({
                error: "DIRECTORY_ERROR",
                message: error.message,
                traceId: req.traceId || "unknown",
            });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/directory/nodes
 * List all nodes
 */
router.get("/directory/nodes", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "CIVIC_PANEL_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, entries;
    return __generator(this, function (_a) {
        try {
            r = req;
            entries = (0, registry_1.listEntriesByType)("node");
            return [2 /*return*/, res.json({
                    success: true,
                    traceId: r.traceId,
                    count: entries.length,
                    nodes: entries,
                })];
        }
        catch (error) {
            res.status(500).json({
                error: "DIRECTORY_ERROR",
                message: error.message,
                traceId: req.traceId || "unknown",
            });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/directory/ports
 * List all ports
 */
router.get("/directory/ports", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "CIVIC_PANEL_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, entries;
    return __generator(this, function (_a) {
        try {
            r = req;
            entries = (0, registry_1.listEntriesByType)("port");
            return [2 /*return*/, res.json({
                    success: true,
                    traceId: r.traceId,
                    count: entries.length,
                    ports: entries,
                })];
        }
        catch (error) {
            res.status(500).json({
                error: "DIRECTORY_ERROR",
                message: error.message,
                traceId: req.traceId || "unknown",
            });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/directory/conduits
 * List all conduits
 */
router.get("/directory/conduits", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "CIVIC_PANEL_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, entries;
    return __generator(this, function (_a) {
        try {
            r = req;
            entries = (0, registry_1.listEntriesByType)("conduit");
            return [2 /*return*/, res.json({
                    success: true,
                    traceId: r.traceId,
                    count: entries.length,
                    conduits: entries,
                })];
        }
        catch (error) {
            res.status(500).json({
                error: "DIRECTORY_ERROR",
                message: error.message,
                traceId: req.traceId || "unknown",
            });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/directory/search
 * Search all directory entries by query string
 */
router.get("/directory/search", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "CIVIC_PANEL_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, query, entries;
    return __generator(this, function (_a) {
        try {
            r = req;
            query = req.query.q;
            if (!query) {
                return [2 /*return*/, res.status(400).json({
                        error: "QUERY_REQUIRED",
                        message: "Query parameter 'q' is required",
                        traceId: r.traceId,
                    })];
            }
            entries = (0, registry_1.searchEntries)(query);
            return [2 /*return*/, res.json({
                    success: true,
                    traceId: r.traceId,
                    query: query,
                    count: entries.length,
                    results: entries,
                })];
        }
        catch (error) {
            res.status(500).json({
                error: "DIRECTORY_ERROR",
                message: error.message,
                traceId: req.traceId || "unknown",
            });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/directory/all
 * List all directory entries
 */
router.get("/directory/all", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "CIVIC_PANEL_CORE", requiredOfficeIds: ["FOUNDER"] }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, entries;
    return __generator(this, function (_a) {
        try {
            r = req;
            entries = (0, registry_1.listAllEntries)();
            return [2 /*return*/, res.json({
                    success: true,
                    traceId: r.traceId,
                    count: entries.length,
                    entries: entries,
                })];
        }
        catch (error) {
            res.status(500).json({
                error: "DIRECTORY_ERROR",
                message: error.message,
                traceId: req.traceId || "unknown",
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;

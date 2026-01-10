"use strict";
/**
 * Discovery API
 * Exposes network discovery and mapping endpoints
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
var registry_1 = require("../../packages/directory/src/registry");
var withPort_1 = require("../../packages/port-governor/src/withPort");
var controlCoreMiddleware_1 = require("../../packages/dreamnet-control-core/controlCoreMiddleware");
var router = (0, express_1.Router)();
/**
 * GET /api/discovery/map
 * Get a discovery map of all entities (nodes + edges)
 */
router.get("/discovery/map", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "CIVIC_PANEL_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, traceId, nodes, ports, conduits, citizens, agents, dreams, edges, allNodes;
    return __generator(this, function (_a) {
        try {
            r = req;
            traceId = r.traceId || "unknown";
            nodes = (0, registry_1.listEntriesByType)("node");
            ports = (0, registry_1.listEntriesByType)("port");
            conduits = (0, registry_1.listEntriesByType)("conduit");
            citizens = (0, registry_1.listEntriesByType)("citizen");
            agents = (0, registry_1.listEntriesByType)("agent");
            dreams = (0, registry_1.listEntriesByType)("dream");
            edges = conduits.map(function (conduit) { return ({
                id: "edge-".concat(conduit.conduitId),
                source: conduit.portId,
                target: conduit.clusterId,
                type: "conduit",
                label: conduit.label,
                metadata: {
                    toolId: conduit.toolId,
                    conduitId: conduit.conduitId,
                },
            }); });
            allNodes = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], nodes.map(function (n) { return ({
                id: n.nodeId,
                type: "node",
                label: n.label,
                clusterId: n.clusterId,
            }); }), true), ports.map(function (p) { return ({
                id: p.portId,
                type: "port",
                label: p.label,
            }); }), true), citizens.map(function (c) { return ({
                id: c.citizenId,
                type: "citizen",
                label: c.label,
            }); }), true), agents.map(function (a) { return ({
                id: a.agentId,
                type: "agent",
                label: a.label,
                clusterId: a.clusterId,
            }); }), true), dreams.map(function (d) { return ({
                id: d.dreamId,
                type: "dream",
                label: d.label,
                status: d.status,
            }); }), true);
            return [2 /*return*/, res.json({
                    success: true,
                    traceId: traceId,
                    nodes: allNodes,
                    edges: edges,
                    stats: {
                        nodes: nodes.length,
                        ports: ports.length,
                        conduits: conduits.length,
                        citizens: citizens.length,
                        agents: agents.length,
                        dreams: dreams.length,
                        totalEntities: allNodes.length,
                        totalEdges: edges.length,
                    },
                })];
        }
        catch (error) {
            res.status(500).json({
                error: "DISCOVERY_ERROR",
                message: error.message,
                traceId: req.traceId || "unknown",
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;

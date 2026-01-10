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
var express_1 = require("express");
var NodeRegistry_1 = require("../../dreamnodes/registry/NodeRegistry");
var router = (0, express_1.Router)();
// GET /api/nodes - List all public nodes
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var publicNodes;
    return __generator(this, function (_a) {
        try {
            publicNodes = NodeRegistry_1.nodeRegistry.listPublicNodes();
            res.json({
                success: true,
                nodes: publicNodes,
                totalCount: publicNodes.length
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to fetch nodes',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/nodes/:nodeId - Get specific node details
router.get('/:nodeId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nodeId, node, usageStats;
    return __generator(this, function (_a) {
        try {
            nodeId = req.params.nodeId;
            node = NodeRegistry_1.nodeRegistry.getNode(nodeId);
            if (!node) {
                return [2 /*return*/, res.status(404).json({
                        error: 'Node not found',
                        nodeId: nodeId
                    })];
            }
            usageStats = NodeRegistry_1.nodeRegistry.getUsageStats(nodeId);
            res.json({
                success: true,
                node: node,
                usageStats: usageStats
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to fetch node details',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/nodes/:nodeId/capabilities - Check node capabilities
router.get('/:nodeId/capabilities', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nodeId, node;
    return __generator(this, function (_a) {
        try {
            nodeId = req.params.nodeId;
            node = NodeRegistry_1.nodeRegistry.getNode(nodeId);
            if (!node) {
                return [2 /*return*/, res.status(404).json({
                        error: 'Node not found',
                        nodeId: nodeId
                    })];
            }
            res.json({
                success: true,
                nodeId: nodeId,
                capabilities: {
                    inboxEnabled: NodeRegistry_1.nodeRegistry.isInboxEnabled(nodeId),
                    mintEnabled: NodeRegistry_1.nodeRegistry.isMintEnabled(nodeId),
                    isolated: NodeRegistry_1.nodeRegistry.isIsolated(nodeId),
                    trustBoundary: NodeRegistry_1.nodeRegistry.getTrustBoundary(nodeId),
                    agentVisibility: NodeRegistry_1.nodeRegistry.getAgentVisibility(nodeId),
                    allowedAccess: node.allowedAccess
                }
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to fetch node capabilities',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/nodes/creator/:creatorWallet - List nodes by creator
router.get('/creator/:creatorWallet', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var creatorWallet, nodes;
    return __generator(this, function (_a) {
        try {
            creatorWallet = req.params.creatorWallet;
            nodes = NodeRegistry_1.nodeRegistry.listNodesByCreator(creatorWallet);
            res.json({
                success: true,
                creator: creatorWallet,
                nodes: nodes,
                totalCount: nodes.length
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to fetch nodes by creator',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        return [2 /*return*/];
    });
}); });
// POST /api/nodes - Register a new node (future feature)
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            // This would be for user-created nodes in the future
            res.status(501).json({
                error: 'Node registration not yet implemented',
                message: 'Currently only system nodes are supported'
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to register node',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/nodes/stats/global - Global usage statistics
router.get('/stats/global', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allStats, totalRequests, totalSuccess, totalFailures;
    return __generator(this, function (_a) {
        try {
            allStats = NodeRegistry_1.nodeRegistry.getAllUsageStats();
            totalRequests = allStats.reduce(function (sum, stat) { return sum + stat.totalRequests; }, 0);
            totalSuccess = allStats.reduce(function (sum, stat) { return sum + stat.successfulRequests; }, 0);
            totalFailures = allStats.reduce(function (sum, stat) { return sum + stat.failedRequests; }, 0);
            res.json({
                success: true,
                globalStats: {
                    totalNodes: NodeRegistry_1.nodeRegistry.nodes.size,
                    publicNodes: NodeRegistry_1.nodeRegistry.listPublicNodes().length,
                    totalRequests: totalRequests,
                    successRate: totalRequests > 0 ? (totalSuccess / totalRequests) * 100 : 0,
                    totalFailures: totalFailures
                },
                nodeStats: allStats
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to fetch global statistics',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;

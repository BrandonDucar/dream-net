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
exports.integrationRouter = void 0;
var express_1 = require("express");
var IntegrationMappingService_1 = require("../services/IntegrationMappingService");
var zod_1 = require("zod");
var router = (0, express_1.Router)();
exports.integrationRouter = router;
// Initialize integration mapping system
router.post('/initialize', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('🗺️ [INTEGRATION API] Initializing system mapping...');
                return [4 /*yield*/, IntegrationMappingService_1.integrationMappingService.initializeSystemMapping()];
            case 1:
                _a.sent();
                res.json({
                    success: true,
                    message: 'Integration mapping system initialized successfully',
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('❌ [INTEGRATION API] Initialization failed:', error_1);
                res.status(500).json({
                    success: false,
                    error: 'Failed to initialize integration mapping system',
                    details: error_1 instanceof Error ? error_1.message : 'Unknown error'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get complete system map
router.get('/map', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var systemMap, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('🗺️ [INTEGRATION API] Fetching system map...');
                return [4 /*yield*/, IntegrationMappingService_1.integrationMappingService.getSystemMap()];
            case 1:
                systemMap = _a.sent();
                res.json({
                    success: true,
                    data: systemMap,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('❌ [INTEGRATION API] Failed to fetch system map:', error_2);
                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch system map',
                    details: error_2 instanceof Error ? error_2.message : 'Unknown error'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get system health overview
router.get('/health', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var health, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('🔍 [INTEGRATION API] Fetching system health...');
                return [4 /*yield*/, IntegrationMappingService_1.integrationMappingService.getSystemHealth()];
            case 1:
                health = _a.sent();
                res.json({
                    success: true,
                    data: health,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('❌ [INTEGRATION API] Failed to fetch system health:', error_3);
                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch system health',
                    details: error_3 instanceof Error ? error_3.message : 'Unknown error'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Search nodes
router.get('/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, nodes, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = zod_1.z.string().min(1).parse(req.query.q);
                console.log("\uD83D\uDD0D [INTEGRATION API] Searching nodes for: ".concat(query));
                return [4 /*yield*/, IntegrationMappingService_1.integrationMappingService.searchNodes(query)];
            case 1:
                nodes = _a.sent();
                res.json({
                    success: true,
                    data: nodes,
                    query: query,
                    count: nodes.length,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('❌ [INTEGRATION API] Search failed:', error_4);
                res.status(500).json({
                    success: false,
                    error: 'Search failed',
                    details: error_4 instanceof Error ? error_4.message : 'Unknown error'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get specific node details
router.get('/node/:nodeId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nodeId, node, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                nodeId = zod_1.z.string().parse(req.params.nodeId);
                console.log("\uD83D\uDD0D [INTEGRATION API] Fetching node details for: ".concat(nodeId));
                return [4 /*yield*/, IntegrationMappingService_1.integrationMappingService.getNodeDetails(nodeId)];
            case 1:
                node = _a.sent();
                if (!node) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            error: 'Node not found',
                            nodeId: nodeId
                        })];
                }
                res.json({
                    success: true,
                    data: node,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('❌ [INTEGRATION API] Failed to fetch node details:', error_5);
                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch node details',
                    details: error_5 instanceof Error ? error_5.message : 'Unknown error'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update node health
router.post('/node/:nodeId/health', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nodeId, healthScore, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                nodeId = zod_1.z.string().parse(req.params.nodeId);
                healthScore = zod_1.z.object({
                    healthScore: zod_1.z.number().min(0).max(100)
                }).parse(req.body).healthScore;
                console.log("\uD83D\uDC8A [INTEGRATION API] Updating health for node ".concat(nodeId, ": ").concat(healthScore, "%"));
                return [4 /*yield*/, IntegrationMappingService_1.integrationMappingService.updateNodeHealth(nodeId, healthScore)];
            case 1:
                _a.sent();
                res.json({
                    success: true,
                    message: 'Node health updated successfully',
                    nodeId: nodeId,
                    healthScore: healthScore,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('❌ [INTEGRATION API] Failed to update node health:', error_6);
                res.status(500).json({
                    success: false,
                    error: 'Failed to update node health',
                    details: error_6 instanceof Error ? error_6.message : 'Unknown error'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get integration metrics
router.get('/metrics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var systemMap_1, health_1, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                console.log('📊 [INTEGRATION API] Fetching integration metrics...');
                return [4 /*yield*/, IntegrationMappingService_1.integrationMappingService.getSystemMap()];
            case 1:
                systemMap_1 = _a.sent();
                return [4 /*yield*/, IntegrationMappingService_1.integrationMappingService.getSystemHealth()];
            case 2:
                health_1 = _a.sent();
                res.json({
                    success: true,
                    data: {
                        overview: systemMap_1.metrics,
                        health: health_1,
                        layers: systemMap_1.layers.map(function (layer) { return (__assign(__assign({}, layer), { health: Math.round(health_1.nodes
                                .filter(function (n) { return systemMap_1.nodes.find(function (node) {
                                return node.id === n.id && node.layer === layer.level;
                            }); })
                                .reduce(function (sum, n) { return sum + n.health; }, 0) /
                                Math.max(1, health_1.nodes.filter(function (n) {
                                    return systemMap_1.nodes.find(function (node) {
                                        return node.id === n.id && node.layer === layer.level;
                                    });
                                }).length)) })); }),
                        connections: {
                            total: systemMap_1.connections.length,
                            active: systemMap_1.connections.filter(function (c) { return c.isActive; }).length,
                            byType: systemMap_1.connections.reduce(function (acc, conn) {
                                acc[conn.type] = (acc[conn.type] || 0) + 1;
                                return acc;
                            }, {}),
                            byStrength: systemMap_1.connections.reduce(function (acc, conn) {
                                var range = conn.strength <= 3 ? 'low' : conn.strength <= 6 ? 'medium' : 'high';
                                acc[range] = (acc[range] || 0) + 1;
                                return acc;
                            }, {})
                        }
                    },
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                console.error('❌ [INTEGRATION API] Failed to fetch metrics:', error_7);
                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch integration metrics',
                    details: error_7 instanceof Error ? error_7.message : 'Unknown error'
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });

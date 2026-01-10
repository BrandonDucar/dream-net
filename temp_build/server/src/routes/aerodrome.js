"use strict";
/**
 * Aerodrome Finance API Routes
 *
 * Provides RESTful endpoints for GitHub + Aerodrome DeFi integration
 * Supporting business user specialization and real-time data
 * Enhanced with WebSocket streaming capabilities
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
var aerodrome_1 = require("../integrations/aerodrome");
var router = (0, express_1.Router)();
/**
 * GitHub Integration Endpoints
 */
// GET /api/aerodrome/github/repos - Get Aerodrome GitHub repository information
router.get('/github/repos', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var repos, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, aerodrome_1.aerodromeIntegration.getGitHubRepoInfo()];
            case 1:
                repos = _a.sent();
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: repos
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({
                    success: false,
                    error: error_1.message,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * DeFi Analytics Endpoints
 */
// GET /api/aerodrome/pools - Get pool analytics with optional limit
router.get('/pools', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, pools, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                limit = parseInt(req.query.limit) || 10;
                return [4 /*yield*/, aerodrome_1.aerodromeIntegration.getPoolAnalytics(limit)];
            case 1:
                pools = _a.sent();
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: {
                        pools: pools,
                        count: pools.length,
                        total_tvl: pools.reduce(function (sum, pool) { return sum + (pool.tvl || 0); }, 0),
                        avg_apr: pools.length > 0 ? pools.reduce(function (sum, pool) { return sum + (pool.apr || 0); }, 0) / pools.length : 0
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({
                    success: false,
                    error: error_2.message,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/aerodrome/quote - Get swap quote
router.post('/quote', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fromToken, toToken, amount, quote, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, fromToken = _a.fromToken, toToken = _a.toToken, amount = _a.amount;
                if (!fromToken || !toToken || !amount) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Missing required parameters: fromToken, toToken, amount'
                        })];
                }
                return [4 /*yield*/, aerodrome_1.aerodromeIntegration.getSwapQuote(fromToken, toToken, amount)];
            case 1:
                quote = _b.sent();
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: quote
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                res.status(500).json({
                    success: false,
                    error: error_3.message,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Business User Specialization Endpoints
 */
// GET /api/aerodrome/business/eric - Eric's metals trading focus
router.get('/business/eric', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var metrics, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, aerodrome_1.aerodromeIntegration.getBusinessMetrics('eric')];
            case 1:
                metrics = _a.sent();
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: metrics
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).json({
                    success: false,
                    error: error_4.message,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/aerodrome/business/dan - Dan's crypto trading focus
router.get('/business/dan', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var metrics, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, aerodrome_1.aerodromeIntegration.getBusinessMetrics('dan')];
            case 1:
                metrics = _a.sent();
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: metrics
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(500).json({
                    success: false,
                    error: error_5.message,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/aerodrome/business/sutton - Sutton's security focus  
router.get('/business/sutton', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var metrics, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, aerodrome_1.aerodromeIntegration.getBusinessMetrics('sutton')];
            case 1:
                metrics = _a.sent();
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: metrics
                });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                res.status(500).json({
                    success: false,
                    error: error_6.message,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/aerodrome/business/brandon - Brandon's system admin focus
router.get('/business/brandon', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var metrics, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, aerodrome_1.aerodromeIntegration.getBusinessMetrics('brandon')];
            case 1:
                metrics = _a.sent();
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: metrics
                });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                res.status(500).json({
                    success: false,
                    error: error_7.message,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Integration Status and Health Monitoring
 */
// GET /api/aerodrome/status - Check integration health
router.get('/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var status_1, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, aerodrome_1.aerodromeIntegration.getIntegrationStatus()];
            case 1:
                status_1 = _a.sent();
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: status_1
                });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                res.status(500).json({
                    success: false,
                    error: error_8.message,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Comprehensive Dashboard Endpoint
 */
// GET /api/aerodrome/dashboard - Complete dashboard data
router.get('/dashboard', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, repos, pools, status_2, dashboard, error_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Promise.all([
                        aerodrome_1.aerodromeIntegration.getGitHubRepoInfo(),
                        aerodrome_1.aerodromeIntegration.getPoolAnalytics(15),
                        aerodrome_1.aerodromeIntegration.getIntegrationStatus()
                    ])];
            case 1:
                _a = _b.sent(), repos = _a[0], pools = _a[1], status_2 = _a[2];
                dashboard = {
                    github: {
                        repositories: repos,
                        total_stars: repos.reduce(function (sum, repo) { return sum + repo.stars; }, 0),
                        total_forks: repos.reduce(function (sum, repo) { return sum + repo.forks; }, 0),
                        languages: __spreadArray([], new Set(repos.map(function (repo) { return repo.language; })), true),
                        last_updated: Math.max.apply(Math, repos.map(function (repo) { return new Date(repo.last_updated).getTime(); }))
                    },
                    defi: {
                        pools: pools.slice(0, 10), // Top 10 pools
                        total_pools: pools.length,
                        total_tvl: pools.reduce(function (sum, pool) { return sum + (pool.tvl || 0); }, 0),
                        avg_apr: pools.length > 0 ? pools.reduce(function (sum, pool) { return sum + (pool.apr || 0); }, 0) / pools.length : 0,
                        top_volume: pools.sort(function (a, b) { return (b.volume24h || 0) - (a.volume24h || 0); }).slice(0, 5)
                    },
                    integration_status: status_2,
                    business_users: [
                        { name: 'Eric', role: 'Metals Mint President', focus: 'Trading systems' },
                        { name: 'Dan', role: 'Crypto Trader', focus: 'Meme coins & trading' },
                        { name: 'Sutton', role: 'Security Professional', focus: 'IT security' },
                        { name: 'Brandon', role: 'System Administrator', focus: 'Backend monitoring' }
                    ]
                };
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: dashboard
                });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _b.sent();
                res.status(500).json({
                    success: false,
                    error: error_9.message,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Real-Time WebSocket Streaming Endpoints
 */
// GET /api/aerodrome/stream/status - Check WebSocket streaming capabilities
router.get('/stream/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var streamStatus, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, aerodrome_1.aerodromeIntegration.getRealtimeBlockStream()];
            case 1:
                streamStatus = _a.sent();
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: streamStatus
                });
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                res.status(500).json({
                    success: false,
                    error: error_10.message,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;

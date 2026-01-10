"use strict";
/**
 * Velo by Wix Integration Routes
 *
 * Provides REST API endpoints for Velo by Wix integration including:
 * - Integration status monitoring
 * - GitHub repository management
 * - Site and collection data
 * - Business user specialization
 * - Development tools status
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
var router = (0, express_1.Router)();
// Velo integration is optional
var veloIntegration = null;
try {
    var veloModule = require('../integrations/velo');
    veloIntegration = veloModule.veloIntegration;
}
catch (_a) {
    console.warn("[Velo Router] Velo integration not available");
}
/**
 * Get overall integration status
 * GET /api/velo/status
 */
router.get('/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var status_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, veloIntegration.getIntegrationStatus()];
            case 1:
                status_1 = _a.sent();
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: status_1
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Velo integration status error:', error_1);
                res.status(500).json({
                    success: false,
                    error: error_1 instanceof Error ? error_1.message : 'Unknown error',
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Get GitHub repositories for Velo projects
 * GET /api/velo/github/repos
 */
router.get('/github/repos', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var repos, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, veloIntegration.getVeloGitHubRepos()];
            case 1:
                repos = _a.sent();
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: repos
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Velo GitHub repos error:', error_2);
                res.status(500).json({
                    success: false,
                    error: error_2 instanceof Error ? error_2.message : 'Unknown error',
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Get site information
 * GET /api/velo/site
 */
router.get('/site', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var siteInfo, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, veloIntegration.getSiteInfo()];
            case 1:
                siteInfo = _a.sent();
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: siteInfo
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Velo site info error:', error_3);
                res.status(500).json({
                    success: false,
                    error: error_3 instanceof Error ? error_3.message : 'Unknown error',
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Get data collections
 * GET /api/velo/collections
 */
router.get('/collections', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var collections, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, veloIntegration.getDataCollections()];
            case 1:
                collections = _a.sent();
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: {
                        collections: collections,
                        count: collections.length,
                        total_records: collections.reduce(function (sum, col) { return sum + (col.recordCount || 0); }, 0)
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Velo collections error:', error_4);
                res.status(500).json({
                    success: false,
                    error: error_4 instanceof Error ? error_4.message : 'Unknown error',
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Get development tools status
 * GET /api/velo/devtools
 */
router.get('/devtools', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var devTools, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, veloIntegration.getDevToolsStatus()];
            case 1:
                devTools = _a.sent();
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: devTools
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Velo dev tools error:', error_5);
                res.status(500).json({
                    success: false,
                    error: error_5 instanceof Error ? error_5.message : 'Unknown error',
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Business user endpoints
 */
// Auric - Metals Intelligence Node
router.get('/business/auric', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var metrics;
    return __generator(this, function (_a) {
        try {
            metrics = veloIntegration.getBusinessUserMetrics('auric');
            res.json({
                success: true,
                timestamp: new Date().toISOString(),
                data: metrics
            });
        }
        catch (error) {
            console.error('Velo Auric metrics error:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            });
        }
        return [2 /*return*/];
    });
}); });
// Flux - Crypto Intelligence Node
router.get('/business/flux', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var metrics;
    return __generator(this, function (_a) {
        try {
            metrics = veloIntegration.getBusinessUserMetrics('flux');
            res.json({
                success: true,
                timestamp: new Date().toISOString(),
                data: metrics
            });
        }
        catch (error) {
            console.error('Velo Flux metrics error:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            });
        }
        return [2 /*return*/];
    });
}); });
// Sentinel - Security Intelligence Node
router.get('/business/sentinel', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var metrics;
    return __generator(this, function (_a) {
        try {
            metrics = veloIntegration.getBusinessUserMetrics('sentinel');
            res.json({
                success: true,
                timestamp: new Date().toISOString(),
                data: metrics
            });
        }
        catch (error) {
            console.error('Velo Sentinel metrics error:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            });
        }
        return [2 /*return*/];
    });
}); });
// DreamOps - Core Operations Node
router.get('/business/dreamops', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var metrics;
    return __generator(this, function (_a) {
        try {
            metrics = veloIntegration.getBusinessUserMetrics('dreamops');
            res.json({
                success: true,
                timestamp: new Date().toISOString(),
                data: metrics
            });
        }
        catch (error) {
            console.error('Velo DreamOps metrics error:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            });
        }
        return [2 /*return*/];
    });
}); });
/**
 * Dashboard overview with all integration data
 * GET /api/velo/dashboard
 */
router.get('/dashboard', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dashboard, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, veloIntegration.getDashboardOverview()];
            case 1:
                dashboard = _a.sent();
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: dashboard
                });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Velo dashboard error:', error_6);
                res.status(500).json({
                    success: false,
                    error: error_6 instanceof Error ? error_6.message : 'Unknown error',
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;

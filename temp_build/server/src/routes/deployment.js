"use strict";
/**
 * Unified Deployment API Routes
 * Deploy to any platform - we ARE the deployment platform!
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
var deployment_core_1 = require("../../packages/deployment-core");
var DomainKeeper_1 = require("../services/DomainKeeper");
var router = (0, express_1.Router)();
/**
 * POST /api/deployment/deploy
 * Deploy to a specific platform
 */
router.post('/deploy', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var config, manager, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                config = req.body;
                if (!config.platform || !config.projectName || !config.sourceDirectory) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Missing required fields: platform, projectName, sourceDirectory',
                        })];
                }
                console.log("[Deployment] Deploying ".concat(config.projectName, " to ").concat(config.platform));
                manager = (0, deployment_core_1.getDeploymentManager)();
                return [4 /*yield*/, manager.deploy(config)];
            case 1:
                result = _a.sent();
                // If deployment succeeded and it's Vercel, sync domains asynchronously
                if (result.success && config.platform === 'vercel') {
                    // Run domain sync in background (don't block response)
                    (0, DomainKeeper_1.getDomainKeeper)()
                        .syncProductionDomain()
                        .then(function (syncResult) {
                        console.log("[DomainKeeper] Production domain sync: ".concat(syncResult.action, " - ").concat(syncResult.message));
                    })
                        .catch(function (error) {
                        console.error('[DomainKeeper] Domain sync error (non-blocking):', error);
                    });
                }
                res.json({
                    success: result.success,
                    result: result,
                    timestamp: new Date().toISOString(),
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('[Deployment] Error:', error_1);
                res.status(500).json({
                    success: false,
                    error: error_1.message || 'Deployment failed',
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/deployment/deploy-all
 * Deploy to all available platforms simultaneously
 */
router.post('/deploy-all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var config, manager, results, successCount, totalCount, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                config = req.body;
                if (!config.projectName || !config.sourceDirectory) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Missing required fields: projectName, sourceDirectory',
                        })];
                }
                console.log("[Deployment] Deploying ".concat(config.projectName, " to ALL platforms"));
                manager = (0, deployment_core_1.getDeploymentManager)();
                return [4 /*yield*/, manager.deployToAll(config)];
            case 1:
                results = _a.sent();
                successCount = results.filter(function (r) { return r.success; }).length;
                totalCount = results.length;
                res.json({
                    success: true,
                    results: results,
                    summary: {
                        total: totalCount,
                        successful: successCount,
                        failed: totalCount - successCount,
                    },
                    timestamp: new Date().toISOString(),
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('[Deployment] Error:', error_2);
                res.status(500).json({
                    success: false,
                    error: error_2.message || 'Deployment failed',
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/deployment/platforms
 * List all available deployment platforms
 */
router.get('/platforms', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var manager, platforms;
    return __generator(this, function (_a) {
        try {
            manager = (0, deployment_core_1.getDeploymentManager)();
            platforms = manager.listAvailablePlatforms();
            res.json({
                success: true,
                platforms: platforms,
                count: platforms.length,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('[Deployment] Error:', error);
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/deployment/status/:deploymentId
 * Get deployment status
 */
router.get('/status/:deploymentId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deploymentId, platform, manager, provider, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                deploymentId = req.params.deploymentId;
                platform = req.query.platform;
                if (!platform || typeof platform !== 'string') {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Platform query parameter is required',
                        })];
                }
                manager = (0, deployment_core_1.getDeploymentManager)();
                provider = manager.getProvider(platform);
                if (!provider) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            error: "Platform ".concat(platform, " not found"),
                        })];
                }
                return [4 /*yield*/, provider.getStatus(deploymentId)];
            case 1:
                result = _a.sent();
                res.json({
                    success: true,
                    result: result,
                    timestamp: new Date().toISOString(),
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('[Deployment] Error:', error_3);
                res.status(500).json({
                    success: false,
                    error: error_3.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/deployment/sync-domains
 * Manually trigger domain synchronization
 * Ensures dreamnet.ink is attached to the correct Vercel project and DNS is correct
 */
router.post('/sync-domains', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var keeper, results, summary, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('[DomainKeeper] Manual domain sync triggered');
                keeper = (0, DomainKeeper_1.getDomainKeeper)();
                return [4 /*yield*/, keeper.syncAllDomains()];
            case 1:
                results = _a.sent();
                summary = {
                    total: results.length,
                    successful: results.filter(function (r) { return r.action !== 'error' && r.dnsAction !== 'error'; }).length,
                    failed: results.filter(function (r) { return r.action === 'error' || r.dnsAction === 'error'; }).length,
                    results: results.map(function (r) { return ({
                        domain: r.domain,
                        vercel: {
                            action: r.action,
                            message: r.message,
                        },
                        dns: r.dnsAction ? {
                            action: r.dnsAction,
                            message: r.dnsMessage,
                        } : undefined,
                    }); }),
                };
                res.json({
                    success: summary.failed === 0,
                    summary: summary,
                    timestamp: new Date().toISOString(),
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('[DomainKeeper] Sync error:', error_4);
                res.status(500).json({
                    success: false,
                    error: error_4.message || 'Domain sync failed',
                    timestamp: new Date().toISOString(),
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;

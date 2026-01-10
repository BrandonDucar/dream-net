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
var router = (0, express_1.Router)();
// Services are optional - handle missing gracefully
var WebhookHygieneService = null;
var DependencySanityService = null;
var BlastRadiusControlService = null;
var webhookHygiene = null;
var dependencySanity = null;
var blastRadius = null;
try {
    var hygieneModule = require('../services/WebhookHygieneService');
    var sanityModule = require('../services/DependencySanityService');
    var blastModule = require('../services/BlastRadiusControlService');
    WebhookHygieneService = hygieneModule.WebhookHygieneService;
    DependencySanityService = sanityModule.DependencySanityService;
    BlastRadiusControlService = blastModule.BlastRadiusControlService;
    if (WebhookHygieneService)
        webhookHygiene = new WebhookHygieneService();
    if (DependencySanityService)
        dependencySanity = new DependencySanityService();
    if (BlastRadiusControlService)
        blastRadius = new BlastRadiusControlService();
}
catch (_a) {
    console.warn("[Webhook Hygiene] Services not available");
}
// Webhook validation endpoint
router.post('/validate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, provider, signature, timestamp, eventId, payload, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!webhookHygiene) {
                    return [2 /*return*/, res.status(503).json({ error: "Webhook Hygiene Service not available" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = req.body, provider = _a.provider, signature = _a.signature, timestamp = _a.timestamp, eventId = _a.eventId;
                payload = JSON.stringify(req.body.payload || {});
                return [4 /*yield*/, webhookHygiene.validateWebhook(provider, signature, payload, timestamp, eventId)];
            case 2:
                result = _b.sent();
                res.json(result);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                res.status(500).json({
                    error: 'Webhook validation failed',
                    message: error_1.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Dependency audit endpoint
router.get('/audit/dependencies', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var audit, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!dependencySanity) {
                    return [2 /*return*/, res.status(503).json({ error: "Dependency Sanity Service not available" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dependencySanity.runDependencyAudit()];
            case 2:
                audit = _a.sent();
                res.json(audit);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(500).json({
                    error: 'Dependency audit failed',
                    message: error_2.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Generate dependency audit report
router.get('/audit/report', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var report, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!dependencySanity) {
                    return [2 /*return*/, res.status(503).json({ error: "Dependency Sanity Service not available" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dependencySanity.generateAuditReport()];
            case 2:
                report = _a.sent();
                res.setHeader('Content-Type', 'text/plain');
                res.send(report);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500).json({
                    error: 'Report generation failed',
                    message: error_3.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Blast radius control endpoints
router.get('/blast-radius/status', function (req, res) {
    if (!blastRadius) {
        return res.status(503).json({ error: "Blast Radius Service not available" });
    }
    try {
        var health = blastRadius.getIntegrationHealth();
        var stats = blastRadius.getBlastRadiusStats();
        res.json({
            integrationHealth: health,
            statistics: stats,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Blast radius status failed',
            message: error.message
        });
    }
});
router.post('/blast-radius/disable/:integration', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var integration, reason, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!blastRadius) {
                    return [2 /*return*/, res.status(503).json({ error: "Blast Radius Service not available" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                integration = req.params.integration;
                reason = req.body.reason;
                return [4 /*yield*/, blastRadius.disableIntegration(integration, reason || 'Manual disable')];
            case 2:
                _a.sent();
                res.json({
                    success: true,
                    message: "Integration ".concat(integration, " disabled"),
                    integration: integration,
                    reason: reason
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.status(500).json({
                    error: 'Failed to disable integration',
                    message: error_4.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/blast-radius/enable/:integration', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var integration, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!blastRadius) {
                    return [2 /*return*/, res.status(503).json({ error: "Blast Radius Service not available" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                integration = req.params.integration;
                return [4 /*yield*/, blastRadius.enableIntegration(integration)];
            case 2:
                _a.sent();
                res.json({
                    success: true,
                    message: "Integration ".concat(integration, " enabled"),
                    integration: integration
                });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.status(500).json({
                    error: 'Failed to enable integration',
                    message: error_5.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/blast-radius/emergency-disable/:integration', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var integration, reason, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!blastRadius) {
                    return [2 /*return*/, res.status(503).json({ error: "Blast Radius Service not available" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                integration = req.params.integration;
                reason = req.body.reason;
                return [4 /*yield*/, blastRadius.emergencyDisable(integration, reason || 'Emergency disable')];
            case 2:
                _a.sent();
                res.json({
                    success: true,
                    message: "Integration ".concat(integration, " emergency disabled"),
                    integration: integration,
                    reason: reason,
                    emergency: true
                });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                res.status(500).json({
                    error: 'Failed to emergency disable integration',
                    message: error_6.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Webhook statistics
router.get('/stats', function (req, res) {
    if (!webhookHygiene) {
        return res.status(503).json({ error: "Webhook Hygiene Service not available" });
    }
    try {
        var stats = webhookHygiene.getStats();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to get webhook stats',
            message: error.message
        });
    }
});
// Integration flags management
router.get('/integration-flags', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var IntegrationFlagsService, flags, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/IntegrationFlagsService'); })];
            case 1:
                IntegrationFlagsService = (_a.sent()).IntegrationFlagsService;
                return [4 /*yield*/, IntegrationFlagsService.getAllFlags()];
            case 2:
                flags = _a.sent();
                res.json(flags);
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                res.status(500).json({
                    error: 'Failed to get integration flags',
                    message: error_7.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/integration-flags/:name/enable', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var IntegrationFlagsService, name_1, reason, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/IntegrationFlagsService'); })];
            case 1:
                IntegrationFlagsService = (_a.sent()).IntegrationFlagsService;
                name_1 = req.params.name;
                reason = req.body.reason;
                return [4 /*yield*/, IntegrationFlagsService.setIntegrationEnabled(name_1, true, reason)];
            case 2:
                _a.sent();
                res.json({
                    success: true,
                    message: "Integration ".concat(name_1, " enabled"),
                    integration: name_1,
                    enabled: true
                });
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                res.status(500).json({
                    error: 'Failed to enable integration',
                    message: error_8.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/integration-flags/:name/disable', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var IntegrationFlagsService, name_2, reason, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/IntegrationFlagsService'); })];
            case 1:
                IntegrationFlagsService = (_a.sent()).IntegrationFlagsService;
                name_2 = req.params.name;
                reason = req.body.reason;
                return [4 /*yield*/, IntegrationFlagsService.setIntegrationEnabled(name_2, false, reason)];
            case 2:
                _a.sent();
                res.json({
                    success: true,
                    message: "Integration ".concat(name_2, " disabled"),
                    integration: name_2,
                    enabled: false
                });
                return [3 /*break*/, 4];
            case 3:
                error_9 = _a.sent();
                res.status(500).json({
                    error: 'Failed to disable integration',
                    message: error_9.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/integration-flags/emergency-mode', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var IntegrationFlagsService, reason, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/IntegrationFlagsService'); })];
            case 1:
                IntegrationFlagsService = (_a.sent()).IntegrationFlagsService;
                reason = req.body.reason;
                return [4 /*yield*/, IntegrationFlagsService.enableEmergencyMode(reason)];
            case 2:
                _a.sent();
                res.json({
                    success: true,
                    message: 'Emergency mode activated',
                    emergency_mode: true
                });
                return [3 /*break*/, 4];
            case 3:
                error_10 = _a.sent();
                res.status(500).json({
                    error: 'Failed to enable emergency mode',
                    message: error_10.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.delete('/integration-flags/emergency-mode', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var IntegrationFlagsService, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/IntegrationFlagsService'); })];
            case 1:
                IntegrationFlagsService = (_a.sent()).IntegrationFlagsService;
                return [4 /*yield*/, IntegrationFlagsService.disableEmergencyMode()];
            case 2:
                _a.sent();
                res.json({
                    success: true,
                    message: 'Emergency mode deactivated',
                    emergency_mode: false
                });
                return [3 /*break*/, 4];
            case 3:
                error_11 = _a.sent();
                res.status(500).json({
                    error: 'Failed to disable emergency mode',
                    message: error_11.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/integration-flags/validate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var IntegrationFlagsService, validation, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/IntegrationFlagsService'); })];
            case 1:
                IntegrationFlagsService = (_a.sent()).IntegrationFlagsService;
                return [4 /*yield*/, IntegrationFlagsService.validateFlags()];
            case 2:
                validation = _a.sent();
                res.json(validation);
                return [3 /*break*/, 4];
            case 3:
                error_12 = _a.sent();
                res.status(500).json({
                    error: 'Failed to validate flags',
                    message: error_12.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Provider Configuration Management
router.get('/providers', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ProviderConfigurationService, providers, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/ProviderConfigurationService'); })];
            case 1:
                ProviderConfigurationService = (_a.sent()).ProviderConfigurationService;
                return [4 /*yield*/, ProviderConfigurationService.getAllProvidersStatus()];
            case 2:
                providers = _a.sent();
                res.json({
                    success: true,
                    providers: providers,
                    total: providers.length,
                    enabled: providers.filter(function (p) { return p.enabled; }).length,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 4];
            case 3:
                error_13 = _a.sent();
                res.status(500).json({
                    error: 'Failed to get providers',
                    message: error_13.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/providers/:name', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ProviderConfigurationService, name_3, config, readiness, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/ProviderConfigurationService'); })];
            case 1:
                ProviderConfigurationService = (_a.sent()).ProviderConfigurationService;
                name_3 = req.params.name;
                return [4 /*yield*/, ProviderConfigurationService.getProviderConfig(name_3)];
            case 2:
                config = _a.sent();
                return [4 /*yield*/, ProviderConfigurationService.getProviderReadiness(name_3)];
            case 3:
                readiness = _a.sent();
                if (!config) {
                    return [2 /*return*/, res.status(404).json({
                            error: 'Provider not found',
                            name: name_3
                        })];
                }
                res.json({
                    success: true,
                    provider: {
                        name: name_3,
                        config: config,
                        readiness: readiness
                    }
                });
                return [3 /*break*/, 5];
            case 4:
                error_14 = _a.sent();
                res.status(500).json({
                    error: 'Failed to get provider',
                    message: error_14.message
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/providers/:name/validate-flow', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ProviderConfigurationService, name_4, _a, flowType, permission, hasPermission, error_15;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/ProviderConfigurationService'); })];
            case 1:
                ProviderConfigurationService = (_b.sent()).ProviderConfigurationService;
                name_4 = req.params.name;
                _a = req.body, flowType = _a.flowType, permission = _a.permission;
                if (!flowType || !permission) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Missing required fields: flowType, permission'
                        })];
                }
                return [4 /*yield*/, ProviderConfigurationService.validateFlowPermission(name_4, flowType, permission)];
            case 2:
                hasPermission = _b.sent();
                res.json({
                    success: true,
                    provider: name_4,
                    flowType: flowType,
                    permission: permission,
                    hasPermission: hasPermission,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 4];
            case 3:
                error_15 = _b.sent();
                res.status(500).json({
                    error: 'Failed to validate flow permission',
                    message: error_15.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/providers/:name/validate-webhook', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ProviderConfigurationService, name_5, eventType, isValid, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/ProviderConfigurationService'); })];
            case 1:
                ProviderConfigurationService = (_a.sent()).ProviderConfigurationService;
                name_5 = req.params.name;
                eventType = req.body.eventType;
                if (!eventType) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Missing required field: eventType'
                        })];
                }
                return [4 /*yield*/, ProviderConfigurationService.validateWebhookEvent(name_5, eventType)];
            case 2:
                isValid = _a.sent();
                res.json({
                    success: true,
                    provider: name_5,
                    eventType: eventType,
                    isValid: isValid,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 4];
            case 3:
                error_16 = _a.sent();
                res.status(500).json({
                    error: 'Failed to validate webhook event',
                    message: error_16.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/providers/:name/readiness', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ProviderConfigurationService, name_6, readiness, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/ProviderConfigurationService'); })];
            case 1:
                ProviderConfigurationService = (_a.sent()).ProviderConfigurationService;
                name_6 = req.params.name;
                return [4 /*yield*/, ProviderConfigurationService.getProviderReadiness(name_6)];
            case 2:
                readiness = _a.sent();
                res.json({
                    success: true,
                    provider: name_6,
                    readiness: readiness,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 4];
            case 3:
                error_17 = _a.sent();
                res.status(500).json({
                    error: 'Failed to get provider readiness',
                    message: error_17.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Integration sweep endpoint for proof plan
router.get('/sweep', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ProviderConfigurationService, IntegrationFlagsService, coreProviders, results, summary, _i, coreProviders_1, provider, config, readiness, isEnabled, readStatus, writeStatus, hasReadFlow, hasWriteFlow, result, error_18, message, error_19, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/ProviderConfigurationService'); })];
            case 1:
                ProviderConfigurationService = (_a.sent()).ProviderConfigurationService;
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/IntegrationFlagsService'); })];
            case 2:
                IntegrationFlagsService = (_a.sent()).IntegrationFlagsService;
                coreProviders = ['stripe', 'google', 'microsoft', 'openai', 'anthropic'];
                results = [];
                summary = {
                    total: coreProviders.length,
                    passing: 0,
                    failing: 0,
                    readStatus: { green: 0, yellow: 0, red: 0 },
                    writeStatus: { green: 0, yellow: 0, red: 0 },
                    timestamp: new Date().toISOString()
                };
                console.log('🔍 [Integration Sweep] Starting core provider validation...');
                _i = 0, coreProviders_1 = coreProviders;
                _a.label = 3;
            case 3:
                if (!(_i < coreProviders_1.length)) return [3 /*break*/, 10];
                provider = coreProviders_1[_i];
                _a.label = 4;
            case 4:
                _a.trys.push([4, 8, , 9]);
                return [4 /*yield*/, ProviderConfigurationService.getProviderConfig(provider)];
            case 5:
                config = _a.sent();
                return [4 /*yield*/, ProviderConfigurationService.getProviderReadiness(provider)];
            case 6:
                readiness = _a.sent();
                return [4 /*yield*/, IntegrationFlagsService.getIntegrationConfig(provider)];
            case 7:
                isEnabled = _a.sent();
                readStatus = 'red';
                writeStatus = 'red';
                if (config && (isEnabled === null || isEnabled === void 0 ? void 0 : isEnabled.enabled)) {
                    hasReadFlow = config.flows.Lead === 'read' || config.flows.Lead === 'read_write' ||
                        config.flows.Event === 'read' || config.flows.Event === 'read_write' ||
                        config.flows.Content === 'request_response';
                    hasWriteFlow = config.flows.Lead === 'write' || config.flows.Lead === 'read_write' ||
                        config.flows.Event === 'write' || config.flows.Event === 'read_write' ||
                        config.flows.Billing === 'write' ||
                        config.flows.Content === 'request_response';
                    if (hasReadFlow && readiness.envConfigured) {
                        readStatus = readiness.score >= 80 ? 'green' : 'yellow';
                    }
                    else if (hasReadFlow) {
                        readStatus = 'yellow';
                    }
                    if (hasWriteFlow && readiness.envConfigured) {
                        writeStatus = readiness.score >= 80 ? 'green' : 'yellow';
                    }
                    else if (hasWriteFlow) {
                        writeStatus = 'yellow';
                    }
                }
                summary.readStatus[readStatus]++;
                summary.writeStatus[writeStatus]++;
                result = {
                    provider: provider,
                    enabled: (isEnabled === null || isEnabled === void 0 ? void 0 : isEnabled.enabled) || false,
                    readiness: readiness.score,
                    readStatus: readStatus,
                    writeStatus: writeStatus,
                    flows: (config === null || config === void 0 ? void 0 : config.flows) || {},
                    envStatus: readiness.envConfigured ? 'configured' : 'missing',
                    details: readiness.details
                };
                results.push(result);
                if (readStatus === 'green' && writeStatus === 'green') {
                    summary.passing++;
                    console.log("\u2705 [Integration Sweep] ".concat(provider, ": PASS (").concat(readiness.score, "%)"));
                }
                else {
                    summary.failing++;
                    console.log("\u274C [Integration Sweep] ".concat(provider, ": FAIL (").concat(readiness.score, "%) - Read: ").concat(readStatus, ", Write: ").concat(writeStatus));
                }
                return [3 /*break*/, 9];
            case 8:
                error_18 = _a.sent();
                message = error_18 instanceof Error ? error_18.message : String(error_18);
                summary.failing++;
                results.push({
                    provider: provider,
                    enabled: false,
                    readiness: 0,
                    readStatus: 'red',
                    writeStatus: 'red',
                    flows: {},
                    envStatus: 'error',
                    error: message
                });
                console.log("\u274C [Integration Sweep] ".concat(provider, ": ERROR - ").concat(message));
                return [3 /*break*/, 9];
            case 9:
                _i++;
                return [3 /*break*/, 3];
            case 10:
                console.log("\uD83D\uDD0D [Integration Sweep] Complete: ".concat(summary.passing, "/").concat(summary.total, " passing"));
                res.json({
                    success: true,
                    summary: summary,
                    results: results,
                    coreProviders: coreProviders,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 12];
            case 11:
                error_19 = _a.sent();
                message = error_19 instanceof Error ? error_19.message : String(error_19);
                res.status(500).json({
                    error: 'Integration sweep failed',
                    message: message
                });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
exports.default = router;

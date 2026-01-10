"use strict";
/**
 * Vercel Agent API Routes
 * Manage Vercel deployments and clean up old projects
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
var controlCoreMiddleware_1 = require("../../packages/dreamnet-control-core/controlCoreMiddleware");
var router = (0, express_1.Router)();
// Optional imports - handle missing packages gracefully
var DreamNetVercelAgent = null;
var withPort = null;
var NERVE_BUS = null;
var createNerveEvent = null;
var EnvKeeperCore = null;
var APIKeeperCore = null;
var recordDeployEvent = null;
try {
    var vercelModule = require("../../packages/dreamnet-vercel-agent");
    DreamNetVercelAgent = vercelModule.DreamNetVercelAgent;
    var summaryModule = require("../../packages/dreamnet-vercel-agent/summary");
    recordDeployEvent = summaryModule.recordDeployEvent;
}
catch (_a) {
    console.warn("[Vercel Router] @dreamnet/dreamnet-vercel-agent not available");
}
try {
    var portModule = require("../../packages/port-governor/src/withPort");
    withPort = portModule.withPort;
}
catch (_b) {
    console.warn("[Vercel Router] @dreamnet/port-governor not available");
}
try {
    var nerveBusModule = require("../../packages/nerve/src/bus");
    NERVE_BUS = nerveBusModule.NERVE_BUS;
    var nerveFactoryModule = require("../../packages/nerve/src/factory");
    createNerveEvent = nerveFactoryModule.createNerveEvent;
}
catch (_c) {
    console.warn("[Vercel Router] @dreamnet/nerve not available");
}
try {
    var envKeeperModule = require("../../packages/env-keeper-core");
    EnvKeeperCore = envKeeperModule.EnvKeeperCore;
    var apiKeeperModule = require("../../packages/api-keeper-core");
    APIKeeperCore = apiKeeperModule.APIKeeperCore;
}
catch (_d) {
    console.warn("[Vercel Router] Keeper cores not available");
}
// GET /api/vercel/status - Get Vercel agent status
router.get("/status", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var status_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, DreamNetVercelAgent.status()];
            case 1:
                status_1 = _a.sent();
                res.json({
                    success: true,
                    status: status_1,
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({ error: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/vercel/projects - List all projects
router.get("/projects", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var projects, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, DreamNetVercelAgent.listProjects()];
            case 1:
                projects = _a.sent();
                res.json({
                    success: true,
                    projects: projects,
                    count: projects.length,
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({ error: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/vercel/project/:name - Get project by name
router.get("/project/:name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name_1, project, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                name_1 = req.params.name;
                return [4 /*yield*/, DreamNetVercelAgent.getProject(name_1)];
            case 1:
                project = _a.sent();
                if (project) {
                    res.json({
                        success: true,
                        project: project,
                    });
                }
                else {
                    res.status(404).json({
                        success: false,
                        error: "Project not found",
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ error: error_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/vercel/analyze - Analyze cleanup opportunities (dry-run)
router.get("/analyze", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var targetDomain, actions, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                targetDomain = req.query.domain || "dreamnet.ink";
                return [4 /*yield*/, DreamNetVercelAgent.analyzeCleanup(targetDomain)];
            case 1:
                actions = _a.sent();
                res.json({
                    success: true,
                    actions: actions,
                    count: actions.length,
                    dryRun: true,
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).json({ error: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/vercel/cleanup - Execute cleanup (dry-run by default) (governed port)
router.post("/cleanup", withPort ? withPort("VERCEL_PORT") : (function (req, res, next) { return next(); }), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "DEPLOYKEEPER_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, actions, _b, dryRun, traceId, callerIdentity, result, event_1, error_5;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _a = req.body, actions = _a.actions, _b = _a.dryRun, dryRun = _b === void 0 ? true : _b;
                traceId = req.traceId || "unknown";
                callerIdentity = req.callerIdentity;
                if (!actions || !Array.isArray(actions)) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Actions array required",
                        })];
                }
                return [4 /*yield*/, DreamNetVercelAgent.executeCleanup(actions, dryRun)];
            case 1:
                result = _d.sent();
                // Record deploy event
                recordDeployEvent("ok");
                // Emit Nerve event for cleanup operations
                try {
                    event_1 = createNerveEvent({
                        channelId: "INTEGRATION_EVENT",
                        kind: "INTEGRATION_STATUS",
                        priority: 5,
                        context: {
                            traceId: traceId,
                            clusterId: "DEPLOYKEEPER_CORE",
                            tierId: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.tierId,
                            citizenId: (_c = callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.passport) === null || _c === void 0 ? void 0 : _c.citizenId,
                            officeIds: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.officeIds,
                            cabinetIds: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.cabinetIds,
                        },
                        payload: {
                            integration: "vercel",
                            action: "cleanup_executed",
                            dryRun: dryRun,
                            actionsCount: actions.length,
                            status: "ok",
                        },
                        defaultSampleRate: 1.0,
                    });
                    NERVE_BUS.publish(event_1);
                }
                catch (error) {
                    // Nerve not available, continue
                }
                res.json({
                    success: true,
                    result: result,
                    dryRun: dryRun,
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _d.sent();
                res.status(500).json({ error: error_5.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/vercel/cleanup/auto - Auto-analyze and execute cleanup (governed port)
router.post("/cleanup/auto", withPort ? withPort("VERCEL_PORT") : (function (req, res, next) { return next(); }), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "DEPLOYKEEPER_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, targetDomain, _c, dryRun, traceId, callerIdentity, vercelToken, actions, result, event_2, error_6;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 3, , 4]);
                _a = req.body, _b = _a.targetDomain, targetDomain = _b === void 0 ? "dreamnet.ink" : _b, _c = _a.dryRun, dryRun = _c === void 0 ? true : _c;
                traceId = req.traceId || "unknown";
                callerIdentity = req.callerIdentity;
                vercelToken = EnvKeeperCore.get("VERCEL_TOKEN");
                if (!vercelToken || !vercelToken.value) {
                    return [2 /*return*/, res.status(409).json({
                            error: "MISSING_DEPLOY_CREDENTIALS",
                            message: "VERCEL_TOKEN not found in Env Keeper",
                            traceId: traceId,
                        })];
                }
                return [4 /*yield*/, DreamNetVercelAgent.analyzeCleanup(targetDomain)];
            case 1:
                actions = _e.sent();
                return [4 /*yield*/, DreamNetVercelAgent.executeCleanup(actions, dryRun)];
            case 2:
                result = _e.sent();
                // Record deploy event
                recordDeployEvent("ok");
                // Emit Nerve event
                try {
                    event_2 = createNerveEvent({
                        channelId: "INTEGRATION_EVENT",
                        kind: "INTEGRATION_STATUS",
                        priority: 5,
                        context: {
                            traceId: traceId,
                            clusterId: "DEPLOYKEEPER_CORE",
                            tierId: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.tierId,
                            citizenId: (_d = callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.passport) === null || _d === void 0 ? void 0 : _d.citizenId,
                            officeIds: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.officeIds,
                            cabinetIds: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.cabinetIds,
                        },
                        payload: {
                            integration: "vercel",
                            action: "cleanup_auto_executed",
                            targetDomain: targetDomain,
                            dryRun: dryRun,
                            actionsFound: actions.length,
                            status: "ok",
                        },
                        defaultSampleRate: 1.0,
                    });
                    NERVE_BUS.publish(event_2);
                }
                catch (error) {
                    // Nerve not available, continue
                }
                res.json({
                    success: true,
                    actionsFound: actions.length,
                    result: result,
                    dryRun: dryRun,
                });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _e.sent();
                res.status(500).json({ error: error_6.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;

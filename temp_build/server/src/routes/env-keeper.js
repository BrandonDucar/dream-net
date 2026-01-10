"use strict";
/**
 * Env Keeper API Routes
 * Manage environment variables through unified interface
 */
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
var express_1 = require("express");
var siwe_auth_1 = require("../siwe-auth");
var env_keeper_core_1 = require("../../packages/env-keeper-core");
var withPort_1 = require("../../packages/port-governor/src/withPort");
var controlCoreMiddleware_1 = require("../../packages/dreamnet-control-core/controlCoreMiddleware");
var bus_1 = require("../../packages/nerve/src/bus");
var factory_1 = require("../../packages/nerve/src/factory");
var router = (0, express_1.Router)();
/**
 * GET /api/env-keeper/status
 * Get Env Keeper status
 */
router.get("/status", siwe_auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var status_1;
    return __generator(this, function (_a) {
        try {
            status_1 = env_keeper_core_1.EnvKeeperCore.status();
            res.json({ success: true, status: status_1 });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/env-keeper/list
 * List all environment variables (values masked for secrets)
 */
router.get("/list", siwe_auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var vars, masked;
    return __generator(this, function (_a) {
        try {
            vars = env_keeper_core_1.EnvKeeperCore.list(false);
            masked = vars.map(function (v) { return (__assign(__assign({}, v), { value: v.isSecret ? "[ENCRYPTED]" : v.value })); });
            res.json({ success: true, variables: masked, count: masked.length });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/env-keeper/get/:key
 * Get specific environment variable (decrypted if authorized)
 */
router.get("/get/:key", siwe_auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var key, decrypt, isAdmin, envVar, response;
    var _a;
    return __generator(this, function (_b) {
        try {
            key = req.params.key;
            decrypt = req.query.decrypt;
            isAdmin = (_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin;
            envVar = env_keeper_core_1.EnvKeeperCore.get(key, decrypt === "true" && isAdmin);
            if (!envVar) {
                return [2 /*return*/, res.status(404).json({ error: "Environment variable not found" })];
            }
            response = __assign(__assign({}, envVar), { value: envVar.isSecret && (!isAdmin || decrypt !== "true") ? "[ENCRYPTED]" : envVar.value });
            res.json({ success: true, variable: response });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
/**
 * POST /api/env-keeper/set
 * Set environment variable (governed port)
 */
router.post("/set", (0, withPort_1.withPort)("ENVKEEPER_PORT"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "ENVKEEPER_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, key, value, category, isSecret, description, environments, traceId, callerIdentity, envVar, event_1;
    var _b;
    return __generator(this, function (_c) {
        try {
            _a = req.body, key = _a.key, value = _a.value, category = _a.category, isSecret = _a.isSecret, description = _a.description, environments = _a.environments;
            traceId = req.traceId || "unknown";
            callerIdentity = req.callerIdentity;
            if (!key || value === undefined) {
                return [2 /*return*/, res.status(400).json({ error: "key and value are required" })];
            }
            envVar = env_keeper_core_1.EnvKeeperCore.set(key, value, {
                category: category,
                isSecret: isSecret,
                description: description,
                environments: environments,
            });
            // Emit Nerve event for secret mutations (EnvKeeperCore.set already emits, but we add context)
            if (envVar.isSecret) {
                try {
                    event_1 = (0, factory_1.createNerveEvent)({
                        channelId: "DREAMSTATE_EVENT",
                        kind: "DREAMSTATE_DECISION",
                        priority: 5,
                        context: {
                            traceId: traceId,
                            clusterId: "ENVKEEPER_CORE",
                            tierId: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.tierId,
                            citizenId: (_b = callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.passport) === null || _b === void 0 ? void 0 : _b.citizenId,
                            officeIds: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.officeIds,
                            cabinetIds: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.cabinetIds,
                        },
                        payload: {
                            action: "ENV_SECRET_MUTATION",
                            key: envVar.key,
                            sensitivity: "secret",
                        },
                        defaultSampleRate: 1.0,
                    });
                    bus_1.NERVE_BUS.publish(event_1);
                }
                catch (error) {
                    // Nerve not available, continue
                }
            }
            res.json({
                success: true,
                variable: __assign(__assign({}, envVar), { value: envVar.isSecret ? "[ENCRYPTED]" : envVar.value }),
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
/**
 * DELETE /api/env-keeper/delete/:key
 * Delete environment variable (governed port)
 */
router.delete("/delete/:key", (0, withPort_1.withPort)("ENVKEEPER_PORT"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "ENVKEEPER_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var key, traceId, callerIdentity, deleted, getEnvDescriptor, descriptor, event_2;
    var _a;
    return __generator(this, function (_b) {
        try {
            key = req.params.key;
            traceId = req.traceId || "unknown";
            callerIdentity = req.callerIdentity;
            deleted = env_keeper_core_1.EnvKeeperCore.delete(key);
            // Emit Nerve event for secret deletions (EnvKeeperCore.delete already emits, but we add context)
            if (deleted) {
                try {
                    getEnvDescriptor = require("../../packages/env-keeper-core/logic/envClassifier").getEnvDescriptor;
                    descriptor = getEnvDescriptor(key);
                    if (descriptor && descriptor.sensitivity === "secret") {
                        event_2 = (0, factory_1.createNerveEvent)({
                            channelId: "DREAMSTATE_EVENT",
                            kind: "DREAMSTATE_DECISION",
                            priority: 5,
                            context: {
                                traceId: traceId,
                                clusterId: "ENVKEEPER_CORE",
                                tierId: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.tierId,
                                citizenId: (_a = callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.passport) === null || _a === void 0 ? void 0 : _a.citizenId,
                                officeIds: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.officeIds,
                                cabinetIds: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.cabinetIds,
                            },
                            payload: {
                                action: "ENV_SECRET_DELETION",
                                key: key,
                                sensitivity: "secret",
                            },
                            defaultSampleRate: 1.0,
                        });
                        bus_1.NERVE_BUS.publish(event_2);
                    }
                }
                catch (error) {
                    // Nerve not available, continue
                }
            }
            if (deleted) {
                res.json({ success: true, message: "Environment variable deleted" });
            }
            else {
                res.status(404).json({ error: "Environment variable not found" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
/**
 * POST /api/env-keeper/sync
 * Sync environment variables from all sources (governed port)
 */
router.post("/sync", (0, withPort_1.withPort)("ENVKEEPER_PORT"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "ENVKEEPER_CORE" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var discovered, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, env_keeper_core_1.EnvKeeperCore.sync()];
            case 1:
                discovered = _a.sent();
                res.json({
                    success: true,
                    message: "Synced ".concat(discovered.length, " environment variable(s)"),
                    count: discovered.length,
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
/**
 * GET /api/env-keeper/generate-env
 * Generate .env file content
 */
router.get("/generate-env", siwe_auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, environment, includeComments, content;
    return __generator(this, function (_b) {
        try {
            _a = req.query, environment = _a.environment, includeComments = _a.includeComments;
            content = env_keeper_core_1.EnvKeeperCore.generateEnvFile(environment, includeComments !== "false");
            res.setHeader("Content-Type", "text/plain");
            res.send(content);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/env-keeper/export
 * Export environment variables as JSON
 */
router.get("/export", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var decrypt, exportData;
    return __generator(this, function (_a) {
        try {
            decrypt = req.query.decrypt;
            exportData = env_keeper_core_1.EnvKeeperCore.export(decrypt === "true");
            res.json(__assign({ success: true }, exportData));
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/env-keeper/sync-sources
 * Get sync sources status
 */
router.get("/sync-sources", siwe_auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sources;
    return __generator(this, function (_a) {
        try {
            sources = env_keeper_core_1.EnvKeeperCore.getSyncSources();
            res.json({ success: true, sources: sources });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;

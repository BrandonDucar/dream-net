"use strict";
/**
 * Agent Gateway
 * High-bandwidth, AI-native ingress for ChatGPT, Cursor, Replit agents, and other DreamNet-integrated AIs
 * Upgraded with intent router and tool registry
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
var withPort_1 = require("../../packages/port-governor/src/withPort");
var controlCoreMiddleware_1 = require("../../packages/dreamnet-control-core/controlCoreMiddleware");
var router_1 = require("../../packages/agent-gateway/src/router");
var tools_1 = require("../../packages/agent-gateway/src/tools");
var executor_1 = require("../../packages/agent-gateway/src/executor");
var router = (0, express_1.Router)();
/**
 * GET /api/agent/gateway/tools
 * List all available tools (filtered by caller permissions)
 */
router.get("/agent/gateway/tools", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "API_KEEPER" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, traceId, callerIdentity, allTools, availableTools, _i, allTools_1, tool, allowed;
    var _a;
    return __generator(this, function (_b) {
        try {
            r = req;
            traceId = r.traceId || "unknown";
            callerIdentity = r.callerIdentity;
            allTools = (0, tools_1.listTools)();
            availableTools = [];
            // Filter tools by caller permissions
            for (_i = 0, allTools_1 = allTools; _i < allTools_1.length; _i++) {
                tool = allTools_1[_i];
                allowed = (0, router_1.isToolAllowedForCaller)(tool.id, r).allowed;
                if (allowed) {
                    availableTools.push({
                        id: tool.id,
                        label: tool.label,
                        description: tool.description,
                        clusterId: tool.clusterId,
                        portId: tool.portId,
                        minTier: tool.minTier,
                    });
                }
            }
            return [2 /*return*/, res.json({
                    success: true,
                    traceId: traceId,
                    citizenId: (_a = callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.passport) === null || _a === void 0 ? void 0 : _a.citizenId,
                    tierId: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.tierId,
                    tools: availableTools,
                    totalTools: allTools.length,
                    availableTools: availableTools.length,
                    message: "Available tools filtered by your permissions",
                })];
        }
        catch (error) {
            res.status(500).json({
                error: "GATEWAY_ERROR",
                message: error.message,
                traceId: req.traceId || "unknown",
            });
        }
        return [2 /*return*/];
    });
}); });
/**
 * POST /api/agent/gateway
 * Agent Gateway endpoint - single AI-native entry point for ChatGPT, Cursor, Replit agents
 * Routes intents to tools via Tool Registry
 */
router.post("/agent/gateway", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "API_KEEPER" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, body, traceId, callerIdentity, resolution, toolId, toolConfig, _a, allowed, reason, executionResult, error_1;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                _m.trys.push([0, 2, , 3]);
                r = req;
                body = req.body;
                traceId = r.traceId || "unknown";
                callerIdentity = r.callerIdentity;
                // Validation
                if (!(body === null || body === void 0 ? void 0 : body.intent) || typeof body.intent !== "string") {
                    return [2 /*return*/, res.status(400).json({
                            traceId: traceId,
                            error: "INTENT_REQUIRED",
                            message: "Intent is required and must be a string",
                        })];
                }
                resolution = (0, router_1.resolveIntentToTool)(body);
                if (!resolution.tool) {
                    return [2 /*return*/, res.status(400).json({
                            traceId: traceId,
                            error: "NO_MATCHING_TOOL",
                            reason: resolution.reason,
                            intent: body.intent,
                            message: "Could not resolve intent to a known tool. Use tool IDs like 'env.get', 'api.listKeys', 'vercel.deploy', or natural language.",
                        })];
                }
                toolId = resolution.tool;
                toolConfig = (0, tools_1.getToolConfig)(toolId);
                if (!toolConfig) {
                    return [2 /*return*/, res.status(404).json({
                            traceId: traceId,
                            error: "UNKNOWN_TOOL",
                            toolId: toolId,
                            message: "Tool ".concat(toolId, " not found in registry"),
                        })];
                }
                _a = (0, router_1.isToolAllowedForCaller)(toolId, r), allowed = _a.allowed, reason = _a.reason;
                if (!allowed) {
                    return [2 /*return*/, res.status(403).json({
                            traceId: traceId,
                            error: "TOOL_NOT_ALLOWED",
                            toolId: toolId,
                            reason: reason,
                            toolConfig: {
                                id: toolConfig.id,
                                label: toolConfig.label,
                                minTier: toolConfig.minTier,
                                requiredOfficeIds: toolConfig.requiredOfficeIds,
                                requiredCabinetIds: toolConfig.requiredCabinetIds,
                            },
                            caller: {
                                tierId: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.tierId,
                                officeIds: (_b = callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.officeIds) !== null && _b !== void 0 ? _b : [],
                                cabinetIds: (_c = callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.cabinetIds) !== null && _c !== void 0 ? _c : [],
                                isGodVault: (_d = callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.isGodVault) !== null && _d !== void 0 ? _d : false,
                            },
                            message: "Access denied: ".concat(reason, ". Required: tier ").concat(toolConfig.minTier, " or higher").concat(((_e = toolConfig.requiredOfficeIds) === null || _e === void 0 ? void 0 : _e.length) ? ", office: ".concat(toolConfig.requiredOfficeIds.join(" or ")) : "").concat(((_f = toolConfig.requiredCabinetIds) === null || _f === void 0 ? void 0 : _f.length) ? ", cabinet: ".concat(toolConfig.requiredCabinetIds.join(" or ")) : ""),
                        })];
                }
                return [4 /*yield*/, (0, executor_1.executeTool)(toolId, body.payload || {}, r)];
            case 1:
                executionResult = _m.sent();
                if (!executionResult.ok) {
                    return [2 /*return*/, res.status(400).json({
                            traceId: traceId,
                            error: "TOOL_EXECUTION_FAILED",
                            toolId: toolId,
                            executionError: executionResult.error,
                            data: executionResult.data,
                        })];
                }
                // 4) Return execution result
                return [2 /*return*/, res.json({
                        traceId: traceId,
                        citizenId: (_g = callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.passport) === null || _g === void 0 ? void 0 : _g.citizenId,
                        tierId: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.tierId,
                        officeIds: (_h = callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.officeIds) !== null && _h !== void 0 ? _h : [],
                        cabinetIds: (_j = callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.cabinetIds) !== null && _j !== void 0 ? _j : [],
                        intent: body.intent,
                        toolId: toolId,
                        toolConfig: {
                            id: toolConfig.id,
                            label: toolConfig.label,
                            description: toolConfig.description,
                            clusterId: toolConfig.clusterId,
                            portId: toolConfig.portId,
                            minTier: toolConfig.minTier,
                        },
                        constraints: (_k = body.constraints) !== null && _k !== void 0 ? _k : {},
                        payload: (_l = body.payload) !== null && _l !== void 0 ? _l : {},
                        result: {
                            ok: executionResult.ok,
                            data: executionResult.data,
                            latencyMs: executionResult.latencyMs,
                        },
                        message: "Tool executed successfully",
                        status: "completed",
                    })];
            case 2:
                error_1 = _m.sent();
                res.status(500).json({
                    error: "GATEWAY_ERROR",
                    message: error_1.message,
                    traceId: req.traceId || "unknown",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;

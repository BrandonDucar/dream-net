"use strict";
/**
 * ChatGPT Agent Mode Interface
 * Natural language interface for ChatGPT to interact with DreamNet
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
var apiKeyAuth_1 = require("../middleware/apiKeyAuth");
var dreamnet_vercel_agent_1 = require("../../packages/dreamnet-vercel-agent");
var withPort_1 = require("../../packages/port-governor/src/withPort");
var controlCoreMiddleware_1 = require("../../packages/dreamnet-control-core/controlCoreMiddleware");
var router = (0, express_1.Router)();
/**
 * GET /api/chatgpt-agent/context
 * Provides ChatGPT with context about DreamNet's capabilities
 */
router.get("/context", apiKeyAuth_1.requireApiKey, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var context_1;
    return __generator(this, function (_a) {
        try {
            context_1 = {
                system: "DreamNet",
                description: "A biomimetic digital organism with autonomous agents and systems",
                capabilities: {
                    deployment: {
                        description: "Manage Vercel deployments and projects",
                        endpoints: [
                            "GET /api/vercel/projects - List all projects",
                            "GET /api/vercel/project/:name - Get specific project",
                            "GET /api/vercel/analyze - Analyze cleanup opportunities",
                            "POST /api/vercel/cleanup/auto - Auto-cleanup projects",
                        ],
                        examples: [
                            "List all Vercel projects",
                            "Show me the dreamnet.ink project",
                            "Analyze Vercel projects for cleanup",
                            "Clean up duplicate projects",
                        ],
                    },
                    monitoring: {
                        description: "Monitor DreamNet system status and health",
                        endpoints: [
                            "GET /api/heartbeat - Full system status",
                            "GET /api/system/state - System state",
                            "GET /api/system/spider - Spider Web status",
                            "GET /api/system/shields - Shield Core status",
                        ],
                        examples: [
                            "What's DreamNet's current status?",
                            "Show me system health",
                            "Check Shield Core threats",
                            "What's happening in Spider Web?",
                        ],
                    },
                    dreams: {
                        description: "Manage dreams (user-submitted content)",
                        endpoints: [
                            "GET /api/dreams - List dreams",
                            "GET /api/dreams/:id - Get specific dream",
                            "POST /api/dreams - Create dream",
                        ],
                        examples: [
                            "List all dreams",
                            "Show me dream #123",
                            "Create a new dream",
                        ],
                    },
                    wolfPack: {
                        description: "Wolf Pack funding system - lead discovery and outreach",
                        endpoints: [
                            "GET /api/wolf-pack/opportunities - List opportunities",
                            "POST /api/wolf-pack/discover - Discover new leads",
                            "POST /api/wolf-pack/hunt - Start a hunt",
                        ],
                        examples: [
                            "What funding opportunities are available?",
                            "Discover new leads",
                            "Start a funding hunt",
                        ],
                    },
                    shield: {
                        description: "Shield Core - security and threat detection",
                        endpoints: [
                            "GET /api/shield/status - Shield status",
                            "GET /api/shield/threats - Recent threats",
                            "POST /api/shield/detect - Detect threat",
                        ],
                        examples: [
                            "Show me Shield Core status",
                            "What threats have been detected?",
                            "Check for security threats",
                        ],
                    },
                },
                baseUrl: process.env.DREAMNET_BASE_URL || "https://dreamnet.ink",
                authentication: {
                    method: "API Key",
                    header: "Authorization: Bearer YOUR_API_KEY",
                    alternateHeader: "X-API-Key: YOUR_API_KEY",
                },
            };
            res.json({
                success: true,
                context: context_1,
                message: "Use this context to understand DreamNet's capabilities",
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
/**
 * POST /api/chatgpt-agent/chat
 * Natural language interface - ChatGPT sends a message, DreamNet responds with actions
 * Routes through AGENT_GATEWAY port
 */
router.post("/chat", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "API_KEEPER" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, message, context_2, lowerMessage, response, projects, error_1, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                _a = req.body, message = _a.message, context_2 = _a.context;
                if (!message || typeof message !== "string") {
                    return [2 /*return*/, res.status(400).json({
                            error: "Message is required",
                            suggestion: "Send a natural language message like 'Show me DreamNet status' or 'List Vercel projects'",
                        })];
                }
                lowerMessage = message.toLowerCase();
                response = {
                    message: message,
                    understood: true,
                    actions: [],
                    data: null,
                    suggestions: [],
                };
                if (!(lowerMessage.includes("vercel") || lowerMessage.includes("deploy") || lowerMessage.includes("project"))) return [3 /*break*/, 7];
                if (!(lowerMessage.includes("list") || lowerMessage.includes("show") || lowerMessage.includes("all"))) return [3 /*break*/, 5];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dreamnet_vercel_agent_1.DreamNetVercelAgent.analyzeCleanup()];
            case 2:
                projects = _b.sent();
                response.actions.push({
                    type: "vercel_list_projects",
                    endpoint: "GET /api/vercel/projects",
                    description: "List all Vercel projects",
                });
                response.data = {
                    projectsFound: projects.length,
                    message: "Found ".concat(projects.length, " potential cleanup actions. Use GET /api/vercel/projects to see all projects."),
                };
                response.suggestions.push("Try: GET /api/vercel/projects to see all projects");
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                response.data = {
                    error: error_1.message,
                    suggestion: "Make sure VERCEL_TOKEN is configured",
                };
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                if (lowerMessage.includes("cleanup") || lowerMessage.includes("clean") || lowerMessage.includes("duplicate")) {
                    response.actions.push({
                        type: "vercel_analyze_cleanup",
                        endpoint: "GET /api/vercel/analyze",
                        description: "Analyze Vercel projects for cleanup opportunities",
                    });
                    response.data = {
                        message: "Use GET /api/vercel/analyze?targetDomain=dreamnet.ink to analyze cleanup opportunities",
                    };
                    response.suggestions.push("Try: GET /api/vercel/analyze?targetDomain=dreamnet.ink");
                }
                else if (lowerMessage.includes("dreamnet.ink") || lowerMessage.includes("dreamnet")) {
                    response.actions.push({
                        type: "vercel_get_project",
                        endpoint: "GET /api/vercel/project/dreamnet.ink",
                        description: "Get dreamnet.ink project details",
                    });
                    response.data = {
                        message: "Use GET /api/vercel/project/dreamnet.ink to get project details",
                    };
                    response.suggestions.push("Try: GET /api/vercel/project/dreamnet.ink");
                }
                _b.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                if (lowerMessage.includes("status") || lowerMessage.includes("health") || lowerMessage.includes("how")) {
                    // Status queries
                    response.actions.push({
                        type: "get_status",
                        endpoint: "GET /api/heartbeat",
                        description: "Get DreamNet system status",
                    });
                    response.data = {
                        message: "Use GET /api/heartbeat to get full system status",
                    };
                    response.suggestions.push("Try: GET /api/heartbeat");
                }
                else if (lowerMessage.includes("shield") || lowerMessage.includes("security") || lowerMessage.includes("threat")) {
                    // Shield Core queries
                    response.actions.push({
                        type: "get_shield_status",
                        endpoint: "GET /api/shield/status",
                        description: "Get Shield Core status",
                    });
                    response.data = {
                        message: "Use GET /api/shield/status to get Shield Core status",
                    };
                    response.suggestions.push("Try: GET /api/shield/status or GET /api/shield/threats");
                }
                else if (lowerMessage.includes("wolf") || lowerMessage.includes("pack") || lowerMessage.includes("funding") || lowerMessage.includes("lead")) {
                    // Wolf Pack queries
                    response.actions.push({
                        type: "get_wolf_pack_status",
                        endpoint: "GET /api/wolf-pack/opportunities",
                        description: "Get Wolf Pack opportunities",
                    });
                    response.data = {
                        message: "Use GET /api/wolf-pack/opportunities to see funding opportunities",
                    };
                    response.suggestions.push("Try: GET /api/wolf-pack/opportunities");
                }
                else if (lowerMessage.includes("dream")) {
                    // Dream queries
                    response.actions.push({
                        type: "list_dreams",
                        endpoint: "GET /api/dreams",
                        description: "List all dreams",
                    });
                    response.data = {
                        message: "Use GET /api/dreams to list all dreams",
                    };
                    response.suggestions.push("Try: GET /api/dreams");
                }
                else {
                    // Unknown query
                    response.understood = false;
                    response.data = {
                        message: "I didn't understand that. Here are some things I can help with:",
                        capabilities: [
                            "Vercel deployment management",
                            "System status monitoring",
                            "Shield Core security",
                            "Wolf Pack funding",
                            "Dream management",
                        ],
                    };
                    response.suggestions.push("Try: 'Show me DreamNet status' or 'List Vercel projects'");
                }
                _b.label = 8;
            case 8:
                res.json(__assign({ success: true }, response));
                return [3 /*break*/, 10];
            case 9:
                error_2 = _b.sent();
                res.status(500).json({
                    error: error_2.message,
                    suggestion: "Check the API documentation at /api/chatgpt-agent/context",
                });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/chatgpt-agent/execute
 * Execute a specific action (for ChatGPT to call after understanding intent)
 * Routes through AGENT_GATEWAY port
 */
router.post("/execute", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "API_KEEPER" }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, action, params, result, projectName, targetDomain;
    return __generator(this, function (_b) {
        try {
            _a = req.body, action = _a.action, params = _a.params;
            if (!action) {
                return [2 /*return*/, res.status(400).json({
                        error: "Action is required",
                        availableActions: [
                            "vercel_list_projects",
                            "vercel_get_project",
                            "vercel_analyze_cleanup",
                            "vercel_cleanup",
                            "get_status",
                            "get_shield_status",
                            "get_wolf_pack_status",
                            "list_dreams",
                        ],
                    })];
            }
            result = {};
            switch (action) {
                case "vercel_list_projects":
                    // Redirect to actual endpoint
                    result = {
                        redirect: "/api/vercel/projects",
                        message: "Call GET /api/vercel/projects to list projects",
                    };
                    break;
                case "vercel_get_project":
                    projectName = (params === null || params === void 0 ? void 0 : params.name) || "dreamnet.ink";
                    result = {
                        redirect: "/api/vercel/project/".concat(projectName),
                        message: "Call GET /api/vercel/project/".concat(projectName, " to get project details"),
                    };
                    break;
                case "vercel_analyze_cleanup":
                    targetDomain = (params === null || params === void 0 ? void 0 : params.targetDomain) || "dreamnet.ink";
                    result = {
                        redirect: "/api/vercel/analyze?targetDomain=".concat(targetDomain),
                        message: "Call GET /api/vercel/analyze?targetDomain=".concat(targetDomain, " to analyze cleanup"),
                    };
                    break;
                case "get_status":
                    result = {
                        redirect: "/api/heartbeat",
                        message: "Call GET /api/heartbeat to get system status",
                    };
                    break;
                case "get_shield_status":
                    result = {
                        redirect: "/api/shield/status",
                        message: "Call GET /api/shield/status to get Shield Core status",
                    };
                    break;
                case "get_wolf_pack_status":
                    result = {
                        redirect: "/api/wolf-pack/opportunities",
                        message: "Call GET /api/wolf-pack/opportunities to get Wolf Pack status",
                    };
                    break;
                case "list_dreams":
                    result = {
                        redirect: "/api/dreams",
                        message: "Call GET /api/dreams to list dreams",
                    };
                    break;
                default:
                    return [2 /*return*/, res.status(400).json({
                            error: "Unknown action: ".concat(action),
                            availableActions: [
                                "vercel_list_projects",
                                "vercel_get_project",
                                "vercel_analyze_cleanup",
                                "get_status",
                                "get_shield_status",
                                "get_wolf_pack_status",
                                "list_dreams",
                            ],
                        })];
            }
            res.json({
                success: true,
                action: action,
                result: result,
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/chatgpt-agent/quick-start
 * Quick start guide for ChatGPT
 */
router.get("/quick-start", apiKeyAuth_1.requireApiKey, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var guide;
    return __generator(this, function (_a) {
        guide = {
            title: "ChatGPT Agent Mode - DreamNet Quick Start",
            steps: [
                {
                    step: 1,
                    action: "Get context",
                    endpoint: "GET /api/chatgpt-agent/context",
                    description: "Learn what DreamNet can do",
                },
                {
                    step: 2,
                    action: "Chat with DreamNet",
                    endpoint: "POST /api/chatgpt-agent/chat",
                    body: { message: "Show me DreamNet status" },
                    description: "Use natural language to interact",
                },
                {
                    step: 3,
                    action: "Execute actions",
                    endpoint: "POST /api/chatgpt-agent/execute",
                    body: { action: "get_status" },
                    description: "Execute specific actions",
                },
            ],
            examples: [
                {
                    message: "Show me DreamNet status",
                    expectedResponse: "Returns actions to call GET /api/heartbeat",
                },
                {
                    message: "List all Vercel projects",
                    expectedResponse: "Returns actions to call GET /api/vercel/projects",
                },
                {
                    message: "Analyze Vercel projects for cleanup",
                    expectedResponse: "Returns actions to call GET /api/vercel/analyze",
                },
                {
                    message: "What threats has Shield Core detected?",
                    expectedResponse: "Returns actions to call GET /api/shield/threats",
                },
            ],
            tips: [
                "Always start with GET /api/chatgpt-agent/context to understand capabilities",
                "Use POST /api/chatgpt-agent/chat for natural language queries",
                "Then call the actual endpoints returned in the 'actions' array",
                "We have direct Vercel integration - better than ChatGPT's built-in connector!",
            ],
        };
        res.json({
            success: true,
            guide: guide,
        });
        return [2 /*return*/];
    });
}); });
exports.default = router;

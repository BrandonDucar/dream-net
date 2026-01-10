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
exports.createBiomimeticSystemsRouter = createBiomimeticSystemsRouter;
var express_1 = require("express");
var swarm_coordinator_1 = require("../swarm-coordinator");
var ConnectorBot_1 = require("../routes/ConnectorBot");
function createBiomimeticSystemsRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    // SWARM COORDINATOR ROUTES
    // GET /api/biomimetic/swarm/status - Get swarm status
    router.get("/biomimetic/swarm/status", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var status_1;
        return __generator(this, function (_a) {
            try {
                status_1 = swarm_coordinator_1.swarmCoordinator.getSwarmStatus();
                res.json({ ok: true, status: status_1 });
            }
            catch (error) {
                console.error("Failed to get swarm status:", error);
                res.status(500).json({ ok: false, error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // POST /api/biomimetic/swarm/execute - Execute swarm operation
    router.post("/biomimetic/swarm/execute", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, type, params, operationId, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, type = _a.type, params = _a.params;
                    if (!type) {
                        return [2 /*return*/, res.status(400).json({ ok: false, error: "Operation type is required" })];
                    }
                    return [4 /*yield*/, swarm_coordinator_1.swarmCoordinator.executeSwarmOperation(type, params || {})];
                case 1:
                    operationId = _b.sent();
                    res.json({ ok: true, operationId: operationId });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    console.error("Failed to execute swarm operation:", error_1);
                    res.status(500).json({ ok: false, error: error_1.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // CONNECTOR BOT ROUTES
    // POST /api/biomimetic/connector/route - Route a task
    router.post("/biomimetic/connector/route", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, currentState, goal, availableBots, walletData, urgency, complexity, decision, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, currentState = _a.currentState, goal = _a.goal, availableBots = _a.availableBots, walletData = _a.walletData, urgency = _a.urgency, complexity = _a.complexity;
                    if (!currentState || !goal) {
                        return [2 /*return*/, res.status(400).json({ ok: false, error: "currentState and goal are required" })];
                    }
                    return [4 /*yield*/, ConnectorBot_1.connectorBotV1.routeTask({
                            currentState: currentState,
                            goal: goal,
                            availableBots: availableBots || [],
                            walletData: walletData,
                            urgency: urgency,
                            complexity: complexity,
                        })];
                case 1:
                    decision = _b.sent();
                    res.json({ ok: true, decision: decision });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _b.sent();
                    console.error("Failed to route task:", error_2);
                    res.status(500).json({ ok: false, error: error_2.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // GET /api/biomimetic/connector/capabilities - Get connector bot capabilities
    router.get("/biomimetic/connector/capabilities", function (req, res) {
        try {
            var capabilities = ConnectorBot_1.connectorBotV1.getCapabilities();
            var botCapabilities = ConnectorBot_1.connectorBotV1.getBotCapabilities();
            var routingPatterns = ConnectorBot_1.connectorBotV1.getRoutingPatterns();
            res.json({
                ok: true,
                version: ConnectorBot_1.connectorBotV1.getVersion(),
                capabilities: capabilities,
                botCapabilities: botCapabilities,
                routingPatterns: routingPatterns,
            });
        }
        catch (error) {
            console.error("Failed to get connector capabilities:", error);
            res.status(500).json({ ok: false, error: error.message });
        }
    });
    // NANO BOTS ROUTES (delegated to existing nano routes)
    // GET /api/biomimetic/nano/status - Get nano status
    router.get("/biomimetic/nano/status", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // This will be handled by the existing nano routes
                // For now, return a placeholder
                res.json({
                    ok: true,
                    status: "active",
                    message: "Nano bots are active. Use /api/nano/status for detailed status.",
                    endpoint: "/api/nano/status",
                });
            }
            catch (error) {
                console.error("Failed to get nano status:", error);
                res.status(500).json({ ok: false, error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/biomimetic/systems - List all biomimetic systems
    router.get("/biomimetic/systems", function (req, res) {
        try {
            var systems = [
                {
                    id: "swarm",
                    name: "Swarm (Ants & Bees)",
                    description: "Distributed foraging, division of labor, adaptive routing",
                    status: "active",
                    endpoints: ["/api/biomimetic/swarm/status", "/api/biomimetic/swarm/execute"],
                    ui: "/biomimetic/swarm",
                },
                {
                    id: "connector",
                    name: "Connector Bot",
                    description: "Intelligent task routing and bot orchestration",
                    status: "active",
                    endpoints: ["/api/biomimetic/connector/route", "/api/biomimetic/connector/capabilities"],
                    ui: "/biomimetic/connector",
                },
                {
                    id: "nano",
                    name: "Nano Bots",
                    description: "Micro-agents for image generation and processing",
                    status: "active",
                    endpoints: ["/api/nano/status", "/api/nano/generate"],
                    ui: "/biomimetic/nano",
                },
                {
                    id: "snail",
                    name: "Dream Snail Trail",
                    description: "Know-all win-all privacy layer with verifiable provenance",
                    status: "active",
                    endpoints: ["/api/snail/trail", "/api/snail/privacy", "/api/snail/insights"],
                    ui: "/snail",
                },
                {
                    id: "octopus",
                    name: "Octopus Brain & Arms",
                    description: "Central brain with semi-autonomous arms",
                    status: "documented",
                    endpoints: [],
                    ui: null,
                },
                {
                    id: "chameleon",
                    name: "Chameleon Skin",
                    description: "Adaptive skins, protocol negotiation",
                    status: "documented",
                    endpoints: [],
                    ui: null,
                },
                {
                    id: "wolf-pack",
                    name: "Wolf Pack",
                    description: "Coordinated hunts and pincer moves",
                    status: "active",
                    endpoints: ["/api/wolf-pack/status", "/api/wolf-pack/discover"],
                    ui: "/wolf-pack",
                },
                {
                    id: "falcon-eye",
                    name: "Falcon Eye",
                    description: "Long-range scanning and telemetry",
                    status: "active",
                    endpoints: ["/api/mesh/status"],
                    ui: "/mesh",
                },
                {
                    id: "zen-garden",
                    name: "Zen Garden",
                    description: "Wellness and engagement loops",
                    status: "documented",
                    endpoints: [],
                    ui: null,
                },
                {
                    id: "dream-clouds",
                    name: "Dream Clouds",
                    description: "Thematic clusters (DeSci, DeFi, gaming, memes)",
                    status: "active",
                    endpoints: ["/api/dream-clouds"],
                    ui: "/dream-clouds",
                },
                {
                    id: "magnetic-rail",
                    name: "Magnetic Rail Train",
                    description: "Stage-gated pipelines with explicit checkpoints",
                    status: "active",
                    endpoints: [],
                    ui: null,
                },
                {
                    id: "triple-helix",
                    name: "Triple Helix Armor",
                    description: "Immune system and defense spikes",
                    status: "documented",
                    endpoints: [],
                    ui: null,
                },
            ];
            res.json({ ok: true, systems: systems, count: systems.length });
        }
        catch (error) {
            console.error("Failed to list biomimetic systems:", error);
            res.status(500).json({ ok: false, error: error.message });
        }
    });
    return router;
}

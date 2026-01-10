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
exports.createSuperSpineRouter = createSuperSpineRouter;
var express_1 = require("express");
var SuperSpine_1 = require("../core/SuperSpine");
function createSuperSpineRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    // Middleware to get user ID
    var getUserId = function (req) {
        return req.headers["x-user-id"] ||
            req.query.userId ||
            undefined;
    };
    // GET /api/super-spine/agents - Get all agents
    router.get("/super-spine/agents", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, capability, available, agents;
        return __generator(this, function (_b) {
            try {
                _a = req.query, capability = _a.capability, available = _a.available;
                agents = SuperSpine_1.superSpine.getAllAgents();
                if (capability) {
                    agents = SuperSpine_1.superSpine.getAvailableAgents(capability);
                }
                else if (available === "true") {
                    agents = SuperSpine_1.superSpine.getAvailableAgents();
                }
                res.json({ ok: true, agents: agents });
            }
            catch (error) {
                console.error("Failed to get agents:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/super-spine/agent/:key - Get specific agent
    router.get("/super-spine/agent/:key", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var agent, stats;
        return __generator(this, function (_a) {
            try {
                agent = SuperSpine_1.superSpine.getAgent(req.params.key);
                if (!agent) {
                    return [2 /*return*/, res.status(404).json({ error: "Agent not found" })];
                }
                stats = SuperSpine_1.superSpine.getAgentStats(req.params.key);
                res.json({ ok: true, agent: agent, stats: stats });
            }
            catch (error) {
                console.error("Failed to get agent:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/super-spine/agent/:key/access - Check user access to agent
    router.get("/super-spine/agent/:key/access", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, _a, trustScore, completedDreams, stakedSheep, hasTokenBoost, access;
        return __generator(this, function (_b) {
            try {
                userId = getUserId(req);
                _a = req.query, trustScore = _a.trustScore, completedDreams = _a.completedDreams, stakedSheep = _a.stakedSheep, hasTokenBoost = _a.hasTokenBoost;
                if (!userId) {
                    return [2 /*return*/, res.status(400).json({ error: "User ID required" })];
                }
                access = SuperSpine_1.superSpine.checkAgentAccess(req.params.key, userId, parseInt(String(trustScore || 0), 10), parseInt(String(completedDreams || 0), 10), parseInt(String(stakedSheep || 0), 10), hasTokenBoost === "true");
                res.json(__assign({ ok: true }, access));
            }
            catch (error) {
                console.error("Failed to check access:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // POST /api/super-spine/subscription - Create agent subscription
    router.post("/super-spine/subscription", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, agentKey, period, userId, subscription;
        return __generator(this, function (_b) {
            try {
                _a = req.body, agentKey = _a.agentKey, period = _a.period;
                userId = getUserId(req);
                if (!userId || !agentKey) {
                    return [2 /*return*/, res.status(400).json({ error: "userId and agentKey are required" })];
                }
                subscription = SuperSpine_1.superSpine.createSubscription(userId, agentKey, period);
                if (!subscription) {
                    return [2 /*return*/, res.status(400).json({ error: "Failed to create subscription" })];
                }
                res.json({ ok: true, subscription: subscription });
            }
            catch (error) {
                console.error("Failed to create subscription:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/super-spine/subscription/:agentKey - Get user's subscription for agent
    router.get("/super-spine/subscription/:agentKey", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, subscription;
        return __generator(this, function (_a) {
            try {
                userId = getUserId(req);
                if (!userId) {
                    return [2 /*return*/, res.status(400).json({ error: "User ID required" })];
                }
                subscription = SuperSpine_1.superSpine.getUserSubscription(userId, req.params.agentKey);
                res.json({ ok: true, subscription: subscription || null });
            }
            catch (error) {
                console.error("Failed to get subscription:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // POST /api/super-spine/task - Submit task to agent
    router.post("/super-spine/task", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, agentKey, type, input, userId, _b, trustScore, completedDreams, stakedSheep, hasTokenBoost, access, task;
        return __generator(this, function (_c) {
            try {
                _a = req.body, agentKey = _a.agentKey, type = _a.type, input = _a.input;
                userId = getUserId(req);
                if (!agentKey || !type) {
                    return [2 /*return*/, res.status(400).json({ error: "agentKey and type are required" })];
                }
                _b = req.body, trustScore = _b.trustScore, completedDreams = _b.completedDreams, stakedSheep = _b.stakedSheep, hasTokenBoost = _b.hasTokenBoost;
                access = SuperSpine_1.superSpine.checkAgentAccess(agentKey, userId || "anonymous", parseInt(String(trustScore || 0), 10), parseInt(String(completedDreams || 0), 10), parseInt(String(stakedSheep || 0), 10), hasTokenBoost === "true");
                if (!access.hasAccess) {
                    return [2 /*return*/, res.status(403).json({ error: access.reason || "Access denied" })];
                }
                task = SuperSpine_1.superSpine.submitTask(agentKey, type, input || {}, userId);
                res.json({ ok: true, task: task });
            }
            catch (error) {
                console.error("Failed to submit task:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/super-spine/tasks - Get user's tasks
    router.get("/super-spine/tasks", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, tasks;
        return __generator(this, function (_a) {
            try {
                userId = getUserId(req);
                if (!userId) {
                    return [2 /*return*/, res.status(400).json({ error: "User ID required" })];
                }
                tasks = SuperSpine_1.superSpine.getUserTasks(userId);
                res.json({ ok: true, tasks: tasks });
            }
            catch (error) {
                console.error("Failed to get tasks:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/super-spine/task/:id - Get specific task
    router.get("/super-spine/task/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var task;
        return __generator(this, function (_a) {
            try {
                task = SuperSpine_1.superSpine.getTask(req.params.id);
                if (!task) {
                    return [2 /*return*/, res.status(404).json({ error: "Task not found" })];
                }
                res.json({ ok: true, task: task });
            }
            catch (error) {
                console.error("Failed to get task:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    return router;
}

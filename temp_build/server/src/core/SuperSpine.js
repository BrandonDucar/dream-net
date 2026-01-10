"use strict";
/**
 * Super Spine - Agent Orchestration Backbone
 *
 * The central nervous system that coordinates all agents:
 * - Agent discovery and registration
 * - Task routing and load balancing
 * - Agent health monitoring
 * - Inter-agent communication
 * - Agent marketplace and subscriptions
 *
 * PERSISTENCE:
 * - Primary: PostgreSQL database (Cloud SQL/AlloyDB for Cloud Run)
 * - Fallback: In-memory storage (if database unavailable)
 * - Future: Persistent disk for Compute Engine deployments
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
exports.superSpine = void 0;
var node_crypto_1 = require("node:crypto");
var db_1 = require("../db");
var schema_1 = require("../../shared/schema");
var drizzle_orm_1 = require("drizzle-orm");
var SuperSpine = /** @class */ (function () {
    function SuperSpine() {
        this.agents = new Map();
        this.tasks = new Map();
        this.subscriptions = new Map();
        this.useDatabase = false;
        this.initialized = false;
        this.initialize();
    }
    /**
     * Initialize Super Spine with persistence
     */
    SuperSpine.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.useDatabase = (0, db_1.isDbAvailable)();
                        if (!this.useDatabase) return [3 /*break*/, 2];
                        console.log("[Super Spine] 🗄️  Using database persistence");
                        return [4 /*yield*/, this.loadFromDatabase()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        console.log("[Super Spine] 💾 Using in-memory storage (database unavailable)");
                        _a.label = 3;
                    case 3:
                        // Always initialize core agents (will be persisted if DB available)
                        this.initializeCoreAgents();
                        this.startHealthMonitoring();
                        this.initialized = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load agents, tasks, and subscriptions from database
     */
    SuperSpine.prototype.loadFromDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var db, agentRecords, _i, agentRecords_1, record, node, taskRecords, _a, taskRecords_1, record, task, subscriptionRecords, _b, subscriptionRecords_1, record, subscription, error_1;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 4, , 5]);
                        db = (0, db_1.getDb)();
                        return [4 /*yield*/, db.select().from(schema_1.superSpineAgents)];
                    case 1:
                        agentRecords = _e.sent();
                        for (_i = 0, agentRecords_1 = agentRecords; _i < agentRecords_1.length; _i++) {
                            record = agentRecords_1[_i];
                            node = {
                                id: record.id,
                                agentKey: record.agentKey,
                                name: record.name,
                                status: record.status,
                                capabilities: record.capabilities,
                                currentTask: record.currentTask || undefined,
                                taskQueue: record.taskQueue || [],
                                health: record.health,
                                metadata: record.metadata,
                                registeredAt: record.registeredAt.toISOString(),
                                lastActiveAt: record.lastActiveAt.toISOString(),
                            };
                            this.agents.set(record.agentKey, node);
                        }
                        return [4 /*yield*/, db.select().from(schema_1.superSpineTasks)];
                    case 2:
                        taskRecords = _e.sent();
                        for (_a = 0, taskRecords_1 = taskRecords; _a < taskRecords_1.length; _a++) {
                            record = taskRecords_1[_a];
                            task = {
                                id: record.id,
                                userId: record.userId || undefined,
                                agentKey: record.agentKey,
                                type: record.type,
                                input: record.input,
                                status: record.status,
                                result: record.result,
                                error: record.error || undefined,
                                createdAt: record.createdAt.toISOString(),
                                startedAt: (_c = record.startedAt) === null || _c === void 0 ? void 0 : _c.toISOString(),
                                completedAt: (_d = record.completedAt) === null || _d === void 0 ? void 0 : _d.toISOString(),
                            };
                            this.tasks.set(record.id, task);
                        }
                        return [4 /*yield*/, db.select().from(schema_1.superSpineSubscriptions)];
                    case 3:
                        subscriptionRecords = _e.sent();
                        for (_b = 0, subscriptionRecords_1 = subscriptionRecords; _b < subscriptionRecords_1.length; _b++) {
                            record = subscriptionRecords_1[_b];
                            subscription = {
                                id: record.id,
                                userId: record.userId,
                                agentKey: record.agentKey,
                                status: record.status,
                                startedAt: record.startedAt.toISOString(),
                                expiresAt: record.expiresAt.toISOString(),
                                price: record.price,
                            };
                            this.subscriptions.set(record.id, subscription);
                        }
                        console.log("[Super Spine] \u2705 Loaded ".concat(agentRecords.length, " agents, ").concat(taskRecords.length, " tasks, ").concat(subscriptionRecords.length, " subscriptions from database"));
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _e.sent();
                        console.error("[Super Spine] ❌ Failed to load from database:", error_1);
                        this.useDatabase = false;
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save agent to database
     */
    SuperSpine.prototype.saveAgent = function (agent) {
        return __awaiter(this, void 0, void 0, function () {
            var db, existing, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.useDatabase)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        db = (0, db_1.getDb)();
                        return [4 /*yield*/, db.select().from(schema_1.superSpineAgents).where((0, drizzle_orm_1.eq)(schema_1.superSpineAgents.agentKey, agent.agentKey)).limit(1)];
                    case 2:
                        existing = _a.sent();
                        if (!(existing.length > 0)) return [3 /*break*/, 4];
                        // Update existing
                        return [4 /*yield*/, db.update(schema_1.superSpineAgents)
                                .set({
                                name: agent.name,
                                status: agent.status,
                                capabilities: agent.capabilities,
                                currentTask: agent.currentTask || null,
                                taskQueue: agent.taskQueue,
                                health: agent.health,
                                metadata: agent.metadata,
                                lastActiveAt: new Date(agent.lastActiveAt),
                            })
                                .where((0, drizzle_orm_1.eq)(schema_1.superSpineAgents.agentKey, agent.agentKey))];
                    case 3:
                        // Update existing
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: 
                    // Insert new
                    return [4 /*yield*/, db.insert(schema_1.superSpineAgents).values({
                            id: agent.id,
                            agentKey: agent.agentKey,
                            name: agent.name,
                            status: agent.status,
                            capabilities: agent.capabilities,
                            currentTask: agent.currentTask || null,
                            taskQueue: agent.taskQueue,
                            health: agent.health,
                            metadata: agent.metadata,
                            registeredAt: new Date(agent.registeredAt),
                            lastActiveAt: new Date(agent.lastActiveAt),
                        })];
                    case 5:
                        // Insert new
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_2 = _a.sent();
                        console.error("[Super Spine] \u274C Failed to save agent ".concat(agent.agentKey, ":"), error_2);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save task to database
     */
    SuperSpine.prototype.saveTask = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            var db, existing, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.useDatabase)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        db = (0, db_1.getDb)();
                        return [4 /*yield*/, db.select().from(schema_1.superSpineTasks).where((0, drizzle_orm_1.eq)(schema_1.superSpineTasks.id, task.id)).limit(1)];
                    case 2:
                        existing = _a.sent();
                        if (!(existing.length > 0)) return [3 /*break*/, 4];
                        // Update existing
                        return [4 /*yield*/, db.update(schema_1.superSpineTasks)
                                .set({
                                status: task.status,
                                result: task.result ? JSON.parse(JSON.stringify(task.result)) : null,
                                error: task.error || null,
                                startedAt: task.startedAt ? new Date(task.startedAt) : null,
                                completedAt: task.completedAt ? new Date(task.completedAt) : null,
                            })
                                .where((0, drizzle_orm_1.eq)(schema_1.superSpineTasks.id, task.id))];
                    case 3:
                        // Update existing
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: 
                    // Insert new
                    return [4 /*yield*/, db.insert(schema_1.superSpineTasks).values({
                            id: task.id,
                            userId: task.userId || null,
                            agentKey: task.agentKey,
                            type: task.type,
                            input: task.input,
                            status: task.status,
                            result: task.result ? JSON.parse(JSON.stringify(task.result)) : null,
                            error: task.error || null,
                            createdAt: new Date(task.createdAt),
                            startedAt: task.startedAt ? new Date(task.startedAt) : null,
                            completedAt: task.completedAt ? new Date(task.completedAt) : null,
                        })];
                    case 5:
                        // Insert new
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_3 = _a.sent();
                        console.error("[Super Spine] \u274C Failed to save task ".concat(task.id, ":"), error_3);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save subscription to database
     */
    SuperSpine.prototype.saveSubscription = function (subscription) {
        return __awaiter(this, void 0, void 0, function () {
            var db, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.useDatabase)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        db = (0, db_1.getDb)();
                        return [4 /*yield*/, db.insert(schema_1.superSpineSubscriptions).values({
                                id: subscription.id,
                                userId: subscription.userId,
                                agentKey: subscription.agentKey,
                                status: subscription.status,
                                startedAt: new Date(subscription.startedAt),
                                expiresAt: new Date(subscription.expiresAt),
                                price: subscription.price,
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error("[Super Spine] \u274C Failed to save subscription ".concat(subscription.id, ":"), error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Initialize core agents from shared/agents.ts
     */
    SuperSpine.prototype.initializeCoreAgents = function () {
        var coreAgents = [
            { name: "LUCID", tier: "Standard", unlock: "Default", key: "lucid" },
            { name: "CANVAS", tier: "Standard", unlock: "Default", key: "canvas" },
            { name: "ROOT", tier: "Standard", unlock: "Trust Score > 60", key: "root" },
            { name: "CRADLE", tier: "Premium", unlock: "Trust Score > 80 or Token Boost", key: "cradle" },
            { name: "WING", tier: "Premium", unlock: "Stake 1000 $SHEEP or complete 10 dreams", key: "wing" },
        ];
        for (var _i = 0, coreAgents_1 = coreAgents; _i < coreAgents_1.length; _i++) {
            var agent = coreAgents_1[_i];
            // Only create if not already loaded from database
            if (!this.agents.has(agent.key)) {
                var node = {
                    id: (0, node_crypto_1.randomUUID)(),
                    agentKey: agent.key,
                    name: agent.name,
                    status: "idle",
                    capabilities: this.getCapabilitiesForAgent(agent.key),
                    taskQueue: [],
                    health: {
                        uptime: 100,
                        successRate: 100,
                        avgResponseTime: 0,
                        errorCount: 0,
                    },
                    metadata: {
                        tier: agent.tier,
                        unlock: agent.unlock,
                        subscriptionRequired: agent.tier === "Premium",
                        price: agent.tier === "Premium"
                            ? {
                                amount: agent.key === "cradle" ? 50 : 30,
                                currency: "DREAM",
                                period: "monthly",
                            }
                            : undefined,
                    },
                    registeredAt: new Date().toISOString(),
                    lastActiveAt: new Date().toISOString(),
                };
                this.agents.set(agent.key, node);
                this.saveAgent(node); // Persist immediately
            }
        }
        // Register Wolf Pack if not exists
        if (!this.agents.has("wolf-pack")) {
            var wolfPackNode = {
                id: (0, node_crypto_1.randomUUID)(),
                agentKey: "wolf-pack",
                name: "Wolf Pack",
                status: "idle",
                capabilities: ["funding", "communication", "analysis"],
                taskQueue: [],
                health: {
                    uptime: 100,
                    successRate: 100,
                    avgResponseTime: 0,
                    errorCount: 0,
                },
                metadata: {
                    tier: "Premium",
                    unlock: "Premium Subscription",
                    subscriptionRequired: true,
                    price: {
                        amount: 100,
                        currency: "DREAM",
                        period: "monthly",
                    },
                },
                registeredAt: new Date().toISOString(),
                lastActiveAt: new Date().toISOString(),
            };
            this.agents.set("wolf-pack", wolfPackNode);
            this.saveAgent(wolfPackNode); // Persist immediately
        }
    };
    /**
     * Get capabilities for an agent
     */
    SuperSpine.prototype.getCapabilitiesForAgent = function (agentKey) {
        var capabilities = {
            lucid: ["code", "analysis"],
            canvas: ["design", "code"],
            root: ["code", "analysis"],
            echo: ["analysis"],
            cradle: ["code", "analysis"],
            wing: ["communication"],
            "wolf-pack": ["funding", "communication", "analysis"],
        };
        return capabilities[agentKey] || [];
    };
    /**
     * Register a new agent
     */
    SuperSpine.prototype.registerAgent = function (agentKey, name, capabilities, metadata) {
        var node = {
            id: (0, node_crypto_1.randomUUID)(),
            agentKey: agentKey,
            name: name,
            status: "idle",
            capabilities: capabilities,
            taskQueue: [],
            health: {
                uptime: 100,
                successRate: 100,
                avgResponseTime: 0,
                errorCount: 0,
            },
            metadata: metadata,
            registeredAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
        };
        this.agents.set(agentKey, node);
        this.saveAgent(node); // Persist immediately
        return node;
    };
    /**
     * Get agent node
     */
    SuperSpine.prototype.getAgent = function (agentKey) {
        return this.agents.get(agentKey);
    };
    /**
     * Get all agents
     */
    SuperSpine.prototype.getAllAgents = function () {
        return Array.from(this.agents.values());
    };
    /**
     * Get available agents (not busy, not offline)
     */
    SuperSpine.prototype.getAvailableAgents = function (capability) {
        var agents = Array.from(this.agents.values()).filter(function (a) { return a.status !== "offline" && a.status !== "error"; });
        if (capability) {
            agents = agents.filter(function (a) { return a.capabilities.includes(capability); });
        }
        return agents;
    };
    /**
     * Check if user has access to agent (unlock + subscription)
     */
    SuperSpine.prototype.checkAgentAccess = function (agentKey, userId, trustScore, completedDreams, stakedSheep, hasTokenBoost) {
        if (hasTokenBoost === void 0) { hasTokenBoost = false; }
        var agent = this.agents.get(agentKey);
        if (!agent) {
            return { hasAccess: false, reason: "Agent not found" };
        }
        // Check unlock requirements (from shared/agents.ts logic)
        if (agentKey === "root" && trustScore <= 60) {
            return { hasAccess: false, reason: "Trust Score > 60 required" };
        }
        if (agentKey === "cradle" && trustScore <= 80 && !hasTokenBoost) {
            return { hasAccess: false, reason: "Trust Score > 80 or Token Boost required" };
        }
        if (agentKey === "wing" && stakedSheep < 1000 && completedDreams < 10) {
            return { hasAccess: false, reason: "Stake 1000 $SHEEP or complete 10 dreams" };
        }
        // Check subscription for premium agents
        if (agent.metadata.subscriptionRequired) {
            var subscription = this.getUserSubscription(userId, agentKey);
            if (!subscription || subscription.status !== "active") {
                return {
                    hasAccess: false,
                    reason: "Premium subscription required",
                };
            }
        }
        return { hasAccess: true };
    };
    /**
     * Create agent subscription
     */
    SuperSpine.prototype.createSubscription = function (userId, agentKey, period) {
        if (period === void 0) { period = "monthly"; }
        var agent = this.agents.get(agentKey);
        if (!agent || !agent.metadata.price) {
            return null;
        }
        var now = new Date();
        var expiresAt = new Date(now);
        if (period === "monthly") {
            expiresAt.setMonth(expiresAt.getMonth() + 1);
        }
        else {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }
        var subscription = {
            id: (0, node_crypto_1.randomUUID)(),
            userId: userId,
            agentKey: agentKey,
            status: "active",
            startedAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            price: {
                amount: agent.metadata.price.amount * (period === "yearly" ? 10 : 1),
                currency: agent.metadata.price.currency,
            },
        };
        this.subscriptions.set(subscription.id, subscription);
        this.saveSubscription(subscription); // Persist immediately
        return subscription;
    };
    /**
     * Get user's subscription for an agent
     */
    SuperSpine.prototype.getUserSubscription = function (userId, agentKey) {
        var now = new Date();
        return Array.from(this.subscriptions.values()).find(function (sub) {
            return sub.userId === userId &&
                sub.agentKey === agentKey &&
                sub.status === "active" &&
                new Date(sub.expiresAt) > now;
        });
    };
    /**
     * Submit a task to an agent
     */
    SuperSpine.prototype.submitTask = function (agentKey, type, input, userId) {
        var task = {
            id: (0, node_crypto_1.randomUUID)(),
            userId: userId,
            agentKey: agentKey,
            type: type,
            input: input,
            status: "pending",
            createdAt: new Date().toISOString(),
        };
        this.tasks.set(task.id, task);
        this.saveTask(task); // Persist immediately
        // Add to agent's queue
        var agent = this.agents.get(agentKey);
        if (agent) {
            agent.taskQueue.push(task.id);
            if (agent.status === "idle") {
                agent.status = "active";
            }
            this.saveAgent(agent); // Persist agent update
        }
        return task;
    };
    /**
     * Get task by ID
     */
    SuperSpine.prototype.getTask = function (taskId) {
        return this.tasks.get(taskId);
    };
    /**
     * Get user's tasks
     */
    SuperSpine.prototype.getUserTasks = function (userId) {
        return Array.from(this.tasks.values()).filter(function (t) { return t.userId === userId; });
    };
    /**
     * Start health monitoring loop
     */
    SuperSpine.prototype.startHealthMonitoring = function () {
        var _this = this;
        setInterval(function () {
            for (var _i = 0, _a = _this.agents.values(); _i < _a.length; _i++) {
                var agent = _a[_i];
                // Update last active if agent has been processing tasks
                if (agent.status === "active" || agent.status === "busy") {
                    agent.lastActiveAt = new Date().toISOString();
                    _this.saveAgent(agent); // Persist health updates
                }
                // Check if agent should be marked offline (no activity for 5 minutes)
                var lastActive = new Date(agent.lastActiveAt);
                var now = new Date();
                if (now.getTime() - lastActive.getTime() > 5 * 60 * 1000) {
                    if (agent.status !== "offline") {
                        agent.status = "offline";
                        _this.saveAgent(agent); // Persist status change
                    }
                }
            }
        }, 60000); // Check every minute
    };
    /**
     * Get agent statistics
     */
    SuperSpine.prototype.getAgentStats = function (agentKey) {
        var agent = this.agents.get(agentKey);
        if (!agent)
            return null;
        var tasks = Array.from(this.tasks.values()).filter(function (t) { return t.agentKey === agentKey; });
        var completed = tasks.filter(function (t) { return t.status === "completed"; });
        var failed = tasks.filter(function (t) { return t.status === "failed"; });
        var activeSubscriptions = Array.from(this.subscriptions.values()).filter(function (sub) { return sub.agentKey === agentKey && sub.status === "active"; }).length;
        return {
            totalTasks: tasks.length,
            completedTasks: completed.length,
            failedTasks: failed.length,
            avgResponseTime: agent.health.avgResponseTime,
            activeSubscriptions: activeSubscriptions,
        };
    };
    /**
     * Get persistence status
     */
    SuperSpine.prototype.getPersistenceStatus = function () {
        return {
            usingDatabase: this.useDatabase,
            initialized: this.initialized,
            agentCount: this.agents.size,
            taskCount: this.tasks.size,
            subscriptionCount: this.subscriptions.size,
        };
    };
    return SuperSpine;
}());
// Export singleton
exports.superSpine = new SuperSpine();

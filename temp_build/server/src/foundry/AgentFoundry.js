"use strict";
/**
 * Agent Foundry
 *
 * All agents (including hybrids) can build new agents instantly.
 * Connected to instant mesh for seamless agent creation.
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentFoundry = void 0;
var node_crypto_1 = require("node:crypto");
var InstantMesh_1 = require("../mesh/InstantMesh");
var SuperSpine_1 = require("../core/SuperSpine");
var AgentFoundry = /** @class */ (function () {
    function AgentFoundry() {
        this.builds = new Map();
        this.templates = new Map();
        this.initializeTemplates();
        this.subscribeToMesh();
    }
    /**
     * Initialize default templates
     */
    AgentFoundry.prototype.initializeTemplates = function () {
        var defaultTemplates = [
            {
                slug: "task-router",
                name: "Task Router",
                summary: "Intelligent task routing and orchestration agent",
                capabilities: ["routing", "orchestration", "logic"],
                scopes: ["tasks", "workflows"],
                pricing: "Free",
            },
            {
                slug: "ui-builder",
                name: "UI Builder",
                summary: "Visual component and interface generation agent",
                capabilities: ["design", "ui", "visual"],
                scopes: ["frontend", "components"],
                pricing: "Free",
            },
            {
                slug: "data-architect",
                name: "Data Architect",
                summary: "Backend schema and data structure design agent",
                capabilities: ["architecture", "backend", "schema"],
                scopes: ["backend", "database"],
                pricing: "Free",
            },
            {
                slug: "analyst",
                name: "Analyst",
                summary: "Data analysis and wallet intelligence agent",
                capabilities: ["analysis", "wallet", "intelligence"],
                scopes: ["analytics", "wallet"],
                pricing: "Free",
            },
            {
                slug: "evolution-engine",
                name: "Evolution Engine",
                summary: "Dream evolution and token minting agent",
                capabilities: ["evolution", "minting", "growth"],
                scopes: ["dreams", "tokens"],
                pricing: "Free",
            },
            {
                slug: "messenger",
                name: "Messenger",
                summary: "Communication and message delivery agent",
                capabilities: ["messaging", "communication", "delivery"],
                scopes: ["messaging", "notifications"],
                pricing: "Free",
            },
        ];
        for (var _i = 0, defaultTemplates_1 = defaultTemplates; _i < defaultTemplates_1.length; _i++) {
            var template = defaultTemplates_1[_i];
            this.templates.set(template.slug, template);
        }
    };
    /**
     * Subscribe to instant mesh for agent build requests
     */
    AgentFoundry.prototype.subscribeToMesh = function () {
        var _this = this;
        // Listen for agent build requests from any agent
        InstantMesh_1.instantMesh.subscribe("foundry", function (event) {
            if (event.type === "agent.build.request") {
                var _a = event.payload, requestedBy = _a.requestedBy, agentName = _a.agentName, templateSlug = _a.templateSlug, capabilities = _a.capabilities, traits = _a.traits, parentAgents = _a.parentAgents;
                _this.buildAgent({
                    requestedBy: requestedBy,
                    agentName: agentName,
                    templateSlug: templateSlug,
                    capabilities: capabilities,
                    traits: traits,
                    parentAgents: parentAgents,
                }).catch(function (err) {
                    console.error("[Foundry] Failed to build agent:", err);
                });
            }
        });
    };
    /**
     * Build agent from request
     */
    AgentFoundry.prototype.buildAgent = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var buildRequest, agentKey, mappedCapabilities, _i, _a, cap, uniqueCapabilities, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        buildRequest = {
                            id: (0, node_crypto_1.randomUUID)(),
                            requestedBy: request.requestedBy,
                            agentName: request.agentName,
                            templateSlug: request.templateSlug,
                            capabilities: request.capabilities || [],
                            traits: request.traits || [],
                            parentAgents: request.parentAgents,
                            status: "building",
                            createdAt: new Date().toISOString(),
                        };
                        this.builds.set(buildRequest.id, buildRequest);
                        // Emit instant event
                        InstantMesh_1.instantMesh.emit({
                            source: "foundry",
                            type: "agent.build.started",
                            payload: { buildId: buildRequest.id, agentName: buildRequest.agentName },
                        });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        // Build agent instantly
                        return [4 /*yield*/, this.executeBuild(buildRequest)];
                    case 2:
                        // Build agent instantly
                        _b.sent();
                        buildRequest.status = "completed";
                        buildRequest.completedAt = new Date().toISOString();
                        agentKey = buildRequest.agentName.toLowerCase().replace(/\s+/g, "-");
                        mappedCapabilities = [];
                        for (_i = 0, _a = buildRequest.capabilities; _i < _a.length; _i++) {
                            cap = _a[_i];
                            if (["code", "design", "analysis", "communication", "funding", "deployment"].includes(cap)) {
                                mappedCapabilities.push(cap);
                            }
                            else if (cap.includes("routing") || cap.includes("logic")) {
                                mappedCapabilities.push("code");
                            }
                            else if (cap.includes("ui") || cap.includes("visual") || cap.includes("design")) {
                                mappedCapabilities.push("design");
                            }
                            else if (cap.includes("analysis") || cap.includes("wallet")) {
                                mappedCapabilities.push("analysis");
                            }
                            else if (cap.includes("messaging") || cap.includes("communication")) {
                                mappedCapabilities.push("communication");
                            }
                            else if (cap.includes("funding") || cap.includes("outreach")) {
                                mappedCapabilities.push("funding");
                            }
                        }
                        uniqueCapabilities = Array.from(new Set(mappedCapabilities));
                        SuperSpine_1.superSpine.registerAgent(agentKey, buildRequest.agentName, uniqueCapabilities.length > 0 ? uniqueCapabilities : ["code"], {
                            tier: "Standard",
                            unlock: "Built by ".concat(buildRequest.requestedBy),
                            subscriptionRequired: false,
                        });
                        buildRequest.builtAgentId = agentKey;
                        // Emit instant event
                        InstantMesh_1.instantMesh.emit({
                            source: "foundry",
                            type: "agent.build.completed",
                            payload: { buildId: buildRequest.id, agentId: agentKey },
                        });
                        console.log("\uD83D\uDD28 [Foundry] Agent built: ".concat(buildRequest.agentName, " by ").concat(buildRequest.requestedBy));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        buildRequest.status = "failed";
                        buildRequest.error = error_1.message;
                        buildRequest.completedAt = new Date().toISOString();
                        // Emit instant event
                        InstantMesh_1.instantMesh.emit({
                            source: "foundry",
                            type: "agent.build.failed",
                            payload: { buildId: buildRequest.id, error: buildRequest.error },
                        });
                        console.error("\uD83D\uDD28 [Foundry] Build failed: ".concat(buildRequest.agentName), error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, buildRequest];
                }
            });
        });
    };
    /**
     * Execute the build
     */
    AgentFoundry.prototype.executeBuild = function (build) {
        return __awaiter(this, void 0, void 0, function () {
            var template, _i, _a, parentKey, parentAgent;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // If template provided, use it
                        if (build.templateSlug) {
                            template = this.templates.get(build.templateSlug);
                            if (template) {
                                build.capabilities = __spreadArray(__spreadArray([], build.capabilities, true), template.capabilities, true);
                                build.traits = __spreadArray(__spreadArray([], build.traits, true), template.scopes, true);
                            }
                        }
                        // If parent agents provided, inherit capabilities
                        if (build.parentAgents && build.parentAgents.length > 0) {
                            // Get capabilities from parent agents
                            for (_i = 0, _a = build.parentAgents; _i < _a.length; _i++) {
                                parentKey = _a[_i];
                                parentAgent = SuperSpine_1.superSpine.getAgent(parentKey);
                                if (parentAgent) {
                                    (_b = build.capabilities).push.apply(_b, parentAgent.capabilities.map(function (c) { return c.toString(); }));
                                }
                            }
                        }
                        // Simulate build time (instant in practice)
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 1:
                        // Simulate build time (instant in practice)
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Request agent build from any agent
     */
    AgentFoundry.prototype.requestBuild = function (requestedBy, agentName, options) {
        // Emit to mesh - foundry will pick it up
        InstantMesh_1.instantMesh.emit({
            source: requestedBy,
            target: "foundry",
            type: "agent.build.request",
            payload: {
                requestedBy: requestedBy,
                agentName: agentName,
                templateSlug: options === null || options === void 0 ? void 0 : options.templateSlug,
                capabilities: options === null || options === void 0 ? void 0 : options.capabilities,
                traits: options === null || options === void 0 ? void 0 : options.traits,
                parentAgents: options === null || options === void 0 ? void 0 : options.parentAgents,
            },
        });
    };
    /**
     * Get all templates
     */
    AgentFoundry.prototype.getTemplates = function () {
        return Array.from(this.templates.values());
    };
    /**
     * Get template by slug
     */
    AgentFoundry.prototype.getTemplate = function (slug) {
        return this.templates.get(slug);
    };
    /**
     * Get all builds
     */
    AgentFoundry.prototype.getBuilds = function (requestedBy) {
        var builds = Array.from(this.builds.values());
        if (requestedBy) {
            return builds.filter(function (b) { return b.requestedBy === requestedBy; });
        }
        return builds;
    };
    /**
     * Get build by ID
     */
    AgentFoundry.prototype.getBuild = function (id) {
        return this.builds.get(id);
    };
    return AgentFoundry;
}());
// Export singleton
exports.agentFoundry = new AgentFoundry();

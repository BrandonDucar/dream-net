"use strict";
/**
 * Instant Mesh System
 *
 * Zero-delay, seamless event routing across all systems.
 * No staging, no gating - pure instant flow.
 * Agents can build agents through hybridization.
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
exports.instantMesh = void 0;
var bus_1 = require("../starbridge/bus");
var types_1 = require("../starbridge/types");
var node_crypto_1 = require("node:crypto");
var InstantWormhole_1 = require("./InstantWormhole");
var InstantMesh = /** @class */ (function () {
    function InstantMesh() {
        this.eventQueue = [];
        this.hybrids = new Map();
        this.eventSubscriptions = new Map();
        this.routingRules = new Map(); // event type -> target agents
        this.initializeInstantRouting();
        this.subscribeToStarbridge();
        // Initialize wormhole system (it subscribes to mesh automatically)
        void InstantWormhole_1.instantWormhole;
    }
    /**
     * Initialize instant routing rules
     */
    InstantMesh.prototype.initializeInstantRouting = function () {
        // All events route instantly - no delays
        this.routingRules.set("*", ["*"]); // Everything goes everywhere instantly
        // Specific instant routes
        this.routingRules.set("agent.created", ["super-spine", "foundry", "mesh"]);
        this.routingRules.set("agent.hybrid", ["all-agents", "mesh"]);
        this.routingRules.set("dream.submitted", ["lucid", "canvas", "root", "mesh"]);
        this.routingRules.set("reward.granted", ["rewards-engine", "metrics-engine", "mesh"]);
        this.routingRules.set("fleet.deployed", ["all-fleets", "mesh"]);
        this.routingRules.set("gpt.activated", ["custom-gpt-fleets", "mesh"]);
    };
    /**
     * Subscribe to Starbridge events for instant routing
     */
    InstantMesh.prototype.subscribeToStarbridge = function () {
        var _this = this;
        (0, bus_1.onStarbridgeEvent)(function (event) {
            // Instant delivery - no queuing, no delays
            _this.routeInstantly(event);
        });
    };
    /**
     * Route event instantly to all targets
     */
    InstantMesh.prototype.routeInstantly = function (event) {
        var instantEvent = {
            id: (0, node_crypto_1.randomUUID)(),
            source: event.source,
            type: "".concat(event.topic, ".").concat(event.type),
            payload: event.payload || {},
            timestamp: Date.now(),
            routed: true,
            delivered: false,
        };
        // Get routing targets
        var targets = this.routingRules.get(instantEvent.type) ||
            this.routingRules.get("*") ||
            ["*"];
        var _loop_1 = function (target) {
            if (target === "*") {
                // Broadcast to all subscribers
                this_1.eventSubscriptions.forEach(function (subscribers) {
                    subscribers.forEach(function (handler) {
                        try {
                            handler(instantEvent);
                        }
                        catch (err) {
                            console.error("[Instant Mesh] Handler error:", err);
                        }
                    });
                });
            }
            else {
                // Deliver to specific target
                var subscribers = this_1.eventSubscriptions.get(target);
                if (subscribers) {
                    subscribers.forEach(function (handler) {
                        try {
                            handler(instantEvent);
                        }
                        catch (err) {
                            console.error("[Instant Mesh] Handler error for ".concat(target, ":"), err);
                        }
                    });
                }
            }
        };
        var this_1 = this;
        // Deliver instantly to all targets
        for (var _i = 0, targets_1 = targets; _i < targets_1.length; _i++) {
            var target = targets_1[_i];
            _loop_1(target);
        }
        instantEvent.delivered = true;
        this.eventQueue.push(instantEvent);
        // Keep only last 1000 events
        if (this.eventQueue.length > 1000) {
            this.eventQueue.shift();
        }
    };
    /**
     * Emit event instantly
     */
    InstantMesh.prototype.emit = function (event) {
        var instantEvent = __assign(__assign({ id: (0, node_crypto_1.randomUUID)() }, event), { timestamp: Date.now(), routed: false, delivered: false });
        // Route instantly
        this.routeInstantly({
            topic: types_1.StarbridgeTopic.System,
            source: event.source || types_1.StarbridgeSource.Runtime,
            type: event.type,
            payload: event.payload,
        });
        return instantEvent;
    };
    /**
     * Subscribe to events
     */
    InstantMesh.prototype.subscribe = function (target, handler) {
        var _this = this;
        if (!this.eventSubscriptions.has(target)) {
            this.eventSubscriptions.set(target, new Set());
        }
        this.eventSubscriptions.get(target).add(handler);
        // Return unsubscribe function
        return function () {
            var subscribers = _this.eventSubscriptions.get(target);
            if (subscribers) {
                subscribers.delete(handler);
            }
        };
    };
    /**
     * Create agent hybrid - agents building agents
     */
    InstantMesh.prototype.createHybrid = function (name, parentAgents, capabilities, traits) {
        var hybrid = {
            id: (0, node_crypto_1.randomUUID)(),
            name: name,
            parentAgents: parentAgents,
            capabilities: capabilities,
            traits: traits,
            status: "active",
            createdAt: new Date().toISOString(),
        };
        this.hybrids.set(hybrid.id, hybrid);
        // Emit instant event
        this.emit({
            source: "mesh",
            type: "agent.hybrid.created",
            payload: { hybrid: hybrid },
        });
        // Broadcast to Starbridge
        void (0, bus_1.broadcastStarbridgeEvent)({
            topic: types_1.StarbridgeTopic.System,
            source: types_1.StarbridgeSource.Runtime,
            type: "agent.hybrid.created",
            payload: { hybrid: hybrid },
        }, { skipPersistence: false });
        console.log("\uD83E\uDDEC [Instant Mesh] Hybrid agent created: ".concat(name, " from ").concat(parentAgents.join(" + ")));
        // Auto-connect hybrid to Foundry
        this.emit({
            source: "mesh",
            target: "foundry",
            type: "agent.hybrid.created",
            payload: { hybrid: hybrid },
        });
        return hybrid;
    };
    /**
     * Evolve hybrid from another hybrid
     */
    InstantMesh.prototype.evolveHybrid = function (parentHybridId, name, newCapabilities, newTraits) {
        var parent = this.hybrids.get(parentHybridId);
        if (!parent)
            return null;
        var hybrid = {
            id: (0, node_crypto_1.randomUUID)(),
            name: name,
            parentAgents: __spreadArray([], parent.parentAgents, true),
            capabilities: __spreadArray(__spreadArray([], parent.capabilities, true), newCapabilities, true),
            traits: __spreadArray(__spreadArray([], parent.traits, true), newTraits, true),
            status: "active",
            createdAt: new Date().toISOString(),
            evolvedFrom: parentHybridId,
        };
        this.hybrids.set(hybrid.id, hybrid);
        // Emit instant event
        this.emit({
            source: "mesh",
            type: "agent.hybrid.evolved",
            payload: { hybrid: hybrid, parent: parent.id },
        });
        console.log("\uD83E\uDDEC [Instant Mesh] Hybrid evolved: ".concat(name, " from ").concat(parent.name));
        return hybrid;
    };
    /**
     * Request agent build from Foundry
     */
    InstantMesh.prototype.requestAgentBuild = function (requestedBy, agentName, options) {
        // Emit to foundry through mesh
        this.emit({
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
     * Cross agents - combine capabilities
     */
    InstantMesh.prototype.crossAgents = function (agent1, agent2, name) {
        var hybridName = name || "".concat(agent1, "\u00D7").concat(agent2);
        // Determine capabilities from parent agents
        var capabilities = [];
        var traits = [];
        // Map agent capabilities
        var agentCapabilities = {
            lucid: { capabilities: ["routing", "logic"], traits: ["coordinator"] },
            canvas: { capabilities: ["design", "ui"], traits: ["visual"] },
            root: { capabilities: ["architecture", "backend"], traits: ["strategist"] },
            echo: { capabilities: ["analysis", "wallet"], traits: ["analyst"] },
            cradle: { capabilities: ["evolution", "minting"], traits: ["evolutionary"] },
            wing: { capabilities: ["messaging", "minting"], traits: ["communicator"] },
            "wolf-pack": { capabilities: ["funding", "outreach"], traits: ["hunter"] },
            "super-spine": { capabilities: ["orchestration", "registry"], traits: ["coordinator"] },
        };
        var agent1Data = agentCapabilities[agent1.toLowerCase()] || { capabilities: [], traits: [] };
        var agent2Data = agentCapabilities[agent2.toLowerCase()] || { capabilities: [], traits: [] };
        capabilities.push.apply(capabilities, __spreadArray(__spreadArray([], agent1Data.capabilities, false), agent2Data.capabilities, false));
        traits.push.apply(traits, __spreadArray(__spreadArray([], agent1Data.traits, false), agent2Data.traits, false));
        return this.createHybrid(hybridName, [agent1, agent2], capabilities, traits);
    };
    /**
     * Get all hybrids
     */
    InstantMesh.prototype.getHybrids = function () {
        return Array.from(this.hybrids.values());
    };
    /**
     * Get recent events
     */
    InstantMesh.prototype.getRecentEvents = function (limit) {
        if (limit === void 0) { limit = 100; }
        return this.eventQueue.slice(-limit).reverse();
    };
    /**
     * Get mesh status
     */
    InstantMesh.prototype.getStatus = function () {
        var subscriptionCount = 0;
        this.eventSubscriptions.forEach(function (subs) {
            subscriptionCount += subs.size;
        });
        return {
            active: true,
            eventCount: this.eventQueue.length,
            hybridCount: this.hybrids.size,
            subscriptions: subscriptionCount,
        };
    };
    return InstantMesh;
}());
// Export singleton
exports.instantMesh = new InstantMesh();

"use strict";
/**
 * Instant Wormhole Delivery System
 *
 * Zero-delay event routing - events flow instantly through wormholes.
 * No staging, no queuing - pure instant delivery.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.instantWormhole = void 0;
var InstantMesh_1 = require("./InstantMesh");
var InstantWormhole = /** @class */ (function () {
    function InstantWormhole() {
        this.routes = new Map();
        this.routeIndex = [];
        this.initializeDefaultRoutes();
        this.subscribeToMesh();
    }
    /**
     * Initialize default instant routes
     */
    InstantWormhole.prototype.initializeDefaultRoutes = function () {
        // Dream events → All agents instantly
        this.addRoute({
            id: "dream-to-agents",
            from: { type: "dream.*" },
            to: { target: "*" }, // All agents
            enabled: true,
            priority: 10,
        });
        // Agent events → Super Spine instantly
        this.addRoute({
            id: "agent-to-spine",
            from: { type: "agent.*" },
            to: { target: "super-spine" },
            enabled: true,
            priority: 10,
        });
        // Reward events → Metrics instantly
        this.addRoute({
            id: "reward-to-metrics",
            from: { type: "reward.*" },
            to: { target: "metrics-engine" },
            enabled: true,
            priority: 10,
        });
        // Fleet events → All fleets instantly
        this.addRoute({
            id: "fleet-broadcast",
            from: { type: "fleet.*" },
            to: { target: "*" },
            enabled: true,
            priority: 10,
        });
        // Hybrid events → Mesh instantly
        this.addRoute({
            id: "hybrid-to-mesh",
            from: { type: "agent.hybrid.*" },
            to: { target: "*" },
            enabled: true,
            priority: 10,
        });
    };
    /**
     * Subscribe to instant mesh events
     */
    InstantWormhole.prototype.subscribeToMesh = function () {
        var _this = this;
        // Use lazy access to avoid initialization order issues
        try {
            if (InstantMesh_1.instantMesh && typeof InstantMesh_1.instantMesh.subscribe === 'function') {
                InstantMesh_1.instantMesh.subscribe("*", function (event) {
                    _this.routeInstantly(event);
                });
            }
            else {
                // Defer subscription until mesh is ready
                setTimeout(function () {
                    if (InstantMesh_1.instantMesh && typeof InstantMesh_1.instantMesh.subscribe === 'function') {
                        InstantMesh_1.instantMesh.subscribe("*", function (event) {
                            _this.routeInstantly(event);
                        });
                    }
                }, 100);
            }
        }
        catch (error) {
            console.warn('[InstantWormhole] Failed to subscribe to mesh, will retry:', error);
            // Retry after a delay
            setTimeout(function () { return _this.subscribeToMesh(); }, 1000);
        }
    };
    /**
     * Route event instantly through matching wormholes
     */
    InstantWormhole.prototype.routeInstantly = function (event) {
        var _this = this;
        // Find matching routes (sorted by priority)
        var matches = this.routeIndex
            .filter(function (route) { return _this.matchesRoute(event, route); })
            .sort(function (a, b) { return b.priority - a.priority; });
        // Deliver instantly through all matching wormholes
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var route = matches_1[_i];
            if (!route.enabled)
                continue;
            var transformedEvent = event;
            if (route.to.transform) {
                transformedEvent = route.to.transform(event);
            }
            // Instant delivery
            this.deliver(route.to.target, transformedEvent);
        }
    };
    /**
     * Check if event matches route
     */
    InstantWormhole.prototype.matchesRoute = function (event, route) {
        if (route.from.source && event.source !== route.from.source) {
            return false;
        }
        if (route.from.type) {
            if (route.from.pattern) {
                var regex = new RegExp(route.from.pattern);
                if (!regex.test(event.type))
                    return false;
            }
            else if (route.from.type.endsWith(".*")) {
                var prefix = route.from.type.slice(0, -2);
                if (!event.type.startsWith(prefix))
                    return false;
            }
            else if (event.type !== route.from.type) {
                return false;
            }
        }
        return true;
    };
    /**
     * Deliver event instantly to target
     */
    InstantWormhole.prototype.deliver = function (target, event) {
        // Instant delivery - emit to mesh for target
        try {
            if (InstantMesh_1.instantMesh && typeof InstantMesh_1.instantMesh.emit === 'function') {
                InstantMesh_1.instantMesh.emit({
                    source: "wormhole",
                    target: target,
                    type: "wormhole.delivered.".concat(event.type),
                    payload: {
                        originalEvent: event,
                        deliveredAt: Date.now(),
                    },
                });
            }
        }
        catch (error) {
            console.warn('[InstantWormhole] Failed to deliver event:', error);
        }
    };
    /**
     * Add wormhole route
     */
    InstantWormhole.prototype.addRoute = function (route) {
        this.routes.set(route.id, route);
        this.routeIndex.push(route);
        this.routeIndex.sort(function (a, b) { return b.priority - a.priority; });
    };
    /**
     * Remove route
     */
    InstantWormhole.prototype.removeRoute = function (id) {
        this.routes.delete(id);
        this.routeIndex = this.routeIndex.filter(function (r) { return r.id !== id; });
    };
    /**
     * Get all routes
     */
    InstantWormhole.prototype.getRoutes = function () {
        return Array.from(this.routes.values());
    };
    return InstantWormhole;
}());
// Export singleton
exports.instantWormhole = new InstantWormhole();

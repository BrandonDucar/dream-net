"use strict";
/**
 * @dreamnet/internal-router
 *
 * Laser Router - High-speed packet routing system for DreamNet
 *
 * Routes packets to ports based on fiber channels and packet types.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMetrics = exports.getRouteCount = exports.getRouteStats = exports.incrementRouteCount = exports.clearRoutes = exports.routePacket = exports.hasRoute = exports.listRoutes = exports.getRoute = exports.unregisterRoute = exports.registerRoute = exports.getRouterConfig = exports.configureRouter = void 0;
// Export router functions
var router_1 = require("./router");
Object.defineProperty(exports, "configureRouter", { enumerable: true, get: function () { return router_1.configureRouter; } });
Object.defineProperty(exports, "getRouterConfig", { enumerable: true, get: function () { return router_1.getRouterConfig; } });
Object.defineProperty(exports, "registerRoute", { enumerable: true, get: function () { return router_1.registerRoute; } });
Object.defineProperty(exports, "unregisterRoute", { enumerable: true, get: function () { return router_1.unregisterRoute; } });
Object.defineProperty(exports, "getRoute", { enumerable: true, get: function () { return router_1.getRoute; } });
Object.defineProperty(exports, "listRoutes", { enumerable: true, get: function () { return router_1.listRoutes; } });
Object.defineProperty(exports, "hasRoute", { enumerable: true, get: function () { return router_1.hasRoute; } });
Object.defineProperty(exports, "routePacket", { enumerable: true, get: function () { return router_1.routePacket; } });
Object.defineProperty(exports, "clearRoutes", { enumerable: true, get: function () { return router_1.clearRoutes; } });
// Export metrics
var metrics_1 = require("./metrics");
Object.defineProperty(exports, "incrementRouteCount", { enumerable: true, get: function () { return metrics_1.incrementRouteCount; } });
Object.defineProperty(exports, "getRouteStats", { enumerable: true, get: function () { return metrics_1.getRouteStats; } });
Object.defineProperty(exports, "getRouteCount", { enumerable: true, get: function () { return metrics_1.getRouteCount; } });
Object.defineProperty(exports, "resetMetrics", { enumerable: true, get: function () { return metrics_1.resetMetrics; } });
// Import for default route registration
const index_1 = require("../../internal-ports/src/index");
const router_2 = require("./router");
/**
 * Default port IDs from @dreamnet/internal-ports
 * These match the port IDs registered in that package
 */
const DEFAULT_PORT_IDS = {
    DREAMNET_CORE: 'dreamnet-core',
    SHIELD_CORE: 'shield-core',
    MESH_CORE: 'mesh-core',
    EVENT_WORMHOLE: 'event-wormhole',
    DREAM_VAULT: 'dream-vault',
    DREAM_SHOP: 'dream-shop',
    STAR_BRIDGE: 'star-bridge'
};
/**
 * Register default routes for DreamNet subsystems
 * These routes connect packet types to their corresponding ports
 */
function registerDefaultRoutes() {
    // DreamNet Core routes (FIBER.ALPHA)
    (0, router_2.registerRoute)({
        key: {
            fiber: index_1.FIBERS.ALPHA,
            type: 'dreamnet.event'
        },
        target: {
            portId: index_1.PORT_IDS.DREAMNET_CORE
        },
        description: 'DreamNet Core system events'
    });
    // Shield Core routes (FIBER.BETA)
    (0, router_2.registerRoute)({
        key: {
            fiber: index_1.FIBERS.BETA,
            type: 'shield.event'
        },
        target: {
            portId: index_1.PORT_IDS.SHIELD_CORE
        },
        description: 'Shield Core security events'
    });
    // Mesh Core routes (FIBER.GAMMA)
    (0, router_2.registerRoute)({
        key: {
            fiber: index_1.FIBERS.GAMMA,
            type: 'mesh.event'
        },
        target: {
            portId: index_1.PORT_IDS.MESH_CORE
        },
        description: 'Mesh Core network events'
    });
    // Event Wormhole routes (FIBER.OMEGA)
    (0, router_2.registerRoute)({
        key: {
            fiber: index_1.FIBERS.OMEGA,
            type: 'wormhole.event'
        },
        target: {
            portId: index_1.PORT_IDS.EVENT_WORMHOLE
        },
        description: 'Event Wormhole cross-system events'
    });
    // TravelNet Core routes (FIBER.GAMMA)
    (0, router_2.registerRoute)({
        key: {
            fiber: index_1.FIBERS.GAMMA,
            type: 'travelnet.event'
        },
        target: {
            portId: index_1.PORT_IDS.TRAVELNET_CORE
        },
        description: 'TravelNet Core event route'
    });
    // MILNET Core routes (FIBER.BETA)
    (0, router_2.registerRoute)({
        key: {
            fiber: index_1.FIBERS.BETA,
            type: 'milnet.event'
        },
        target: {
            portId: index_1.PORT_IDS.MILNET_CORE
        },
        description: 'MILNET Core event route'
    });
    // OTTNET Core routes (FIBER.GAMMA)
    (0, router_2.registerRoute)({
        key: {
            fiber: index_1.FIBERS.GAMMA,
            type: 'ottnet.event'
        },
        target: {
            portId: index_1.PORT_IDS.OTTNET_CORE
        },
        description: 'OTTNET Core event route'
    });
    // METALNET Core routes (FIBER.ALPHA)
    (0, router_2.registerRoute)({
        key: {
            fiber: index_1.FIBERS.ALPHA,
            type: 'metalnet.event'
        },
        target: {
            portId: index_1.PORT_IDS.METALNET_CORE
        },
        description: 'METALNET Core event route'
    });
    console.log('[Laser Router] Default routes registered');
}
/**
 * Configure router with sensible defaults
 */
function configureDefaultRouter() {
    (0, router_2.configureRouter)({
        defaultFiber: index_1.FIBERS.ALPHA,
        allowFallback: true,
        strict: false
    });
    console.log('[Laser Router] Router configured with defaults');
}
// Auto-configure and register default routes on module load
configureDefaultRouter();
registerDefaultRoutes();

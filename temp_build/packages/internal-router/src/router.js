"use strict";
/**
 * Laser Router
 *
 * High-speed packet routing system for DreamNet internal communication.
 * Routes packets to ports based on fiber channel and packet type.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRouter = configureRouter;
exports.getRouterConfig = getRouterConfig;
exports.registerRoute = registerRoute;
exports.unregisterRoute = unregisterRoute;
exports.getRoute = getRoute;
exports.listRoutes = listRoutes;
exports.hasRoute = hasRoute;
exports.routePacket = routePacket;
exports.clearRoutes = clearRoutes;
const index_1 = require("../../internal-ports/src/index");
const metrics_1 = require("./metrics");
/**
 * In-memory routing table
 * Key format: `${fiber}:${type}`
 */
const routingTable = new Map();
/**
 * Router configuration
 */
let routerConfig = {
    defaultFiber: undefined,
    allowFallback: false,
    strict: false
};
/**
 * Configure the router
 *
 * @param config - Router configuration
 */
function configureRouter(config) {
    routerConfig = { ...routerConfig, ...config };
}
/**
 * Get current router configuration
 */
function getRouterConfig() {
    return { ...routerConfig };
}
/**
 * Register a route
 *
 * @param entry - Route entry to register
 * @throws Error if route already exists
 */
function registerRoute(entry) {
    const key = `${entry.key.fiber}:${entry.key.type}`;
    if (routingTable.has(key)) {
        throw new Error(`Route already exists: ${key}`);
    }
    routingTable.set(key, entry);
}
/**
 * Unregister a route
 *
 * @param fiber - Fiber channel name
 * @param type - Packet type
 * @returns true if route was removed, false if it didn't exist
 */
function unregisterRoute(fiber, type) {
    const key = `${fiber}:${type}`;
    return routingTable.delete(key);
}
/**
 * Get a route entry
 *
 * @param fiber - Fiber channel name
 * @param type - Packet type
 * @returns Route entry if found, undefined otherwise
 */
function getRoute(fiber, type) {
    const key = `${fiber}:${type}`;
    return routingTable.get(key);
}
/**
 * List all registered routes
 *
 * @returns Array of all route entries
 */
function listRoutes() {
    return Array.from(routingTable.values());
}
/**
 * Check if a route exists
 *
 * @param fiber - Fiber channel name
 * @param type - Packet type
 * @returns true if route exists, false otherwise
 */
function hasRoute(fiber, type) {
    const key = `${fiber}:${type}`;
    return routingTable.has(key);
}
/**
 * Route a packet to the appropriate port handler
 *
 * @param packet - DreamPacket to route
 * @param options - Routing options (fiber override)
 * @returns Promise resolving to handler result or error response
 * @throws Error if strict mode is enabled and route/port not found
 */
async function routePacket(packet, options) {
    // Determine effective fiber
    let effectiveFiber;
    if (options?.fiber) {
        effectiveFiber = options.fiber;
    }
    else if (routerConfig.defaultFiber) {
        effectiveFiber = routerConfig.defaultFiber;
    }
    else if (packet.metadata?.fiber && typeof packet.metadata.fiber === 'string') {
        effectiveFiber = packet.metadata.fiber;
    }
    else {
        // No fiber specified and no default
        if (routerConfig.strict) {
            throw new Error(`No fiber specified for packet type: ${packet.type}`);
        }
        return { ok: false, reason: 'No fiber specified' };
    }
    // Look up route
    let route = getRoute(effectiveFiber, packet.type);
    // Fallback routing if enabled
    if (!route && routerConfig.allowFallback && routerConfig.defaultFiber) {
        const fallbackFiber = routerConfig.defaultFiber;
        if (fallbackFiber !== effectiveFiber) {
            route = getRoute(fallbackFiber, packet.type);
        }
    }
    // Handle missing route
    if (!route) {
        if (routerConfig.strict) {
            throw new Error(`Route not found: ${effectiveFiber}:${packet.type}`);
        }
        return { ok: false, reason: `Route not found: ${effectiveFiber}:${packet.type}` };
    }
    // Find port
    const port = (0, index_1.getPort)(route.target.portId);
    if (!port) {
        // Port not found
        if (routerConfig.strict) {
            throw new Error(`Port not found: ${route.target.portId}`);
        }
        console.warn(`[Router] Port not found: ${route.target.portId} (route: ${effectiveFiber}:${packet.type})`);
        return { ok: false, reason: `Port not found: ${route.target.portId}` };
    }
    // Increment metrics (even if handler throws)
    (0, metrics_1.incrementRouteCount)(effectiveFiber, packet.type);
    // Call port handler
    try {
        const result = await port.handler(packet);
        return result;
    }
    catch (error) {
        // Handler threw an error
        if (routerConfig.strict) {
            throw error;
        }
        console.error(`[Router] Handler error for port ${route.target.portId}:`, error);
        return {
            ok: false,
            reason: error instanceof Error ? error.message : String(error)
        };
    }
}
/**
 * Clear all routes
 */
function clearRoutes() {
    routingTable.clear();
}

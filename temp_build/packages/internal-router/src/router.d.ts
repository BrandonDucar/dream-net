/**
 * Laser Router
 *
 * High-speed packet routing system for DreamNet internal communication.
 * Routes packets to ports based on fiber channel and packet type.
 */
import type { DreamPacket } from '../../internal-ports/src/index';
import type { RouteEntry, RouterConfig } from './types';
/**
 * Configure the router
 *
 * @param config - Router configuration
 */
export declare function configureRouter(config: RouterConfig): void;
/**
 * Get current router configuration
 */
export declare function getRouterConfig(): RouterConfig;
/**
 * Register a route
 *
 * @param entry - Route entry to register
 * @throws Error if route already exists
 */
export declare function registerRoute(entry: RouteEntry): void;
/**
 * Unregister a route
 *
 * @param fiber - Fiber channel name
 * @param type - Packet type
 * @returns true if route was removed, false if it didn't exist
 */
export declare function unregisterRoute(fiber: string, type: string): boolean;
/**
 * Get a route entry
 *
 * @param fiber - Fiber channel name
 * @param type - Packet type
 * @returns Route entry if found, undefined otherwise
 */
export declare function getRoute(fiber: string, type: string): RouteEntry | undefined;
/**
 * List all registered routes
 *
 * @returns Array of all route entries
 */
export declare function listRoutes(): RouteEntry[];
/**
 * Check if a route exists
 *
 * @param fiber - Fiber channel name
 * @param type - Packet type
 * @returns true if route exists, false otherwise
 */
export declare function hasRoute(fiber: string, type: string): boolean;
/**
 * Route a packet to the appropriate port handler
 *
 * @param packet - DreamPacket to route
 * @param options - Routing options (fiber override)
 * @returns Promise resolving to handler result or error response
 * @throws Error if strict mode is enabled and route/port not found
 */
export declare function routePacket(packet: DreamPacket, options?: {
    fiber?: string;
}): Promise<any>;
/**
 * Clear all routes
 */
export declare function clearRoutes(): void;

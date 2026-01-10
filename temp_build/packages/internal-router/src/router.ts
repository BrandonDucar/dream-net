/**
 * Laser Router
 * 
 * High-speed packet routing system for DreamNet internal communication.
 * Routes packets to ports based on fiber channel and packet type.
 */

import type { DreamPacket } from '../../internal-ports/src/index';
import { getPort } from '../../internal-ports/src/index';
import type { RouteKey, RouteTarget, RouteEntry, RouterConfig } from './types';
import { incrementRouteCount } from './metrics';

/**
 * In-memory routing table
 * Key format: `${fiber}:${type}`
 */
const routingTable = new Map<string, RouteEntry>();

/**
 * Router configuration
 */
let routerConfig: RouterConfig = {
  defaultFiber: undefined,
  allowFallback: false,
  strict: false
};

/**
 * Configure the router
 * 
 * @param config - Router configuration
 */
export function configureRouter(config: RouterConfig): void {
  routerConfig = { ...routerConfig, ...config };
}

/**
 * Get current router configuration
 */
export function getRouterConfig(): RouterConfig {
  return { ...routerConfig };
}

/**
 * Register a route
 * 
 * @param entry - Route entry to register
 * @throws Error if route already exists
 */
export function registerRoute(entry: RouteEntry): void {
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
export function unregisterRoute(fiber: string, type: string): boolean {
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
export function getRoute(fiber: string, type: string): RouteEntry | undefined {
  const key = `${fiber}:${type}`;
  return routingTable.get(key);
}

/**
 * List all registered routes
 * 
 * @returns Array of all route entries
 */
export function listRoutes(): RouteEntry[] {
  return Array.from(routingTable.values());
}

/**
 * Check if a route exists
 * 
 * @param fiber - Fiber channel name
 * @param type - Packet type
 * @returns true if route exists, false otherwise
 */
export function hasRoute(fiber: string, type: string): boolean {
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
export async function routePacket(
  packet: DreamPacket,
  options?: { fiber?: string }
): Promise<any> {
  // Determine effective fiber
  let effectiveFiber: string;
  
  if (options?.fiber) {
    effectiveFiber = options.fiber;
  } else if (routerConfig.defaultFiber) {
    effectiveFiber = routerConfig.defaultFiber;
  } else if (packet.metadata?.fiber && typeof packet.metadata.fiber === 'string') {
    effectiveFiber = packet.metadata.fiber;
  } else {
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
  const port = getPort(route.target.portId);
  
  if (!port) {
    // Port not found
    if (routerConfig.strict) {
      throw new Error(`Port not found: ${route.target.portId}`);
    }
    console.warn(`[Router] Port not found: ${route.target.portId} (route: ${effectiveFiber}:${packet.type})`);
    return { ok: false, reason: `Port not found: ${route.target.portId}` };
  }
  
  // Increment metrics (even if handler throws)
  incrementRouteCount(effectiveFiber, packet.type);
  
  // Call port handler
  try {
    const result = await port.handler(packet);
    return result;
  } catch (error) {
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
export function clearRoutes(): void {
  routingTable.clear();
}


/**
 * @dreamnet/internal-router
 * 
 * Laser Router - High-speed packet routing system for DreamNet
 * 
 * Routes packets to ports based on fiber channels and packet types.
 */

// Export types
export type {
  RouteKey,
  RouteTarget,
  RouteEntry,
  RouterConfig,
  RouteResult
} from './types';

// Export router functions
export {
  configureRouter,
  getRouterConfig,
  registerRoute,
  unregisterRoute,
  getRoute,
  listRoutes,
  hasRoute,
  routePacket,
  clearRoutes
} from './router';

// Export metrics
export {
  incrementRouteCount,
  getRouteStats,
  getRouteCount,
  resetMetrics
} from './metrics';

// Import for default route registration
import { FIBERS, PORT_IDS } from '@dreamnet/internal-ports';
import { registerRoute, configureRouter } from './router';
import type { RouteEntry } from './types';

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
} as const;

/**
 * Register default routes for DreamNet subsystems
 * These routes connect packet types to their corresponding ports
 */
function registerDefaultRoutes(): void {
  // DreamNet Core routes (FIBER.ALPHA)
  registerRoute({
    key: {
      fiber: FIBERS.ALPHA,
      type: 'dreamnet.event'
    },
    target: {
      portId: PORT_IDS.DREAMNET_CORE
    },
    description: 'DreamNet Core system events'
  });
  
  // Shield Core routes (FIBER.BETA)
  registerRoute({
    key: {
      fiber: FIBERS.BETA,
      type: 'shield.event'
    },
    target: {
      portId: PORT_IDS.SHIELD_CORE
    },
    description: 'Shield Core security events'
  });
  
  // Mesh Core routes (FIBER.GAMMA)
  registerRoute({
    key: {
      fiber: FIBERS.GAMMA,
      type: 'mesh.event'
    },
    target: {
      portId: PORT_IDS.MESH_CORE
    },
    description: 'Mesh Core network events'
  });
  
  // Event Wormhole routes (FIBER.OMEGA)
  registerRoute({
    key: {
      fiber: FIBERS.OMEGA,
      type: 'wormhole.event'
    },
    target: {
      portId: PORT_IDS.EVENT_WORMHOLE
    },
    description: 'Event Wormhole cross-system events'
  });
  
  // TravelNet Core routes (FIBER.GAMMA)
  registerRoute({
    key: {
      fiber: FIBERS.GAMMA,
      type: 'travelnet.event'
    },
    target: {
      portId: PORT_IDS.TRAVELNET_CORE
    },
    description: 'TravelNet Core event route'
  });
  
  // MILNET Core routes (FIBER.BETA)
  registerRoute({
    key: {
      fiber: FIBERS.BETA,
      type: 'milnet.event'
    },
    target: {
      portId: PORT_IDS.MILNET_CORE
    },
    description: 'MILNET Core event route'
  });
  
  // OTTNET Core routes (FIBER.GAMMA)
  registerRoute({
    key: {
      fiber: FIBERS.GAMMA,
      type: 'ottnet.event'
    },
    target: {
      portId: PORT_IDS.OTTNET_CORE
    },
    description: 'OTTNET Core event route'
  });
  
  // METALNET Core routes (FIBER.ALPHA)
  registerRoute({
    key: {
      fiber: FIBERS.ALPHA,
      type: 'metalnet.event'
    },
    target: {
      portId: PORT_IDS.METALNET_CORE
    },
    description: 'METALNET Core event route'
  });
  
  console.log('[Laser Router] Default routes registered');
}

/**
 * Configure router with sensible defaults
 */
function configureDefaultRouter(): void {
  configureRouter({
    defaultFiber: FIBERS.ALPHA,
    allowFallback: true,
    strict: false
  });
  
  console.log('[Laser Router] Router configured with defaults');
}

// Auto-configure and register default routes on module load
configureDefaultRouter();
registerDefaultRoutes();


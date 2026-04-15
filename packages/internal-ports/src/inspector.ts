/**
 * System Inspector
 * 
 * Provides read-only snapshots of ports, routes, and wormholes
 * for monitoring and debugging purposes.
 */

import { listPorts } from './registry';
import type { DreamPort } from './ports';
import { PORT_IDS, type PortId } from './port-ids';

/**
 * Default port IDs registered by @dreamnet/internal-ports
 */
const DEFAULT_PORT_IDS = new Set([
  PORT_IDS.DREAMNET_CORE,
  PORT_IDS.SHIELD_CORE,
  PORT_IDS.MESH_CORE,
  PORT_IDS.EVENT_WORMHOLE,
  PORT_IDS.DREAM_VAULT,
  PORT_IDS.DREAM_SHOP,
  PORT_IDS.STAR_BRIDGE,
  PORT_IDS.TRAVELNET_CORE,
  PORT_IDS.MILNET_CORE,
  PORT_IDS.OTTNET_CORE,
  PORT_IDS.METALNET_CORE,
]);

/**
 * Port snapshot for inspection
 */
export interface PortSnapshot {
  id: string;
  label: string;
  direction: 'in' | 'out' | 'bidirectional';
  fiber: string;
  isDefault: boolean;
}

/**
 * Get a snapshot of all registered ports
 * 
 * @returns Array of port snapshots
 */
export function getPortsSnapshot(): PortSnapshot[] {
  const ports = listPorts();
  
  return ports.map((port: DreamPort) => ({
    id: port.id,
    label: port.label,
    direction: port.direction,
    fiber: port.fiber,
    isDefault: DEFAULT_PORT_IDS.has(port.id as PortId)
  }));
}

/**
 * Route snapshot for inspection
 */
export interface RouteSnapshot {
  fiber: string;
  type: string;
  targetPortId: string;
  description?: string;
}

/**
 * Get a snapshot of all registered routes
 * 
 * @returns Array of route snapshots
 */
export async function getRoutesSnapshot(): Promise<RouteSnapshot[]> {
  // Dynamic import to avoid circular dependencies
  const router = await import('@dreamnet/internal-router');
  const routes = router.listRoutes();
  
  return routes.map((route) => ({
    fiber: route.key.fiber,
    type: route.key.type,
    targetPortId: route.target.portId,
    description: route.description
  }));
}

/**
 * Wormhole snapshot for inspection
 */
export interface WormholeSnapshot {
  id: string;
  label: string;
  direction: 'in' | 'out' | 'bidirectional';
  fiber: string;
  stats: {
    buffered: number;
    enqueued: number;
    dropped: number;
  };
}

/**
 * Get a snapshot of all registered wormholes
 * 
 * @returns Array of wormhole snapshots
 */
export async function getWormholesSnapshot(): Promise<WormholeSnapshot[]> {
  // Dynamic import to avoid circular dependencies
  const wormholesModule = await import('@dreamnet/event-wormholes');
  const wormholes = wormholesModule.listWormholes();
  const stats = wormholesModule.getWormholeStats();
  
  return wormholes.map((wormhole) => ({
    id: wormhole.id,
    label: wormhole.label,
    direction: wormhole.direction,
    fiber: wormhole.fiber,
    stats: stats[wormhole.id] || {
      buffered: 0,
      enqueued: 0,
      dropped: 0
    }
  }));
}


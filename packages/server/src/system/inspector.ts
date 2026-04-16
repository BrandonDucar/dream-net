/**
 * System Inspector Helper
 * 
 * Provides a unified snapshot of the entire DreamNet internal system:
 * ports, routes, and wormholes.
 */

import {
  getPortsSnapshot,
  getRoutesSnapshot,
  getWormholesSnapshot,
  type PortSnapshot,
  type RouteSnapshot,
  type WormholeSnapshot
} from '@dreamnet/internal-ports';

/**
 * Complete system snapshot
 */
export interface SystemSnapshot {
  ports: PortSnapshot[];
  routes: RouteSnapshot[];
  wormholes: WormholeSnapshot[];
}

/**
 * Get a complete snapshot of the DreamNet internal system
 * 
 * This includes:
 * - All registered ports (with default flags)
 * - All registered routes (fiber + type → port mappings)
 * - All registered wormholes (with buffering statistics)
 * 
 * @returns Complete system snapshot
 */
export async function getSystemSnapshot(): Promise<SystemSnapshot> {
  const [ports, routes, wormholes] = await Promise.all([
    Promise.resolve(getPortsSnapshot()),
    getRoutesSnapshot(),
    getWormholesSnapshot()
  ]);
  
  return {
    ports,
    routes,
    wormholes
  };
}


/**
 * System Graph Helper
 * 
 * Provides a unified snapshot of the entire DreamNet internal system:
 * ports, routes, and wormholes.
 */

import {
  getPortsSnapshot,
  getRoutesSnapshot,
  getWormholesSnapshot,
} from "@dreamnet/internal-ports";

/**
 * Get a complete snapshot of the DreamNet internal system
 * 
 * @returns Complete system snapshot with ports, routes, and wormholes
 */
export async function getSystemSnapshot() {
  const [ports, routes, wormholes] = await Promise.all([
    Promise.resolve(getPortsSnapshot()),
    getRoutesSnapshot(),
    getWormholesSnapshot(),
  ]);

  return {
    ports,
    routes,
    wormholes,
  };
}


/**
 * @dreamnet/event-wormholes
 * 
 * Event Wormholes - Teleport Channels for Packet Transportation
 * 
 * Provides wormhole endpoints for moving packets across clusters, nodes,
 * or external transports. Integrates with internal-router for routing.
 */

// Export types
export type {
  WormholeId,
  RemoteHint,
  WormholeEndpoint,
  WormholeConfig,
  WormholePacketEnvelope,
  WormholeResult,
  WormholeStats
} from './types';

// Export registry functions
export {
  configureWormholes,
  getWormholeConfig,
  registerWormhole,
  getWormhole,
  listWormholes,
  unregisterWormhole,
  hasWormhole
} from './wormholes';

// Export buffering functions
export {
  enqueueToWormhole,
  getWormholeBuffer,
  clearWormholeBuffer,
  getWormholeStats,
  getWormholeStat,
  resetWormholeStats,
  resetAllStats,
  clearAllWormholes
} from './wormholes';

// Export dispatcher functions
export {
  sendThroughWormhole,
  flushWormhole,
  flushAllWormholes,
  getBufferedCount,
  getTotalBufferedCount
} from './dispatcher';

// Import for default setup
import { FIBERS } from '@dreamnet/internal-ports';
import { configureWormholes, registerWormhole } from './wormholes';
import type { WormholeEndpoint } from './types';

/**
 * Configure wormholes with sensible defaults
 */
function configureDefaultWormholes(): void {
  configureWormholes({
    bufferLimit: 100,
    dropPolicy: 'drop-oldest',
    enableMetrics: true
  });
  
  console.log('[Event Wormholes] Default configuration applied');
}

/**
 * Register default wormhole endpoints
 */
function registerDefaultWormholes(): void {
  // Core Omega Wormhole - primary event teleportation channel
  registerWormhole({
    id: 'WH-CORE-OMEGA',
    label: 'Core Omega Wormhole',
    direction: 'bidirectional',
    fiber: FIBERS.OMEGA
  });
  
  // TravelNet Wormhole - travel network teleportation channel
  registerWormhole({
    id: 'WH-TRAVELNET-GAMMA',
    label: 'TravelNet Gamma Wormhole',
    direction: 'bidirectional',
    fiber: FIBERS.GAMMA,
    remoteHint: {
      region: 'global',
      cluster: 'travelnet'
    }
  });
  
  // MILNET Wormhole - military/defense network teleportation channel
  registerWormhole({
    id: 'WH-MILNET-BETA',
    label: 'MILNET Beta Wormhole',
    direction: 'bidirectional',
    fiber: FIBERS.BETA,
    remoteHint: {
      region: 'secure',
      cluster: 'milnet'
    }
  });
  
  // OTTNET Wormhole - streaming/media network teleportation channel
  registerWormhole({
    id: 'WH-OTTNET-GAMMA',
    label: 'OTTNET Gamma Wormhole',
    direction: 'bidirectional',
    fiber: FIBERS.GAMMA,
    remoteHint: {
      region: 'edge',
      cluster: 'media'
    }
  });
  
  // METALNET Wormhole - precious metals network teleportation channel
  registerWormhole({
    id: 'WH-METALNET-ALPHA',
    label: 'METALNET Alpha Wormhole',
    direction: 'bidirectional',
    fiber: FIBERS.ALPHA,
    remoteHint: {
      region: 'vault',
      cluster: 'metals'
    }
  });
  
  console.log('[Event Wormholes] Default wormholes registered');
}

// Auto-configure and register defaults on module load
configureDefaultWormholes();
registerDefaultWormholes();

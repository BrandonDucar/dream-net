/**
 * @dreamnet/event-wormholes
 *
 * Event Wormholes - Teleport Channels for Packet Transportation
 *
 * Provides wormhole endpoints for moving packets across clusters, nodes,
 * or external transports. Integrates with internal-router for routing.
 */
export type { WormholeId, RemoteHint, WormholeEndpoint, WormholeConfig, WormholePacketEnvelope, WormholeResult, WormholeStats } from './types';
export { configureWormholes, getWormholeConfig, registerWormhole, getWormhole, listWormholes, unregisterWormhole, hasWormhole } from './wormholes';
export { enqueueToWormhole, getWormholeBuffer, clearWormholeBuffer, getWormholeStats, getWormholeStat, resetWormholeStats, resetAllStats, clearAllWormholes } from './wormholes';
export { sendThroughWormhole, flushWormhole, flushAllWormholes, getBufferedCount, getTotalBufferedCount } from './dispatcher';

/**
 * @dreamnet/event-wormholes
 *
 * Event Wormholes - Teleport Channels for Packet Transportation
 *
 * Provides wormhole endpoints for moving packets across clusters, nodes,
 * or external transports. Integrates with internal-router for routing.
 */
export type { WormholeId, RemoteHint, WormholeEndpoint, WormholeConfig, WormholePacketEnvelope, WormholeResult, WormholeStats } from './types.js';
export { configureWormholes, getWormholeConfig, registerWormhole, getWormhole, listWormholes, unregisterWormhole, hasWormhole } from './wormholes.js';
export { enqueueToWormhole, getWormholeBuffer, clearWormholeBuffer, getWormholeStats, getWormholeStat, resetWormholeStats, resetAllStats, clearAllWormholes } from './wormholes.js';
export { sendThroughWormhole, flushWormhole, flushAllWormholes, getBufferedCount, getTotalBufferedCount } from './dispatcher.js';
export { emitEvent, getRecentEvents, getEventById, markEventHandled } from './eventBus.js';
export { ThermodynamicAnalyzer } from './analysis.js';
export type { Thermodynamics } from './analysis.js';
//# sourceMappingURL=index.d.ts.map
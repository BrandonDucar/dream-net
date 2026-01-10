/**
 * @dreamnet/internal-ports
 *
 * Internal Port System for DreamNet
 *
 * Provides fiber-optic channels and port-based internal communication
 * for DreamNet subsystems.
 */
export { FIBERS, type FiberChannel, getAllFibers, isValidFiber } from './fibers.js';
export { createPacket, isValidPacket, type DreamPacket } from './packets.js';
export { createPort, isValidPort, type DreamPort } from './ports.js';
export { registerPort, getPort, listPorts, hasPort, unregisterPort, clearPorts, getPortsByFiber, getPortsByDirection, getRegistryStats } from './registry.js';
export { getPortsSnapshot, getRoutesSnapshot, getWormholesSnapshot, type PortSnapshot, type RouteSnapshot, type WormholeSnapshot } from './inspector.js';
export { PORT_IDS, type PortId } from './port-ids.js';
//# sourceMappingURL=index.d.ts.map
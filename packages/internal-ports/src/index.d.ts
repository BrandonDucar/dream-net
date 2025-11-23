/**
 * @dreamnet/internal-ports
 *
 * Internal Port System for DreamNet
 *
 * Provides fiber-optic channels and port-based internal communication
 * for DreamNet subsystems.
 */
export { FIBERS, type FiberChannel, getAllFibers, isValidFiber } from './fibers';
export { createPacket, isValidPacket, type DreamPacket } from './packets';
export { createPort, isValidPort, type DreamPort } from './ports';
export { registerPort, getPort, listPorts, hasPort, unregisterPort, clearPorts, getPortsByFiber, getPortsByDirection, getRegistryStats } from './registry';
export { getPortsSnapshot, getRoutesSnapshot, getWormholesSnapshot, type PortSnapshot, type RouteSnapshot, type WormholeSnapshot } from './inspector';
export { PORT_IDS, type PortId } from './port-ids';

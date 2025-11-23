/**
 * @dreamnet/internal-ports
 *
 * Internal Port System for DreamNet
 *
 * Provides fiber-optic channels and port-based internal communication
 * for DreamNet subsystems.
 */
// Export fibers
export { FIBERS, getAllFibers, isValidFiber } from './fibers';
// Export packets
export { createPacket, isValidPacket } from './packets';
// Export ports
export { createPort, isValidPort } from './ports';
// Export registry
export { registerPort, getPort, listPorts, hasPort, unregisterPort, clearPorts, getPortsByFiber, getPortsByDirection, getRegistryStats } from './registry';
// Export inspector
export { getPortsSnapshot, getRoutesSnapshot, getWormholesSnapshot } from './inspector';
// Export port IDs
export { PORT_IDS } from './port-ids';
// Import for default port registration
import { FIBERS } from './fibers';
import { createPort } from './ports';
import { registerPort } from './registry';
import { PORT_IDS } from './port-ids';
/**
 * Default placeholder handler for ports
 * Logs packet type and returns success response
 */
async function defaultHandler(packet) {
    console.log(`[Port Handler] Received packet type: ${packet.type} (id: ${packet.id})`);
    return { ok: true };
}
/**
 * Register default ports for DreamNet subsystems
 * These are placeholder ports that will be wired to actual implementations later
 */
function registerDefaultPorts() {
    // DreamNet Core port (FIBER.ALPHA)
    registerPort(createPort(PORT_IDS.DREAMNET_CORE, 'DreamNet Core', 'bidirectional', FIBERS.ALPHA, defaultHandler));
    // Shield Core port (FIBER.BETA)
    registerPort(createPort(PORT_IDS.SHIELD_CORE, 'Shield Core', 'bidirectional', FIBERS.BETA, defaultHandler));
    // Mesh Core port (FIBER.GAMMA)
    registerPort(createPort(PORT_IDS.MESH_CORE, 'Mesh Core', 'bidirectional', FIBERS.GAMMA, defaultHandler));
    // Event Wormhole port (FIBER.OMEGA)
    registerPort(createPort(PORT_IDS.EVENT_WORMHOLE, 'Event Wormhole', 'bidirectional', FIBERS.OMEGA, defaultHandler));
    // DreamVault port (FIBER.BETA)
    registerPort(createPort(PORT_IDS.DREAM_VAULT, 'DreamVault', 'bidirectional', FIBERS.BETA, defaultHandler));
    // DreamShop port (FIBER.GAMMA)
    registerPort(createPort(PORT_IDS.DREAM_SHOP, 'DreamShop', 'bidirectional', FIBERS.GAMMA, defaultHandler));
    // StarBridge port (FIBER.ALPHA)
    registerPort(createPort(PORT_IDS.STAR_BRIDGE, 'StarBridge', 'bidirectional', FIBERS.ALPHA, defaultHandler));
    // TravelNet Core port (FIBER.GAMMA) - exploration/travel semantics
    registerPort(createPort(PORT_IDS.TRAVELNET_CORE, 'TravelNet Core', 'bidirectional', FIBERS.GAMMA, async (packet) => {
        console.log("[TravelNetCore] Received packet:", packet.type, packet.metadata);
        return { ok: true };
    }));
    // MILNET Core port (FIBER.BETA) - security/defense semantics
    registerPort(createPort(PORT_IDS.MILNET_CORE, 'MILNET Core', 'bidirectional', FIBERS.BETA, async (packet) => {
        console.log("[MILNETCore] Received packet:", packet.type, packet.metadata);
        return { ok: true, core: "MILNET", receivedType: packet.type };
    }));
    // OTTNET Core port (FIBER.GAMMA) - high-bandwidth media/streaming semantics
    registerPort(createPort(PORT_IDS.OTTNET_CORE, 'OTTNET Core', 'bidirectional', FIBERS.GAMMA, async (packet) => {
        console.log("[OTTNETCore] Received packet:", packet.type, packet.metadata);
        return { ok: true, core: "OTTNET", receivedType: packet.type };
    }));
    // METALNET Core port (FIBER.ALPHA) - economic spine/precious metals semantics
    registerPort(createPort(PORT_IDS.METALNET_CORE, 'METALNET Core', 'bidirectional', FIBERS.ALPHA, async (packet) => {
        console.log("[METALNETCore] Received packet:", packet.type, packet.metadata);
        return { ok: true, core: "METALNET", receivedType: packet.type };
    }));
    console.log('[Internal Ports] Default ports registered');
}
// Auto-register default ports on module load
registerDefaultPorts();

"use strict";
/**
 * @dreamnet/internal-ports
 *
 * Internal Port System for DreamNet
 *
 * Provides fiber-optic channels and port-based internal communication
 * for DreamNet subsystems.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT_IDS = exports.getWormholesSnapshot = exports.getRoutesSnapshot = exports.getPortsSnapshot = exports.getRegistryStats = exports.getPortsByDirection = exports.getPortsByFiber = exports.clearPorts = exports.unregisterPort = exports.hasPort = exports.listPorts = exports.getPort = exports.registerPort = exports.isValidPort = exports.createPort = exports.isValidPacket = exports.createPacket = exports.isValidFiber = exports.getAllFibers = exports.FIBERS = void 0;
// Export fibers
var fibers_1 = require("./fibers");
Object.defineProperty(exports, "FIBERS", { enumerable: true, get: function () { return fibers_1.FIBERS; } });
Object.defineProperty(exports, "getAllFibers", { enumerable: true, get: function () { return fibers_1.getAllFibers; } });
Object.defineProperty(exports, "isValidFiber", { enumerable: true, get: function () { return fibers_1.isValidFiber; } });
// Export packets
var packets_1 = require("./packets");
Object.defineProperty(exports, "createPacket", { enumerable: true, get: function () { return packets_1.createPacket; } });
Object.defineProperty(exports, "isValidPacket", { enumerable: true, get: function () { return packets_1.isValidPacket; } });
// Export ports
var ports_1 = require("./ports");
Object.defineProperty(exports, "createPort", { enumerable: true, get: function () { return ports_1.createPort; } });
Object.defineProperty(exports, "isValidPort", { enumerable: true, get: function () { return ports_1.isValidPort; } });
// Export registry
var registry_1 = require("./registry");
Object.defineProperty(exports, "registerPort", { enumerable: true, get: function () { return registry_1.registerPort; } });
Object.defineProperty(exports, "getPort", { enumerable: true, get: function () { return registry_1.getPort; } });
Object.defineProperty(exports, "listPorts", { enumerable: true, get: function () { return registry_1.listPorts; } });
Object.defineProperty(exports, "hasPort", { enumerable: true, get: function () { return registry_1.hasPort; } });
Object.defineProperty(exports, "unregisterPort", { enumerable: true, get: function () { return registry_1.unregisterPort; } });
Object.defineProperty(exports, "clearPorts", { enumerable: true, get: function () { return registry_1.clearPorts; } });
Object.defineProperty(exports, "getPortsByFiber", { enumerable: true, get: function () { return registry_1.getPortsByFiber; } });
Object.defineProperty(exports, "getPortsByDirection", { enumerable: true, get: function () { return registry_1.getPortsByDirection; } });
Object.defineProperty(exports, "getRegistryStats", { enumerable: true, get: function () { return registry_1.getRegistryStats; } });
// Export inspector
var inspector_1 = require("./inspector");
Object.defineProperty(exports, "getPortsSnapshot", { enumerable: true, get: function () { return inspector_1.getPortsSnapshot; } });
Object.defineProperty(exports, "getRoutesSnapshot", { enumerable: true, get: function () { return inspector_1.getRoutesSnapshot; } });
Object.defineProperty(exports, "getWormholesSnapshot", { enumerable: true, get: function () { return inspector_1.getWormholesSnapshot; } });
// Export port IDs
var port_ids_1 = require("./port-ids");
Object.defineProperty(exports, "PORT_IDS", { enumerable: true, get: function () { return port_ids_1.PORT_IDS; } });
// Import for default port registration
const fibers_2 = require("./fibers");
const ports_2 = require("./ports");
const registry_2 = require("./registry");
const port_ids_2 = require("./port-ids");
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
    (0, registry_2.registerPort)((0, ports_2.createPort)(port_ids_2.PORT_IDS.DREAMNET_CORE, 'DreamNet Core', 'bidirectional', fibers_2.FIBERS.ALPHA, defaultHandler));
    // Shield Core port (FIBER.BETA)
    (0, registry_2.registerPort)((0, ports_2.createPort)(port_ids_2.PORT_IDS.SHIELD_CORE, 'Shield Core', 'bidirectional', fibers_2.FIBERS.BETA, defaultHandler));
    // Mesh Core port (FIBER.GAMMA)
    (0, registry_2.registerPort)((0, ports_2.createPort)(port_ids_2.PORT_IDS.MESH_CORE, 'Mesh Core', 'bidirectional', fibers_2.FIBERS.GAMMA, defaultHandler));
    // Event Wormhole port (FIBER.OMEGA)
    (0, registry_2.registerPort)((0, ports_2.createPort)(port_ids_2.PORT_IDS.EVENT_WORMHOLE, 'Event Wormhole', 'bidirectional', fibers_2.FIBERS.OMEGA, defaultHandler));
    // DreamVault port (FIBER.BETA)
    (0, registry_2.registerPort)((0, ports_2.createPort)(port_ids_2.PORT_IDS.DREAM_VAULT, 'DreamVault', 'bidirectional', fibers_2.FIBERS.BETA, defaultHandler));
    // DreamShop port (FIBER.GAMMA)
    (0, registry_2.registerPort)((0, ports_2.createPort)(port_ids_2.PORT_IDS.DREAM_SHOP, 'DreamShop', 'bidirectional', fibers_2.FIBERS.GAMMA, defaultHandler));
    // StarBridge port (FIBER.ALPHA)
    (0, registry_2.registerPort)((0, ports_2.createPort)(port_ids_2.PORT_IDS.STAR_BRIDGE, 'StarBridge', 'bidirectional', fibers_2.FIBERS.ALPHA, defaultHandler));
    // TravelNet Core port (FIBER.GAMMA) - exploration/travel semantics
    (0, registry_2.registerPort)((0, ports_2.createPort)(port_ids_2.PORT_IDS.TRAVELNET_CORE, 'TravelNet Core', 'bidirectional', fibers_2.FIBERS.GAMMA, async (packet) => {
        console.log("[TravelNetCore] Received packet:", packet.type, packet.metadata);
        return { ok: true };
    }));
    // MILNET Core port (FIBER.BETA) - security/defense semantics
    (0, registry_2.registerPort)((0, ports_2.createPort)(port_ids_2.PORT_IDS.MILNET_CORE, 'MILNET Core', 'bidirectional', fibers_2.FIBERS.BETA, async (packet) => {
        console.log("[MILNETCore] Received packet:", packet.type, packet.metadata);
        return { ok: true, core: "MILNET", receivedType: packet.type };
    }));
    // OTTNET Core port (FIBER.GAMMA) - high-bandwidth media/streaming semantics
    (0, registry_2.registerPort)((0, ports_2.createPort)(port_ids_2.PORT_IDS.OTTNET_CORE, 'OTTNET Core', 'bidirectional', fibers_2.FIBERS.GAMMA, async (packet) => {
        console.log("[OTTNETCore] Received packet:", packet.type, packet.metadata);
        return { ok: true, core: "OTTNET", receivedType: packet.type };
    }));
    // METALNET Core port (FIBER.ALPHA) - economic spine/precious metals semantics
    (0, registry_2.registerPort)((0, ports_2.createPort)(port_ids_2.PORT_IDS.METALNET_CORE, 'METALNET Core', 'bidirectional', fibers_2.FIBERS.ALPHA, async (packet) => {
        console.log("[METALNETCore] Received packet:", packet.type, packet.metadata);
        return { ok: true, core: "METALNET", receivedType: packet.type };
    }));
    console.log('[Internal Ports] Default ports registered');
}
// Auto-register default ports on module load
registerDefaultPorts();

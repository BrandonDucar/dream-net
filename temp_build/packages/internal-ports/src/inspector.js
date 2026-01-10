"use strict";
/**
 * System Inspector
 *
 * Provides read-only snapshots of ports, routes, and wormholes
 * for monitoring and debugging purposes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortsSnapshot = getPortsSnapshot;
exports.getRoutesSnapshot = getRoutesSnapshot;
exports.getWormholesSnapshot = getWormholesSnapshot;
const registry_1 = require("./registry");
const port_ids_1 = require("./port-ids");
/**
 * Default port IDs registered by @dreamnet/internal-ports
 */
const DEFAULT_PORT_IDS = new Set([
    port_ids_1.PORT_IDS.DREAMNET_CORE,
    port_ids_1.PORT_IDS.SHIELD_CORE,
    port_ids_1.PORT_IDS.MESH_CORE,
    port_ids_1.PORT_IDS.EVENT_WORMHOLE,
    port_ids_1.PORT_IDS.DREAM_VAULT,
    port_ids_1.PORT_IDS.DREAM_SHOP,
    port_ids_1.PORT_IDS.STAR_BRIDGE,
    port_ids_1.PORT_IDS.TRAVELNET_CORE,
    port_ids_1.PORT_IDS.MILNET_CORE,
    port_ids_1.PORT_IDS.OTTNET_CORE,
    port_ids_1.PORT_IDS.METALNET_CORE,
]);
/**
 * Get a snapshot of all registered ports
 *
 * @returns Array of port snapshots
 */
function getPortsSnapshot() {
    const ports = (0, registry_1.listPorts)();
    return ports.map((port) => ({
        id: port.id,
        label: port.label,
        direction: port.direction,
        fiber: port.fiber,
        isDefault: DEFAULT_PORT_IDS.has(port.id)
    }));
}
/**
 * Get a snapshot of all registered routes
 *
 * @returns Array of route snapshots
 */
/**
 * Get a snapshot of all registered routes
 *
 * @returns Array of route snapshots
 */
async function getRoutesSnapshot() {
    // Stubbed to break circular dependency during build stabilization
    // TODO: Re-enable once @dreamnet/internal-router is stable and types are shared
    return [];
}
/**
 * Get a snapshot of all registered wormholes
 *
 * @returns Array of wormhole snapshots
 */
async function getWormholesSnapshot() {
    // Stubbed to break circular dependency during build stabilization
    // TODO: Re-enable once @dreamnet/event-wormholes is stable and types are shared
    return [];
}

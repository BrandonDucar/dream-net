/**
 * Port Registry
 *
 * Central registry for managing DreamPort instances.
 * Provides registration, lookup, and listing functionality.
 */
/**
 * Internal port registry map
 */
const portRegistry = new Map();
/**
 * Register a port in the registry
 *
 * @param port - DreamPort to register
 * @throws Error if port ID already exists
 */
export function registerPort(port) {
    if (portRegistry.has(port.id)) {
        throw new Error(`Port with ID "${port.id}" is already registered`);
    }
    portRegistry.set(port.id, port);
}
/**
 * Get a port by ID
 *
 * @param id - Port identifier
 * @returns DreamPort if found, undefined otherwise
 */
export function getPort(id) {
    return portRegistry.get(id);
}
/**
 * List all registered ports
 *
 * @returns Array of all registered DreamPort instances
 */
export function listPorts() {
    return Array.from(portRegistry.values());
}
/**
 * Check if a port is registered
 *
 * @param id - Port identifier
 * @returns true if port exists, false otherwise
 */
export function hasPort(id) {
    return portRegistry.has(id);
}
/**
 * Unregister a port
 *
 * @param id - Port identifier
 * @returns true if port was removed, false if it didn't exist
 */
export function unregisterPort(id) {
    return portRegistry.delete(id);
}
/**
 * Clear all registered ports
 */
export function clearPorts() {
    portRegistry.clear();
}
/**
 * Get ports by fiber channel
 *
 * @param fiber - Fiber channel name
 * @returns Array of ports connected to the specified fiber
 */
export function getPortsByFiber(fiber) {
    return listPorts().filter(port => port.fiber === fiber);
}
/**
 * Get ports by direction
 *
 * @param direction - Port direction
 * @returns Array of ports with the specified direction
 */
export function getPortsByDirection(direction) {
    return listPorts().filter(port => port.direction === direction);
}
/**
 * Get registry statistics
 */
export function getRegistryStats() {
    const ports = listPorts();
    const portsByFiber = {};
    const portsByDirection = {};
    ports.forEach(port => {
        portsByFiber[port.fiber] = (portsByFiber[port.fiber] || 0) + 1;
        portsByDirection[port.direction] = (portsByDirection[port.direction] || 0) + 1;
    });
    return {
        totalPorts: ports.length,
        portsByFiber,
        portsByDirection
    };
}

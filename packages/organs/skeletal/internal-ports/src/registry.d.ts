/**
 * Port Registry
 *
 * Central registry for managing DreamPort instances.
 * Provides registration, lookup, and listing functionality.
 */
import type { DreamPort } from './ports.js';
/**
 * Register a port in the registry
 *
 * @param port - DreamPort to register
 * @throws Error if port ID already exists
 */
export declare function registerPort(port: DreamPort): void;
/**
 * Get a port by ID
 *
 * @param id - Port identifier
 * @returns DreamPort if found, undefined otherwise
 */
export declare function getPort(id: string): DreamPort | undefined;
/**
 * List all registered ports
 *
 * @returns Array of all registered DreamPort instances
 */
export declare function listPorts(): DreamPort[];
/**
 * Check if a port is registered
 *
 * @param id - Port identifier
 * @returns true if port exists, false otherwise
 */
export declare function hasPort(id: string): boolean;
/**
 * Unregister a port
 *
 * @param id - Port identifier
 * @returns true if port was removed, false if it didn't exist
 */
export declare function unregisterPort(id: string): boolean;
/**
 * Clear all registered ports
 */
export declare function clearPorts(): void;
/**
 * Get ports by fiber channel
 *
 * @param fiber - Fiber channel name
 * @returns Array of ports connected to the specified fiber
 */
export declare function getPortsByFiber(fiber: string): DreamPort[];
/**
 * Get ports by direction
 *
 * @param direction - Port direction
 * @returns Array of ports with the specified direction
 */
export declare function getPortsByDirection(direction: DreamPort['direction']): DreamPort[];
/**
 * Get registry statistics
 */
export declare function getRegistryStats(): {
    totalPorts: number;
    portsByFiber: Record<string, number>;
    portsByDirection: Record<string, number>;
};
//# sourceMappingURL=registry.d.ts.map
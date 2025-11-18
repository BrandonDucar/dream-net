/**
 * Port Registry
 * 
 * Central registry for managing DreamPort instances.
 * Provides registration, lookup, and listing functionality.
 */

import type { DreamPort } from './ports';

/**
 * Internal port registry map
 */
const portRegistry = new Map<string, DreamPort>();

/**
 * Register a port in the registry
 * 
 * @param port - DreamPort to register
 * @throws Error if port ID already exists
 */
export function registerPort(port: DreamPort): void {
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
export function getPort(id: string): DreamPort | undefined {
  return portRegistry.get(id);
}

/**
 * List all registered ports
 * 
 * @returns Array of all registered DreamPort instances
 */
export function listPorts(): DreamPort[] {
  return Array.from(portRegistry.values());
}

/**
 * Check if a port is registered
 * 
 * @param id - Port identifier
 * @returns true if port exists, false otherwise
 */
export function hasPort(id: string): boolean {
  return portRegistry.has(id);
}

/**
 * Unregister a port
 * 
 * @param id - Port identifier
 * @returns true if port was removed, false if it didn't exist
 */
export function unregisterPort(id: string): boolean {
  return portRegistry.delete(id);
}

/**
 * Clear all registered ports
 */
export function clearPorts(): void {
  portRegistry.clear();
}

/**
 * Get ports by fiber channel
 * 
 * @param fiber - Fiber channel name
 * @returns Array of ports connected to the specified fiber
 */
export function getPortsByFiber(fiber: string): DreamPort[] {
  return listPorts().filter(port => port.fiber === fiber);
}

/**
 * Get ports by direction
 * 
 * @param direction - Port direction
 * @returns Array of ports with the specified direction
 */
export function getPortsByDirection(direction: DreamPort['direction']): DreamPort[] {
  return listPorts().filter(port => port.direction === direction);
}

/**
 * Get registry statistics
 */
export function getRegistryStats(): {
  totalPorts: number;
  portsByFiber: Record<string, number>;
  portsByDirection: Record<string, number>;
} {
  const ports = listPorts();
  const portsByFiber: Record<string, number> = {};
  const portsByDirection: Record<string, number> = {};
  
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


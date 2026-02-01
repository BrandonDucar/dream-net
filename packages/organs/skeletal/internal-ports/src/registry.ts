/**
 * Port Registry
 * 
 * Central registry for managing DreamPort instances.
 * Provides registration, lookup, and listing functionality.
 */

import type { DreamPort } from './ports.js';

/**
 * Internal port registry map
 */
const portRegistry = new Map<string, DreamPort>();

/**
 * 🐙 OCTOPUS SENTINEL: Port Traffic Monitor
 * Tracks packet flow rate per port. Squeezes (Blocks) if limits exceeded.
 */
const portTrafficStats = new Map<string, { count: number; lastReset: number; blockedUntil: number }>();

function checkTrafficSentinel(portId: string): boolean {
  const now = Date.now();
  let stats = portTrafficStats.get(portId);

  if (!stats) {
    stats = { count: 0, lastReset: now, blockedUntil: 0 };
    portTrafficStats.set(portId, stats);
  }

  // Check if squeezed (blocked)
  if (now < stats.blockedUntil) {
    console.warn(`🐙 [Port Sentinel] Port ${portId} is SQUEEZED (Blocked) for ${(stats.blockedUntil - now) / 1000}s`);
    return false; // Blocked
  }

  // Reset window every 1 second
  if (now - stats.lastReset > 1000) {
    stats.count = 0;
    stats.lastReset = now;
  }

  stats.count++;

  // LIMIT: 100 packets per second per port
  if (stats.count > 100) {
    console.warn(`🐙 [Port Sentinel] Port ${portId} exceeded rate limit! SQUEEZING (Blocking for 10s).`);
    stats.blockedUntil = now + 10000; // Block for 10s
    return false;
  }

  return true; // Allowed
}

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

  // Wrap the handler with the Sentinel
  const originalHandler = port.handler;
  port.handler = async (packet) => {
    // 1. Sentinel Check
    if (!checkTrafficSentinel(port.id)) {
      throw new Error(`🐙 Port ${port.id} is SQUEEZED by Sentinel.`);
    }
    // 2. Original Handler
    return originalHandler(packet);
  };

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


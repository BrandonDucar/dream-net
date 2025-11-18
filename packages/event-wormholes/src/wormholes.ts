/**
 * Event Wormholes Registry and Buffering
 * 
 * Manages wormhole endpoints and packet buffering for teleportation.
 * This is in-memory only - no external I/O yet.
 */

import type {
  WormholeId,
  WormholeEndpoint,
  WormholeConfig,
  WormholePacketEnvelope,
  WormholeResult,
  WormholeStats
} from './types';
import type { DreamPacket } from '@dreamnet/internal-ports';

/**
 * In-memory wormhole registry
 */
const wormholeRegistry = new Map<WormholeId, WormholeEndpoint>();

/**
 * Packet buffers per wormhole
 */
const wormholeBuffers = new Map<WormholeId, WormholePacketEnvelope[]>();

/**
 * Wormhole statistics
 */
const wormholeStats = new Map<WormholeId, WormholeStats>();

/**
 * Current wormhole configuration
 */
let wormholeConfig: WormholeConfig = {
  bufferLimit: 100,
  dropPolicy: 'drop-oldest',
  enableMetrics: true
};

/**
 * Configure wormholes
 * 
 * @param config - Wormhole configuration
 */
export function configureWormholes(config: Partial<WormholeConfig>): void {
  wormholeConfig = { ...wormholeConfig, ...config };
}

/**
 * Get current wormhole configuration
 */
export function getWormholeConfig(): WormholeConfig {
  return { ...wormholeConfig };
}

/**
 * Register a wormhole endpoint
 * 
 * @param endpoint - Wormhole endpoint to register
 * @throws Error if wormhole ID already exists
 */
export function registerWormhole(endpoint: WormholeEndpoint): void {
  if (wormholeRegistry.has(endpoint.id)) {
    throw new Error(`Wormhole with ID "${endpoint.id}" is already registered`);
  }
  
  wormholeRegistry.set(endpoint.id, endpoint);
  wormholeBuffers.set(endpoint.id, []);
  
  if (wormholeConfig.enableMetrics) {
    wormholeStats.set(endpoint.id, {
      buffered: 0,
      enqueued: 0,
      dropped: 0
    });
  }
}

/**
 * Get a wormhole by ID
 * 
 * @param id - Wormhole identifier
 * @returns WormholeEndpoint if found, undefined otherwise
 */
export function getWormhole(id: WormholeId): WormholeEndpoint | undefined {
  return wormholeRegistry.get(id);
}

/**
 * List all registered wormholes
 * 
 * @returns Array of all wormhole endpoints
 */
export function listWormholes(): WormholeEndpoint[] {
  return Array.from(wormholeRegistry.values());
}

/**
 * Unregister a wormhole
 * 
 * @param id - Wormhole identifier
 * @returns true if wormhole was removed, false if it didn't exist
 */
export function unregisterWormhole(id: WormholeId): boolean {
  const removed = wormholeRegistry.delete(id);
  if (removed) {
    wormholeBuffers.delete(id);
    wormholeStats.delete(id);
  }
  return removed;
}

/**
 * Check if a wormhole exists
 * 
 * @param id - Wormhole identifier
 * @returns true if wormhole exists, false otherwise
 */
export function hasWormhole(id: WormholeId): boolean {
  return wormholeRegistry.has(id);
}

/**
 * Enqueue a packet to a wormhole buffer
 * 
 * @param id - Wormhole identifier
 * @param packet - Packet to enqueue
 * @returns Result indicating success or failure
 */
export function enqueueToWormhole(id: WormholeId, packet: DreamPacket): WormholeResult {
  // Validate wormhole exists
  const wormhole = getWormhole(id);
  if (!wormhole) {
    return { ok: false, reason: `Wormhole not found: ${id}` };
  }
  
  // Check direction
  if (wormhole.direction === 'in') {
    return { ok: false, reason: `Wormhole "${id}" is input-only, cannot enqueue` };
  }
  
  // Get or create buffer
  let buffer = wormholeBuffers.get(id);
  if (!buffer) {
    buffer = [];
    wormholeBuffers.set(id, buffer);
  }
  
  // Create envelope
  const envelope: WormholePacketEnvelope = {
    wormholeId: id,
    packet,
    createdAt: Date.now()
  };
  
  // Check buffer limit
  if (buffer.length >= wormholeConfig.bufferLimit) {
    if (wormholeConfig.dropPolicy === 'drop-oldest') {
      // Remove oldest packet
      buffer.shift();
      buffer.push(envelope);
      
      // Update stats
      if (wormholeConfig.enableMetrics) {
        const stats = wormholeStats.get(id);
        if (stats) {
          stats.dropped++;
          stats.enqueued++;
          stats.buffered = buffer.length;
        }
      }
      
      return { ok: true };
    } else {
      // drop-newest: reject new packet
      if (wormholeConfig.enableMetrics) {
        const stats = wormholeStats.get(id);
        if (stats) {
          stats.dropped++;
        }
      }
      
      return { ok: false, reason: 'Buffer full, drop-newest policy' };
    }
  }
  
  // Add to buffer
  buffer.push(envelope);
  
  // Update stats
  if (wormholeConfig.enableMetrics) {
    const stats = wormholeStats.get(id);
    if (stats) {
      stats.enqueued++;
      stats.buffered = buffer.length;
    }
  }
  
  return { ok: true };
}

/**
 * Get buffer for a wormhole
 * 
 * @param id - Wormhole identifier
 * @returns Array of buffered envelopes, or empty array if wormhole doesn't exist
 */
export function getWormholeBuffer(id: WormholeId): WormholePacketEnvelope[] {
  return wormholeBuffers.get(id) || [];
}

/**
 * Clear buffer for a wormhole
 * 
 * @param id - Wormhole identifier
 */
export function clearWormholeBuffer(id: WormholeId): void {
  const buffer = wormholeBuffers.get(id);
  if (buffer) {
    buffer.length = 0;
    if (wormholeConfig.enableMetrics) {
      const stats = wormholeStats.get(id);
      if (stats) {
        stats.buffered = 0;
      }
    }
  }
}

/**
 * Get wormhole statistics
 * 
 * @returns Object mapping wormhole IDs to their statistics
 */
export function getWormholeStats(): Record<string, WormholeStats> {
  const stats: Record<string, WormholeStats> = {};
  
  for (const [id, stat] of wormholeStats.entries()) {
    stats[id] = { ...stat };
  }
  
  return stats;
}

/**
 * Get statistics for a specific wormhole
 * 
 * @param id - Wormhole identifier
 * @returns Statistics if wormhole exists and metrics enabled, undefined otherwise
 */
export function getWormholeStat(id: WormholeId): WormholeStats | undefined {
  return wormholeStats.get(id);
}

/**
 * Reset statistics for a wormhole
 * 
 * @param id - Wormhole identifier
 */
export function resetWormholeStats(id: WormholeId): void {
  const stats = wormholeStats.get(id);
  if (stats) {
    stats.enqueued = 0;
    stats.dropped = 0;
    stats.buffered = getWormholeBuffer(id).length;
  }
}

/**
 * Reset all statistics
 */
export function resetAllStats(): void {
  for (const id of wormholeStats.keys()) {
    resetWormholeStats(id);
  }
}

/**
 * Clear all wormholes and buffers
 */
export function clearAllWormholes(): void {
  wormholeRegistry.clear();
  wormholeBuffers.clear();
  wormholeStats.clear();
}


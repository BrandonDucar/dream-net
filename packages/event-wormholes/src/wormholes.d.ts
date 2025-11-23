/**
 * Event Wormholes Registry and Buffering
 *
 * Manages wormhole endpoints and packet buffering for teleportation.
 * This is in-memory only - no external I/O yet.
 */
import type { WormholeId, WormholeEndpoint, WormholeConfig, WormholePacketEnvelope, WormholeResult, WormholeStats } from './types';
import type { DreamPacket } from '../../internal-ports/src/index.ts';
/**
 * Configure wormholes
 *
 * @param config - Wormhole configuration
 */
export declare function configureWormholes(config: Partial<WormholeConfig>): void;
/**
 * Get current wormhole configuration
 */
export declare function getWormholeConfig(): WormholeConfig;
/**
 * Register a wormhole endpoint
 *
 * @param endpoint - Wormhole endpoint to register
 * @throws Error if wormhole ID already exists
 */
export declare function registerWormhole(endpoint: WormholeEndpoint): void;
/**
 * Get a wormhole by ID
 *
 * @param id - Wormhole identifier
 * @returns WormholeEndpoint if found, undefined otherwise
 */
export declare function getWormhole(id: WormholeId): WormholeEndpoint | undefined;
/**
 * List all registered wormholes
 *
 * @returns Array of all wormhole endpoints
 */
export declare function listWormholes(): WormholeEndpoint[];
/**
 * Unregister a wormhole
 *
 * @param id - Wormhole identifier
 * @returns true if wormhole was removed, false if it didn't exist
 */
export declare function unregisterWormhole(id: WormholeId): boolean;
/**
 * Check if a wormhole exists
 *
 * @param id - Wormhole identifier
 * @returns true if wormhole exists, false otherwise
 */
export declare function hasWormhole(id: WormholeId): boolean;
/**
 * Enqueue a packet to a wormhole buffer
 *
 * @param id - Wormhole identifier
 * @param packet - Packet to enqueue
 * @returns Result indicating success or failure
 */
export declare function enqueueToWormhole(id: WormholeId, packet: DreamPacket): WormholeResult;
/**
 * Get buffer for a wormhole
 *
 * @param id - Wormhole identifier
 * @returns Array of buffered envelopes, or empty array if wormhole doesn't exist
 */
export declare function getWormholeBuffer(id: WormholeId): WormholePacketEnvelope[];
/**
 * Clear buffer for a wormhole
 *
 * @param id - Wormhole identifier
 */
export declare function clearWormholeBuffer(id: WormholeId): void;
/**
 * Get wormhole statistics
 *
 * @returns Object mapping wormhole IDs to their statistics
 */
export declare function getWormholeStats(): Record<string, WormholeStats>;
/**
 * Get statistics for a specific wormhole
 *
 * @param id - Wormhole identifier
 * @returns Statistics if wormhole exists and metrics enabled, undefined otherwise
 */
export declare function getWormholeStat(id: WormholeId): WormholeStats | undefined;
/**
 * Reset statistics for a wormhole
 *
 * @param id - Wormhole identifier
 */
export declare function resetWormholeStats(id: WormholeId): void;
/**
 * Reset all statistics
 */
export declare function resetAllStats(): void;
/**
 * Clear all wormholes and buffers
 */
export declare function clearAllWormholes(): void;

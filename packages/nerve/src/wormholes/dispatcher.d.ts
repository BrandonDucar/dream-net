/**
 * Wormhole Dispatcher
 *
 * Bridges wormholes with the internal-router for packet teleportation.
 * Handles flushing buffered packets through the routing system.
 */
import type { WormholeId } from './types.js';
import type { DreamPacket } from '@dreamnet/internal-ports';
/**
 * Send a packet through a wormhole
 *
 * This enqueues the packet to the wormhole's buffer.
 * To actually route it, call flushWormhole() later.
 *
 * @param wormholeId - Wormhole identifier
 * @param packet - Packet to send
 * @returns Promise resolving to operation result
 */
export declare function sendThroughWormhole(wormholeId: WormholeId, packet: DreamPacket): Promise<{
    ok: boolean;
    reason?: string;
}>;
/**
 * Flush buffered packets from a wormhole
 *
 * Dequeues all buffered packets and routes them through the internal-router
 * using the wormhole's fiber channel.
 *
 * @param wormholeId - Wormhole identifier
 * @returns Promise that resolves when flush is complete
 */
export declare function flushWormhole(wormholeId: WormholeId): Promise<void>;
/**
 * Flush all wormholes
 *
 * Flushes buffered packets from all registered wormholes.
 *
 * @returns Promise that resolves when all flushes are complete
 */
export declare function flushAllWormholes(): Promise<void>;
/**
 * Get buffered packet count for a wormhole
 *
 * @param wormholeId - Wormhole identifier
 * @returns Number of buffered packets
 */
export declare function getBufferedCount(wormholeId: WormholeId): number;
/**
 * Get total buffered packets across all wormholes
 *
 * @returns Total number of buffered packets
 */
export declare function getTotalBufferedCount(): Promise<number>;
//# sourceMappingURL=dispatcher.d.ts.map
/**
 * Wormhole Dispatcher
 *
 * Bridges wormholes with the internal-router for packet teleportation.
 * Handles flushing buffered packets through the routing system.
 */
import { routePacket } from '@dreamnet/internal-router';
import { getWormhole, getWormholeBuffer, clearWormholeBuffer, enqueueToWormhole } from './wormholes.js';
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
export async function sendThroughWormhole(wormholeId, packet) {
    // Validate wormhole exists
    const wormhole = getWormhole(wormholeId);
    if (!wormhole) {
        return { ok: false, reason: `Wormhole not found: ${wormholeId}` };
    }
    // Enqueue packet
    const result = enqueueToWormhole(wormholeId, packet);
    return result;
}
/**
 * Flush buffered packets from a wormhole
 *
 * Dequeues all buffered packets and routes them through the internal-router
 * using the wormhole's fiber channel.
 *
 * @param wormholeId - Wormhole identifier
 * @returns Promise that resolves when flush is complete
 */
export async function flushWormhole(wormholeId) {
    const wormhole = getWormhole(wormholeId);
    if (!wormhole) {
        console.warn(`[Wormhole Dispatcher] Cannot flush: wormhole not found: ${wormholeId}`);
        return;
    }
    // Get buffer
    const buffer = getWormholeBuffer(wormholeId);
    if (buffer.length === 0) {
        return; // Nothing to flush
    }
    // Route each packet
    for (const envelope of buffer) {
        try {
            // 🐙 OCTOPUS SENTINEL: Taste the data before routing
            // If the packet is "poison" (spam/malware), drop it.
            // If the packet is "gold" (money/critical), prioritize it.
            if (envelope.packet.metadata?.sentiment === "malicious") {
                console.warn(`🐙 [Wormhole Sentinel] BLOCKED malicious packet: ${envelope.packet.id}`);
                continue;
            }
            if (envelope.packet.type.includes("payment") || envelope.packet.metadata?.priority === "high") {
                console.log(`🐙 [Wormhole Sentinel] FAST-TRACKING high-value packet: ${envelope.packet.id}`);
                // In a real system, we might boost its priority queue or alert the Bank Arm immediately
            }
            // Route packet using wormhole's fiber channel
            await routePacket(envelope.packet, { fiber: wormhole.fiber });
        }
        catch (error) {
            // Swallow errors - log but don't throw
            console.error(`[Wormhole Dispatcher] Error routing packet through wormhole ${wormholeId}:`, error instanceof Error ? error.message : String(error));
        }
    }
    // Clear buffer after successful routing
    clearWormholeBuffer(wormholeId);
}
/**
 * Flush all wormholes
 *
 * Flushes buffered packets from all registered wormholes.
 *
 * @returns Promise that resolves when all flushes are complete
 */
export async function flushAllWormholes() {
    const { listWormholes } = await import('./wormholes.js');
    const wormholes = listWormholes();
    // Flush each wormhole
    await Promise.all(wormholes.map(wormhole => flushWormhole(wormhole.id)));
}
/**
 * Get buffered packet count for a wormhole
 *
 * @param wormholeId - Wormhole identifier
 * @returns Number of buffered packets
 */
export function getBufferedCount(wormholeId) {
    return getWormholeBuffer(wormholeId).length;
}
/**
 * Get total buffered packets across all wormholes
 *
 * @returns Total number of buffered packets
 */
export async function getTotalBufferedCount() {
    const { listWormholes } = await import('./wormholes.js');
    const wormholes = listWormholes();
    return wormholes.reduce((total, wormhole) => {
        return total + getBufferedCount(wormhole.id);
    }, 0);
}
//# sourceMappingURL=dispatcher.js.map
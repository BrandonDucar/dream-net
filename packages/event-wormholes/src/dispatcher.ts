/**
 * Wormhole Dispatcher
 * 
 * Bridges wormholes with the internal-router for packet teleportation.
 * Handles flushing buffered packets through the routing system.
 */

import type { WormholeId, WormholePacketEnvelope } from './types';
import type { DreamPacket } from '@dreamnet/internal-ports';
import { routePacket } from '../../internal-router/src/index.ts';
import {
  getWormhole,
  getWormholeBuffer,
  clearWormholeBuffer,
  enqueueToWormhole
} from './wormholes';

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
export async function sendThroughWormhole(
  wormholeId: WormholeId,
  packet: DreamPacket
): Promise<{ ok: boolean; reason?: string }> {
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
export async function flushWormhole(wormholeId: WormholeId): Promise<void> {
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
      // Route packet using wormhole's fiber channel
      await routePacket(envelope.packet, { fiber: wormhole.fiber });
    } catch (error) {
      // Swallow errors - log but don't throw
      console.error(
        `[Wormhole Dispatcher] Error routing packet through wormhole ${wormholeId}:`,
        error instanceof Error ? error.message : String(error)
      );
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
export async function flushAllWormholes(): Promise<void> {
  const { listWormholes } = await import('./wormholes');
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
export function getBufferedCount(wormholeId: WormholeId): number {
  return getWormholeBuffer(wormholeId).length;
}

/**
 * Get total buffered packets across all wormholes
 * 
 * @returns Total number of buffered packets
 */
export async function getTotalBufferedCount(): Promise<number> {
  const { listWormholes } = await import('./wormholes');
  const wormholes = listWormholes();
  
  return wormholes.reduce((total, wormhole) => {
    return total + getBufferedCount(wormhole.id);
  }, 0);
}


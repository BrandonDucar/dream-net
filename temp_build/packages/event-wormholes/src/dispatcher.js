"use strict";
/**
 * Wormhole Dispatcher
 *
 * Bridges wormholes with the internal-router for packet teleportation.
 * Handles flushing buffered packets through the routing system.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendThroughWormhole = sendThroughWormhole;
exports.flushWormhole = flushWormhole;
exports.flushAllWormholes = flushAllWormholes;
exports.getBufferedCount = getBufferedCount;
exports.getTotalBufferedCount = getTotalBufferedCount;
const index_1 = require("../../internal-router/src/index");
const wormholes_1 = require("./wormholes");
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
async function sendThroughWormhole(wormholeId, packet) {
    // Validate wormhole exists
    const wormhole = (0, wormholes_1.getWormhole)(wormholeId);
    if (!wormhole) {
        return { ok: false, reason: `Wormhole not found: ${wormholeId}` };
    }
    // Enqueue packet
    const result = (0, wormholes_1.enqueueToWormhole)(wormholeId, packet);
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
async function flushWormhole(wormholeId) {
    const wormhole = (0, wormholes_1.getWormhole)(wormholeId);
    if (!wormhole) {
        console.warn(`[Wormhole Dispatcher] Cannot flush: wormhole not found: ${wormholeId}`);
        return;
    }
    // Get buffer
    const buffer = (0, wormholes_1.getWormholeBuffer)(wormholeId);
    if (buffer.length === 0) {
        return; // Nothing to flush
    }
    // Route each packet
    for (const envelope of buffer) {
        try {
            // 🐙 OCTOPUS SENTINEL: Taste the data before routing
            // If the packet is "poison" (spam/malware), drop it.
            // If the packet is "gold" (money/critical), prioritize it.
            if (packet.metadata?.sentiment === "malicious") {
                console.warn(`🐙 [Wormhole Sentinel] BLOCKED malicious packet: ${packet.id}`);
                continue;
            }
            if (packet.type.includes("payment") || packet.metadata?.priority === "high") {
                console.log(`🐙 [Wormhole Sentinel] FAST-TRACKING high-value packet: ${packet.id}`);
                // In a real system, we might boost its priority queue or alert the Bank Arm immediately
            }
            // Route packet using wormhole's fiber channel
            await (0, index_1.routePacket)(envelope.packet, { fiber: wormhole.fiber });
        }
        catch (error) {
            // Swallow errors - log but don't throw
            console.error(`[Wormhole Dispatcher] Error routing packet through wormhole ${wormholeId}:`, error instanceof Error ? error.message : String(error));
        }
    }
    // Clear buffer after successful routing
    (0, wormholes_1.clearWormholeBuffer)(wormholeId);
}
/**
 * Flush all wormholes
 *
 * Flushes buffered packets from all registered wormholes.
 *
 * @returns Promise that resolves when all flushes are complete
 */
async function flushAllWormholes() {
    const { listWormholes } = await Promise.resolve().then(() => __importStar(require('./wormholes')));
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
function getBufferedCount(wormholeId) {
    return (0, wormholes_1.getWormholeBuffer)(wormholeId).length;
}
/**
 * Get total buffered packets across all wormholes
 *
 * @returns Total number of buffered packets
 */
async function getTotalBufferedCount() {
    const { listWormholes } = await Promise.resolve().then(() => __importStar(require('./wormholes')));
    const wormholes = listWormholes();
    return wormholes.reduce((total, wormhole) => {
        return total + getBufferedCount(wormhole.id);
    }, 0);
}

"use strict";
/**
 * DreamPacket - Internal Communication Packet
 *
 * Standardized packet format for internal DreamNet communication
 * via fiber-optic channels.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPacket = createPacket;
exports.isValidPacket = isValidPacket;
const crypto_1 = require("crypto");
/**
 * Create a new DreamPacket
 *
 * @param type - Event or message type
 * @param payload - Packet payload data
 * @param metadata - Optional metadata object
 * @returns DreamPacket with generated UUID and timestamp
 */
function createPacket(type, payload, metadata) {
    return {
        id: (0, crypto_1.randomUUID)(),
        type,
        payload,
        metadata,
        timestamp: Date.now()
    };
}
/**
 * Validate a packet structure
 */
function isValidPacket(packet) {
    return (typeof packet === 'object' &&
        packet !== null &&
        typeof packet.id === 'string' &&
        typeof packet.type === 'string' &&
        typeof packet.timestamp === 'number' &&
        packet.payload !== undefined);
}

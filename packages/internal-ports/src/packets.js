/**
 * DreamPacket - Internal Communication Packet
 *
 * Standardized packet format for internal DreamNet communication
 * via fiber-optic channels.
 */
import { randomUUID } from 'crypto';
/**
 * Create a new DreamPacket
 *
 * @param type - Event or message type
 * @param payload - Packet payload data
 * @param metadata - Optional metadata object
 * @returns DreamPacket with generated UUID and timestamp
 */
export function createPacket(type, payload, metadata) {
    return {
        id: randomUUID(),
        type,
        payload,
        metadata,
        timestamp: Date.now()
    };
}
/**
 * Validate a packet structure
 */
export function isValidPacket(packet) {
    return (typeof packet === 'object' &&
        packet !== null &&
        typeof packet.id === 'string' &&
        typeof packet.type === 'string' &&
        typeof packet.timestamp === 'number' &&
        packet.payload !== undefined);
}
//# sourceMappingURL=packets.js.map
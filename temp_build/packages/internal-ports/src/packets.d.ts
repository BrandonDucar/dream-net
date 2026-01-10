/**
 * DreamPacket - Internal Communication Packet
 *
 * Standardized packet format for internal DreamNet communication
 * via fiber-optic channels.
 */
/**
 * DreamPacket interface for internal communication
 */
export interface DreamPacket {
    /**
     * Unique packet identifier (UUID)
     */
    id: string;
    /**
     * Event or message type
     * Examples: 'dream.created', 'shield.alert', 'mesh.event'
     */
    type: string;
    /**
     * Packet payload (any data structure)
     */
    payload: any;
    /**
     * Optional metadata (headers, routing info, etc.)
     */
    metadata?: Record<string, any>;
    /**
     * Timestamp when packet was created (Unix timestamp in ms)
     */
    timestamp: number;
}
/**
 * Create a new DreamPacket
 *
 * @param type - Event or message type
 * @param payload - Packet payload data
 * @param metadata - Optional metadata object
 * @returns DreamPacket with generated UUID and timestamp
 */
export declare function createPacket(type: string, payload: any, metadata?: Record<string, any>): DreamPacket;
/**
 * Validate a packet structure
 */
export declare function isValidPacket(packet: any): packet is DreamPacket;

/**
 * DreamPort - Internal Communication Port
 *
 * Ports are endpoints for internal fiber-optic communication channels.
 * Each port can receive, send, or handle bidirectional communication.
 */
import type { DreamPacket } from './packets';
import type { FiberChannel } from './fibers';
/**
 * DreamPort interface for internal communication endpoints
 */
export interface DreamPort {
    /**
     * Unique port identifier
     */
    id: string;
    /**
     * Human-readable port label
     */
    label: string;
    /**
     * Communication direction
     * - "in": Port receives packets
     * - "out": Port sends packets
     * - "bidirectional": Port can both send and receive
     */
    direction: 'in' | 'out' | 'bidirectional';
    /**
     * Fiber channel this port is connected to
     */
    fiber: FiberChannel;
    /**
     * Handler function that processes incoming packets
     * Returns a promise that resolves to handler result
     */
    handler: (packet: DreamPacket) => Promise<any>;
}
/**
 * Create a DreamPort with validation
 */
export declare function createPort(id: string, label: string, direction: DreamPort['direction'], fiber: FiberChannel, handler: DreamPort['handler']): DreamPort;
/**
 * Validate a port structure
 */
export declare function isValidPort(port: any): port is DreamPort;

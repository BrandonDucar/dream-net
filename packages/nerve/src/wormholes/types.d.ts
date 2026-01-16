/**
 * Event Wormholes Types
 *
 * Type definitions for teleport channels that move packets across
 * clusters, nodes, or external transports.
 */
import type { DreamPacket } from '@dreamnet/internal-ports';
/**
 * Wormhole identifier
 */
export type WormholeId = string;
/**
 * Event Model - lightweight phase 1 definition
 */
export interface EventModel {
    id: string;
    timestamp: Date;
    sourceType: "agent" | "squad" | "halo" | "api" | "graft" | "spore" | "system";
    sourceId?: string;
    eventType: string;
    severity: "info" | "warning" | "error" | "critical";
    payload?: Record<string, any>;
    handled?: boolean;
}
/**
 * Universal Wormhole Definition
 * Hybridizes operational state with buffering logic.
 */
export interface WormholeEndpoint {
    id: WormholeId;
    name: string;
    label?: string;
    description?: string;
    fiber: string;
    direction: 'in' | 'out' | 'bidirectional';
    enabled: boolean;
    from: {
        sourceType: string;
        eventType: string;
    };
    to: {
        targetAgentRole?: string;
        actionType: 'log' | 'notify' | 'create-task';
    };
    filters?: {
        minSeverity?: EventModel["severity"];
    };
    createdAt: Date | number;
    updatedAt: Date | number;
}
export type WormholeModel = WormholeEndpoint;
/**
 * Packet envelope for wormhole buffering
 */
export interface WormholePacketEnvelope {
    wormholeId: WormholeId;
    packet: DreamPacket;
    createdAt: number;
}
/**
 * Wormhole operation result
 */
export interface WormholeResult {
    ok: boolean;
    reason?: string;
}
/**
 * Wormhole statistics
 */
export interface WormholeStats {
    buffered: number;
    enqueued: number;
    dropped: number;
}
/**
 * Wormhole configuration
 */
export interface WormholeConfig {
    bufferLimit: number;
    dropPolicy: 'drop-oldest' | 'drop-newest';
    enableMetrics: boolean;
}
//# sourceMappingURL=types.d.ts.map
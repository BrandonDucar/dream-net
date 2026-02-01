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
 * Remote endpoint information (for future use)
 */
export interface RemoteHint {
    /**
     * Geographic region
     */
    region?: string;
    /**
     * Cluster identifier
     */
    cluster?: string;
    /**
     * Remote URL endpoint
     */
    url?: string;
}
/**
 * Wormhole endpoint definition
 */
export interface WormholeEndpoint {
    /**
     * Unique wormhole identifier
     */
    id: WormholeId;
    /**
     * Human-readable label
     */
    label: string;
    /**
     * Communication direction
     * - "in": Receives packets from remote
     * - "out": Sends packets to remote
     * - "bidirectional": Can both send and receive
     */
    direction: 'in' | 'out' | 'bidirectional';
    /**
     * Fiber channel this wormhole is connected to
     */
    fiber: string;
    /**
     * Optional remote information for future transport integration
     */
    remoteHint?: RemoteHint;
}
/**
 * Wormhole configuration
 */
export interface WormholeConfig {
    /**
     * Maximum buffered packets per wormhole before dropping
     */
    bufferLimit: number;
    /**
     * Drop policy when buffer is full
     * - "drop-oldest": Remove oldest packet
     * - "drop-newest": Reject new packet
     */
    dropPolicy: 'drop-oldest' | 'drop-newest';
    /**
     * Whether to emit metrics
     */
    enableMetrics: boolean;
}
/**
 * Packet envelope for wormhole buffering
 */
export interface WormholePacketEnvelope {
    /**
     * Wormhole ID this packet is queued for
     */
    wormholeId: WormholeId;
    /**
     * The packet to transport
     */
    packet: DreamPacket;
    /**
     * Timestamp when envelope was created
     */
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
    /**
     * Number of packets currently buffered
     */
    buffered: number;
    /**
     * Total packets enqueued (since last reset)
     */
    enqueued: number;
    /**
     * Total packets dropped (since last reset)
     */
    dropped: number;
}
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
 * Wormhole Model - configuration for event teleportation
 */
export interface WormholeModel {
    id: string;
    name: string;
    description?: string;
    enabled: boolean;
    from: {
        sourceType: EventModel["sourceType"];
        eventType: string;
    };
    to: {
        actionType: "log" | "notify" | "create-task";
        targetAgentRole?: string;
    };
    filters?: {
        minSeverity?: EventModel["severity"];
    };
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=types.d.ts.map
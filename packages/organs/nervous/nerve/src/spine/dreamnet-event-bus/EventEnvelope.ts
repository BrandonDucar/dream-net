import type { EventType } from './EventTypes.js';

// Placeholder types until we have the actual packages linked
export type TierId = 'FREE' | 'PRO' | 'PREMIUM' | 'GOD_MODE';
export type OfficeId = string;
export type CabinetId = string;

export interface EventEnvelope<T = any> {
    // Core Fields
    eventType: EventType | string; // Allow string for flexibility
    eventId: string; // Unique event ID (UUID)
    correlationId: string; // Request/mission correlation ID
    timestamp: number; // Unix timestamp (milliseconds)

    // Source & Actor
    source: 'ShieldCore' | 'BrowserAgent' | 'AgentRegistry' | 'DreamKeeper' | string;
    actor: {
        callerId?: string;
        tierId?: TierId;
        officeIds?: OfficeId[];
        cabinetIds?: CabinetId[];
        agentId?: string;
        missionId?: string;
        system?: boolean;
    };

    // Target
    target: {
        resource?: string;
        action?: string;
        endpoint?: string;
        url?: string;
        domain?: string;
        ip?: string;
        callerId?: string;
        agentId?: string;
        scope?: string;
        [key: string]: any;
    };

    // Severity
    severity: 'low' | 'medium' | 'high' | 'critical' | 'extreme';

    // Payload (event-specific)
    payload: T;

    // Optional Metadata
    metadata?: {
        userAgent?: string;
        ip?: string;
        requestPath?: string;
        requestMethod?: string;
        stackTrace?: string;
        [key: string]: any;
    };

    // Routing
    routing?: {
        subscribers?: string[]; // List of subscriber IDs
        persistent?: boolean; // Should this event be persisted?
        siem?: boolean; // Should this event be sent to SIEM?
        blockchain?: boolean; // Should this event hash be stored on-chain?
    };
}

import type { EventType } from './EventTypes';
export type TierId = 'FREE' | 'PRO' | 'PREMIUM' | 'GOD_MODE';
export type OfficeId = string;
export type CabinetId = string;
export interface EventEnvelope<T = any> {
    eventType: EventType | string;
    eventId: string;
    correlationId: string;
    timestamp: number;
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
    severity: 'low' | 'medium' | 'high' | 'critical' | 'extreme';
    payload: T;
    metadata?: {
        userAgent?: string;
        ip?: string;
        requestPath?: string;
        requestMethod?: string;
        stackTrace?: string;
        [key: string]: any;
    };
    routing?: {
        subscribers?: string[];
        persistent?: boolean;
        siem?: boolean;
        blockchain?: boolean;
    };
}

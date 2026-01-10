import { EventEnvelope } from './EventEnvelope.js';
export type EventHandler<T = unknown> = (event: EventEnvelope<T>) => void;
export declare class DreamEventBus {
    private handlers;
    subscribe<T = unknown>(eventType: string, handler: EventHandler<T>): () => void;
    private breaker;
    constructor();
    publish<T = unknown>(event: EventEnvelope<T>): void;
    createEnvelope<T = unknown>(eventType: string, source: string, payload: T, metadata?: {
        eventId?: string;
        correlationId?: string;
        timestamp?: number;
        actor?: EventEnvelope['actor'];
        target?: EventEnvelope['target'];
        severity?: EventEnvelope['severity'];
        routing?: EventEnvelope['routing'];
        [key: string]: any;
    }): EventEnvelope<T>;
}

import { EventEnvelope } from './EventEnvelope.js';
import { CircuitBreaker } from './CircuitBreaker.js';

export type EventHandler<T = unknown> = (event: EventEnvelope<T>) => void;

export class DreamEventBus {
    private handlers: Map<string, Set<EventHandler>> = new Map();

    public subscribe<T = unknown>(eventType: string, handler: EventHandler<T>): () => void {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, new Set());
        }
        this.handlers.get(eventType)!.add(handler as EventHandler);

        // Return unsubscribe function
        return () => {
            const handlers = this.handlers.get(eventType);
            if (handlers) {
                handlers.delete(handler as EventHandler);
                if (handlers.size === 0) {
                    this.handlers.delete(eventType);
                }
            }
        };
    }

    private breaker: CircuitBreaker;

    constructor() {
        this.breaker = new CircuitBreaker();
    }

    public publish<T = unknown>(event: EventEnvelope<T>): void {
        const handlers = this.handlers.get(event.eventType);
        if (handlers) {
            handlers.forEach((handler) => {
                try {
                    // Execute handler within circuit breaker
                    // Note: Since handlers are void, we wrap them to catch synchronous errors
                    this.breaker.execute(() => {
                        handler(event);
                    });
                } catch (error) {
                    console.error(`Error handling event ${event.eventType}:`, error);
                    // Circuit breaker state is managed internally by execute()
                }
            });
        }
    }

    // Helper to create a standard envelope with new structure
    public createEnvelope<T = unknown>(
        eventType: string,
        source: string,
        payload: T,
        metadata?: {
            eventId?: string;
            correlationId?: string;
            timestamp?: number;
            actor?: EventEnvelope['actor'];
            target?: EventEnvelope['target'];
            severity?: EventEnvelope['severity'];
            routing?: EventEnvelope['routing'];
            [key: string]: any;
        }
    ): EventEnvelope<T> {
        return {
            eventType,
            eventId: metadata?.eventId || crypto.randomUUID(),
            correlationId: metadata?.correlationId || crypto.randomUUID(),
            timestamp: metadata?.timestamp || Date.now(),
            source,
            actor: metadata?.actor || { system: true },
            target: metadata?.target || {},
            severity: metadata?.severity || 'low',
            payload,
            metadata: metadata ? { ...metadata } : undefined,
            routing: metadata?.routing,
        };
    }
}

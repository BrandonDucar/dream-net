"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DreamEventBus = void 0;
const CircuitBreaker_1 = require("./CircuitBreaker");
class DreamEventBus {
    handlers = new Map();
    subscribe(eventType, handler) {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, new Set());
        }
        this.handlers.get(eventType).add(handler);
        // Return unsubscribe function
        return () => {
            const handlers = this.handlers.get(eventType);
            if (handlers) {
                handlers.delete(handler);
                if (handlers.size === 0) {
                    this.handlers.delete(eventType);
                }
            }
        };
    }
    breaker;
    constructor() {
        this.breaker = new CircuitBreaker_1.CircuitBreaker();
    }
    publish(event) {
        const handlers = this.handlers.get(event.eventType);
        if (handlers) {
            handlers.forEach((handler) => {
                try {
                    // Execute handler within circuit breaker
                    // Note: Since handlers are void, we wrap them to catch synchronous errors
                    this.breaker.execute(() => {
                        handler(event);
                    });
                }
                catch (error) {
                    console.error(`Error handling event ${event.eventType}:`, error);
                    // Circuit breaker state is managed internally by execute()
                }
            });
        }
    }
    // Helper to create a standard envelope with new structure
    createEnvelope(eventType, source, payload, metadata) {
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
exports.DreamEventBus = DreamEventBus;

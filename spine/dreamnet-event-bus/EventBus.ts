import type { EventEnvelope } from './EventEnvelope.js';

export class EventBus {
    private subscribers: Map<string, (event: EventEnvelope) => void> = new Map();

    /**
     * Publish an event to the event bus
     */
    public publish(event: EventEnvelope): void {
        // Emit to all subscribers
        for (const [subscriberId, handler] of this.subscribers) {
            try {
                handler(event);
            } catch (error) {
                console.error(`[EventBus] Error in subscriber ${subscriberId}:`, error);
            }
        }

        // Optional: Persist event (Future)
        if (event.routing?.persistent) {
            this.persistEvent(event);
        }

        // Optional: Send to SIEM (Future)
        if (event.routing?.siem) {
            this.sendToSIEM(event);
        }

        // Optional: Store hash on blockchain (Future)
        if (event.routing?.blockchain) {
            this.storeHashOnChain(event);
        }
    }

    /**
     * Subscribe to events
     */
    public subscribe(subscriberId: string, handler: (event: EventEnvelope) => void): void {
        this.subscribers.set(subscriberId, handler);
    }

    /**
     * Unsubscribe from events
     */
    public unsubscribe(subscriberId: string): void {
        this.subscribers.delete(subscriberId);
    }

    // Private methods (to be implemented)
    private persistEvent(event: EventEnvelope): void {
        // TODO: Implement persistent storage
    }

    private sendToSIEM(event: EventEnvelope): void {
        // TODO: Implement SIEM integration
    }

    private storeHashOnChain(event: EventEnvelope): void {
        // TODO: Implement blockchain storage
    }
}

export const eventBus = new EventBus();

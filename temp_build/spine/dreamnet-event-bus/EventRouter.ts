import { EventEnvelope } from './EventEnvelope';

export class EventRouter {
    // Thin wrapper for future routing rules
    // Phase 1: Simple pass-through

    public route(event: EventEnvelope): EventEnvelope {
        // Hook point for future routing logic
        return event;
    }

    public canRoute(eventType: string): boolean {
        // For now, all events are routable
        return true;
    }
}

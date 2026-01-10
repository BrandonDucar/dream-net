import { EventEnvelope } from './EventEnvelope.js';
export declare class EventRouter {
    route(event: EventEnvelope): EventEnvelope;
    canRoute(eventType: string): boolean;
}

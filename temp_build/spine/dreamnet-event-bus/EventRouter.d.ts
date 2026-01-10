import { EventEnvelope } from './EventEnvelope';
export declare class EventRouter {
    route(event: EventEnvelope): EventEnvelope;
    canRoute(eventType: string): boolean;
}

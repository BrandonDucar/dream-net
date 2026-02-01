import type { EventModel } from './types.js';
export declare function emitEvent(event: Omit<EventModel, "id" | "timestamp" | "handled">): Promise<EventModel>;
export declare function getRecentEvents(limit?: number): EventModel[];
export declare function getEventById(id: string): EventModel | null;
export declare function markEventHandled(id: string): Promise<void>;
//# sourceMappingURL=eventBus.d.ts.map
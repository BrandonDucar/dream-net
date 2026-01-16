import { EventEmitter } from 'events';
export interface SovereignIntent {
    id: string;
    target: string;
    data: string;
    value: string;
    minSurplus: number;
    deadline: number;
}
/**
 * 📜 Intent Generator
 * Converts raw Nerve Events into Sovereign Intents (The Raw Ingredients for the Dutch Oven).
 */
export declare class IntentGenerator extends EventEmitter {
    constructor();
    /**
     * Converts a raw event into a "Cookable" Intent.
     */
    forgeIntent(payload: any): SovereignIntent;
}
//# sourceMappingURL=IntentGenerator.d.ts.map
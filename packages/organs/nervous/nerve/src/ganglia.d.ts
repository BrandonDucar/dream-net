/**
 * 🐙 CEPHALOPOD GANGLIA
 *
 * "Intelligence in the Arms"
 *
 * In an octopus, the arms have their own ganglia (localized brains).
 * This module allows Mini-Apps to process local sensory input and
 * emit events without waiting for the central ControlCore brain.
 */
import { DreamEventBus } from "./spine/index.js";
export interface GanglionContext {
    miniAppId: string;
    trustScore: number;
    armDescriptor: string;
}
export interface SensoryImpulse {
    type: string;
    payload: any;
    priority: "low" | "medium" | "high";
}
export declare class CephalopodGanglion {
    private bus;
    private context;
    constructor(bus: DreamEventBus, context: GanglionContext);
    /**
     * Processes a sensory impulse locally.
     * High-priority impulses are also "shadowed" to the central brain.
     */
    fire(impulse: SensoryImpulse): Promise<void>;
}
export declare const createGanglion: (bus: DreamEventBus, context: GanglionContext) => CephalopodGanglion;
//# sourceMappingURL=ganglia.d.ts.map
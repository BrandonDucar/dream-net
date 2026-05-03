
/**
 * 🐙 CEPHALOPOD GANGLIA
 * 
 * "Intelligence in the Arms"
 * 
 * In an octopus, the arms have their own ganglia (localized brains).
 * This module allows Mini-Apps to process local sensory input and 
 * emit events without waiting for the central ControlCore brain.
 */

import { randomUUID } from "node:crypto";
import { NerveBus } from "./bus.js";
import { createNerveEvent } from "./factory.js";

export interface GanglionContext {
    miniAppId: string;
    trustScore: number;
    armDescriptor: string; // "visual", "economic", "social"
}

export interface SensoryImpulse {
    type: string;
    payload: any;
    priority: "low" | "medium" | "high";
}

export class CephalopodGanglion {
    private bus: NerveBus;
    private context: GanglionContext;

    constructor(bus: NerveBus, context: GanglionContext) {
        this.bus = bus;
        this.context = context;
    }

    /**
     * Processes a sensory impulse locally.
     * High-priority impulses are also "shadowed" to the central brain.
     */
    public async fire(impulse: SensoryImpulse) {
        console.log(`🐙 [Ganglion:${this.context.miniAppId}] Processing impulse: ${impulse.type}`);

        // 1. Local Reflex (Immediate Emission)
        this.bus.publish(createNerveEvent({
            channelId: "GENERIC",
            kind: `ganglion:${this.context.miniAppId}:${impulse.type}`,
            priority: impulse.priority === "high" ? 4 : 2,
            payload: {
                ...impulse.payload,
                _ganglion: {
                    id: randomUUID(),
                    arm: this.context.armDescriptor,
                    timestamp: Date.now()
                }
            }
        }));

        // 2. Central Shadowing (Only for high priority)
        if (impulse.priority === "high") {
            console.log(`🐙 [Ganglion] Shadowing high-priority impulse to central brain.`);
            this.bus.publish(createNerveEvent({
                channelId: "INTEGRATION_EVENT",
                kind: 'brain:sensory_bypass',
                priority: 5,
                payload: {
                    source: this.context.miniAppId,
                    type: impulse.type,
                    data: impulse.payload
                }
            }));
        }
    }
}

export const createGanglion = (bus: NerveBus, context: GanglionContext) => {
    return new CephalopodGanglion(bus, context);
};


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
import { DreamEventBus } from "./spine/index.js";

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
    private bus: DreamEventBus;
    private context: GanglionContext;

    constructor(bus: DreamEventBus, context: GanglionContext) {
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
        await this.bus.emit(`ganglion:${this.context.miniAppId}:${impulse.type}`, {
            ...impulse.payload,
            _ganglion: {
                id: randomUUID(),
                arm: this.context.armDescriptor,
                timestamp: Date.now()
            }
        });

        // 2. Central Shadowing (Only for high priority)
        if (impulse.priority === "high") {
            console.log(`🐙 [Ganglion] Shadowing high-priority impulse to central brain.`);
            await this.bus.emit('brain:sensory_bypass', {
                source: this.context.miniAppId,
                type: impulse.type,
                data: impulse.payload
            });
        }
    }
}

export const createGanglion = (bus: DreamEventBus, context: GanglionContext) => {
    return new CephalopodGanglion(bus, context);
};

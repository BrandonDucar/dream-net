import { type SensorySpike, type SpikeResult } from '../index.js';
/**
 * 🥒 PickleIntelSpike
 * Specialized sensory spike for Pickleball intelligence.
 * Tracks trends, strategies, and tournament data to keep the USER (and the swarm) sharp.
 */
export declare class PickleIntelSpike implements SensorySpike {
    name: string;
    type: 'cultural';
    fetch(): Promise<SpikeResult>;
}
export declare const pickleIntelSpike: PickleIntelSpike;
//# sourceMappingURL=PickleIntelSpike.d.ts.map
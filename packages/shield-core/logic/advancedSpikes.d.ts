/**
 * Advanced Offensive Spikes
 * Enhanced offensive capabilities with active countermeasures, threat intelligence sharing, and deception networks
 */
import { OffensiveSpike, Threat } from "../types";
/**
 * Advanced spike types beyond basic defensive spikes
 */
export type AdvancedSpikeType = "active-counter-attack" | "threat-intelligence-sharing" | "automated-response" | "deception-network" | "threat-hunting" | "honeypot-deployment" | "attacker-tracing" | "intelligence-gathering";
export interface AdvancedSpike extends OffensiveSpike {
    advancedType: AdvancedSpikeType;
    intelligence?: Record<string, any>;
    effectiveness?: number;
}
/**
 * Fire an advanced offensive spike
 */
export declare function fireAdvancedSpike(name: string, type: AdvancedSpikeType, target: string, power?: number, meta?: Record<string, any>): AdvancedSpike;
/**
 * Fire advanced spike in response to threat
 */
export declare function fireAdvancedSpikeAtThreat(threat: Threat, spikeType?: AdvancedSpikeType): AdvancedSpike | null;
/**
 * Track spike effectiveness and learn which spikes work best
 */
export declare function trackSpikeEffectiveness(spike: AdvancedSpike, threatNeutralized: boolean): void;
/**
 * Get best spike type for a given threat (ML-based selection)
 */
export declare function getBestSpikeType(threat: Threat): AdvancedSpikeType;

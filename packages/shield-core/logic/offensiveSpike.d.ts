import { OffensiveSpike, Threat } from "../types";
/**
 * Fire an offensive spike
 */
export declare function fireSpike(name: string, type: OffensiveSpike["type"], target: string, power?: number, meta?: Record<string, any>): OffensiveSpike;
/**
 * Fire spike in response to threat
 */
export declare function fireSpikeAtThreat(threat: Threat, spikeType?: OffensiveSpike["type"]): OffensiveSpike | null;

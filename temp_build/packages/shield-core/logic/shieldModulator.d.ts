import { ShieldModulator, ShieldPhase } from "../types";
/**
 * Create a modulator for a shield phase
 */
export declare function createModulator(phase: ShieldPhase, modulationType: ShieldModulator["modulationType"], frequency: number, amplitude?: number): ShieldModulator;
/**
 * Ensure default modulators exist for all phases
 */
export declare function ensureDefaultModulators(): ShieldModulator[];
/**
 * Update modulator efficiency based on performance
 */
export declare function updateModulatorEfficiency(phase: ShieldPhase, modulatorId: string, efficiency: number): boolean;

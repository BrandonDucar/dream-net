import { ShieldEmitter, ShieldPhase, ThreatType } from "../types";
/**
 * Create an emitter for a shield phase
 */
export declare function createEmitter(phase: ShieldPhase, emissionType: ShieldEmitter["emissionType"], targetThreatTypes: ThreatType[], power?: number, range?: number): ShieldEmitter;
/**
 * Ensure default emitters exist for all phases
 */
export declare function ensureDefaultEmitters(): ShieldEmitter[];
/**
 * Emit defensive signal
 */
export declare function emitDefensive(phase: ShieldPhase, emitterId: string): boolean;
/**
 * Emit offensive signal
 */
export declare function emitOffensive(phase: ShieldPhase, emitterId: string): boolean;

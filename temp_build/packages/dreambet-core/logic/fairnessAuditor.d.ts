import type { FairnessRecord, GameRound } from "../types";
/**
 * Very simple fairness check placeholder:
 * - ensures rngSeed/result exist
 * - ensures resultHex looks like hex
 */
export declare function auditRoundRNG(round: GameRound): FairnessRecord;

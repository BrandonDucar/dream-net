import type { RNGRequest, RNGResult } from "../types";
export declare function generateRNG(req: RNGRequest): RNGResult;
/**
 * Helper: map a resultHex to a float in [0,1).
 */
export declare function rngToUnit(resultHex: string): number;
/**
 * Helper: pick an integer in [0, n)
 */
export declare function rngToInt(resultHex: string, n: number): number;

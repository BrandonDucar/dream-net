import { OrcaPackContext } from "../types";
/**
 * Real posting implementation (replaces simulation)
 */
export declare function executeOrcaPosting(ctx: OrcaPackContext): Promise<void>;
/**
 * Simulation mode (fallback when no API keys)
 */
export declare function simulateOrcaPosting(ctx: OrcaPackContext): Promise<void>;

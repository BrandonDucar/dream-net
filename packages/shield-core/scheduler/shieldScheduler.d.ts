import { ShieldContext, ShieldStatus } from "../types";
/**
 * Run one shield cycle:
 * - Rotate frequencies
 * - Detect threats
 * - Block threats
 * - Fire spikes if needed
 */
export declare function runShieldCycle(ctx: ShieldContext): ShieldStatus;

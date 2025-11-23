import { DreamStateContext, DreamStateStatus } from "../types";
/**
 * Run one Dream State cycle:
 * - Ensure government structure exists
 * - Ensure state symbols exist
 * - Ensure default diplomatic relations
 * - Record state heartbeat
 */
export declare function runDreamStateCycle(ctx: DreamStateContext): DreamStateStatus;

import { RuntimeContext } from "../types";
export declare function initRuntimeContext(ctx: RuntimeContext): void;
/**
 * Run a single orchestrator cycle and then refresh status snapshots.
 */
export declare function runRuntimeCycleOnce(): Promise<void>;
/**
 * Start a background loop. Caller is responsible for managing lifecycle in Node.
 */
export declare function startRuntimeLoop(intervalMs?: number): NodeJS.Timeout | undefined;
/**
 * Stop the background loop.
 */
export declare function stopRuntimeLoop(): void;

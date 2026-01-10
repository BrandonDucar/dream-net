import { SignalThread, SpiderWebContext } from "../types";
/**
 * Execute a thread's execution plan
 */
export declare function executeThread(thread: SignalThread, ctx: SpiderWebContext): Promise<{
    success: boolean;
    result?: Record<string, any>;
    error?: string;
}>;
/**
 * Check if thread dependencies are met
 */
export declare function canExecuteThread(thread: SignalThread): boolean;

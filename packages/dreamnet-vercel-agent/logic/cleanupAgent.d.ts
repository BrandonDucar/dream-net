/**
 * Vercel Cleanup Agent
 * Analyzes Vercel projects and suggests/executes cleanup actions
 */
import type { CleanupAction } from '../types.js';
/**
 * Analyze projects and find cleanup opportunities
 */
export declare function analyzeCleanup(targetDomain?: string): Promise<CleanupAction[]>;
/**
 * Execute cleanup action
 */
export declare function executeCleanupAction(action: CleanupAction): Promise<boolean>;
/**
 * Execute all cleanup actions (with dry-run option)
 */
export declare function executeCleanup(actions: CleanupAction[], dryRun?: boolean): Promise<{
    executed: number;
    failed: number;
    skipped: number;
}>;
//# sourceMappingURL=cleanupAgent.d.ts.map
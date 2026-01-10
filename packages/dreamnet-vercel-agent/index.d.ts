/**
 * DreamNet Vercel Agent
 * Agent to manage Vercel deployments and clean up old projects
 */
import type { VercelAgentStatus, CleanupAction, VercelProject } from './types.js';
export declare const DreamNetVercelAgent: {
    /**
     * Initialize Vercel agent
     */
    init(): Promise<boolean>;
    /**
     * Get status
     */
    status(): Promise<VercelAgentStatus>;
    /**
     * List all projects
     */
    listProjects(): Promise<VercelProject[]>;
    /**
     * Get project by name
     */
    getProject(name: string): Promise<VercelProject | null>;
    /**
     * Analyze cleanup opportunities
     */
    analyzeCleanup(targetDomain?: string): Promise<CleanupAction[]>;
    /**
     * Execute cleanup (dry-run by default)
     */
    executeCleanup(actions: CleanupAction[], dryRun?: boolean): Promise<{
        executed: number;
        failed: number;
        skipped: number;
    }>;
    /**
     * Execute single cleanup action
     */
    executeAction(action: CleanupAction): Promise<boolean>;
};
export * from './types.js';
export * from './summary.js';
export default DreamNetVercelAgent;
//# sourceMappingURL=index.d.ts.map
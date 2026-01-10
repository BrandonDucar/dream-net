/**
 * DreamNet Vercel Agent
 * Agent to manage Vercel deployments and clean up old projects
 */
import { initializeVercel, listProjects, getProject } from './logic/vercelClient.js';
import { analyzeCleanup, executeCleanup, executeCleanupAction } from './logic/cleanupAgent.js';
export const DreamNetVercelAgent = {
    /**
     * Initialize Vercel agent
     */
    async init() {
        return initializeVercel();
    },
    /**
     * Get status
     */
    async status() {
        try {
            const projects = await listProjects();
            return {
                initialized: true,
                projectsFound: projects.length,
                deploymentsFound: 0, // Would need to count all deployments
                lastSyncAt: Date.now(),
            };
        }
        catch (error) {
            return {
                initialized: false,
                projectsFound: 0,
                deploymentsFound: 0,
                lastSyncAt: null,
            };
        }
    },
    /**
     * List all projects
     */
    async listProjects() {
        return listProjects();
    },
    /**
     * Get project by name
     */
    async getProject(name) {
        return getProject(name);
    },
    /**
     * Analyze cleanup opportunities
     */
    async analyzeCleanup(targetDomain) {
        return analyzeCleanup(targetDomain);
    },
    /**
     * Execute cleanup (dry-run by default)
     */
    async executeCleanup(actions, dryRun = true) {
        return executeCleanup(actions, dryRun);
    },
    /**
     * Execute single cleanup action
     */
    async executeAction(action) {
        return executeCleanupAction(action);
    },
};
export * from './types.js';
export * from './summary.js';
export default DreamNetVercelAgent;
//# sourceMappingURL=index.js.map
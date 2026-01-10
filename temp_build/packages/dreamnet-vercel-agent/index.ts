/**
 * DreamNet Vercel Agent
 * Agent to manage Vercel deployments and clean up old projects
 */

import { initializeVercel, listProjects, getProject } from "./logic/vercelClient";
import { analyzeCleanup, executeCleanup, executeCleanupAction } from "./logic/cleanupAgent";
import type { VercelAgentStatus, CleanupAction, VercelProject } from "./types";

export const DreamNetVercelAgent = {
  /**
   * Initialize Vercel agent
   */
  async init(): Promise<boolean> {
    return initializeVercel();
  },

  /**
   * Get status
   */
  async status(): Promise<VercelAgentStatus> {
    try {
      const projects = await listProjects();
      return {
        initialized: true,
        projectsFound: projects.length,
        deploymentsFound: 0, // Would need to count all deployments
        lastSyncAt: Date.now(),
      };
    } catch (error) {
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
  async listProjects(): Promise<VercelProject[]> {
    return listProjects();
  },

  /**
   * Get project by name
   */
  async getProject(name: string): Promise<VercelProject | null> {
    return getProject(name);
  },

  /**
   * Analyze cleanup opportunities
   */
  async analyzeCleanup(targetDomain?: string): Promise<CleanupAction[]> {
    return analyzeCleanup(targetDomain);
  },

  /**
   * Execute cleanup (dry-run by default)
   */
  async executeCleanup(actions: CleanupAction[], dryRun: boolean = true) {
    return executeCleanup(actions, dryRun);
  },

  /**
   * Execute single cleanup action
   */
  async executeAction(action: CleanupAction): Promise<boolean> {
    return executeCleanupAction(action);
  },
};

export * from "./types";
export * from "./summary";
export default DreamNetVercelAgent;


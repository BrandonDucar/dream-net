/**
 * Vercel API Client
 * Uses API Keeper to discover Vercel token automatically
 */
import type { VercelConfig, VercelProject, VercelDeployment } from "../types";
/**
 * Initialize Vercel client using API Keeper discovered credentials
 */
export declare function initializeVercel(): Promise<boolean>;
/**
 * List all projects
 */
export declare function listProjects(): Promise<VercelProject[]>;
/**
 * Get project by name
 */
export declare function getProject(name: string): Promise<VercelProject | null>;
/**
 * List deployments for a project
 */
export declare function listDeployments(projectId: string, limit?: number): Promise<VercelDeployment[]>;
/**
 * Delete a deployment
 */
export declare function deleteDeployment(deploymentId: string): Promise<boolean>;
/**
 * Delete a project
 */
export declare function deleteProject(projectId: string): Promise<boolean>;
/**
 * Get project domains
 */
export declare function getProjectDomains(projectId: string): Promise<string[]>;
/**
 * Add domain to project
 */
export declare function addDomain(projectId: string, domain: string): Promise<boolean>;
/**
 * Remove domain from project
 */
export declare function removeDomain(projectId: string, domain: string): Promise<boolean>;
/**
 * Get current config
 */
export declare function getConfig(): VercelConfig | null;

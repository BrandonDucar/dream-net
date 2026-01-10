/**
 * Advice Functions
 * Return plain JSON objects for build/deploy plans
 */
import type { OpsContract, IntegrationDescriptor } from './contracts.js';
export interface BuildPlan {
    steps: Array<{
        name: string;
        command: string;
        description: string;
    }>;
    outputDirectory: string;
    environment: Record<string, string>;
}
export interface DeployPlan {
    platform: 'vercel' | 'railway';
    steps: Array<{
        name: string;
        command: string;
        description: string;
    }>;
    environment: Record<string, string>;
}
/**
 * Get frontend build plan for Vercel
 */
export declare function getFrontendBuildPlan(contract: OpsContract): BuildPlan;
/**
 * Get backend deploy plan for Railway
 */
export declare function getBackendDeployPlan(contract: OpsContract): DeployPlan;
/**
 * Get integration configuration
 */
export declare function getIntegrationConfig(contract: OpsContract, name: string): IntegrationDescriptor | null;
/**
 * Get all integrations by category
 */
export declare function getIntegrationsByCategory(contract: OpsContract, category: IntegrationDescriptor['category']): IntegrationDescriptor[];
/**
 * Get required environment variables for a scope
 */
export declare function getRequiredEnvVars(contract: OpsContract, scope: 'frontend' | 'backend' | 'both'): string[];
//# sourceMappingURL=advice.d.ts.map
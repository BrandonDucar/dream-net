/**
 * Vercel Integration
 *
 * Watch PRs for preview deploys
 * Health checks and route verification
 * Production promotion on merge
 * DNS verification
 * Auto-rollback on failure
 */
export interface VercelDeployment {
    id: string;
    url: string;
    state: "BUILDING" | "READY" | "ERROR" | "CANCELED";
    createdAt: number;
    target?: "production" | "staging";
}
export declare class VercelIntegration {
    private deployments;
    /**
     * Create preview deployment from PR
     */
    createPreview(projectId: string, branch: string): Promise<VercelDeployment>;
    /**
     * Promote to production
     */
    promoteToProduction(deploymentId: string): Promise<boolean>;
    /**
     * Run health check on deployment
     */
    checkHealth(url: string): Promise<{
        status: "ok" | "degraded" | "down";
        latency: number;
        routes?: string[];
    }>;
    /**
     * Verify DNS configuration
     */
    verifyDNS(domain: string): Promise<boolean>;
    /**
     * Rollback deployment
     */
    rollback(projectId: string): Promise<boolean>;
    /**
     * Get deployment by ID
     */
    getDeployment(id: string): VercelDeployment | undefined;
}
export default VercelIntegration;

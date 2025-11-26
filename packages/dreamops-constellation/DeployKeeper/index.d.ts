/**
 * DeployKeeper - Deployment Star
 *
 * CI/CD automation, environment diffing, secrets checks, DNS checks
 * APIs: Vercel, GitHub Actions, Health pings
 */
export interface DeploymentStatus {
    id: string;
    service: string;
    environment: "staging" | "prod";
    status: "pending" | "building" | "deploying" | "success" | "failed" | "rolled-back";
    url?: string;
    previewUrl?: string;
    startedAt: string;
    completedAt?: string;
    error?: string;
    metadata?: Record<string, any>;
}
export interface HealthCheck {
    service: string;
    url: string;
    status: "ok" | "degraded" | "down";
    latency: number;
    timestamp: string;
}
export declare class DeployKeeper {
    private deployments;
    private healthChecks;
    /**
     * Deploy a service to Cloud Run
     */
    deploy(service: string, environment: "staging" | "prod", branch: string): Promise<DeploymentStatus>;
    /**
     * Run health checks on deployed services
     */
    checkHealth(service: string, url: string): Promise<HealthCheck>;
    /**
     * Rollback a deployment
     */
    rollback(deploymentId: string): Promise<boolean>;
    /**
     * Verify environment configuration
     */
    verifyEnvironment(environment: "staging" | "prod"): Promise<{
        secrets: boolean;
        dns: boolean;
        health: boolean;
    }>;
    /**
     * Get deployment status
     */
    getDeployment(id: string): DeploymentStatus | undefined;
    /**
     * Get all deployments
     */
    getAllDeployments(): DeploymentStatus[];
    /**
     * Get recent health checks
     */
    getRecentHealthChecks(limit?: number): HealthCheck[];
}
export default DeployKeeper;

/**
 * Google Cloud Run Integration
 *
 * Deploy services to Cloud Run
 */
export interface CloudRunDeployment {
    service: string;
    region: string;
    project: string;
    image?: string;
    envVars?: Record<string, string>;
}
export declare class CloudRunIntegration {
    private project;
    private region;
    constructor(project?: string, region?: string);
    /**
     * Deploy service to Cloud Run
     */
    deploy(deployment: CloudRunDeployment): Promise<{
        url: string;
        status: string;
    }>;
    /**
     * Check deployment health
     */
    checkHealth(serviceUrl: string): Promise<{
        status: "ok" | "degraded" | "down";
        latency: number;
    }>;
    /**
     * Get service URL
     */
    getServiceUrl(service: string): string;
}
export default CloudRunIntegration;

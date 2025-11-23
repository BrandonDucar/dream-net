/**
 * DreamNet Deployment Core
 * Unified deployment abstraction for all hosting platforms
 * Instead of being dependent on Vercel, we ARE the deployment platform
 */
export interface DeploymentConfig {
    platform: DeploymentPlatform;
    projectName: string;
    sourceDirectory: string;
    buildCommand?: string;
    outputDirectory?: string;
    environmentVariables?: Record<string, string>;
    customDomain?: string;
}
export interface DeploymentResult {
    success: boolean;
    deploymentId?: string;
    url?: string;
    platform: DeploymentPlatform;
    error?: string;
    logs?: string[];
}
export type DeploymentPlatform = 'vercel' | 'netlify' | 'railway' | 'cloudflare-pages' | 'render' | 'fly-io' | 'aws-amplify' | 'azure-static-web-apps' | 'github-pages' | 'surge' | 'firebase-hosting' | 'digitalocean-app-platform' | 'heroku' | 'pixl' | 'dreamnet';
export interface DeploymentProvider {
    name: DeploymentPlatform;
    deploy(config: DeploymentConfig): Promise<DeploymentResult>;
    getStatus(deploymentId: string): Promise<DeploymentResult>;
    listDeployments(): Promise<DeploymentResult[]>;
}
/**
 * Base deployment provider with common functionality
 */
export declare abstract class BaseDeploymentProvider implements DeploymentProvider {
    abstract name: DeploymentPlatform;
    abstract deploy(config: DeploymentConfig): Promise<DeploymentResult>;
    abstract getStatus(deploymentId: string): Promise<DeploymentResult>;
    abstract listDeployments(): Promise<DeploymentResult[]>;
    protected validateConfig(config: DeploymentConfig): void;
}
/**
 * DreamNet Native Deployment Provider
 * Our own deployment platform - no external dependencies!
 */
export declare class DreamNetDeploymentProvider extends BaseDeploymentProvider {
    name: DeploymentPlatform;
    deploy(config: DeploymentConfig): Promise<DeploymentResult>;
    getStatus(deploymentId: string): Promise<DeploymentResult>;
    listDeployments(): Promise<DeploymentResult[]>;
}
/**
 * Vercel Deployment Provider
 */
export declare class VercelDeploymentProvider extends BaseDeploymentProvider {
    name: DeploymentPlatform;
    deploy(config: DeploymentConfig): Promise<DeploymentResult>;
    getStatus(deploymentId: string): Promise<DeploymentResult>;
    listDeployments(): Promise<DeploymentResult[]>;
}
/**
 * Netlify Deployment Provider
 */
export declare class NetlifyDeploymentProvider extends BaseDeploymentProvider {
    name: DeploymentPlatform;
    deploy(config: DeploymentConfig): Promise<DeploymentResult>;
    getStatus(deploymentId: string): Promise<DeploymentResult>;
    listDeployments(): Promise<DeploymentResult[]>;
}
/**
 * Railway Deployment Provider
 */
export declare class RailwayDeploymentProvider extends BaseDeploymentProvider {
    name: DeploymentPlatform;
    deploy(config: DeploymentConfig): Promise<DeploymentResult>;
    getStatus(deploymentId: string): Promise<DeploymentResult>;
    listDeployments(): Promise<DeploymentResult[]>;
}
/**
 * Cloudflare Pages Deployment Provider
 */
export declare class CloudflarePagesDeploymentProvider extends BaseDeploymentProvider {
    name: DeploymentPlatform;
    deploy(config: DeploymentConfig): Promise<DeploymentResult>;
    getStatus(deploymentId: string): Promise<DeploymentResult>;
    listDeployments(): Promise<DeploymentResult[]>;
}
/**
 * Render Deployment Provider
 */
export declare class RenderDeploymentProvider extends BaseDeploymentProvider {
    name: DeploymentPlatform;
    deploy(config: DeploymentConfig): Promise<DeploymentResult>;
    getStatus(deploymentId: string): Promise<DeploymentResult>;
    listDeployments(): Promise<DeploymentResult[]>;
}
/**
 * Unified Deployment Manager
 * Routes deployments to the appropriate platform
 */
export declare class DeploymentManager {
    private providers;
    constructor();
    registerProvider(provider: DeploymentProvider): void;
    getProvider(platform: DeploymentPlatform): DeploymentProvider | undefined;
    deploy(config: DeploymentConfig): Promise<DeploymentResult>;
    deployToAll(config: Omit<DeploymentConfig, 'platform'>): Promise<DeploymentResult[]>;
    listAvailablePlatforms(): DeploymentPlatform[];
}
export declare function getDeploymentManager(): DeploymentManager;
export default DeploymentManager;

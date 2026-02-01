import { SocialSuit } from './SocialSuit.js';
/**
 * 🏗️ VercelSuit: The Infrastructure Mech for Deployment Control
 *
 * Capabilities:
 * - Monitor build statuses across the DreamNet Fleet (Sitebuilder, SEO, API).
 * - Trigger redeployments via Vercel API.
 * - Pulse check on domain health.
 */
export declare class VercelSuit implements SocialSuit {
    name: string;
    private token;
    constructor();
    isOnline(): boolean;
    ignite(): Promise<void>;
    /**
     * In the context of Vercel, "post" triggers a production deployment.
     */
    post(content: string | any): Promise<{
        success: boolean;
        url?: string;
        id?: string;
    }>;
    engage(targetId: string, action: 'like' | 'reply' | 'repost' | 'comment', content?: string): Promise<boolean>;
    /**
     * Scan recent deployments for status/errors.
     */
    scan(query?: string, limit?: number): Promise<any[]>;
    /**
     * Specific Infrastructure Method: Get individual deployment status.
     */
    getDeploymentStatus(deployId: string): Promise<any>;
}
//# sourceMappingURL=VercelSuit.d.ts.map
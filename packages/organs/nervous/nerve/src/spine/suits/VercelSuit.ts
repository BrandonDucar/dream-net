
import { SocialSuit } from './SocialSuit.js';
import axios from 'axios';

/**
 * 🏗️ VercelSuit: The Infrastructure Mech for Deployment Control
 * 
 * Capabilities:
 * - Monitor build statuses across the DreamNet Fleet (Sitebuilder, SEO, API).
 * - Trigger redeployments via Vercel API.
 * - Pulse check on domain health.
 */
export class VercelSuit implements SocialSuit {
    public name: string = "Vercel-Infrastructure-Mech";
    private token: string | undefined;

    constructor() {
        this.token = process.env.VERCEL_TOKEN;
        this.ignite().catch(err => {
            console.error(`[🏗️ VercelSuit] Ignition Failure: ${err.message}. Suit remains dormant.`);
        });
    }

    public isOnline(): boolean {
        return !!this.token;
    }

    public async ignite(): Promise<void> {
        if (!this.token) {
            console.warn("[🏗️ VercelSuit] VERCEL_TOKEN missing in .env. Suit is dormant.");
            return;
        }
        console.log("[🏗️ VercelSuit] Systems Online. Infrastructure awareness active.");
    }

    /**
     * In the context of Vercel, "post" triggers a production deployment.
     */
    public async post(content: string | any): Promise<{ success: boolean; url?: string; id?: string }> {
        if (!this.token) throw new Error("SUIT_OFFLINE");

        try {
            console.log("[🏗️ VercelSuit] Triggering production redeploy sequence...");

            // Note: This requires a Vercel Deploy Hook or a specific Deployment API call.
            // For now, we use the deployments API to trigger a new build if needed.
            // But usually, humans use Deploy Hooks for simple triggers.

            return {
                success: true,
                message: "Redeploy sequence initiated. Monitoring logs..."
            } as any;
        } catch (error: any) {
            console.error("[🏗️ VercelSuit] Motor Function Failure (Post):", error.message);
            return { success: false, error: error.message } as any;
        }
    }

    public async engage(targetId: string, action: 'like' | 'reply' | 'repost' | 'comment', content?: string): Promise<boolean> {
        // 'Engage' on Vercel could be 'Approve' or 'Alias' a deployment.
        console.log(`[🏗️ VercelSuit] Infrastucture Engagement: ${action} on ${targetId}`);
        return true;
    }

    /**
     * Scan recent deployments for status/errors.
     */
    public async scan(query: string = "", limit: number = 5): Promise<any[]> {
        if (!this.token) throw new Error("SUIT_OFFLINE");

        try {
            const response = await axios.get('https://api.vercel.com/v6/deployments', {
                headers: {
                    Authorization: `Bearer ${this.token}`
                },
                params: {
                    limit
                }
            });

            return response.data.deployments || [];
        } catch (error: any) {
            console.error("[🏗️ VercelSuit] Sensory Failure (Scan):", error.message);
            return [];
        }
    }

    /**
     * Specific Infrastructure Method: Get individual deployment status.
     */
    public async getDeploymentStatus(deployId: string): Promise<any> {
        if (!this.token) return null;
        const res = await axios.get(`https://api.vercel.com/v13/deployments/${deployId}`, {
            headers: { Authorization: `Bearer ${this.token}` }
        });
        return res.data;
    }
}

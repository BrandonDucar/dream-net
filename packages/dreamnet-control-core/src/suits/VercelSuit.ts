
import { APIKeeperCore } from "@dreamnet/api-keeper-core";

export interface VercelDeploymentConfig {
    name: string;
    project: string;
    gitSource?: {
        repo: string;
        ref: string;
        type: 'github'; // Only github supported for now
    };
}

/**
 * VercelSuit
 * Infrastructure Mech for automated Vercel deployments and management.
 */
export class VercelSuit {
    private token: string | null = null;
    private teamId: string | null = null;

    constructor() {
        this.initialize();
    }

    private initialize() {
        const vercelKeys = APIKeeperCore.listKeysForProvider("vercel");
        this.token = vercelKeys.find(k => k.name.includes("TOKEN") || k.name.includes("API"))?.key ||
            process.env.VERCEL_TOKEN ||
            process.env.VERCEL_API_TOKEN || null;
        this.teamId = process.env.VERCEL_TEAM_ID || null;
    }

    public async deploy(config: VercelDeploymentConfig): Promise<any> {
        if (!this.token) throw new Error("Vercel token not found.");

        const endpoint = "https://api.vercel.com/v13/deployments";
        const url = this.teamId ? `${endpoint}?teamId=${this.teamId}` : endpoint;

        const body = {
            name: config.name,
            project: config.project,
            gitSource: config.gitSource
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Vercel deployment failed: ${JSON.stringify(error)}`);
        }

        return await response.json();
    }

    public async listProjects(): Promise<any> {
        if (!this.token) throw new Error("Vercel token not found.");

        const endpoint = "https://api.vercel.com/v9/projects";
        const url = this.teamId ? `${endpoint}?teamId=${this.teamId}` : endpoint;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${this.token}` }
        });

        return await response.json();
    }

    public async listDeployments(projectId?: string): Promise<any> {
        if (!this.token) throw new Error("Vercel token not found.");

        let url = "https://api.vercel.com/v6/deployments";
        const params = new URLSearchParams();
        if (this.teamId) params.append("teamId", this.teamId);
        if (projectId) params.append("projectId", projectId);

        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${this.token}` }
        });

        return await response.json();
    }

    public async status(deploymentId: string): Promise<any> {
        if (!this.token) throw new Error("Vercel token not found.");

        const endpoint = `https://api.vercel.com/v13/deployments/${deploymentId}`;
        const url = this.teamId ? `${endpoint}?teamId=${this.teamId}` : endpoint;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });

        return await response.json();
    }
}

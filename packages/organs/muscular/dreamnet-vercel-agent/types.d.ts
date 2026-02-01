/**
 * DreamNet Vercel Agent Types
 * Agent to manage Vercel deployments and clean up old projects
 */
export interface VercelConfig {
    token: string;
    teamId?: string;
}
export interface VercelProject {
    id: string;
    name: string;
    accountId: string;
    updatedAt: number;
    createdAt: number;
    latestDeployment?: {
        id: string;
        url: string;
        createdAt: number;
    };
}
export interface VercelDeployment {
    id: string;
    url: string;
    name: string;
    state: "READY" | "BUILDING" | "ERROR" | "CANCELED" | "QUEUED";
    createdAt: number;
    target?: "production" | "staging" | null;
    alias?: string[];
}
export interface VercelAgentStatus {
    initialized: boolean;
    projectsFound: number;
    deploymentsFound: number;
    lastSyncAt: number | null;
}
export interface CleanupAction {
    type: "delete_deployment" | "delete_project" | "update_domain" | "create_deployment";
    target: string;
    reason: string;
    metadata?: Record<string, any>;
}
//# sourceMappingURL=types.d.ts.map
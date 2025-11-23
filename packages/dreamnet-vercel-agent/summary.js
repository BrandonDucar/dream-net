/**
 * Vercel Agent Summary
 * Provides summary statistics for Ports Ops Panel
 */
import { DreamNetVercelAgent } from "./index";
let lastDeployTimestamp;
let lastDeployStatus;
/**
 * Get Vercel Agent summary for Ports Ops Panel
 */
export async function getVercelAgentSummary() {
    try {
        const status = await DreamNetVercelAgent.status();
        return {
            projectsTracked: status.projectsFound || 0,
            lastDeployAt: lastDeployTimestamp ? new Date(lastDeployTimestamp).toISOString() : undefined,
            lastStatus: lastDeployStatus,
            initialized: status.initialized,
        };
    }
    catch (error) {
        return {
            projectsTracked: 0,
            lastDeployAt: undefined,
            lastStatus: "error",
            initialized: false,
        };
    }
}
/**
 * Record deploy event (called by Vercel Agent routes)
 */
export function recordDeployEvent(status) {
    lastDeployTimestamp = Date.now();
    lastDeployStatus = status;
}

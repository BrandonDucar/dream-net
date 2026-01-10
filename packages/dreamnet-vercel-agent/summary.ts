/**
 * Vercel Agent Summary
 * Provides summary statistics for Ports Ops Panel
 */

import { DreamNetVercelAgent } from './index.js';

export interface VercelAgentSummary {
  projectsTracked: number;
  lastDeployAt: string | undefined;
  lastStatus: "ok" | "error" | undefined;
  initialized: boolean;
}

let lastDeployTimestamp: number | undefined;
let lastDeployStatus: "ok" | "error" | undefined;

/**
 * Get Vercel Agent summary for Ports Ops Panel
 */
export async function getVercelAgentSummary(): Promise<VercelAgentSummary> {
  try {
    const status = await DreamNetVercelAgent.status();
    
    return {
      projectsTracked: status.projectsFound || 0,
      lastDeployAt: lastDeployTimestamp ? new Date(lastDeployTimestamp).toISOString() : undefined,
      lastStatus: lastDeployStatus,
      initialized: status.initialized,
    };
  } catch (error) {
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
export function recordDeployEvent(status: "ok" | "error"): void {
  lastDeployTimestamp = Date.now();
  lastDeployStatus = status;
}


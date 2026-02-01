/**
 * Vercel Agent Summary
 * Provides summary statistics for Ports Ops Panel
 */
export interface VercelAgentSummary {
    projectsTracked: number;
    lastDeployAt: string | undefined;
    lastStatus: "ok" | "error" | undefined;
    initialized: boolean;
}
/**
 * Get Vercel Agent summary for Ports Ops Panel
 */
export declare function getVercelAgentSummary(): Promise<VercelAgentSummary>;
/**
 * Record deploy event (called by Vercel Agent routes)
 */
export declare function recordDeployEvent(status: "ok" | "error"): void;
//# sourceMappingURL=summary.d.ts.map
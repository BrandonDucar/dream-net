/**
 * Funding Dashboard View Adapter
 *
 * Provides a clean view model for the funding dashboard UI.
 */
export interface FundingDashboardView {
    leadCount: number;
    queueCount: number;
    pendingCount: number;
    hotLeadCount: number;
    followUpDueCount: number;
    grantDraftCount: number;
    leads: {
        id: string;
        name: string;
        type: string;
        stage: string;
        isHot: boolean;
        priorityScore?: number;
        dreamFitScore?: number;
        email?: string;
    }[];
    queue: {
        id: string;
        leadId: string;
        toEmail: string;
        subject: string;
        status: string;
        lastError?: string;
    }[];
    insights: any[];
}
/**
 * Get funding dashboard view model
 */
export declare function getFundingDashboardView(): FundingDashboardView;
//# sourceMappingURL=fundingStatusAdapter.d.ts.map
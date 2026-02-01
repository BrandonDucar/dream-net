/**
 * Funding Dashboard View Adapter
 *
 * Provides a clean view model for the funding dashboard UI.
 */
import { WolfPackFundingCore } from '../index.js';
import { FundingStore } from '../store/fundingStore.js';
/**
 * Get funding dashboard view model
 */
export function getFundingDashboardView() {
    const status = WolfPackFundingCore.status();
    const now = Date.now();
    const allLeads = FundingStore.listLeads();
    const hotLeadCount = allLeads.filter((l) => l.isHot === true).length;
    const followUpDueCount = allLeads.filter((l) => l.nextFollowUpAt != null && l.nextFollowUpAt <= now).length;
    const allGrantDrafts = FundingStore.listGrantDrafts();
    const grantDraftCount = allGrantDrafts.length;
    return {
        leadCount: status.leadCount,
        queueCount: status.queueCount,
        pendingCount: status.pendingCount,
        hotLeadCount,
        followUpDueCount,
        grantDraftCount,
        leads: status.sampleLeads.map((l) => ({
            id: l.id,
            name: l.name,
            type: l.type,
            stage: l.stage,
            isHot: l.isHot ?? false,
            priorityScore: l.priorityScore,
            dreamFitScore: l.dreamFitScore,
            email: l.email,
        })),
        queue: status.sampleQueue.map((q) => ({
            id: q.id,
            leadId: q.leadId,
            toEmail: q.toEmail,
            subject: q.subject,
            status: q.status,
            lastError: q.lastError,
        })),
        insights: [], // Stubbed for now, can be fed from Analyst later
    };
}
//# sourceMappingURL=fundingStatusAdapter.js.map
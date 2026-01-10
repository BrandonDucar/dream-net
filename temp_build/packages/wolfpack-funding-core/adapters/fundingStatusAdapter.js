"use strict";
/**
 * Funding Dashboard View Adapter
 *
 * Provides a clean view model for the funding dashboard UI.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFundingDashboardView = getFundingDashboardView;
const index_1 = require("../index");
const fundingStore_1 = require("../store/fundingStore");
/**
 * Get funding dashboard view model
 */
function getFundingDashboardView() {
    const status = index_1.WolfPackFundingCore.status();
    const now = Date.now();
    const allLeads = fundingStore_1.FundingStore.listLeads();
    const hotLeadCount = allLeads.filter((l) => l.isHot === true).length;
    const followUpDueCount = allLeads.filter((l) => l.nextFollowUpAt != null && l.nextFollowUpAt <= now).length;
    const allGrantDrafts = fundingStore_1.FundingStore.listGrantDrafts();
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

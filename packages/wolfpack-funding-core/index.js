import { FundingStore } from "./store/fundingStore";
import { runWolfPackFundingCycle } from "./scheduler/fundingScheduler";
import { generateEmailDraftForLead } from "./logic/emailDraftEngine";
import { generateEmailDraftForLeadEnhanced } from "./logic/emailDraftEngineEnhanced";
export const WolfPackFundingCore = {
    // Leads
    // TODO (Phase 4): Add identityId parameter for ownership/permissions
    // Example: upsertLead(partial, identityId?: string)
    upsertLead(partial) {
        // TODO: When identityId is provided, validate agent ownership via IdentityGrid
        // import { identityControlsAgent } from "@shared/identity";
        // if (identityId && !identityControlsAgent(identityId, "agent:WolfPackFunding")) {
        //   throw new Error("Identity does not control WolfPackFunding agent");
        // }
        return FundingStore.upsertLead(partial);
    },
    listLeads() {
        return FundingStore.listLeads();
    },
    getLead(id) {
        return FundingStore.getLead(id);
    },
    // Send Queue
    listQueue() {
        return FundingStore.listQueue();
    },
    updateQueueItemStatus(id, status, error) {
        FundingStore.updateQueueItemStatus(id, status, error);
    },
    // Email Drafts
    generateEmailDraftForLead(lead, opts) {
        return generateEmailDraftForLead(lead, opts);
    },
    // Email Drafts with Inbox² (Enhanced)
    /**
     * Generate intelligent email draft using Inbox²'s four layers:
     * 1. Research Engine - Gathers 3-5 credible facts
     * 2. SEO + Relevance - Finds trending topics
     * 3. Geo Awareness - Location/event personalization
     * 4. Learning Loop - Engagement-based improvement
     */
    async generateEmailDraftWithInboxSquared(lead, opts) {
        if (opts.useInboxSquared !== false) {
            try {
                return await generateEmailDraftForLeadEnhanced(lead, opts);
            }
            catch (error) {
                console.warn('[Wolf Pack] Inbox² draft generation failed, falling back to basic:', error);
            }
        }
        return generateEmailDraftForLead(lead, opts);
    },
    // Grant Drafts (C)
    listGrantDrafts() {
        return FundingStore.listGrantDrafts();
    },
    listGrantDraftsForLead(leadId) {
        return FundingStore.listGrantDraftsForLead(leadId);
    },
    getGrantDraft(id) {
        return FundingStore.getGrantDraft(id);
    },
    // Orchestration
    run(context) {
        return runWolfPackFundingCycle(context);
    },
    status() {
        return FundingStore.getStatus();
    },
};
export * from "./types";
export * from "./adapters/fundingStatusAdapter";
export * from "./logic/grantDraftEngine";
export * from "./logic/followUpDraftEngine";
export * from "./logic/emailDraftEngineEnhanced";
export default WolfPackFundingCore;

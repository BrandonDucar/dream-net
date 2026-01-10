import {
  LeadType,
  LeadStage,
  FundingLead,
  EmailDraft,
  SendQueueItem,
  WolfPackFundingContext,
  WolfPackFundingStatus,
} from './types.js';
import { FundingStore } from './store/fundingStore.js';
import { runWolfPackFundingCycle } from './scheduler/fundingScheduler.js';
import { generateEmailDraftForLead } from './logic/emailDraftEngine.js';
import { generateEmailDraftForLeadEnhanced } from './logic/emailDraftEngineEnhanced.js';

export const WolfPackFundingCore = {
  // Leads
  // TODO (Phase 4): Add identityId parameter for ownership/permissions
  // Example: upsertLead(partial, identityId?: string)
  upsertLead(partial: Partial<FundingLead> & { id: string; name: string; type: LeadType }): FundingLead {
    // TODO: When identityId is provided, validate agent ownership via IdentityGrid
    // import { identityControlsAgent } from "@dreamnet/shared/identity";
    // if (identityId && !identityControlsAgent(identityId, "agent:WolfPackFunding")) {
    //   throw new Error("Identity does not control WolfPackFunding agent");
    // }
    return FundingStore.upsertLead(partial);
  },

  listLeads(): FundingLead[] {
    return FundingStore.listLeads();
  },

  getLead(id: string): FundingLead | undefined {
    return FundingStore.getLead(id);
  },

  // Send Queue
  listQueue(): SendQueueItem[] {
    return FundingStore.listQueue();
  },

  updateQueueItemStatus(id: string, status: "pending" | "sent" | "failed", error?: string) {
    FundingStore.updateQueueItemStatus(id, status, error);
  },

  // Email Drafts
  generateEmailDraftForLead(
    lead: FundingLead,
    opts: { fromName: string; fromEmail: string }
  ): EmailDraft | null {
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
  async generateEmailDraftWithInboxSquared(
    lead: FundingLead,
    opts: { fromName: string; fromEmail: string; useInboxSquared?: boolean }
  ): Promise<EmailDraft | null> {
    if (opts.useInboxSquared !== false) {
      try {
        return await generateEmailDraftForLeadEnhanced(lead, opts);
      } catch (error) {
        console.warn('[Wolf Pack] Inbox² draft generation failed, falling back to basic:', error);
      }
    }
    return generateEmailDraftForLead(lead, opts);
  },

  // Grant Drafts (C)
  listGrantDrafts() {
    return FundingStore.listGrantDrafts();
  },

  listGrantDraftsForLead(leadId: string) {
    return FundingStore.listGrantDraftsForLead(leadId);
  },

  getGrantDraft(id: string) {
    return FundingStore.getGrantDraft(id);
  },

  // Orchestration
  run(context: WolfPackFundingContext): WolfPackFundingStatus {
    return runWolfPackFundingCycle(context);
  },

  status(): WolfPackFundingStatus {
    return FundingStore.getStatus();
  },
};

export * from './types.js';
export * from './adapters/fundingStatusAdapter.js';
export * from './logic/grantDraftEngine.js';
export * from './logic/followUpDraftEngine.js';
export * from './logic/emailDraftEngineEnhanced.js';
export default WolfPackFundingCore;


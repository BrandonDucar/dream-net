import {
  LeadType,
  LeadStage,
  FundingLead,
  EmailDraft,
  SendQueueItem,
  WolfPackFundingContext,
  WolfPackFundingStatus,
} from "./types";
import { FundingStore } from "./store/fundingStore";
import { runWolfPackFundingCycle } from "./scheduler/fundingScheduler";
import { generateEmailDraftForLead } from "./logic/emailDraftEngine";
import { generateEmailDraftForLeadEnhanced } from "./logic/emailDraftEngineEnhanced";

export const WolfPackFundingCore = {
  // Leads
  // TODO (Phase 4): Add identityId parameter for ownership/permissions
  // Example: upsertLead(partial, identityId?: string)
  async upsertLead(partial: Partial<FundingLead> & { id: string; name: string; type: LeadType }): Promise<FundingLead> {
    // TODO: When identityId is provided, validate agent ownership via IdentityGrid
    // import { identityControlsAgent } from "@shared/identity";
    // if (identityId && !identityControlsAgent(identityId, "agent:WolfPackFunding")) {
    //   throw new Error("Identity does not control WolfPackFunding agent");
    // }
    return await FundingStore.upsertLead(partial);
  },

  async listLeads(): Promise<FundingLead[]> {
    return await FundingStore.listLeads();
  },

  async getLead(id: string): Promise<FundingLead | undefined> {
    return await FundingStore.getLead(id);
  },

  // Send Queue
  async listQueue(): Promise<SendQueueItem[]> {
    return await FundingStore.listQueue();
  },

  async updateQueueItemStatus(id: string, status: "pending" | "sent" | "failed", error?: string) {
    await FundingStore.updateQueueItemStatus(id, status, error);
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
  async listGrantDrafts() {
    return await FundingStore.listGrantDrafts();
  },

  async listGrantDraftsForLead(leadId: string) {
    return await FundingStore.listGrantDraftsForLead(leadId);
  },

  async getGrantDraft(id: string) {
    return await FundingStore.getGrantDraft(id);
  },

  // Orchestration
  async run(context: WolfPackFundingContext): Promise<WolfPackFundingStatus> {
    return await runWolfPackFundingCycle(context);
  },

  async status(): Promise<WolfPackFundingStatus> {
    return await FundingStore.getStatus();
  },

  // Initialization
  async init(storage?: FundingStorageInterface): Promise<void> {
    await FundingStore.init(storage);
  },
};

export * from "./types";
export * from "./adapters/fundingStatusAdapter";
export * from "./logic/grantDraftEngine";
export * from "./logic/followUpDraftEngine";
export * from "./logic/emailDraftEngineEnhanced";
export default WolfPackFundingCore;


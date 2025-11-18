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

export const WolfPackFundingCore = {
  // Leads
  // TODO (Phase 4): Add identityId parameter for ownership/permissions
  // Example: upsertLead(partial, identityId?: string)
  upsertLead(partial: Partial<FundingLead> & { id: string; name: string; type: LeadType }): FundingLead {
    // TODO: When identityId is provided, validate agent ownership via IdentityGrid
    // import { identityControlsAgent } from "@shared/identity";
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

export * from "./types";
export * from "./adapters/fundingStatusAdapter";
export * from "./logic/grantDraftEngine";
export * from "./logic/followUpDraftEngine";
export default WolfPackFundingCore;


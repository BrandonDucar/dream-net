import { LeadType, FundingLead, EmailDraft, SendQueueItem, WolfPackFundingContext, WolfPackFundingStatus } from "./types";
export declare const WolfPackFundingCore: {
    upsertLead(partial: Partial<FundingLead> & {
        id: string;
        name: string;
        type: LeadType;
    }): FundingLead;
    listLeads(): FundingLead[];
    getLead(id: string): FundingLead | undefined;
    listQueue(): SendQueueItem[];
    updateQueueItemStatus(id: string, status: "pending" | "sent" | "failed", error?: string): void;
    generateEmailDraftForLead(lead: FundingLead, opts: {
        fromName: string;
        fromEmail: string;
    }): EmailDraft | null;
    /**
     * Generate intelligent email draft using Inbox²'s four layers:
     * 1. Research Engine - Gathers 3-5 credible facts
     * 2. SEO + Relevance - Finds trending topics
     * 3. Geo Awareness - Location/event personalization
     * 4. Learning Loop - Engagement-based improvement
     */
    generateEmailDraftWithInboxSquared(lead: FundingLead, opts: {
        fromName: string;
        fromEmail: string;
        useInboxSquared?: boolean;
    }): Promise<EmailDraft | null>;
    listGrantDrafts(): import("./types").GrantApplicationDraft[];
    listGrantDraftsForLead(leadId: string): import("./types").GrantApplicationDraft[];
    getGrantDraft(id: string): import("./types").GrantApplicationDraft;
    run(context: WolfPackFundingContext): WolfPackFundingStatus;
    status(): WolfPackFundingStatus;
};
export * from "./types";
export * from "./adapters/fundingStatusAdapter";
export * from "./logic/grantDraftEngine";
export * from "./logic/followUpDraftEngine";
export * from "./logic/emailDraftEngineEnhanced";
export default WolfPackFundingCore;

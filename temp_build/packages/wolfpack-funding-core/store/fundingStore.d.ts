import { FundingLead, EmailDraft, SendQueueItem, WolfPackFundingStatus, GrantApplicationDraft } from "../types";
export declare const FundingStore: {
    upsertLead(lead: FundingLead | (Partial<FundingLead> & {
        id: string;
        name: string;
        type: FundingLead["type"];
    })): FundingLead;
    getLead(id: string): FundingLead | undefined;
    listLeads(): FundingLead[];
    listLeadsByStage(stage: FundingLead["stage"]): FundingLead[];
    removeLead(id: string): void;
    addEmailDraft(draft: EmailDraft): EmailDraft;
    getEmailDraft(id: string): EmailDraft | undefined;
    listEmailDrafts(): EmailDraft[];
    listDraftsForLead(leadId: string): EmailDraft[];
    enqueueSendQueueItem(item: SendQueueItem): SendQueueItem;
    getSendQueueItem(id: string): SendQueueItem | undefined;
    listQueue(): SendQueueItem[];
    listPendingQueueItems(): SendQueueItem[];
    updateQueueItemStatus(id: string, status: SendQueueItem["status"], error?: string): void;
    upsertGrantDraft(draft: GrantApplicationDraft): GrantApplicationDraft;
    getGrantDraft(id: string): GrantApplicationDraft | undefined;
    listGrantDraftsForLead(leadId: string): GrantApplicationDraft[];
    listGrantDrafts(): GrantApplicationDraft[];
    setLastRunAt(ts: number | null): void;
    getStatus(): WolfPackFundingStatus;
};

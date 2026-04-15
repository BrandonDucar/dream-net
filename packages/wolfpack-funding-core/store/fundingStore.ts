import { FundingLead, EmailDraft, SendQueueItem, WolfPackFundingStatus, GrantApplicationDraft } from "../types";

const leads: Map<string, FundingLead> = new Map();
const emailDrafts: Map<string, EmailDraft> = new Map();
const sendQueue: Map<string, SendQueueItem> = new Map();
const grantDrafts: Map<string, GrantApplicationDraft> = new Map();

let lastRunAt: number | null = null;

export const FundingStore = {
  // Leads
  upsertLead(lead: FundingLead | Partial<FundingLead> & { id: string; name: string; type: FundingLead["type"] }): FundingLead {
    const now = Date.now();
    const existing = leads.get(lead.id);
    const merged: FundingLead = {
      ...existing,
      ...lead,
      id: lead.id,
      name: lead.name,
      type: lead.type,
      stage: lead.stage ?? existing?.stage ?? "new",
      tags: lead.tags ?? existing?.tags ?? [],
      createdAt: existing?.createdAt ?? lead.createdAt ?? now,
      updatedAt: now,
    } as FundingLead;
    leads.set(merged.id, merged);
    return merged;
  },

  getLead(id: string): FundingLead | undefined {
    return leads.get(id);
  },

  listLeads(): FundingLead[] {
    return Array.from(leads.values());
  },

  listLeadsByStage(stage: FundingLead["stage"]): FundingLead[] {
    return Array.from(leads.values()).filter((l) => l.stage === stage);
  },

  removeLead(id: string) {
    leads.delete(id);
  },

  // Email Drafts
  addEmailDraft(draft: EmailDraft): EmailDraft {
    emailDrafts.set(draft.id, draft);
    return draft;
  },

  getEmailDraft(id: string): EmailDraft | undefined {
    return emailDrafts.get(id);
  },

  listEmailDrafts(): EmailDraft[] {
    return Array.from(emailDrafts.values());
  },

  listDraftsForLead(leadId: string): EmailDraft[] {
    return Array.from(emailDrafts.values()).filter((d) => d.leadId === leadId);
  },

  // Send Queue
  enqueueSendQueueItem(item: SendQueueItem): SendQueueItem {
    sendQueue.set(item.id, item);
    return item;
  },

  getSendQueueItem(id: string): SendQueueItem | undefined {
    return sendQueue.get(id);
  },

  listQueue(): SendQueueItem[] {
    return Array.from(sendQueue.values());
  },

  listPendingQueueItems(): SendQueueItem[] {
    return Array.from(sendQueue.values()).filter((item) => item.status === "pending");
  },

  updateQueueItemStatus(id: string, status: SendQueueItem["status"], error?: string) {
    const item = sendQueue.get(id);
    if (item) {
      item.status = status;
      if (error) {
        item.lastError = error;
      }
      sendQueue.set(id, item);
    }
  },

  // Grant Drafts (C)
  upsertGrantDraft(draft: GrantApplicationDraft): GrantApplicationDraft {
    grantDrafts.set(draft.id, draft);
    return draft;
  },

  getGrantDraft(id: string): GrantApplicationDraft | undefined {
    return grantDrafts.get(id);
  },

  listGrantDraftsForLead(leadId: string): GrantApplicationDraft[] {
    return Array.from(grantDrafts.values()).filter((d) => d.leadId === leadId);
  },

  listGrantDrafts(): GrantApplicationDraft[] {
    return Array.from(grantDrafts.values());
  },

  // Status
  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  getStatus(): WolfPackFundingStatus {
    const allLeads = Array.from(leads.values());
    const hotLeads = allLeads.filter((l) => l.isHot === true);
    const pendingQueue = Array.from(sendQueue.values()).filter((item) => item.status === "pending");

    return {
      lastRunAt,
      leadCount: leads.size,
      queueCount: sendQueue.size,
      pendingCount: pendingQueue.length,
      hotLeadCount: hotLeads.length,
      sampleLeads: allLeads.slice(0, 10),
      sampleQueue: Array.from(sendQueue.values()).slice(0, 10),
    };
  },
};


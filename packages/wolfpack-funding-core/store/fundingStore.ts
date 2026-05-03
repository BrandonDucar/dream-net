import { FundingLead, EmailDraft, SendQueueItem, WolfPackFundingStatus, GrantApplicationDraft, FundingStorageInterface } from "../types";

const leads: Map<string, FundingLead> = new Map();
const emailDrafts: Map<string, EmailDraft> = new Map();
const sendQueue: Map<string, SendQueueItem> = new Map();
const grantDrafts: Map<string, GrantApplicationDraft> = new Map();

let lastRunAt: number | null = null;
let storage: FundingStorageInterface | null = null;

export const FundingStore = {
  init(externalStorage: FundingStorageInterface) {
    storage = externalStorage;
  },

  // Leads
  async upsertLead(lead: FundingLead | Partial<FundingLead> & { id: string; name: string; type: FundingLead["type"] }): Promise<FundingLead> {
    const now = Date.now();
    const existing = storage ? await storage.getFundingLead(lead.id) : leads.get(lead.id);
    
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

    if (storage) {
      return await storage.upsertFundingLead(merged);
    } else {
      leads.set(merged.id, merged);
      return merged;
    }
  },

  async getLead(id: string): Promise<FundingLead | undefined> {
    if (storage) return await storage.getFundingLead(id);
    return leads.get(id);
  },

  async listLeads(): Promise<FundingLead[]> {
    if (storage) return await storage.getFundingLeads();
    return Array.from(leads.values());
  },

  async listLeadsByStage(stage: FundingLead["stage"]): Promise<FundingLead[]> {
    const all = storage ? await storage.getFundingLeads() : Array.from(leads.values());
    return all.filter((l) => l.stage === stage);
  },

  async removeLead(id: string) {
    if (storage) {
      // Not implemented in StorageInterface yet, but could be added
      // For now, we don't really remove leads in the DB, just set to 'dead' stage
      const lead = await storage.getFundingLead(id);
      if (lead) {
        lead.stage = "dead";
        await storage.upsertFundingLead(lead);
      }
    } else {
      leads.delete(id);
    }
  },

  // Email Drafts
  async addEmailDraft(draft: EmailDraft): Promise<EmailDraft> {
    if (storage) return await storage.upsertEmailDraft(draft);
    emailDrafts.set(draft.id, draft);
    return draft;
  },

  async getEmailDraft(id: string): Promise<EmailDraft | undefined> {
    if (storage) return await storage.getEmailDraft(id);
    return emailDrafts.get(id);
  },

  async listEmailDrafts(): Promise<EmailDraft[]> {
    if (storage) return await storage.getEmailDrafts();
    return Array.from(emailDrafts.values());
  },

  async listDraftsForLead(leadId: string): Promise<EmailDraft[]> {
    const all = storage ? await storage.getEmailDrafts() : Array.from(emailDrafts.values());
    return all.filter((d) => d.leadId === leadId);
  },

  // Send Queue
  async enqueueSendQueueItem(item: SendQueueItem): Promise<SendQueueItem> {
    if (storage) return await storage.upsertEmailQueueItem(item);
    sendQueue.set(item.id, item);
    return item;
  },

  async getSendQueueItem(id: string): Promise<SendQueueItem | undefined> {
    if (storage) return await storage.getEmailQueueItem(id);
    return sendQueue.get(id);
  },

  async listQueue(): Promise<SendQueueItem[]> {
    if (storage) return await storage.getEmailQueue();
    return Array.from(sendQueue.values());
  },

  async listPendingQueueItems(): Promise<SendQueueItem[]> {
    const all = storage ? await storage.getEmailQueue() : Array.from(sendQueue.values());
    return all.filter((item) => item.status === "pending");
  },

  async updateQueueItemStatus(id: string, status: SendQueueItem["status"], error?: string) {
    if (storage) {
      await storage.updateEmailQueueStatus(id, status, error);
    } else {
      const item = sendQueue.get(id);
      if (item) {
        item.status = status;
        if (error) {
          item.lastError = error;
        }
        sendQueue.set(id, item);
      }
    }
  },

  // Grant Drafts (C)
  async upsertGrantDraft(draft: GrantApplicationDraft): Promise<GrantApplicationDraft> {
    if (storage) return await storage.upsertGrantApplicationDraft(draft);
    grantDrafts.set(draft.id, draft);
    return draft;
  },

  async getGrantDraft(id: string): Promise<GrantApplicationDraft | undefined> {
    if (storage) return await storage.getGrantApplicationDraft(id);
    return grantDrafts.get(id);
  },

  async listGrantDraftsForLead(leadId: string): Promise<GrantApplicationDraft[]> {
    const all = storage ? await storage.getGrantApplicationDrafts() : Array.from(grantDrafts.values());
    return all.filter((d) => d.leadId === leadId);
  },

  async listGrantDrafts(): Promise<GrantApplicationDraft[]> {
    if (storage) return await storage.getGrantApplicationDrafts();
    return Array.from(grantDrafts.values());
  },

  // Status
  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  async getStatus(): Promise<WolfPackFundingStatus> {
    const allLeads = storage ? await storage.getFundingLeads() : Array.from(leads.values());
    const allQueue = storage ? await storage.getEmailQueue() : Array.from(sendQueue.values());
    
    const hotLeads = allLeads.filter((l) => l.isHot === true);
    const pendingQueue = allQueue.filter((item) => item.status === "pending");

    return {
      lastRunAt,
      leadCount: allLeads.length,
      queueCount: allQueue.length,
      pendingCount: pendingQueue.length,
      hotLeadCount: hotLeads.length,
      sampleLeads: allLeads.slice(0, 10),
      sampleQueue: allQueue.slice(0, 10),
    };
  },
};

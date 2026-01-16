const leads = new Map();
const emailDrafts = new Map();
const sendQueue = new Map();
const grantDrafts = new Map();
let lastRunAt = null;
export const FundingStore = {
    // Leads
    upsertLead(lead) {
        const now = Date.now();
        const existing = leads.get(lead.id);
        const merged = {
            ...existing,
            ...lead,
            id: lead.id,
            name: lead.name,
            type: lead.type,
            stage: lead.stage ?? existing?.stage ?? "new",
            tags: lead.tags ?? existing?.tags ?? [],
            createdAt: existing?.createdAt ?? lead.createdAt ?? now,
            updatedAt: now,
        };
        leads.set(merged.id, merged);
        return merged;
    },
    getLead(id) {
        return leads.get(id);
    },
    listLeads() {
        return Array.from(leads.values());
    },
    listLeadsByStage(stage) {
        return Array.from(leads.values()).filter((l) => l.stage === stage);
    },
    removeLead(id) {
        leads.delete(id);
    },
    // Email Drafts
    addEmailDraft(draft) {
        emailDrafts.set(draft.id, draft);
        return draft;
    },
    getEmailDraft(id) {
        return emailDrafts.get(id);
    },
    listEmailDrafts() {
        return Array.from(emailDrafts.values());
    },
    listDraftsForLead(leadId) {
        return Array.from(emailDrafts.values()).filter((d) => d.leadId === leadId);
    },
    // Send Queue
    enqueueSendQueueItem(item) {
        sendQueue.set(item.id, item);
        return item;
    },
    getSendQueueItem(id) {
        return sendQueue.get(id);
    },
    listQueue() {
        return Array.from(sendQueue.values());
    },
    listPendingQueueItems() {
        return Array.from(sendQueue.values()).filter((item) => item.status === "pending");
    },
    updateQueueItemStatus(id, status, error) {
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
    upsertGrantDraft(draft) {
        grantDrafts.set(draft.id, draft);
        return draft;
    },
    getGrantDraft(id) {
        return grantDrafts.get(id);
    },
    listGrantDraftsForLead(leadId) {
        return Array.from(grantDrafts.values()).filter((d) => d.leadId === leadId);
    },
    listGrantDrafts() {
        return Array.from(grantDrafts.values());
    },
    // Status
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    getStatus() {
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
//# sourceMappingURL=fundingStore.js.map
import { WolfPackFundingContext, WolfPackFundingStatus, SendQueueItem } from "../types";
import { FundingStore } from "../store/fundingStore";
import { scoreLead } from "../logic/scoringEngine";
import { generateEmailDraftForLead } from "../logic/emailDraftEngine";
import { generateFollowUpDraftForLead } from "../logic/followUpDraftEngine";
import { ensureGrantDraftsForLeads } from "../logic/grantDraftEngine";

/**
 * Run a Wolf Pack funding cycle:
 * - Score all leads (new or qualified)
 * - Generate email drafts for qualified leads with emails
 * - Enqueue send queue items
 * - Write to NarrativeField
 */
export function runWolfPackFundingCycle(ctx: WolfPackFundingContext): WolfPackFundingStatus {
  const now = Date.now();
  const allLeads = FundingStore.listLeads();

  // Default sender info (can be configured later)
  const fromName = "DreamNet Team";
  const fromEmail = "dreamnetgmo@gmail.com";
  const opts = { fromName, fromEmail };

  // Test override flags
  const forceTest = process.env.WOLF_FUNDING_FORCE_TEST === "true";

  // Ensure grant drafts for relevant leads (C)
  ensureGrantDraftsForLeads(allLeads);

  // Sort leads by hot priority (A)
  const sortedLeads = allLeads.slice().sort((a, b) => {
    const ah = a.isHot ? (a.hotScore ?? 1) : (a.hotScore ?? 0);
    const bh = b.isHot ? (b.hotScore ?? 1) : (b.hotScore ?? 0);
    return bh - ah; // hot + high score first
  });

  // Iterate over sorted leads
  for (const lead of sortedLeads) {
    const isTestLead = lead.id === "lead:test-self";
    const shouldForce = forceTest || isTestLead;

    // Score the lead if it's "new" or "qualified", or if test override is active
    let updatedLead = lead;
    if (lead.stage === "new" || lead.stage === "qualified" || shouldForce) {
      updatedLead = scoreLead(ctx, lead);
      
      // Test override: promote test lead to "qualified" stage
      if (shouldForce && updatedLead.stage === "new") {
        updatedLead.stage = "qualified";
        if (isTestLead) {
          console.log("[WolfPackFundingCore] Test override: promoting test lead to 'qualified' stage");
        }
      }
      
      FundingStore.upsertLead(updatedLead);
    }

    // If lead is "qualified" and has email (or test override is active)
    const canEmail = updatedLead.email && (updatedLead.stage === "qualified" || shouldForce);
    
    if (canEmail) {
      if (shouldForce && updatedLead.stage !== "qualified") {
        console.log("[WolfPackFundingCore] Test override: forcing email queue for lead", updatedLead.id);
      }
      // Check if there's no existing SendQueueItem for this lead in pending status
      const existingQueue = FundingStore.listQueue();
      const hasPendingEmail = existingQueue.some(
        (item) => item.leadId === updatedLead.id && item.status === "pending"
      );

      if (!hasPendingEmail) {
        // Create an EmailDraft
        const draft = generateEmailDraftForLead(updatedLead, opts);
        if (draft) {
          FundingStore.addEmailDraft(draft);

          // Enqueue a SendQueueItem with status "pending"
          const queueItem: SendQueueItem = {
            id: `queue-${lead.id}-${now}`,
            leadId: lead.id,
            toEmail: draft.toEmail,
            subject: draft.subject,
            body: draft.body,
            createdAt: now,
            status: "pending",
          };
          FundingStore.enqueueSendQueueItem(queueItem);

          // Write entry to NarrativeField
          if (ctx.narrativeField?.add) {
            try {
              const entryId = `narrative-wolfpack-funding-${updatedLead.id}-${now}`;
              ctx.narrativeField.add({
                id: entryId,
                timestamp: now,
                title: `Wolf Pack Funding Outreach`,
                summary: `Wolf Pack queued funding outreach to ${updatedLead.name}.`,
                severity: "info",
                domain: "generic",
                tags: ["funding", "wolfpack"],
                references: [{ kind: "other", id: updatedLead.id, label: updatedLead.name }],
              });
            } catch (err) {
              // NarrativeField not available, skip
            }
          }
        }
      }
    }
  }

  // Handle follow-ups (B)
  const existingQueue = FundingStore.listQueue();
  const hasPendingQueueForLead = (leadId: string) => {
    return existingQueue.some(
      (item) => item.leadId === leadId && item.status === "pending"
    );
  };

  const leadsNeedingFollowUp = allLeads.filter((lead) =>
    lead.email &&
    lead.nextFollowUpAt != null &&
    lead.nextFollowUpAt <= now &&
    (lead.stage === "contacted" || lead.stage === "hot")
  );

  for (const lead of leadsNeedingFollowUp) {
    if (hasPendingQueueForLead(lead.id)) continue;

    console.log("[WolfPackFundingCore] Scheduling follow-up for lead", lead.id);

    const draft = generateFollowUpDraftForLead(lead, opts);
    if (!draft) continue;

    FundingStore.addEmailDraft(draft);

    const queueItem: SendQueueItem = {
      id: `queue:${lead.id}:${Date.now()}`,
      leadId: lead.id,
      toEmail: draft.toEmail,
      subject: draft.subject,
      body: draft.body,
      createdAt: Date.now(),
      status: "pending",
    };

    FundingStore.enqueueSendQueueItem(queueItem);
  }

  // Push summary to NeuralMesh
  const status = FundingStore.getStatus();
  if (ctx.neuralMesh?.remember) {
    ctx.neuralMesh.remember({
      source: "WolfPackFundingCore",
      leadCount: status.leadCount,
      pendingQueue: status.pendingCount,
      timestamp: now,
    });
  }

  FundingStore.setLastRunAt(now);
  return status;
}


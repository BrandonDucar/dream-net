import { FundingLead, EmailDraft } from "../types";
import { FundingStore } from "../store/fundingStore";

/**
 * Generate a follow-up email draft for a lead.
 * Returns null if lead.email is missing or no previous email exists.
 */
export function generateFollowUpDraftForLead(
  lead: FundingLead,
  opts: { fromName: string; fromEmail: string }
): EmailDraft | null {
  if (!lead.email) {
    return null;
  }

  // Find previous email draft to reference
  const previousDrafts = FundingStore.listDraftsForLead(lead.id);
  const previousDraft = previousDrafts[previousDrafts.length - 1];
  const previousSubject = previousDraft?.subject || `DreamNet x ${lead.name}`;

  const now = Date.now();
  const draftId = `draft-followup-${lead.id}-${now}`;

  // Generate subject line
  const subject = `Re: ${previousSubject}`;

  // Generate email body - shorter, polite bump
  const greeting = lead.name ? `Hi ${lead.name},` : "Hello,";

  const body = `${greeting}

Just following up on my previous email about DreamNet — a biomimetic, multi-agent network on Base.

I'd love to share a quick overview if you're interested in learning more about what we're building.

Best,
${opts.fromName}
${opts.fromEmail}`;

  return {
    id: draftId,
    leadId: lead.id,
    toEmail: lead.email,
    subject,
    body,
    createdAt: now,
  };
}


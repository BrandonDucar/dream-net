/**
 * Enhanced Email Draft Engine with Inbox² Integration
 * Upgrades existing emailDraftEngine.ts with Inbox² intelligence
 */

import { FundingLead, EmailDraft } from '../types';
// Lazy import to avoid ESM resolution issues
let inboxSquared: any = null;
let DraftGenerationOptions: any = null;

async function getInboxSquared() {
  if (!inboxSquared) {
    const module = await import('../../inbox-squared-core/index.ts');
    inboxSquared = new module.InboxSquared();
    DraftGenerationOptions = module.DraftGenerationOptions;
  }
  return { inboxSquared, DraftGenerationOptions };
}

/**
 * Generate an enhanced email draft using Inbox²
 * Falls back to basic draft if Inbox² is not available
 */
export async function generateEmailDraftForLeadEnhanced(
  lead: FundingLead,
  opts: { fromName: string; fromEmail: string }
): Promise<EmailDraft | null> {
  if (!lead.email) {
    return null;
  }

  try {
    // Use Inbox² to generate intelligent draft
    const { inboxSquared: inbox } = await getInboxSquared();
    const draft = await inbox.generateDraft(
      lead.email,
      lead.name,
      lead.company || lead.type,
      {
        fromName: opts.fromName,
        fromEmail: opts.fromEmail,
        tone: 'consultative',
        includeOptOut: true,
        generateVariants: true,
        generateContentTwins: false, // Can enable later
      }
    );

    // Add lead ID to draft
    draft.leadId = lead.id;

    return draft;
  } catch (error) {
    console.error('[Inbox²] Error generating draft, falling back to basic:', error);
    
    // Fallback to basic draft
    return generateBasicDraft(lead, opts);
  }
}

/**
 * Basic draft generator (fallback)
 */
function generateBasicDraft(
  lead: FundingLead,
  opts: { fromName: string; fromEmail: string }
): EmailDraft {
  const now = Date.now();
  const draftId = `draft-${lead.id}-${now}`;

  const subject = 'DreamNet: A living digital network on Base (Funding Conversation)';
  const greeting = lead.name ? `Hi ${lead.name},` : 'Hello,';

  const body = `${greeting}

I'm ${opts.fromName}, one of the builders behind DreamNet — a biomimetic, multi-agent network running on Base.

We're building a living digital organism:
- Swarm agents (Wolf Pack, FieldLayer, DreamTank)
- A DreamVault of blueprints and rituals
- An emerging Agent Exchange economy

We're currently exploring aligned funding partners who:
- believe in AI + crypto infrastructure
- are excited by multi-agent systems and biomimetic design
- see value in an Agent OS + Agent Exchange layer on Base.

I'd love to share a short overview and see if there's a fit.

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


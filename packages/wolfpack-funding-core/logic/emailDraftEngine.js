/**
 * Generate an email draft for a funding lead.
 * Returns null if lead.email is missing.
 */
export function generateEmailDraftForLead(lead, opts) {
    if (!lead.email) {
        return null;
    }
    const now = Date.now();
    const draftId = `draft-${lead.id}-${now}`;
    // Generate subject line
    const subject = "DreamNet: A living digital network on Base (Funding Conversation)";
    // Generate email body using the specified template
    const greeting = lead.name ? `Hi ${lead.name},` : "Hello,";
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

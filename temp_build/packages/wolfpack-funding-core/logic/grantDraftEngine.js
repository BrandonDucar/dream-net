"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureGrantDraftsForLeads = ensureGrantDraftsForLeads;
const fundingStore_1 = require("../store/fundingStore");
/**
 * Ensure grant application drafts exist for relevant leads.
 */
function ensureGrantDraftsForLeads(leads) {
    const now = Date.now();
    const relevantTypes = new Set([
        "grant",
        "ecosystem-fund",
        "accelerator",
    ]);
    for (const lead of leads) {
        if (!relevantTypes.has(lead.type))
            continue;
        const existingDrafts = fundingStore_1.FundingStore.listGrantDraftsForLead(lead.id);
        if (existingDrafts.length > 0)
            continue;
        const draft = {
            id: `grant:${lead.id}:${now}`,
            leadId: lead.id,
            title: `Draft: ${lead.name} Application`,
            body: buildGrantDraftBodyForLead(lead),
            createdAt: now,
            updatedAt: now,
        };
        fundingStore_1.FundingStore.upsertGrantDraft(draft);
    }
}
function buildGrantDraftBodyForLead(lead) {
    // Simple markdown template. No AI calls here; just structure.
    return [
        `# Draft Application for ${lead.name}`,
        ``,
        `## Project: DreamNet`,
        `DreamNet is a biomimetic, multi-agent digital organism built on Base, designed to evolve, self-heal, and self-fund.`,
        ``,
        `## Problem & Vision`,
        `Explain what DreamNet solves and why this fund/program is a fit.`,
        ``,
        `## Technology & Differentiation`,
        `Explain the agent architecture (Wolf Pack, FieldLayer, DreamTank, etc.).`,
        ``,
        `## Team`,
        `Explain who is behind DreamNet and relevant experience.`,
        ``,
        `## Use of Funds`,
        `Outline how funds from ${lead.name} would be used (infrastructure, agents, OS, growth).`,
        ``,
        `## Alignment with ${lead.name}`,
        `Explain why this particular program is aligned with DreamNet's mission.`,
    ].join("\n");
}

"use strict";
/**
 * Enhanced Email Draft Engine with Inbox² Integration
 * Upgrades existing emailDraftEngine.ts with Inbox² intelligence
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmailDraftForLeadEnhanced = generateEmailDraftForLeadEnhanced;
// Lazy import to avoid ESM resolution issues
let inboxSquared = null;
let DraftGenerationOptions = null;
async function getInboxSquared() {
    if (!inboxSquared) {
        const module = await Promise.resolve().then(() => __importStar(require('../../inbox-squared-core/index.ts')));
        inboxSquared = new module.InboxSquared();
        DraftGenerationOptions = module.DraftGenerationOptions;
    }
    return { inboxSquared, DraftGenerationOptions };
}
/**
 * Generate an enhanced email draft using Inbox²
 * Falls back to basic draft if Inbox² is not available
 */
async function generateEmailDraftForLeadEnhanced(lead, opts) {
    if (!lead.email) {
        return null;
    }
    try {
        // Use Inbox² to generate intelligent draft
        const { inboxSquared: inbox } = await getInboxSquared();
        const draft = await inbox.generateDraft(lead.email, lead.name, lead.company || lead.type, {
            fromName: opts.fromName,
            fromEmail: opts.fromEmail,
            tone: 'consultative',
            includeOptOut: true,
            generateVariants: true,
            generateContentTwins: false, // Can enable later
        });
        // Add lead ID to draft
        draft.leadId = lead.id;
        return draft;
    }
    catch (error) {
        console.error('[Inbox²] Error generating draft, falling back to basic:', error);
        // Fallback to basic draft
        return generateBasicDraft(lead, opts);
    }
}
/**
 * Basic draft generator (fallback)
 */
function generateBasicDraft(lead, opts) {
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

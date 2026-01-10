import { FundingLead, EmailDraft } from "../types";
/**
 * Generate a follow-up email draft for a lead.
 * Returns null if lead.email is missing or no previous email exists.
 */
export declare function generateFollowUpDraftForLead(lead: FundingLead, opts: {
    fromName: string;
    fromEmail: string;
}): EmailDraft | null;

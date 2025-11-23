import { FundingLead, EmailDraft } from "../types";
/**
 * Generate an email draft for a funding lead.
 * Returns null if lead.email is missing.
 */
export declare function generateEmailDraftForLead(lead: FundingLead, opts: {
    fromName: string;
    fromEmail: string;
}): EmailDraft | null;

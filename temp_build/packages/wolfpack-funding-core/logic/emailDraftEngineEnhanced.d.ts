/**
 * Enhanced Email Draft Engine with Inbox² Integration
 * Upgrades existing emailDraftEngine.ts with Inbox² intelligence
 */
import { FundingLead, EmailDraft } from '../types';
/**
 * Generate an enhanced email draft using Inbox²
 * Falls back to basic draft if Inbox² is not available
 */
export declare function generateEmailDraftForLeadEnhanced(lead: FundingLead, opts: {
    fromName: string;
    fromEmail: string;
}): Promise<EmailDraft | null>;

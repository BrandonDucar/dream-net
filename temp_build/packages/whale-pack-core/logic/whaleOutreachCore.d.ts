/**
 * Whale Pack Outreach Core
 * Uses Inbox² for intelligent partner/influencer outreach
 */
import type { EmailDraft, DraftGenerationOptions } from '@dreamnet/inbox-squared-core';
import type { WhaleProduct, WhaleAudience } from '../types';
export interface WhaleOutreachTarget {
    email: string;
    name?: string;
    company?: string;
    role?: string;
    context?: 'partnership' | 'influencer' | 'collaboration' | 'sponsorship';
}
/**
 * Generate outreach email for Whale Pack partner/influencer
 */
export declare function generateWhaleOutreachDraft(target: WhaleOutreachTarget, product?: WhaleProduct, audience?: WhaleAudience, options?: Partial<DraftGenerationOptions>): Promise<EmailDraft | null>;
/**
 * Create Gmail draft for Whale Pack outreach
 */
export declare function createWhaleGmailDraft(draft: EmailDraft): Promise<string | null>;

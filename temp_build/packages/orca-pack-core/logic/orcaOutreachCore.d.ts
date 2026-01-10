/**
 * Orca Pack Outreach Core
 * Uses Inbox² for intelligent community/network outreach
 */
import type { EmailDraft, DraftGenerationOptions } from '@dreamnet/inbox-squared-core';
import type { OrcaPostIdea, OrcaNarrativeTheme } from '../types';
export interface OrcaOutreachTarget {
    email: string;
    name?: string;
    organization?: string;
    role?: string;
    context?: 'community' | 'network' | 'partnership' | 'collaboration';
}
/**
 * Generate outreach email for Orca Pack community/network contact
 */
export declare function generateOrcaOutreachDraft(target: OrcaOutreachTarget, idea?: OrcaPostIdea, theme?: OrcaNarrativeTheme, options?: Partial<DraftGenerationOptions>): Promise<EmailDraft | null>;
/**
 * Create Gmail draft for Orca Pack outreach
 */
export declare function createOrcaGmailDraft(draft: EmailDraft): Promise<string | null>;

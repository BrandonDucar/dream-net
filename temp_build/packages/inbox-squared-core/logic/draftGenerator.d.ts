/**
 * Enhanced Draft Generator
 * Combines all Inbox² layers to create intelligent email drafts
 */
import type { EmailDraft } from '../types';
export interface DraftGenerationOptions {
    fromName: string;
    fromEmail: string;
    tone?: 'casual' | 'consultative' | 'executive';
    includeOptOut?: boolean;
    generateVariants?: boolean;
    generateContentTwins?: boolean;
}
export declare class DraftGenerator {
    /**
     * Generate intelligent email draft using all Inbox² layers
     */
    generateDraft(recipientEmail: string, recipientName?: string, recipientCompany?: string, options: DraftGenerationOptions): Promise<EmailDraft>;
    /**
     * Generate subject line
     */
    private generateSubject;
    /**
     * Generate email body
     */
    private generateBody;
    /**
     * Generate HTML version
     */
    private generateHTML;
    /**
     * Generate A/B variants
     */
    private generateVariants;
    /**
     * Generate content twins (social/landing copy)
     */
    private generateContentTwins;
}
export declare const draftGenerator: DraftGenerator;

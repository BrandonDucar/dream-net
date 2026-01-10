/**
 * Enhanced Draft Generator
 * Combines all Inbox² layers to create intelligent email drafts
 */
import type { EmailDraft, DraftGenerationOptions } from '../types.js';
export declare class DraftGenerator {
    /**
     * Generate intelligent email draft using all Inbox² layers
     */
    generateDraft(recipientEmail: string, options?: DraftGenerationOptions, recipientName?: string, recipientCompany?: string): Promise<EmailDraft>;
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
//# sourceMappingURL=draftGenerator.d.ts.map
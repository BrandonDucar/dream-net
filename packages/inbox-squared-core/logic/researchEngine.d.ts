/**
 * Research Engine - Layer 1
 * Gathers 3-5 recent, credible facts about recipient or company
 */
import type { RecipientResearch } from '../types.js';
export declare class ResearchEngine {
    private cache;
    private cacheHours;
    /**
     * Research recipient or company
     */
    researchRecipient(email: string, name?: string, company?: string): Promise<RecipientResearch>;
    /**
     * Gather facts about recipient
     */
    private gatherFacts;
    /**
     * Clear cache
     */
    clearCache(): void;
    /**
     * Set cache expiration hours
     */
    setCacheHours(hours: number): void;
}
export declare const researchEngine: ResearchEngine;
//# sourceMappingURL=researchEngine.d.ts.map
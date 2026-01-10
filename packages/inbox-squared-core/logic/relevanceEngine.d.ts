/**
 * SEO + Relevance Engine - Layer 2
 * Finds trending topics/keywords to align outreach with real-world relevance
 */
import type { RelevantTopics } from '../types.js';
export declare class RelevanceEngine {
    /**
     * Find relevant topics for recipient
     */
    findRelevantTopics(recipientEmail: string, industry?: string, company?: string): Promise<RelevantTopics>;
    /**
     * Get trending keywords
     */
    private getTrendingKeywords;
    /**
     * Get industry-specific topics
     */
    private getIndustryTopics;
    /**
     * Get recent news
     */
    private getRecentNews;
    /**
     * Calculate relevance score
     */
    private calculateRelevanceScore;
}
export declare const relevanceEngine: RelevanceEngine;
//# sourceMappingURL=relevanceEngine.d.ts.map
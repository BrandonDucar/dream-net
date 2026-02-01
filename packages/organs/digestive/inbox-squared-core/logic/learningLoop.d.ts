/**
 * Learning Loop - Layer 4
 * Adjusts tone and structure based on engagement/feedback
 */
import type { EngagementMetrics, EmailDraft, EmailVariant } from '../types.js';
export interface LearningPattern {
    patternType: 'subject_line' | 'cta' | 'tone' | 'length' | 'timing';
    patternValue: string;
    successRate: number;
    sampleSize: number;
    lastUpdated: number;
}
export declare class LearningLoop {
    private patterns;
    private minSampleSize;
    /**
     * Record engagement metrics
     */
    recordEngagement(draftId: string, metrics: EngagementMetrics): Promise<void>;
    /**
     * Analyze engagement and update patterns
     */
    private analyzeEngagement;
    /**
     * Update learning pattern
     */
    private updatePattern;
    /**
     * Get best performing pattern
     */
    getBestPattern(type: LearningPattern['patternType']): string | null;
    /**
     * Generate A/B variants based on learning
     */
    generateVariants(baseDraft: EmailDraft, type: 'subject' | 'body' | 'cta'): EmailVariant[];
    /**
     * Get all patterns
     */
    getAllPatterns(): LearningPattern[];
    /**
     * Set minimum sample size
     */
    setMinSampleSize(size: number): void;
}
export declare const learningLoop: LearningLoop;

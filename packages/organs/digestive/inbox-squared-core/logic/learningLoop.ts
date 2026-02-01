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

export class LearningLoop {
  private patterns: Map<string, LearningPattern> = new Map();
  private minSampleSize: number = 5;

  /**
   * Record engagement metrics
   */
  async recordEngagement(
    draftId: string,
    metrics: EngagementMetrics
  ): Promise<void> {
    // TODO: Store in database
    // For now, update in-memory patterns
    
    // Analyze what worked/didn't work
    await this.analyzeEngagement(draftId, metrics);
  }

  /**
   * Analyze engagement and update patterns
   */
  private async analyzeEngagement(
    draftId: string,
    metrics: EngagementMetrics
  ): Promise<void> {
    // TODO: Get draft details
    // For now, update patterns based on metrics
    
    if (metrics.opened) {
      // Subject line worked
      this.updatePattern('subject_line', 'current', true);
    }
    
    if (metrics.replied) {
      // Tone/CTA worked
      this.updatePattern('tone', 'current', true);
      this.updatePattern('cta', 'current', true);
    }
    
    if (!metrics.opened) {
      // Subject line didn't work
      this.updatePattern('subject_line', 'current', false);
    }
  }

  /**
   * Update learning pattern
   */
  private updatePattern(
    type: LearningPattern['patternType'],
    value: string,
    success: boolean
  ): void {
    const key = `${type}:${value}`;
    const existing = this.patterns.get(key) || {
      patternType: type,
      patternValue: value,
      successRate: 0,
      sampleSize: 0,
      lastUpdated: Date.now(),
    };

    existing.sampleSize++;
    if (success) {
      existing.successRate =
        (existing.successRate * (existing.sampleSize - 1) + 1) /
        existing.sampleSize;
    } else {
      existing.successRate =
        (existing.successRate * (existing.sampleSize - 1)) /
        existing.sampleSize;
    }
    existing.lastUpdated = Date.now();

    this.patterns.set(key, existing);
  }

  /**
   * Get best performing pattern
   */
  getBestPattern(type: LearningPattern['patternType']): string | null {
    const relevantPatterns = Array.from(this.patterns.values()).filter(
      (p) => p.patternType === type && p.sampleSize >= this.minSampleSize
    );

    if (relevantPatterns.length === 0) return null;

    const best = relevantPatterns.reduce((best, current) =>
      current.successRate > best.successRate ? current : best
    );

    return best.patternValue;
  }

  /**
   * Generate A/B variants based on learning
   */
  generateVariants(
    baseDraft: EmailDraft,
    type: 'subject' | 'body' | 'cta'
  ): EmailVariant[] {
    const variants: EmailVariant[] = [];
    const bestPattern = this.getBestPattern(
      type === 'subject' ? 'subject_line' : type === 'cta' ? 'cta' : 'tone'
    );

    // Generate variants
    if (type === 'subject') {
      variants.push({
        id: `${baseDraft.id}-subject-1`,
        type: 'subject',
        value: baseDraft.subject,
        tested: false,
      });

      if (bestPattern) {
        variants.push({
          id: `${baseDraft.id}-subject-2`,
          type: 'subject',
          value: bestPattern,
          tested: true,
          performance: {
            opens: 0,
            clicks: 0,
            replies: 0,
          },
        });
      }
    }

    return variants;
  }

  /**
   * Get all patterns
   */
  getAllPatterns(): LearningPattern[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Set minimum sample size
   */
  setMinSampleSize(size: number): void {
    this.minSampleSize = size;
  }
}

export const learningLoop = new LearningLoop();


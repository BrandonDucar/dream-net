"use strict";
/**
 * Learning Loop - Layer 4
 * Adjusts tone and structure based on engagement/feedback
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.learningLoop = exports.LearningLoop = void 0;
class LearningLoop {
    patterns = new Map();
    minSampleSize = 5;
    /**
     * Record engagement metrics
     */
    async recordEngagement(draftId, metrics) {
        // TODO: Store in database
        // For now, update in-memory patterns
        // Analyze what worked/didn't work
        await this.analyzeEngagement(draftId, metrics);
    }
    /**
     * Analyze engagement and update patterns
     */
    async analyzeEngagement(draftId, metrics) {
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
    updatePattern(type, value, success) {
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
        }
        else {
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
    getBestPattern(type) {
        const relevantPatterns = Array.from(this.patterns.values()).filter((p) => p.patternType === type && p.sampleSize >= this.minSampleSize);
        if (relevantPatterns.length === 0)
            return null;
        const best = relevantPatterns.reduce((best, current) => current.successRate > best.successRate ? current : best);
        return best.patternValue;
    }
    /**
     * Generate A/B variants based on learning
     */
    generateVariants(baseDraft, type) {
        const variants = [];
        const bestPattern = this.getBestPattern(type === 'subject' ? 'subject_line' : type === 'cta' ? 'cta' : 'tone');
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
    getAllPatterns() {
        return Array.from(this.patterns.values());
    }
    /**
     * Set minimum sample size
     */
    setMinSampleSize(size) {
        this.minSampleSize = size;
    }
}
exports.LearningLoop = LearningLoop;
exports.learningLoop = new LearningLoop();

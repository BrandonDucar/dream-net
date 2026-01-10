"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalystStore = void 0;
const patterns = new Map();
const insights = new Map();
const predictions = new Map();
const emailEffectiveness = new Map();
let lastRunAt = null;
let trainingCycles = 0;
let accuracyScore = undefined;
exports.AnalystStore = {
    // Patterns
    upsertPattern(pattern) {
        patterns.set(pattern.id, pattern);
        return pattern;
    },
    getPattern(id) {
        return patterns.get(id);
    },
    listPatterns() {
        return Array.from(patterns.values());
    },
    listPatternsByType(type) {
        return Array.from(patterns.values()).filter((p) => p.type === type);
    },
    // Insights
    addInsight(insight) {
        insights.set(insight.id, insight);
        // Keep only last 100 insights
        if (insights.size > 100) {
            const sorted = Array.from(insights.values()).sort((a, b) => b.createdAt - a.createdAt);
            const toRemove = sorted.slice(100);
            toRemove.forEach((i) => insights.delete(i.id));
        }
        return insight;
    },
    getInsight(id) {
        return insights.get(id);
    },
    listInsights() {
        return Array.from(insights.values()).sort((a, b) => b.createdAt - a.createdAt);
    },
    listRecentInsights(limit = 10) {
        return Array.from(insights.values())
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, limit);
    },
    // Predictions
    upsertPrediction(prediction) {
        predictions.set(prediction.leadId, prediction);
        return prediction;
    },
    getPrediction(leadId) {
        return predictions.get(leadId);
    },
    listPredictions() {
        return Array.from(predictions.values());
    },
    // Email Effectiveness
    upsertEmailEffectiveness(eff) {
        emailEffectiveness.set(eff.queueItemId, eff);
        return eff;
    },
    getEmailEffectiveness(queueItemId) {
        return emailEffectiveness.get(queueItemId);
    },
    listEmailEffectiveness() {
        return Array.from(emailEffectiveness.values());
    },
    // Training
    incrementTrainingCycles() {
        trainingCycles += 1;
    },
    setAccuracyScore(score) {
        accuracyScore = score;
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    // Status
    status() {
        const allPatterns = Array.from(patterns.values());
        const recentInsights = this.listRecentInsights(10);
        const allPredictions = Array.from(predictions.values());
        const allEmailEff = Array.from(emailEffectiveness.values());
        return {
            lastRunAt,
            trainingMetrics: {
                totalPatternsLearned: allPatterns.length,
                totalInsightsGenerated: insights.size,
                accuracyScore,
                lastTrainingRun: lastRunAt,
                trainingCycles,
            },
            activePatterns: allPatterns.filter((p) => p.confidence > 0.5).slice(0, 20),
            recentInsights,
            predictions: allPredictions,
            emailEffectiveness: allEmailEff.slice(0, 20),
        };
    },
};

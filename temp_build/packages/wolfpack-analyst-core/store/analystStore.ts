import {
  LearnedPattern,
  AnalystInsight,
  LeadPrediction,
  EmailEffectiveness,
  TrainingMetrics,
  WolfPackAnalystStatus,
} from "../types";

const patterns: Map<string, LearnedPattern> = new Map();
const insights: Map<string, AnalystInsight> = new Map();
const predictions: Map<string, LeadPrediction> = new Map();
const emailEffectiveness: Map<string, EmailEffectiveness> = new Map();

let lastRunAt: number | null = null;
let trainingCycles = 0;
let accuracyScore: number | undefined = undefined;

export const AnalystStore = {
  // Patterns
  upsertPattern(pattern: LearnedPattern): LearnedPattern {
    patterns.set(pattern.id, pattern);
    return pattern;
  },

  getPattern(id: string): LearnedPattern | undefined {
    return patterns.get(id);
  },

  listPatterns(): LearnedPattern[] {
    return Array.from(patterns.values());
  },

  listPatternsByType(type: LearnedPattern["type"]): LearnedPattern[] {
    return Array.from(patterns.values()).filter((p) => p.type === type);
  },

  // Insights
  addInsight(insight: AnalystInsight): AnalystInsight {
    insights.set(insight.id, insight);
    // Keep only last 100 insights
    if (insights.size > 100) {
      const sorted = Array.from(insights.values()).sort((a, b) => b.createdAt - a.createdAt);
      const toRemove = sorted.slice(100);
      toRemove.forEach((i) => insights.delete(i.id));
    }
    return insight;
  },

  getInsight(id: string): AnalystInsight | undefined {
    return insights.get(id);
  },

  listInsights(): AnalystInsight[] {
    return Array.from(insights.values()).sort((a, b) => b.createdAt - a.createdAt);
  },

  listRecentInsights(limit: number = 10): AnalystInsight[] {
    return Array.from(insights.values())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  },

  // Predictions
  upsertPrediction(prediction: LeadPrediction): LeadPrediction {
    predictions.set(prediction.leadId, prediction);
    return prediction;
  },

  getPrediction(leadId: string): LeadPrediction | undefined {
    return predictions.get(leadId);
  },

  listPredictions(): LeadPrediction[] {
    return Array.from(predictions.values());
  },

  // Email Effectiveness
  upsertEmailEffectiveness(eff: EmailEffectiveness): EmailEffectiveness {
    emailEffectiveness.set(eff.queueItemId, eff);
    return eff;
  },

  getEmailEffectiveness(queueItemId: string): EmailEffectiveness | undefined {
    return emailEffectiveness.get(queueItemId);
  },

  listEmailEffectiveness(): EmailEffectiveness[] {
    return Array.from(emailEffectiveness.values());
  },

  // Training
  incrementTrainingCycles() {
    trainingCycles += 1;
  },

  setAccuracyScore(score: number | undefined) {
    accuracyScore = score;
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  // Status
  status(): WolfPackAnalystStatus {
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


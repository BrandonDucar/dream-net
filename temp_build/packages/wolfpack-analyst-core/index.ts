import { AnalystStore } from "./store/analystStore";
import { runWolfPackAnalystCycle } from "./scheduler/analystScheduler";
import type {
  WolfPackAnalystContext,
  WolfPackAnalystStatus,
  LearnedPattern,
  AnalystInsight,
  LeadPrediction,
  EmailEffectiveness,
} from "./types";

export const WolfPackAnalystCore = {
  // Patterns
  listPatterns(): LearnedPattern[] {
    return AnalystStore.listPatterns();
  },

  getPattern(id: string): LearnedPattern | undefined {
    return AnalystStore.getPattern(id);
  },

  // Insights
  listInsights(limit?: number): AnalystInsight[] {
    return limit ? AnalystStore.listRecentInsights(limit) : AnalystStore.listInsights();
  },

  getInsight(id: string): AnalystInsight | undefined {
    return AnalystStore.getInsight(id);
  },

  // Predictions
  listPredictions(): LeadPrediction[] {
    return AnalystStore.listPredictions();
  },

  getPrediction(leadId: string): LeadPrediction | undefined {
    return AnalystStore.getPrediction(leadId);
  },

  // Email Effectiveness
  listEmailEffectiveness(): EmailEffectiveness[] {
    return AnalystStore.listEmailEffectiveness();
  },

  getEmailEffectiveness(queueItemId: string): EmailEffectiveness | undefined {
    return AnalystStore.getEmailEffectiveness(queueItemId);
  },

  // Orchestration
  run(context: WolfPackAnalystContext): WolfPackAnalystStatus {
    return runWolfPackAnalystCycle(context);
  },

  status(): WolfPackAnalystStatus {
    return AnalystStore.status();
  },
};

export * from "./types";
export default WolfPackAnalystCore;


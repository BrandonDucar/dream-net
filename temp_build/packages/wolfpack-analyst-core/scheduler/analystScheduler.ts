import { WolfPackAnalystContext, WolfPackAnalystStatus } from "../types";
import { AnalystStore } from "../store/analystStore";
import { trainOnLeadScoring, trainOnEmailEffectiveness } from "../logic/patternTrainer";
import {
  generateInsights,
  generatePredictions,
  analyzeEmailEffectiveness,
} from "../logic/insightEngine";

/**
 * Run the analyst cycle:
 * 1. Train on patterns from historical data
 * 2. Generate insights
 * 3. Generate predictions
 * 4. Analyze email effectiveness
 * 5. Store learnings in NeuralMesh (if available)
 */
export function runWolfPackAnalystCycle(
  ctx: WolfPackAnalystContext
): WolfPackAnalystStatus {
  const now = Date.now();
  console.log("[WolfPackAnalyst] Starting analyst cycle...");

  // Get data from WolfPackFundingCore
  if (!ctx.wolfPackFundingCore) {
    console.warn("[WolfPackAnalyst] WolfPackFundingCore not available");
    return AnalystStore.status();
  }

  const leads = ctx.wolfPackFundingCore.listLeads();
  const queueItems = ctx.wolfPackFundingCore.listQueue();

  console.log(`[WolfPackAnalyst] Analyzing ${leads.length} leads and ${queueItems.length} queue items...`);

  // 1. Train on patterns
  console.log("[WolfPackAnalyst] Training on lead scoring patterns...");
  const leadPatterns = trainOnLeadScoring(leads);
  console.log(`[WolfPackAnalyst] Learned ${leadPatterns.length} lead scoring patterns`);

  console.log("[WolfPackAnalyst] Training on email effectiveness patterns...");
  const emailPatterns = trainOnEmailEffectiveness(queueItems, leads);
  console.log(`[WolfPackAnalyst] Learned ${emailPatterns.length} email effectiveness patterns`);

  const allPatterns = [...leadPatterns, ...emailPatterns];

  // 2. Generate insights
  console.log("[WolfPackAnalyst] Generating insights...");
  const insights = generateInsights(leads, queueItems, allPatterns);
  console.log(`[WolfPackAnalyst] Generated ${insights.length} insights`);

  // 3. Generate predictions
  console.log("[WolfPackAnalyst] Generating predictions...");
  const predictions = generatePredictions(leads, allPatterns);
  console.log(`[WolfPackAnalyst] Generated ${predictions.length} predictions`);

  // 4. Analyze email effectiveness
  console.log("[WolfPackAnalyst] Analyzing email effectiveness...");
  const emailAnalyses = analyzeEmailEffectiveness(queueItems, leads);
  console.log(`[WolfPackAnalyst] Analyzed ${emailAnalyses.length} emails`);

  // 5. Store learnings in NeuralMesh (if available)
  if (ctx.neuralMesh?.remember) {
    console.log("[WolfPackAnalyst] Storing learnings in NeuralMesh...");
    const memory = {
      type: "wolfpack_analyst_cycle",
      timestamp: now,
      patterns: allPatterns.length,
      insights: insights.length,
      predictions: predictions.length,
      summary: `Analyzed ${leads.length} leads, learned ${allPatterns.length} patterns, generated ${insights.length} insights`,
    };
    ctx.neuralMesh.remember("wolfpack_analyst", memory);
  }

  // 6. Log to NarrativeField (if available)
  if (ctx.narrativeField?.add) {
    const narrative = `Wolf Pack Analyst completed cycle: ${insights.length} insights, ${predictions.length} predictions, ${allPatterns.length} patterns learned`;
    ctx.narrativeField.add("wolfpack_analyst", narrative, { timestamp: now });
  }

  // Update training metrics
  AnalystStore.incrementTrainingCycles();
  AnalystStore.setLastRunAt(now);

  const status = AnalystStore.status();
  console.log(`[WolfPackAnalyst] Cycle complete. Status: ${status.trainingMetrics.totalPatternsLearned} patterns, ${status.trainingMetrics.totalInsightsGenerated} total insights`);

  return status;
}


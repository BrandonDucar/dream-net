import { FundingLead, SendQueueItem, LeadStage, WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";
import { AnalystInsight, LeadPrediction, EmailEffectiveness } from '../types.js';
import { AnalystStore } from '../store/analystStore.js';

/**
 * Generate insights from current data and learned patterns
 */
export function generateInsights(
  leads: FundingLead[],
  queueItems: SendQueueItem[],
  patterns: any[]
): AnalystInsight[] {
  const insights: AnalystInsight[] = [];
  const now = Date.now();

  // Insight 1: High-value leads not yet contacted
  const highValueNew = leads.filter(
    (l) =>
      l.stage === "new" &&
      (l.dreamFitScore ?? 0) > 0.7 &&
      (l.priorityScore ?? 0) > 0.7 &&
      l.email
  );
  if (highValueNew.length > 0) {
    insights.push({
      id: `insight:high-value-new-${now}`,
      type: "opportunity",
      severity: "high",
      title: `${highValueNew.length} High-Value Leads Ready for Contact`,
      description: `Found ${highValueNew.length} leads with high fit and priority scores that haven't been contacted yet. These are prime candidates for immediate outreach.`,
      relatedLeadIds: highValueNew.map((l) => l.id),
      confidence: 0.9,
      actionable: true,
      suggestedAction: "Prioritize these leads in the next funding cycle",
      createdAt: now,
    });
  }

  // Insight 2: Stalled leads
  const oldLeads = leads.filter(
    (l) => l.stage === "contacted" && Date.now() - l.updatedAt > 7 * 24 * 60 * 60 * 1000
  );
  if (oldLeads.length > 0) {
    insights.push({
      id: `insight:stalled-leads-${now}`,
      type: "warning",
      severity: "medium",
      title: `${oldLeads.length} Leads Stalled in 'Contacted' Stage`,
      description: `These leads were contacted over 7 days ago but haven't progressed. Consider follow-up or re-evaluation.`,
      relatedLeadIds: oldLeads.map((l) => l.id),
      confidence: 0.8,
      actionable: true,
      suggestedAction: "Review and potentially follow up with these leads",
      createdAt: now,
    });
  }

  // Insight 3: Email queue backlog
  const pendingEmails = queueItems.filter((q) => q.status === "pending");
  if (pendingEmails.length > 20) {
    insights.push({
      id: `insight:email-backlog-${now}`,
      type: "warning",
      severity: "medium",
      title: `Large Email Queue Backlog (${pendingEmails.length} pending)`,
      description: `There are ${pendingEmails.length} emails waiting to be sent. Consider increasing mailer frequency or checking for issues.`,
      relatedQueueIds: pendingEmails.slice(0, 10).map((q) => q.id),
      confidence: 0.9,
      actionable: true,
      suggestedAction: "Check mailer service status and consider increasing send frequency",
      createdAt: now,
    });
  }

  // Insight 4: Pattern-based insights
  const highConfidencePatterns = patterns.filter((p) => p.confidence > 0.7);
  if (highConfidencePatterns.length > 0) {
    const patternTypes = new Set(highConfidencePatterns.map((p) => p.type));
    insights.push({
      id: `insight:strong-patterns-${now}`,
      type: "pattern",
      severity: "low",
      title: `${highConfidencePatterns.length} Strong Patterns Identified`,
      description: `The analyst has identified ${highConfidencePatterns.length} high-confidence patterns across ${patternTypes.size} categories. These patterns can inform future lead scoring and email strategy.`,
      confidence: 0.8,
      actionable: false,
      createdAt: now,
    });
  }

  // Insight 5: Hot leads opportunity
  const hotLeads = leads.filter((l) => l.stage === "hot");
  if (hotLeads.length > 0) {
    insights.push({
      id: `insight:hot-leads-${now}`,
      type: "opportunity",
      severity: "critical",
      title: `${hotLeads.length} Hot Leads Requiring Immediate Attention`,
      description: `These leads are in the 'hot' stage and need immediate follow-up to maximize conversion opportunity.`,
      relatedLeadIds: hotLeads.map((l) => l.id),
      confidence: 1.0,
      actionable: true,
      suggestedAction: "Prioritize outreach to hot leads immediately",
      createdAt: now,
    });
  }

  // Store insights
  insights.forEach((i) => AnalystStore.addInsight(i));

  return insights;
}

/**
 * Generate predictions for leads
 */
export function generatePredictions(leads: FundingLead[], patterns: any[]): LeadPrediction[] {
  const predictions: LeadPrediction[] = [];
  const now = Date.now();

  // Predict stage progression for new/qualified leads
  const candidates = leads.filter((l) => l.stage === "new" || l.stage === "qualified");

  for (const lead of candidates) {
    let predictedStage: LeadStage = lead.stage;
    let probability = 0.5;
    const factors: string[] = [];

    // Factor: High dreamFitScore
    if ((lead.dreamFitScore ?? 0) > 0.7) {
      probability += 0.15;
      factors.push("High dream fit score");
    }

    // Factor: Has email
    if (lead.email) {
      probability += 0.1;
      factors.push("Email address available");
    }

    // Factor: High priorityScore
    if ((lead.priorityScore ?? 0) > 0.8) {
      probability += 0.1;
      factors.push("High priority score");
    }

    // Factor: VC type (if pattern exists)
    const vcPattern = patterns.find(
      (p) => p.type === "stage_progression" && p.pattern.includes("VC")
    );
    if (lead.type === "vc" && vcPattern) {
      probability += 0.1;
      factors.push("VC type (historically progresses faster)");
    }

    probability = Math.min(1, probability);

    // Predict next stage
    if (lead.stage === "new" && probability > 0.6) {
      predictedStage = "qualified";
    } else if (lead.stage === "qualified" && probability > 0.7) {
      predictedStage = "contacted";
    } else if (lead.stage === "contacted" && probability > 0.75) {
      predictedStage = "replied";
    }

    if (predictedStage !== lead.stage) {
      predictions.push({
        leadId: lead.id,
        predictedStage,
        probability,
        timeframe: probability > 0.8 ? "within 3 days" : probability > 0.6 ? "within 7 days" : "within 14 days",
        factors,
        confidence: Math.min(1, probability * 1.2),
      });
    }
  }

  // Store predictions
  predictions.forEach((p) => AnalystStore.upsertPrediction(p));

  return predictions;
}

/**
 * Analyze email effectiveness
 */
export function analyzeEmailEffectiveness(
  queueItems: SendQueueItem[],
  leads: FundingLead[]
): EmailEffectiveness[] {
  const analyses: EmailEffectiveness[] = [];
  const now = Date.now();

  for (const item of queueItems) {
    const lead = leads.find((l) => l.id === item.leadId);
    if (!lead) continue;

    // Calculate factors
    const subjectLineScore = item.subject.length < 50 ? 0.8 : item.subject.length < 100 ? 0.6 : 0.4;
    const bodyLengthScore = item.body.length > 200 && item.body.length < 1000 ? 0.8 : 0.5;
    const personalizationScore = item.body.includes(lead.name) ? 0.9 : 0.5;

    // Timing score (simplified - could be enhanced with actual send time)
    const timeSinceCreated = Date.now() - item.createdAt;
    const timingScore = timeSinceCreated < 24 * 60 * 60 * 1000 ? 0.8 : 0.5;

    // Predicted response rate (weighted average)
    const predictedResponseRate =
      subjectLineScore * 0.3 +
      bodyLengthScore * 0.2 +
      personalizationScore * 0.3 +
      timingScore * 0.2;

    const recommendations: string[] = [];
    if (subjectLineScore < 0.6) {
      recommendations.push("Consider shortening the subject line");
    }
    if (bodyLengthScore < 0.6) {
      recommendations.push("Optimize email body length (200-1000 chars ideal)");
    }
    if (personalizationScore < 0.7) {
      recommendations.push("Add lead name or company name for personalization");
    }

    analyses.push({
      queueItemId: item.id,
      leadId: lead.id,
      predictedResponseRate,
      factors: {
        subjectLineScore,
        bodyLengthScore,
        timingScore,
        personalizationScore,
      },
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    });
  }

  // Store analyses
  analyses.forEach((a) => AnalystStore.upsertEmailEffectiveness(a));

  return analyses;
}


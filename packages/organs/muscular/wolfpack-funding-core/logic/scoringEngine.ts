import { FundingLead, WolfPackFundingContext } from '../types.js';

/**
 * Score a lead using heuristics and ecosystem context.
 * Returns an updated FundingLead with all scores computed.
 */
export function scoreLead(
  ctx: WolfPackFundingContext,
  lead: FundingLead
): FundingLead {
  // Base priority from lead.type and tags
  let basePriority = 0.3;
  if (lead.type === "ecosystem-fund") {
    basePriority = 0.7;
  } else if (lead.type === "accelerator") {
    basePriority = 0.6;
  } else if (lead.type === "vc") {
    basePriority = 0.5;
  } else if (lead.type === "grant") {
    basePriority = 0.4;
  }

  // Boost from tags
  if (lead.tags?.some((tag) => ["web3", "blockchain", "crypto", "base", "ai", "agents"].includes(tag.toLowerCase()))) {
    basePriority += 0.2;
  }

  // FieldLayer sampling for risk signals
  let fieldRiskSignal = 0.5;
  if (ctx.fieldLayer?.sample) {
    try {
      const fieldSample = ctx.fieldLayer.sample("risk", { kind: "generic", id: lead.id });
      if (fieldSample && typeof fieldSample.value === "number") {
        fieldRiskSignal = fieldSample.value;
      }
    } catch (err) {
      // FieldLayer not available or error, use default
    }
  }

  // ReputationLattice check
  let reputationScore = 0.5;
  if (ctx.reputationLattice?.status) {
    try {
      const repStatus = ctx.reputationLattice.status();
      // Try to find reputation for this lead (by name or id)
      if (repStatus.scoresSample) {
        const leadRep = repStatus.scoresSample.find(
          (s: any) => s.entityId === lead.id || s.entityId === lead.name.toLowerCase()
        );
        if (leadRep && typeof leadRep.score === "number") {
          reputationScore = leadRep.score;
        }
      }
    } catch (err) {
      // ReputationLattice not available, use default
    }
  }

  // Compute scores
  const dreamFitScore = Math.min(1, Math.max(0, 0.6 * basePriority + 0.4 * (reputationScore * 0.5 + (1 - fieldRiskSignal) * 0.5)));
  const trustScore = Math.min(1, Math.max(0, reputationScore));
  const riskScore = Math.min(1, Math.max(0, 1 - trustScore + fieldRiskSignal * 0.3));
  const priorityScore = Math.min(1, Math.max(0, dreamFitScore * 0.4 + trustScore * 0.3 - riskScore * 0.3 + basePriority * 0.3));

  // Hot lead scoring (A)
  const hotThreshold = Number(process.env.WOLF_FUNDING_HOT_THRESHOLD || "0.7");
  
  // Simple heuristic for "base/infra/ai" ecosystem leads:
  const tags = lead.tags ?? [];
  const typeBoost =
    lead.type === "ecosystem-fund" || lead.type === "grant" || lead.type === "accelerator" ? 0.2 : 0;
  const tagBoost =
    (tags.includes("base") ? 0.1 : 0) +
    (tags.includes("infra") ? 0.1 : 0) +
    (tags.includes("ai") ? 0.1 : 0);

  const priority = priorityScore;
  const trust = trustScore;

  // combine into hotScore
  const hotScore = clamp01(
    0.4 * priority +
    0.3 * trust +
    0.3 * (typeBoost + tagBoost)
  );

  // mark as hot if above threshold
  const isHot = hotScore >= hotThreshold;

  return {
    ...lead,
    dreamFitScore,
    riskScore,
    trustScore,
    priorityScore,
    hotScore,
    isHot,
    updatedAt: Date.now(),
  };
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}


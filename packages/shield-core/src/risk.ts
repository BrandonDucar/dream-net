/**
 * Shield Core Risk Profile
 * Tracks risk per caller (API key/wallet/citizen) for adaptive decisions
 */

import type { TierId } from "../../dreamnet-control-core/tierConfig";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface CallerRiskProfile {
  callerId: string; // e.g. citizenId or apiKeyId fallback
  tierId: TierId;
  lastUpdatedAt: string;
  score: number; // 0–1
  level: RiskLevel;
  recentFailures: number;
  recentHighRiskUses: number;
  lastToolId?: string;
  lastPortId?: string;
}

const profiles = new Map<string, CallerRiskProfile>();

export function getRiskProfile(callerId: string): CallerRiskProfile | undefined {
  return profiles.get(callerId);
}

function toLevel(score: number): RiskLevel {
  if (score < 0.3) return "low";
  if (score < 0.6) return "medium";
  if (score < 0.8) return "high";
  return "critical";
}

export function updateRiskProfile(params: {
  callerId: string;
  tierId: TierId;
  baseDelta: number; // can be negative to reduce risk
  isFailure?: boolean;
  isHighRiskTool?: boolean;
  portId?: string;
  toolId?: string;
}): CallerRiskProfile {
  const now = new Date().toISOString();
  let existing = profiles.get(params.callerId);

  if (!existing) {
    existing = {
      callerId: params.callerId,
      tierId: params.tierId,
      lastUpdatedAt: now,
      score: 0.2,
      level: "low",
      recentFailures: 0,
      recentHighRiskUses: 0,
    };
  }

  let score = existing.score + params.baseDelta;
  if (params.isFailure) score += 0.15;
  if (params.isHighRiskTool) score += 0.1;

  score = Math.min(1, Math.max(0, score));

  const level = toLevel(score);

  const recentFailures = params.isFailure
    ? existing.recentFailures + 1
    : Math.max(0, existing.recentFailures - 0.1);

  const recentHighRiskUses = params.isHighRiskTool
    ? existing.recentHighRiskUses + 1
    : Math.max(0, existing.recentHighRiskUses - 0.1);

  const updated: CallerRiskProfile = {
    ...existing,
    tierId: params.tierId,
    lastUpdatedAt: now,
    score,
    level,
    recentFailures,
    recentHighRiskUses,
    lastToolId: params.toolId ?? existing.lastToolId,
    lastPortId: params.portId ?? existing.lastPortId,
  };

  profiles.set(params.callerId, updated);
  return updated;
}

export function listRiskProfiles(): CallerRiskProfile[] {
  return Array.from(profiles.values());
}

export function getRiskProfilesByLevel(level: RiskLevel): CallerRiskProfile[] {
  return listRiskProfiles().filter((p) => p.level === level);
}


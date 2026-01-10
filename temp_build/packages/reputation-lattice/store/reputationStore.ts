import type {
  ReputationSignal,
  ReputationScore,
  ReputationConfig,
  RepEntityType,
} from "../types";

const signals: ReputationSignal[] = [];
const scores: Map<string, ReputationScore> = new Map();

let config: ReputationConfig = {
  decayHalfLifeMs: 1000 * 60 * 60 * 24, // 24h by default
  minSignalsForStableScore: 5,
};

function keyFor(eType: RepEntityType, eId: string): string {
  return `${eType}:${eId}`;
}

export const ReputationStore = {
  configure(partial: Partial<ReputationConfig>) {
    config = { ...config, ...partial };
  },

  getConfig(): ReputationConfig {
    return config;
  },

  addSignal(signal: ReputationSignal) {
    signals.push(signal);
  },

  getSignals(): ReputationSignal[] {
    return signals;
  },

  upsertScore(score: ReputationScore) {
    const key = keyFor(score.entityType, score.entityId);
    scores.set(key, score);
  },

  getScores(): Map<string, ReputationScore> {
    return scores;
  },

  getScoreFor(entityType: RepEntityType, entityId: string): ReputationScore | undefined {
    return scores.get(keyFor(entityType, entityId));
  },

  status() {
    return {
      signalCount: signals.length,
      entityCount: scores.size,
      scoresSample: Array.from(scores.values()).slice(0, 20),
    };
  },
};


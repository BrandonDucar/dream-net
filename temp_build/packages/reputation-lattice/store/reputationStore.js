"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputationStore = void 0;
const signals = [];
const scores = new Map();
let config = {
    decayHalfLifeMs: 1000 * 60 * 60 * 24, // 24h by default
    minSignalsForStableScore: 5,
};
function keyFor(eType, eId) {
    return `${eType}:${eId}`;
}
exports.ReputationStore = {
    configure(partial) {
        config = { ...config, ...partial };
    },
    getConfig() {
        return config;
    },
    addSignal(signal) {
        signals.push(signal);
    },
    getSignals() {
        return signals;
    },
    upsertScore(score) {
        const key = keyFor(score.entityType, score.entityId);
        scores.set(key, score);
    },
    getScores() {
        return scores;
    },
    getScoreFor(entityType, entityId) {
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

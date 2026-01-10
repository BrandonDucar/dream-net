"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStore = void 0;
const games = new Map();
const rounds = new Map();
const fairnessRecords = [];
let lastRunAt = null;
exports.GameStore = {
    upsertGame(partial) {
        const now = Date.now();
        const existing = games.get(partial.id);
        const merged = {
            ...existing,
            ...partial,
            players: partial.players ?? existing?.players ?? [],
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
        };
        games.set(merged.id, merged);
        return merged;
    },
    getGame(id) {
        return games.get(id);
    },
    listGames() {
        return Array.from(games.values());
    },
    upsertRound(partial) {
        const now = Date.now();
        const existing = rounds.get(partial.id);
        const merged = {
            ...existing,
            ...partial,
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
        };
        rounds.set(merged.id, merged);
        return merged;
    },
    listRoundsForGame(gameId) {
        return Array.from(rounds.values()).filter((r) => r.gameId === gameId);
    },
    addFairnessRecord(record) {
        fairnessRecords.push(record);
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    status() {
        const sampleGames = Array.from(games.values()).slice(0, 25);
        return {
            lastRunAt,
            gameCount: games.size,
            roundCount: rounds.size,
            fairnessCount: fairnessRecords.length,
            sampleGames,
        };
    },
};

import type {
  GameSession,
  GameRound,
  FairnessRecord,
  DreamBetStatus,
} from "../types";

const games: Map<string, GameSession> = new Map();
const rounds: Map<string, GameRound> = new Map();
const fairnessRecords: FairnessRecord[] = [];

let lastRunAt: number | null = null;

export const GameStore = {
  upsertGame(
    partial: Omit<GameSession, "createdAt" | "updatedAt">
  ): GameSession {
    const now = Date.now();
    const existing = games.get(partial.id);

    const merged: GameSession = {
      ...existing,
      ...partial,
      players: partial.players ?? existing?.players ?? [],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    games.set(merged.id, merged);
    return merged;
  },

  getGame(id: string): GameSession | undefined {
    return games.get(id);
  },

  listGames(): GameSession[] {
    return Array.from(games.values());
  },

  upsertRound(
    partial: Omit<GameRound, "createdAt" | "updatedAt">
  ): GameRound {
    const now = Date.now();
    const existing = rounds.get(partial.id);

    const merged: GameRound = {
      ...existing,
      ...partial,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    rounds.set(merged.id, merged);
    return merged;
  },

  listRoundsForGame(gameId: string): GameRound[] {
    return Array.from(rounds.values()).filter((r) => r.gameId === gameId);
  },

  addFairnessRecord(record: FairnessRecord) {
    fairnessRecords.push(record);
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  status(): DreamBetStatus {
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


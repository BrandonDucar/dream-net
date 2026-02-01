import type { GameSession, GameRound, FairnessRecord, DreamBetStatus } from '../types.js';
export declare const GameStore: {
    upsertGame(partial: Omit<GameSession, "createdAt" | "updatedAt">): GameSession;
    getGame(id: string): GameSession | undefined;
    listGames(): GameSession[];
    upsertRound(partial: Omit<GameRound, "createdAt" | "updatedAt">): GameRound;
    listRoundsForGame(gameId: string): GameRound[];
    addFairnessRecord(record: FairnessRecord): void;
    setLastRunAt(ts: number | null): void;
    status(): DreamBetStatus;
};

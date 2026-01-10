import type { GameSession, GameRound, RNGRequest, RNGResult, DreamBetContext, DreamBetStatus } from "./types";
export declare const DreamBetCore: {
    upsertGame(game: Omit<GameSession, "createdAt" | "updatedAt">): GameSession;
    getGame(id: string): GameSession | undefined;
    listGames(): GameSession[];
    upsertRound(round: Omit<GameRound, "createdAt" | "updatedAt">): GameRound;
    listRoundsForGame(gameId: string): GameRound[];
    generateRNG(req: RNGRequest): RNGResult;
    rngToUnit(resultHex: string): number;
    rngToInt(resultHex: string, n: number): number;
    run(context: DreamBetContext): DreamBetStatus;
    predictOutcome(req: Omit<import("./logic/oracle").PredictionRequest, "context">): Promise<import("./logic/oracle").PredictionResult>;
    status(): DreamBetStatus;
};
export * from "./types";
export default DreamBetCore;

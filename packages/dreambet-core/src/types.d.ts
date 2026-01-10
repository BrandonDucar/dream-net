export type GameType = "poker-table" | "angel-slots" | "roulette" | "coinflip" | "custom";
export type GameState = "waiting" | "active" | "paused" | "completed" | "cancelled";
export interface PlayerRef {
    identityId: string;
    seatId?: string;
}
export interface GameSession {
    id: string;
    type: GameType;
    state: GameState;
    title?: string;
    players: PlayerRef[];
    maxPlayers?: number;
    ruleset?: string;
    createdAt: number;
    updatedAt: number;
}
export type RoundState = "pending" | "in-progress" | "settled";
export interface GameRound {
    id: string;
    gameId: string;
    index: number;
    state: RoundState;
    payload?: any;
    rngSeed?: string;
    rngSalt?: string;
    rngResult?: string;
    createdAt: number;
    updatedAt: number;
}
export interface FairnessRecord {
    roundId: string;
    gameId: string;
    type: "rng" | "payout" | "consistency";
    passed: boolean;
    details?: string;
    createdAt: number;
}
export interface RNGRequest {
    purpose: string;
    gameId?: string;
    roundId?: string;
    entropyHint?: string;
}
export interface RNGResult {
    seed: string;
    salt: string;
    resultHex: string;
    createdAt: number;
}
export interface DreamBetContext {
    identityGrid?: any;
    reputationLattice?: any;
    fieldLayer?: any;
    neuralMesh?: any;
}
export interface DreamBetStatus {
    lastRunAt: number | null;
    gameCount: number;
    roundCount: number;
    fairnessCount: number;
    sampleGames: GameSession[];
}
//# sourceMappingURL=types.d.ts.map
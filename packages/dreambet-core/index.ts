import type {
  GameType,
  GameState,
  GameSession,
  GameRound,
  FairnessRecord,
  RNGRequest,
  RNGResult,
  DreamBetContext,
  DreamBetStatus,
} from "./src/types";
import { GameStore } from "./src/store/gameStore";
import { runDreamBetCycle } from "./src/scheduler/gameScheduler";
import { generateRNG, rngToUnit, rngToInt } from "./src/logic/rngEngine";

export const DreamBetCore = {
  // Game management
  upsertGame(
    game: Omit<GameSession, "createdAt" | "updatedAt">
  ): GameSession {
    return GameStore.upsertGame(game);
  },

  getGame(id: string): GameSession | undefined {
    return GameStore.getGame(id);
  },

  listGames(): GameSession[] {
    return GameStore.listGames();
  },

  // Round management
  upsertRound(
    round: Omit<GameRound, "createdAt" | "updatedAt">
  ): GameRound {
    return GameStore.upsertRound(round);
  },

  listRoundsForGame(gameId: string): GameRound[] {
    return GameStore.listRoundsForGame(gameId);
  },

  // RNG utilities
  generateRNG(req: RNGRequest): RNGResult {
    return generateRNG(req);
  },

  rngToUnit(resultHex: string): number {
    return rngToUnit(resultHex);
  },

  rngToInt(resultHex: string, n: number): number {
    return rngToInt(resultHex, n);
  },

  // Orchestration
  run(context: DreamBetContext): DreamBetStatus {
    return runDreamBetCycle(context);
  },

  status(): DreamBetStatus {
    return GameStore.status();
  },
};

export * from "./src/types";
export default DreamBetCore;


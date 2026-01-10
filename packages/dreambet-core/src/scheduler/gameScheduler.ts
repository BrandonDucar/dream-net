import type { DreamBetContext, DreamBetStatus, GameRound, GameState } from '../types.js';
import { GameStore } from '../store/gameStore.js';
import { generateRNG } from '../logic/rngEngine.js';
import { auditRoundRNG } from '../logic/fairnessAuditor.js';

export function runDreamBetCycle(ctx: DreamBetContext): DreamBetStatus {
  const now = Date.now();

  // Example: For each active game, ensure at least one pending round gets an RNG result + audit
  const games = GameStore.listGames().filter((g) => g.state === "active");

  games.forEach((game) => {
    const rounds = GameStore.listRoundsForGame(game.id);
    const pending = rounds.find((r) => r.state === "pending");

    if (!pending) return;

    const rng = generateRNG({
      purpose: "round",
      gameId: game.id,
      roundId: pending.id,
    });

    const updated: GameRound = GameStore.upsertRound({
      ...pending,
      rngSeed: rng.seed,
      rngSalt: rng.salt,
      rngResult: rng.resultHex,
      state: "settled",
    });

    auditRoundRNG(updated);
  });

  GameStore.setLastRunAt(now);

  // Optional: push summary into NeuralMesh
  if (ctx.neuralMesh?.remember) {
    const status = GameStore.status();
    ctx.neuralMesh.remember({
      source: "DreamBetCore",
      gameCount: status.gameCount,
      roundCount: status.roundCount,
      fairnessCount: status.fairnessCount,
      timestamp: now,
    });
  }

  return GameStore.status();
}


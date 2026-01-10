"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDreamBetCycle = runDreamBetCycle;
const gameStore_1 = require("../store/gameStore");
const rngEngine_1 = require("../logic/rngEngine");
const fairnessAuditor_1 = require("../logic/fairnessAuditor");
function runDreamBetCycle(ctx) {
    const now = Date.now();
    // Example: For each active game, ensure at least one pending round gets an RNG result + audit
    const games = gameStore_1.GameStore.listGames().filter((g) => g.state === "active");
    games.forEach((game) => {
        const rounds = gameStore_1.GameStore.listRoundsForGame(game.id);
        const pending = rounds.find((r) => r.state === "pending");
        if (!pending)
            return;
        const rng = (0, rngEngine_1.generateRNG)({
            purpose: "round",
            gameId: game.id,
            roundId: pending.id,
        });
        const updated = gameStore_1.GameStore.upsertRound({
            ...pending,
            rngSeed: rng.seed,
            rngSalt: rng.salt,
            rngResult: rng.resultHex,
            state: "settled",
        });
        (0, fairnessAuditor_1.auditRoundRNG)(updated);
    });
    gameStore_1.GameStore.setLastRunAt(now);
    // Optional: push summary into NeuralMesh
    if (ctx.neuralMesh?.remember) {
        const status = gameStore_1.GameStore.status();
        ctx.neuralMesh.remember({
            source: "DreamBetCore",
            gameCount: status.gameCount,
            roundCount: status.roundCount,
            fairnessCount: status.fairnessCount,
            timestamp: now,
        });
    }
    return gameStore_1.GameStore.status();
}

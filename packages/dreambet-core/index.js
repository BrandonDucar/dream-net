import { GameStore } from "./store/gameStore";
import { runDreamBetCycle } from "./scheduler/gameScheduler";
import { generateRNG, rngToUnit, rngToInt } from "./logic/rngEngine";
export const DreamBetCore = {
    // Game management
    upsertGame(game) {
        return GameStore.upsertGame(game);
    },
    getGame(id) {
        return GameStore.getGame(id);
    },
    listGames() {
        return GameStore.listGames();
    },
    // Round management
    upsertRound(round) {
        return GameStore.upsertRound(round);
    },
    listRoundsForGame(gameId) {
        return GameStore.listRoundsForGame(gameId);
    },
    // RNG utilities
    generateRNG(req) {
        return generateRNG(req);
    },
    rngToUnit(resultHex) {
        return rngToUnit(resultHex);
    },
    rngToInt(resultHex, n) {
        return rngToInt(resultHex, n);
    },
    // Orchestration
    run(context) {
        return runDreamBetCycle(context);
    },
    status() {
        return GameStore.status();
    },
};
export * from "./types";
export default DreamBetCore;

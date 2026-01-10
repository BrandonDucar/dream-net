import { GameStore } from './store/gameStore.js';
import { runDreamBetCycle } from './scheduler/gameScheduler.js';
import { generateRNG, rngToUnit, rngToInt } from './logic/rngEngine.js';
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
    // Oracle & Prediction
    async predictOutcome(req) {
        const { OracleEngine } = await import('./logic/oracle.js');
        return OracleEngine.predict(req);
    },
    status() {
        return GameStore.status();
    },
};
export * from './types.js';
export default DreamBetCore;
//# sourceMappingURL=index.js.map
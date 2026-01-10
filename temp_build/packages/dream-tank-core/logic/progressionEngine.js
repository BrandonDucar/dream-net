"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runProgressionCycle = runProgressionCycle;
const tankStore_1 = require("../store/tankStore");
const evaluationEngine_1 = require("./evaluationEngine");
function runProgressionCycle(ctx) {
    const dreams = tankStore_1.TankStore.listDreams();
    dreams.forEach((dream) => {
        const evalResult = (0, evaluationEngine_1.evaluateDream)(ctx, dream, "stage-review");
        const nextStage = computeNextStage(dream.stage, evalResult.score);
        const nextHealth = computeHealth(dream.health, evalResult.score);
        if (nextStage !== dream.stage || nextHealth !== dream.health) {
            tankStore_1.TankStore.upsertDream({
                ...dream,
                stage: nextStage,
                health: nextHealth,
            });
        }
    });
}
function computeNextStage(stage, score) {
    if (score < 0.3)
        return stage; // too weak to move
    switch (stage) {
        case "seed":
            return score > 0.5 ? "cocoon" : "seed";
        case "cocoon":
            return score > 0.6 ? "prototype" : "cocoon";
        case "prototype":
            return score > 0.7 ? "beta" : "prototype";
        case "beta":
            return score > 0.75 ? "launch-ready" : "beta";
        case "launch-ready":
            return score > 0.8 ? "launched" : "launch-ready";
        case "launched":
        case "archived":
        default:
            return stage;
    }
}
function computeHealth(current, score) {
    if (score < 0.2)
        return "infected";
    if (score < 0.4)
        return "stalled";
    if (score > 0.8)
        return "stable";
    return current;
}

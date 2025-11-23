import { TankStore } from "../store/tankStore";
import { evaluateDream } from "./evaluationEngine";
export function runProgressionCycle(ctx) {
    const dreams = TankStore.listDreams();
    dreams.forEach((dream) => {
        const evalResult = evaluateDream(ctx, dream, "stage-review");
        const nextStage = computeNextStage(dream.stage, evalResult.score);
        const nextHealth = computeHealth(dream.health, evalResult.score);
        if (nextStage !== dream.stage || nextHealth !== dream.health) {
            TankStore.upsertDream({
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

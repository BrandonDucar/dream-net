import { SquadRegistry } from "../registry/squadRegistry";
import { proposeMergeStrategy } from "../strategies/mergeStrategy";
import { proposeSplitStrategy } from "../strategies/splitStrategy";
import { proposeCloneStrategy } from "../strategies/cloneStrategy";
export function runSquadAlchemyCycle(ctx) {
    const decisions = [];
    // Sync Squad-Builder squads into Alchemy registry (async import handled separately)
    // Note: This is a synchronous function, so we can't await here
    // The sync will happen lazily when the bridge is first accessed
    try {
        // Use dynamic import without await - will be handled asynchronously
        import("../bridge/squadBuilderBridge").then((module) => {
            const synced = module.syncSquadBuilderSquads();
            if (synced > 0) {
                console.log(`[SquadAlchemy] Synced ${synced} squads from Squad-Builder`);
            }
        }).catch(() => {
            // Bridge not available - continue with existing registry
        });
    }
    catch {
        // Bridge not available - continue with existing registry
    }
    const squads = SquadRegistry.getAll();
    if (!squads.length) {
        return [
            {
                action: "noop",
                reason: "No squads registered for alchemy",
            },
        ];
    }
    // Example heuristic:
    // 1. Try merging smallest squads if many small squads exist
    if (squads.length >= 3) {
        const mergeDecision = proposeMergeStrategy(squads);
        decisions.push(mergeDecision);
        applyDecision(mergeDecision);
    }
    // 2. Try splitting largest squad if it is too big
    const largest = [...squads].sort((a, b) => b.members.length - a.members.length)[0];
    if (largest) {
        const splitDecision = proposeSplitStrategy(largest);
        decisions.push(splitDecision);
        applyDecision(splitDecision);
    }
    // 3. Clone a specialized squad for high-pressure roles
    const specialized = squads.find((s) => ["repair", "deploy", "routing"].includes(s.role));
    if (specialized) {
        const cloneDecision = proposeCloneStrategy(specialized);
        decisions.push(cloneDecision);
        applyDecision(cloneDecision);
    }
    // Optional: push summary into Neural Mesh memory or QAL
    if (ctx.neuralMesh?.remember) {
        ctx.neuralMesh.remember({
            source: "SquadAlchemy",
            decisions,
            timestamp: Date.now(),
        });
    }
    return decisions;
}
function applyDecision(decision) {
    if (!decision || decision.action === "noop")
        return;
    if (decision.targetSquadIds) {
        decision.targetSquadIds.forEach((id) => {
            SquadRegistry.remove(id);
        });
    }
    if (decision.newSquads) {
        decision.newSquads.forEach((squad) => SquadRegistry.upsert(squad));
    }
}

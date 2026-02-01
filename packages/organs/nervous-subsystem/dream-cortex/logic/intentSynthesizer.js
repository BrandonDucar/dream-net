import { buildGoalGraph } from './goalGraph.js';
function computeDreamScore(node, ctx) {
    // Placeholder heuristic:
    // - higher priority -> higher score
    // - "blocked" or "infected" pushes score up (needs attention)
    // - "completed" pushes score down
    let base = 0.5;
    switch (node.priority) {
        case "low":
            base -= 0.1;
            break;
        case "high":
            base += 0.1;
            break;
        case "critical":
            base += 0.2;
            break;
    }
    switch (node.status) {
        case "completed":
            base -= 0.3;
            break;
        case "blocked":
        case "infected":
            base += 0.2;
            break;
        case "active":
            base += 0.05;
            break;
    }
    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, base));
}
function pickIntentForDream(node) {
    if (node.status === "blocked" || node.status === "infected")
        return "unblock";
    if (node.status === "completed")
        return "monitor";
    if (node.status === "idle" || node.status === "incubating")
        return "accelerate";
    if (node.status === "active")
        return "stabilize";
    return "monitor";
}
export function synthesizeDirectives(ctx) {
    const { nodes } = buildGoalGraph();
    const now = Date.now();
    const directives = [];
    nodes.forEach((node) => {
        const score = computeDreamScore(node, ctx);
        const intent = pickIntentForDream(node);
        // Only emit directives for dreams above a minimal score
        if (score < 0.3)
            return;
        directives.push({
            id: `directive-${node.id}-${now}`,
            dreamId: node.id,
            intent,
            confidence: score,
            reason: `Dream '${node.name}' requires ${intent} at score=${score.toFixed(2)}`,
            createdAt: now,
        });
    });
    return directives;
}
//# sourceMappingURL=intentSynthesizer.js.map
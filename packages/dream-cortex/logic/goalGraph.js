import { DreamRegistry } from "../store/dreamRegistry";
export function buildGoalGraph() {
    const nodes = DreamRegistry.getAll();
    const edges = [];
    nodes.forEach((node) => {
        (node.dependencies ?? []).forEach((depId) => {
            edges.push({ from: depId, to: node.id });
        });
    });
    return { nodes, edges };
}

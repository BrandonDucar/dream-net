"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGoalGraph = buildGoalGraph;
const dreamRegistry_1 = require("../store/dreamRegistry");
function buildGoalGraph() {
    const nodes = dreamRegistry_1.DreamRegistry.getAll();
    const edges = [];
    nodes.forEach((node) => {
        (node.dependencies ?? []).forEach((depId) => {
            edges.push({ from: depId, to: node.id });
        });
    });
    return { nodes, edges };
}

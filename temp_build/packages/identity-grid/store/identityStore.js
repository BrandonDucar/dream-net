"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityStore = void 0;
const nodes = new Map();
const edges = new Map();
exports.IdentityStore = {
    upsertNode(partial) {
        const now = Date.now();
        const existing = nodes.get(partial.id);
        const merged = {
            id: partial.id,
            type: partial.type,
            label: partial.label ?? existing?.label,
            chain: partial.chain ?? existing?.chain,
            tags: partial.tags ?? existing?.tags ?? [],
            meta: { ...(existing?.meta ?? {}), ...(partial.meta ?? {}) },
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
        };
        nodes.set(merged.id, merged);
        return merged;
    },
    getNode(id) {
        return nodes.get(id);
    },
    listNodes() {
        return Array.from(nodes.values());
    },
    addEdge(edge) {
        edges.set(edge.id, edge);
    },
    listEdges() {
        return Array.from(edges.values());
    },
    findEdgesForNode(id) {
        return Array.from(edges.values()).filter((e) => e.fromId === id || e.toId === id);
    },
    status() {
        const sampleNodes = Array.from(nodes.values()).slice(0, 25);
        const sampleEdges = Array.from(edges.values()).slice(0, 25);
        return {
            lastRunAt: null, // will be set by scheduler
            nodeCount: nodes.size,
            edgeCount: edges.size,
            sampleNodes,
            sampleEdges,
        };
    },
};

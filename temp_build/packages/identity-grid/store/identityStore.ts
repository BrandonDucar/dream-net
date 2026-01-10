import type {
  IdentityNode,
  IdentityEdge,
  IdentityStatus,
} from "../types";

const nodes: Map<string, IdentityNode> = new Map();
const edges: Map<string, IdentityEdge> = new Map();

export const IdentityStore = {
  upsertNode(partial: Omit<IdentityNode, "createdAt" | "updatedAt">): IdentityNode {
    const now = Date.now();
    const existing = nodes.get(partial.id);

    const merged: IdentityNode = {
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

  getNode(id: string): IdentityNode | undefined {
    return nodes.get(id);
  },

  listNodes(): IdentityNode[] {
    return Array.from(nodes.values());
  },

  addEdge(edge: IdentityEdge) {
    edges.set(edge.id, edge);
  },

  listEdges(): IdentityEdge[] {
    return Array.from(edges.values());
  },

  findEdgesForNode(id: string): IdentityEdge[] {
    return Array.from(edges.values()).filter(
      (e) => e.fromId === id || e.toId === id
    );
  },

  status(): IdentityStatus {
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


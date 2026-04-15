import type { DreamNode } from "../types";
import { DreamRegistry } from "../store/dreamRegistry";

export interface GoalGraphEdge {
  from: string;
  to: string;
}

export interface GoalGraphSnapshot {
  nodes: DreamNode[];
  edges: GoalGraphEdge[];
}

export function buildGoalGraph(): GoalGraphSnapshot {
  const nodes = DreamRegistry.getAll();
  const edges: GoalGraphEdge[] = [];

  nodes.forEach((node) => {
    (node.dependencies ?? []).forEach((depId) => {
      edges.push({ from: depId, to: node.id });
    });
  });

  return { nodes, edges };
}


import type { DreamNode } from '../types.js';
export interface GoalGraphEdge {
    from: string;
    to: string;
}
export interface GoalGraphSnapshot {
    nodes: DreamNode[];
    edges: GoalGraphEdge[];
}
export declare function buildGoalGraph(): GoalGraphSnapshot;
//# sourceMappingURL=goalGraph.d.ts.map
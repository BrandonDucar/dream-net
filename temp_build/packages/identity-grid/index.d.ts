import type { IdentityNode, IdentityEdge, IdentityContext, IdentitySnapshot, IdentityStatus } from "./types";
export declare const IdentityGrid: {
    upsertNode(node: Omit<IdentityNode, "createdAt" | "updatedAt">): IdentityNode;
    addEdge(edge: IdentityEdge): void;
    listNodes(): IdentityNode[];
    listEdges(): IdentityEdge[];
    getSnapshot(): IdentitySnapshot;
    run(context: IdentityContext): IdentityStatus;
    status(): IdentityStatus;
};
export * from "./types";
export default IdentityGrid;

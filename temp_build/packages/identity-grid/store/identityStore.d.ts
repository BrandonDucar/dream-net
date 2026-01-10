import type { IdentityNode, IdentityEdge, IdentityStatus } from "../types";
export declare const IdentityStore: {
    upsertNode(partial: Omit<IdentityNode, "createdAt" | "updatedAt">): IdentityNode;
    getNode(id: string): IdentityNode | undefined;
    listNodes(): IdentityNode[];
    addEdge(edge: IdentityEdge): void;
    listEdges(): IdentityEdge[];
    findEdgesForNode(id: string): IdentityEdge[];
    status(): IdentityStatus;
};

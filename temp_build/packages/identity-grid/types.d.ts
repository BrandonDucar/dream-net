export type IdentityType = "wallet" | "user" | "agent" | "service" | "dream";
export type ChainRef = "base" | "ethereum" | "solana" | "polygon" | "arbitrum" | "avalanche" | "near" | "monad" | "unknown";
export interface IdentityNode {
    id: string;
    type: IdentityType;
    label?: string;
    chain?: ChainRef;
    createdAt: number;
    updatedAt: number;
    tags?: string[];
    meta?: Record<string, any>;
}
export type IdentityLinkType = "owns" | "controls" | "operates" | "relates-to" | "trusts" | "belongs-to";
export interface IdentityEdge {
    id: string;
    fromId: string;
    toId: string;
    linkType: IdentityLinkType;
    createdAt: number;
    meta?: Record<string, any>;
}
export interface IdentityContext {
    reputationLattice?: any;
    dreamCortex?: any;
    starBridge?: any;
    neuralMesh?: any;
}
export interface IdentitySnapshot {
    nodes: IdentityNode[];
    edges: IdentityEdge[];
}
export interface IdentityStatus {
    lastRunAt: number | null;
    nodeCount: number;
    edgeCount: number;
    sampleNodes: IdentityNode[];
    sampleEdges: IdentityEdge[];
}

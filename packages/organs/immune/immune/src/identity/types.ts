export type IdentityType = "wallet" | "user" | "agent" | "service" | "dream";

export type ChainRef =
  | "base"
  | "ethereum"
  | "solana"
  | "polygon"
  | "arbitrum"
  | "avalanche"
  | "near"
  | "monad"
  | "unknown";

export interface IdentityNode {
  id: string;                 // stable id, e.g. wallet address or internal id
  type: IdentityType;
  label?: string;             // friendly label
  chain?: ChainRef;           // for wallets
  createdAt: number;
  updatedAt: number;
  tags?: string[];
  trustScore?: number;
  meta?: Record<string, any>;
}

export type IdentityLinkType =
  | "owns"          // wallet owns dream or asset
  | "controls"      // user controls agent or wallet
  | "operates"      // agent operates service
  | "relates-to"    // generic relation
  | "trusts"        // directional trust relation
  | "belongs-to";   // membership relation

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

/**
 * IdentityGrid → Passport Bridge Types
 * Biomimetic: IdentityGrid (DNA) → Passport (Citizenship) flow
 */

export interface PassportIssueEvent {
  identityId: string;
  nodeType: "wallet" | "user" | "agent";
  trustScore?: number;
  reason: "new_node" | "trust_upgrade" | "manual";
}

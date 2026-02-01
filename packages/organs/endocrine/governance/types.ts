export type ActorType = "agent" | "wallet" | "system" | "admin";
export type CapabilityType = "publish" | "remix" | "monetize" | "archive" | "deploy" | "modify_schema" | "manage_keys" | "payout";
export type ScopeType = "global" | "dream" | "agent" | "token" | "infrastructure";
export type QuorumType = "tech" | "creator" | "safety" | "admin";

export interface PolicyRule {
  actor: ActorType;
  capability: CapabilityType;
  scope: ScopeType;
  reversible: boolean;
  review_quorum: QuorumType[];
  min_approvals?: number;
  conditions?: Record<string, unknown>;
}

export interface PolicyTable {
  version: string;
  rules: PolicyRule[];
}

export interface QuorumVote {
  voter: string;
  voterType: ActorType;
  decision: "approve" | "reject" | "abstain";
  timestamp: string;
  reason?: string;
}

export interface QuorumDecision {
  policyId: string;
  quorumType: QuorumType;
  votes: QuorumVote[];
  threshold: number;
  reached: boolean;
  result: "approved" | "rejected" | "pending";
  timestamp: string;
}

export interface ActorContext {
  actorId: string;
  actorType: ActorType;
  walletAddress?: string;
  trustScore?: number;
  stakedTokens?: number;
  completedDreams?: number;
  badges?: string[];
}


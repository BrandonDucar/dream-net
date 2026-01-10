/**
 * IdentityGrid → Passport Bridge Types
 * Biomimetic: IdentityGrid (DNA) → Passport (Citizenship) flow
 */

export interface IdentityNode {
  id: string;
  type: "wallet" | "user" | "agent";
  label: string;
  trustScore?: number;
  metadata?: Record<string, any>;
  createdAt: number;
}

export interface PassportIssueEvent {
  identityId: string;
  nodeType: "wallet" | "user" | "agent";
  trustScore?: number;
  reason: "new_node" | "trust_upgrade" | "manual";
}


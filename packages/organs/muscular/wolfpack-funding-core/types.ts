export type LeadType =
  | "vc"
  | "angel"
  | "grant"
  | "accelerator"
  | "ecosystem-fund"
  | "dao"
  | "other";

export type LeadStage =
  | "new"
  | "qualified"
  | "contacted"
  | "replied"
  | "hot"
  | "dead";

export interface FundingLead {
  id: string;             // lead id, e.g. "lead:a16z-crypto"
  name: string;           // "a16z Crypto", "Base Ecosystem Fund", etc.
  company?: string;
  type: LeadType;
  email?: string;
  website?: string;
  tags?: string[];
  notes?: string;

  // DreamNet fit:
  dreamFitScore?: number;   // 0–1
  riskScore?: number;       // 0–1
  trustScore?: number;      // 0–1
  priorityScore?: number;   // 0–1

  // Hot lead detection (A)
  hotScore?: number;        // 0–1
  isHot?: boolean;          // flagged as "hot"

  // Follow-up metadata (B)
  lastContactedAt?: number;
  lastReplyAt?: number;
  nextFollowUpAt?: number;
  contactCount?: number;

  // Identity Layer v1 (Phase 4+)
  // TODO: Add ownerIdentityId when implementing agent ownership
  // ownerIdentityId?: string;  // IdentityGrid node id (user/agent that owns this lead)

  stage: LeadStage;

  createdAt: number;
  updatedAt: number;
}

export interface EmailDraft {
  id: string;
  leadId: string;
  toEmail: string;
  subject: string;
  body: string;
  createdAt: number;
}

export interface SendQueueItem {
  id: string;             // queue id
  leadId: string;
  toEmail: string;
  subject: string;
  body: string;
  createdAt: number;
  status: "pending" | "sent" | "failed";
  lastError?: string;

  // Identity Layer v1 (Phase 4+)
  // TODO: Add authorIdentityId when implementing agent ownership/permissions
  // authorIdentityId?: string;  // IdentityGrid node id (user/agent that queued this email)
}

// Grant application drafts (C)
export interface GrantApplicationDraft {
  id: string;
  leadId: string;
  title: string;
  body: string;         // markdown / text
  createdAt: number;
  updatedAt: number;
}

export interface WolfPackFundingContext {
  reputationLattice?: any;
  fieldLayer?: any;
  dreamTankCore?: any;
  economicEngineCore?: any;
  narrativeField?: any;
  agentRegistryCore?: any;
  neuralMesh?: any;
}

export interface WolfPackFundingStatus {
  lastRunAt: number | null;
  leadCount: number;
  queueCount: number;
  pendingCount: number;
  hotLeadCount: number;
  sampleLeads: FundingLead[];
  sampleQueue: SendQueueItem[];
}


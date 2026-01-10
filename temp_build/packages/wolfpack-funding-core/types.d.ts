export type LeadType = "vc" | "angel" | "grant" | "accelerator" | "ecosystem-fund" | "dao" | "other";
export type LeadStage = "new" | "qualified" | "contacted" | "replied" | "hot" | "dead";
export interface FundingLead {
    id: string;
    name: string;
    type: LeadType;
    email?: string;
    website?: string;
    tags?: string[];
    notes?: string;
    dreamFitScore?: number;
    riskScore?: number;
    trustScore?: number;
    priorityScore?: number;
    hotScore?: number;
    isHot?: boolean;
    lastContactedAt?: number;
    lastReplyAt?: number;
    nextFollowUpAt?: number;
    contactCount?: number;
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
    id: string;
    leadId: string;
    toEmail: string;
    subject: string;
    body: string;
    createdAt: number;
    status: "pending" | "sent" | "failed";
    lastError?: string;
}
export interface GrantApplicationDraft {
    id: string;
    leadId: string;
    title: string;
    body: string;
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

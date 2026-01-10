export type DreamPassportTier = "visitor" | "dreamer" | "citizen" | "operator" | "architect" | "founder";
export interface DreamPassport {
    id: string;
    identityId: string;
    tier: DreamPassportTier;
    issuedAt: number;
    updatedAt: number;
    expiresAt?: number;
    flags?: string[];
    meta?: Record<string, any>;
    onchainAddress?: string;
    passportTokenId?: string;
}
export interface GovernmentDepartment {
    id: string;
    name: string;
    packId: string;
    leader?: string;
    responsibilities: string[];
    budget?: number;
    createdAt: number;
}
export interface DiplomaticRelation {
    id: string;
    protocolName: string;
    protocolType: "chain" | "dao" | "protocol" | "nation";
    status: "alliance" | "neutral" | "treaty" | "embassy" | "hostile";
    establishedAt: number;
    contactEmail?: string;
    notes?: string;
    wolfPackLeadId?: string;
    meta?: Record<string, any>;
}
export interface StateSymbol {
    id: string;
    type: "flag" | "anthem" | "motto" | "seal" | "emblem";
    name: string;
    content: string;
    description: string;
    adoptedAt: number;
    createdBy?: string;
}
export interface GovernmentAction {
    id: string;
    type: "executive" | "legislative" | "judicial" | "diplomatic" | "administrative";
    department: string;
    action: string;
    authorizedBy: string;
    timestamp: number;
    meta?: Record<string, any>;
}
export interface DreamStateContext {
    identityGrid?: any;
    wolfPackFundingCore?: any;
    economicEngineCore?: any;
    narrativeField?: any;
    neuralMesh?: any;
    agentRegistryCore?: any;
}
export type ProposalStatus = "draft" | "open" | "passed" | "rejected" | "executed";
export interface DreamProposal {
    id: string;
    title: string;
    description: string;
    createdByIdentityId: string;
    createdAt: number;
    status: ProposalStatus;
    votesFor: number;
    votesAgainst: number;
    meta?: Record<string, any>;
}
export interface DreamVote {
    proposalId: string;
    identityId: string;
    choice: "for" | "against";
    weight: number;
    castAt: number;
}
export type DDAOCategory = "grants" | "infra" | "social" | "governance" | "ecosystem";
export interface DDAOAttractor {
    id: string;
    name: string;
    category: DDAOCategory;
    url?: string;
    tags?: string[];
    score?: number;
    createdAt: number;
    updatedAt: number;
}
export interface DreamStateStatus {
    lastRunAt: number | null;
    passportCount: number;
    departmentCount: number;
    diplomaticRelationsCount: number;
    proposalCount: number;
    openProposals: number;
    ddaoAttractorCount: number;
    headOfState: string;
    samplePassports: DreamPassport[];
    sampleDepartments: GovernmentDepartment[];
    sampleDiplomaticRelations: DiplomaticRelation[];
    sampleProposals: DreamProposal[];
    sampleDDAOAttractors: DDAOAttractor[];
    stateSymbols: StateSymbol[];
    recentActions: GovernmentAction[];
}

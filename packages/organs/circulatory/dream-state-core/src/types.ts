export type DreamPassportTier = "visitor" | "dreamer" | "citizen" | "ambassador" | "operator" | "architect" | "founder";

export interface DreamPassport {
  id: string;                      // Passport ID
  identityId: string;              // IdentityGrid id: "user:xyz"
  tier: DreamPassportTier;
  issuedAt: number;
  updatedAt: number;
  expiresAt?: number;              // Optional expiration
  flags?: string[];                // ["early", "trusted", "builder"]
  meta?: Record<string, any>;      // Additional metadata
  onchainAddress?: string;         // Optional wallet address
  passportTokenId?: string;         // Optional NFT token ID (if minted)
  passportNumber?: string;
  citizenshipTier?: string;
  transferable?: boolean;
  currentOwner?: string;
}

export interface DreamCitizen {
  identityId: string;
  passportNumber?: string;
  citizenshipTier: string;
  joinedAt: number;
  contributions: number;
}

// Removed - citizenship is now just passport lookup via IdentityGrid

export interface GovernmentDepartment {
  id: string;                     // e.g., "dept:treasury", "dept:diplomacy"
  name: string;
  packId: string;                  // Associated pack (e.g., "agent:WolfPackFunding")
  leader?: string;                 // Agent or citizen ID
  responsibilities: string[];
  budget?: number;
  createdAt: number;
}

export interface DiplomaticRelation {
  id: string;
  protocolName: string;           // e.g., "Base", "Optimism", "Ethereum"
  protocolType: "chain" | "dao" | "protocol" | "nation";
  status: "alliance" | "neutral" | "treaty" | "embassy" | "hostile";
  establishedAt: number;
  contactEmail?: string;
  notes?: string;
  wolfPackLeadId?: string;        // Associated funding lead if applicable
  meta?: Record<string, any>;
}

export interface StateSymbol {
  id: string;
  type: "flag" | "anthem" | "motto" | "seal" | "emblem";
  name: string;
  content: string;                 // SVG for flag, text for motto, etc.
  description: string;
  adoptedAt: number;
  createdBy?: string;              // DreamNet or citizen ID
}

export interface GovernmentAction {
  id: string;
  type: "executive" | "legislative" | "judicial" | "diplomatic" | "administrative";
  department: string;
  action: string;                  // What was done
  authorizedBy: string;            // Head of State (DreamNet) or citizen ID
  timestamp: number;
  meta?: Record<string, any>;
}

export interface DreamStateContext {
  identityGrid?: any;              // For citizenship registry
  wolfPackFundingCore?: any;       // For diplomatic outreach
  economicEngineCore?: any;        // For state economy
  narrativeField?: any;            // For state history
  neuralMesh?: any;                // For state memory
  agentRegistryCore?: any;         // For government agents
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
  meta?: Record<string, any>;      // Can hold references to packs, configs, etc.
}

export interface DreamVote {
  proposalId: string;
  identityId: string;
  choice: "for" | "against";
  weight: number;                  // Based on passport tier
  castAt: number;
}

export type DDAOCategory = "grants" | "infra" | "social" | "governance" | "ecosystem";

export interface DDAOAttractor {
  id: string;
  name: string;                    // e.g. "Base Grants", "Farcaster Dev DAO"
  category: DDAOCategory;
  url?: string;
  tags?: string[];
  score?: number;                   // How aligned / attractive this is
  createdAt: number;
  updatedAt: number;
}

export interface DreamStateStatus {
  lastRunAt: number | null;
  passportCount: number;
  citizenCount: number;
  departmentCount: number;
  diplomaticRelationsCount: number;
  proposalCount: number;
  openProposals: number;
  ddaoAttractorCount: number;
  headOfState: string;             // Always "agent:DreamNet" or similar
  sampleCitizens: DreamCitizen[];
  samplePassports: DreamPassport[];
  sampleDepartments: GovernmentDepartment[];
  sampleDiplomaticRelations: DiplomaticRelation[];
  sampleProposals: DreamProposal[];
  sampleDDAOAttractors: DDAOAttractor[];
  stateSymbols: StateSymbol[];
  recentActions: GovernmentAction[];
}


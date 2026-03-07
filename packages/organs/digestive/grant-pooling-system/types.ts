// GrantPoolingSystem - Type Definitions

export interface Grant {
  id: string;
  title: string;
  description: string;
  agency: string;
  amount: number;
  deadline: Date;
  requirements: string[];
  isMultiContractor: boolean;
  maxContractorsAllowed: number;
}

export interface AgentCapability {
  agentId: string;
  name: string;
  skills: string[];
  experience: number; // years
  pastGrants: number;
  successRate: number; // 0-100
  capacity: number; // 0-100 (how busy)
  availableFunds: number;
}

export interface PoolableGrant {
  grant: Grant;
  isPoolable: boolean;
  reason: string;
  estimatedTeamSize: number;
  skillGapsToFill: string[];
}

export interface AgentTeam {
  id: string;
  grantId: string;
  leadAgent: AgentCapability;
  teamMembers: AgentCapability[];
  skillsCovered: string[];
  skillsGaps: string[];
  estimatedProposalStrength: number; // 0-100
  totalTeamCapacity: number;
  pooledBudget: number;
}

export interface PooledBid {
  id: string;
  grantId: string;
  team: AgentTeam;
  proposalSummary: string;
  estimatedWinProbability: number; // 0-100
  pricePoint: number;
  submittedAt?: Date;
  status: 'draft' | 'submitted' | 'won' | 'lost' | 'cancelled';
}

export interface GrantWinRecord {
  id: string;
  grantId: string;
  bidId: string;
  team: AgentTeam;
  amountAwarded: number;
  awardedAt: Date;
  startDate: Date;
  endDate: Date;
  revenueSplit: Map<string, number>; // agentId -> amount
  status: 'awarded' | 'active' | 'completed' | 'disputed';
}

export interface PoolingMetrics {
  totalGrantsAnalyzed: number;
  poolableGrants: number;
  teamsFormed: number;
  bidsSubmitted: number;
  bidsWon: number;
  winRate: number;
  totalRevenuePooled: number;
  averageTeamSize: number;
  skillsInDemand: string[];
}

export interface PoolingConfig {
  minTeamSize: number;
  maxTeamSize: number;
  minPoolableGrants: number;
  autoFormTeams: boolean;
  autoSubmitBids: boolean;
  estimatedWinThreshold: number; // Only submit if > X%
}

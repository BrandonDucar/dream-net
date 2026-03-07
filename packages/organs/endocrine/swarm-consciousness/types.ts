// SwarmConsciousnessEngine - Type Definitions

export interface Agent {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  status: 'active' | 'inactive' | 'unavailable';
  currentWorkload: number; // 0-100
  riskTolerance: number; // 0-100
  successRate: number; // 0-100
  monthlyRevenue: number;
  treasury: number;
}

export interface OpportunityProposal {
  id: string;
  title: string;
  description: string;
  requiredAmount: number;
  maxIndividualCapacity: number;
  deadline: Date;
  type: 'grant' | 'contract' | 'partnership';
  requiredSkills: string[];
  estimatedROI: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface SwarmVote {
  opportunityId: string;
  agentId: string;
  vote: 'yes' | 'no' | 'abstain';
  confidence: number; // 0-100
  reasoning: string;
  timestamp: Date;
}

export interface VotingResult {
  opportunityId: string;
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  approvalPercentage: number;
  decision: 'approved' | 'rejected' | 'deferred';
  requiredQuorum: number;
  quorumMet: boolean;
}

export interface ResourcePool {
  opportunityId: string;
  totalRequired: number;
  totalCommitted: number;
  contributors: Map<string, number>; // agentId -> amount
  status: 'forming' | 'active' | 'complete' | 'failed';
  createdAt: Date;
  deadline: Date;
}

export interface RiskAllocation {
  opportunityId: string;
  totalRisk: number;
  riskDistribution: Map<string, number>; // agentId -> risk share
  hedgeStrategy: 'conservative' | 'balanced' | 'aggressive';
  compensationStructure: 'equal' | 'proportional' | 'performance-based';
}

export interface TreasuryTransaction {
  id: string;
  timestamp: Date;
  type: 'deposit' | 'withdrawal' | 'distribution' | 'reserve';
  amount: number;
  agentId?: string;
  opportunityId?: string;
  description: string;
  balance: number;
}

export interface SwarmTreasuryStatus {
  totalFunds: number;
  activeCommitments: number;
  reserves: number;
  availableFunds: number;
  recentTransactions: TreasuryTransaction[];
  lastUpdated: Date;
}

export interface CollectiveDecision {
  id: string;
  proposalId: string;
  decision: 'approved' | 'rejected' | 'deferred';
  votingResult: VotingResult;
  resourcePool?: ResourcePool;
  riskAllocation?: RiskAllocation;
  selectedAgents: string[];
  executedAt?: Date;
  status: 'pending' | 'executing' | 'complete' | 'failed';
}

export interface SwarmMetrics {
  totalAgents: number;
  activeAgents: number;
  averageWorkload: number;
  averageSuccessRate: number;
  totalTreasuryFunds: number;
  monthlyRevenuePerAgent: number;
  decisionsThisMonth: number;
  approvalRate: number;
}

export interface SwarmConfig {
  quorumPercentage: number; // 60, 75, etc
  requiredApprovalPercentage: number;
  maxPoolPercentagePerAgent: number; // 30% of treasury max
  minReservePercentage: number; // Always keep 20% reserve
  riskDiversificationThreshold: number; // No agent > 40% risk
  decisionTimeoutMinutes: number;
}

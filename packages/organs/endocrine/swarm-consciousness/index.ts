// SwarmConsciousnessEngine - Main Engine

import { 
  Agent, 
  OpportunityProposal, 
  CollectiveDecision, 
  SwarmConfig, 
  SwarmMetrics,
  RiskAllocation 
} from './types';
import { VotingSystem } from './voting-system';
import { ResourcePooling } from './resource-pooling';
import { TreasuryManagement } from './treasury-management';

export class SwarmConsciousnessEngine {
  private agents: Map<string, Agent> = new Map();
  private votingSystem: VotingSystem;
  private resourcePooling: ResourcePooling;
  private treasury: TreasuryManagement;
  private decisions: Map<string, CollectiveDecision> = new Map();
  private config: SwarmConfig;
  private riskAllocations: Map<string, RiskAllocation> = new Map();

  constructor(config: SwarmConfig, initialTreasuryFunds: number = 10000000) {
    this.config = config;
    this.votingSystem = new VotingSystem(config);
    this.resourcePooling = new ResourcePooling(config);
    this.treasury = new TreasuryManagement(initialTreasuryFunds, config);
  }

  /**
   * Register an agent with the swarm
   */
  registerAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
    console.log(`[SWARM] Agent registered: ${agent.name} (${agent.id})`);
  }

  /**
   * Register multiple agents
   */
  registerAgents(agents: Agent[]): void {
    agents.forEach(agent => this.registerAgent(agent));
    console.log(`[SWARM] Registered ${agents.length} agents`);
  }

  /**
   * Get an agent's status
   */
  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get all active agents
   */
  getActiveAgents(): Agent[] {
    return Array.from(this.agents.values()).filter(a => a.status === 'active');
  }

  /**
   * Propose an opportunity to the swarm for collective decision
   */
  async proposeOpportunity(opportunity: OpportunityProposal): Promise<string> {
    const proposalId = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create resource pool for the opportunity
    this.resourcePooling.createPool(
      opportunity.id,
      opportunity.requiredAmount,
      opportunity.deadline
    );

    // Commit swarm treasury to the pool
    const committedAmount = Math.min(
      opportunity.requiredAmount,
      this.treasury.getStatus().availableFunds
    );

    if (committedAmount > 0) {
      this.treasury.commitFunds(opportunity.id, committedAmount);
      this.resourcePooling.commitFunds(opportunity.id, 'swarm-treasury', committedAmount, this.treasury.getStatus().totalFunds);
    }

    console.log(`[SWARM] Opportunity proposed: ${opportunity.title} (ID: ${opportunity.id})`);
    console.log(`[SWARM] Swarm committed: $${committedAmount}/${opportunity.requiredAmount}`);

    return proposalId;
  }

  /**
   * Agent votes on an opportunity
   */
  async agentVote(
    opportunityId: string,
    agentId: string,
    vote: 'yes' | 'no' | 'abstain',
    confidence: number,
    reasoning: string
  ): Promise<boolean> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.error(`[SWARM] Agent not found: ${agentId}`);
      return false;
    }

    await this.votingSystem.submitVote(opportunityId, agentId, vote, confidence, reasoning);

    // If vote is YES and resources are available, also commit their treasury
    if (vote === 'yes') {
      const pool = this.resourcePooling.getPoolStatus(opportunityId);
      if (pool && pool.status !== 'complete') {
        const canCommit = this.resourcePooling.calculateMaxContribution(agent.treasury);
        if (canCommit > 0) {
          const commitAmount = Math.min(canCommit, pool.totalRequired - pool.totalCommitted);
          if (commitAmount > 0) {
            this.resourcePooling.commitFunds(opportunityId, agentId, commitAmount, agent.treasury);
            console.log(`[SWARM] Agent ${agentId} committed $${commitAmount} to pool`);
          }
        }
      }
    }

    return true;
  }

  /**
   * Get voting status for an opportunity
   */
  getVotingStatus(opportunityId: string): {
    results: any;
    poolStatus: any;
    canExecute: boolean;
  } {
    const results = this.votingSystem.getVotingResults(opportunityId, this.agents.size);
    const poolStatus = this.resourcePooling.getPoolStatus(opportunityId);

    const canExecute = results.decision === 'approved' && poolStatus?.status === 'complete';

    return {
      results,
      poolStatus,
      canExecute,
    };
  }

  /**
   * Execute a collective decision (opportunity approved and funded)
   */
  async executeDecision(opportunityId: string): Promise<CollectiveDecision> {
    const votingStatus = this.getVotingStatus(opportunityId);

    if (!votingStatus.canExecute) {
      throw new Error(`Cannot execute decision: ${JSON.stringify(votingStatus)}`);
    }

    const contributors = this.resourcePooling.getContributors(opportunityId);
    const selectedAgents = contributors.map(c => c.agentId);

    const decision: CollectiveDecision = {
      id: `dec_${Date.now()}`,
      proposalId: opportunityId,
      decision: 'approved',
      votingResult: votingStatus.results,
      resourcePool: votingStatus.poolStatus,
      selectedAgents,
      status: 'executing',
      executedAt: new Date(),
    };

    this.decisions.set(decision.id, decision);

    console.log(`[SWARM] Decision EXECUTED: ${opportunityId}`);
    console.log(`[SWARM] Selected ${selectedAgents.length} agents for execution`);

    return decision;
  }

  /**
   * Distribute revenue from an opportunity to contributing agents
   */
  async distributeRevenue(opportunityId: string, totalRevenue: number): Promise<any> {
    const contributors = this.resourcePooling.getContributors(opportunityId);
    const distributions = new Map<string, number>();

    contributors.forEach(({ agentId, amount }) => {
      const share = this.resourcePooling.calculateAgentShare(opportunityId, agentId, totalRevenue);
      distributions.set(agentId, share);

      const agent = this.agents.get(agentId);
      if (agent) {
        agent.treasury += share;
        agent.monthlyRevenue += share;
      }
    });

    const result = this.treasury.distributeFundsToAgents(opportunityId, totalRevenue, distributions);

    console.log(`[SWARM] Revenue distributed: $${totalRevenue} from ${opportunityId}`);

    return result;
  }

  /**
   * Get swarm metrics
   */
  getMetrics(): SwarmMetrics {
    const agents = this.getActiveAgents();
    const totalAgents = this.agents.size;
    const activeAgents = agents.length;

    const avgWorkload = activeAgents > 0 ? agents.reduce((sum, a) => sum + a.currentWorkload, 0) / activeAgents : 0;
    const avgSuccessRate = activeAgents > 0 ? agents.reduce((sum, a) => sum + a.successRate, 0) / activeAgents : 0;
    const monthlyRevenuePerAgent = activeAgents > 0 ? agents.reduce((sum, a) => sum + a.monthlyRevenue, 0) / activeAgents : 0;

    const votingStats = this.votingSystem.getVotingStats();
    const poolingStats = this.resourcePooling.getPoolingStats();

    return {
      totalAgents,
      activeAgents,
      averageWorkload: Math.round(avgWorkload * 100) / 100,
      averageSuccessRate: Math.round(avgSuccessRate * 100) / 100,
      totalTreasuryFunds: this.treasury.getStatus().totalFunds,
      monthlyRevenuePerAgent: Math.round(monthlyRevenuePerAgent * 100) / 100,
      decisionsThisMonth: this.decisions.size,
      approvalRate: Math.round(votingStats.averageApprovalRate * 100) / 100,
    };
  }

  /**
   * Get treasury status
   */
  getTreasuryStatus(): any {
    return this.treasury.getStatus();
  }

  /**
   * Export engine state for persistence
   */
  getState(): any {
    return {
      agents: Array.from(this.agents.values()),
      decisions: Array.from(this.decisions.values()),
      treasury: this.treasury.getStatus(),
      pooling: this.resourcePooling.getPoolingStats(),
      voting: this.votingSystem.getVotingStats(),
    };
  }
}

export { VotingSystem, ResourcePooling, TreasuryManagement };

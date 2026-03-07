// GrantPoolingSystem - Main Engine

import { Grant, AgentCapability, PoolableGrant, PooledBid, GrantWinRecord, PoolingMetrics, PoolingConfig } from './types';
import { PoolDetector } from './detector';
import { TeamAssembly } from './team-assembly';

export class GrantPoolingSystem {
  private detector: PoolDetector;
  private teamAssembly: TeamAssembly;
  private config: PoolingConfig;
  private analyzedGrants: Map<string, PoolableGrant> = new Map();
  private formedTeams: Map<string, any> = new Map();
  private submittedBids: Map<string, PooledBid> = new Map();
  private wonGrants: Map<string, GrantWinRecord> = new Map();
  private agents: Map<string, AgentCapability> = new Map();

  constructor(config: PoolingConfig) {
    this.config = config;
    this.detector = new PoolDetector(config);
    this.teamAssembly = new TeamAssembly();
  }

  /**
   * Register agents with the system
   */
  registerAgents(agents: AgentCapability[]): void {
    agents.forEach(a => this.agents.set(a.agentId, a));
    console.log(`[GRANT-POOLING] Registered ${agents.length} agents`);
  }

  /**
   * Analyze grant and form team if poolable
   */
  async analyzeAndPool(grant: Grant): Promise<any> {
    console.log(`[GRANT-POOLING] Analyzing grant: ${grant.title}`);

    // 1. Analyze if poolable
    const analysis = this.detector.analyzeGrant(grant);
    this.analyzedGrants.set(grant.id, analysis);

    if (!analysis.isPoolable) {
      console.log(`[GRANT-POOLING] Grant not poolable: ${analysis.reason}`);
      return { grant, analysis, team: null };
    }

    // 2. Form team if poolable
    const availableAgents = Array.from(this.agents.values());
    const team = this.teamAssembly.assembleTeam(grant, availableAgents, analysis.estimatedTeamSize);
    this.formedTeams.set(team.id, team);

    console.log(`[GRANT-POOLING] Team formed (${team.teamMembers.length + 1} members)`);
    console.log(`[GRANT-POOLING] Proposal strength: ${team.estimatedProposalStrength}%`);

    // 3. Estimate win probability
    const winProbability = this.estimateWinProbability(team, grant);

    // 4. Create bid
    const bid: PooledBid = {
      id: `bid_${Date.now()}`,
      grantId: grant.id,
      team,
      proposalSummary: this.generateProposalSummary(team, grant),
      estimatedWinProbability: winProbability,
      pricePoint: this.calculatePricePoint(grant, team),
      status: 'draft',
    };

    // 5. Auto-submit if configured and strong enough
    if (this.config.autoSubmitBids && winProbability >= this.config.estimatedWinThreshold) {
      await this.submitBid(bid);
    }

    return { grant, analysis, team, bid };
  }

  /**
   * Estimate win probability
   */
  private estimateWinProbability(team: any, grant: Grant): number {
    let probability = team.estimatedProposalStrength;

    // Adjust for skill gaps
    const gapPenalty = (team.skillsGaps.length / grant.requirements.length) * 20;
    probability -= gapPenalty;

    // Adjust for competition (assumed)
    const competitionFactor = 0.85; // Assume 85% of proposals win if submitted
    probability *= competitionFactor;

    return Math.max(0, Math.min(100, probability));
  }

  /**
   * Generate proposal summary
   */
  private generateProposalSummary(team: any, grant: Grant): string {
    return `
Pooled Proposal for: ${grant.title}
Team Lead: ${team.leadAgent.name}
Team Size: ${team.teamMembers.length + 1}
Combined Experience: ${team.teamMembers.reduce((sum, m) => sum + m.experience, team.leadAgent.experience)} years
Success Rate: ${team.teamMembers.reduce((sum, m) => sum + m.successRate, team.leadAgent.successRate) / (team.teamMembers.length + 1)}%
Budget: $${team.pooledBudget}
    `.trim();
  }

  /**
   * Calculate price point for bid
   */
  private calculatePricePoint(grant: Grant, team: any): number {
    // Price at 85% of grant amount (competitive but profitable)
    return grant.amount * 0.85;
  }

  /**
   * Submit bid
   */
  async submitBid(bid: PooledBid): Promise<void> {
    bid.status = 'submitted';
    bid.submittedAt = new Date();
    this.submittedBids.set(bid.id, bid);

    console.log(`[GRANT-POOLING] Bid submitted: ${bid.id}`);
    console.log(`[GRANT-POOLING] Price: $${bid.pricePoint}`);
    console.log(`[GRANT-POOLING] Win probability: ${bid.estimatedWinProbability}%`);
  }

  /**
   * Record grant win
   */
  recordWin(bidId: string, amountAwarded: number, startDate: Date, endDate: Date): GrantWinRecord {
    const bid = this.submittedBids.get(bidId);
    if (!bid) {
      throw new Error(`Bid not found: ${bidId}`);
    }

    // Calculate revenue split (proportional to team member contribution)
    const revenueSplit = new Map<string, number>();
    const teamSize = bid.team.teamMembers.length + 1;
    const perAgentAmount = amountAwarded / teamSize;

    revenueSplit.set(bid.team.leadAgent.agentId, perAgentAmount);
    bid.team.teamMembers.forEach(m => {
      revenueSplit.set(m.agentId, perAgentAmount);
    });

    const record: GrantWinRecord = {
      id: `win_${Date.now()}`,
      grantId: bid.grantId,
      bidId,
      team: bid.team,
      amountAwarded,
      awardedAt: new Date(),
      startDate,
      endDate,
      revenueSplit,
      status: 'awarded',
    };

    this.wonGrants.set(record.id, record);

    console.log(`[GRANT-POOLING] Grant WON: ${amountAwarded}`);
    console.log(`[GRANT-POOLING] Per agent share: $${perAgentAmount}`);

    // Update agent treasury (in production)
    revenueSplit.forEach((amount, agentId) => {
      const agent = this.agents.get(agentId);
      if (agent) {
        agent.availableFunds += amount;
        console.log(`[GRANT-POOLING] Agent ${agent.name} receives: $${amount}`);
      }
    });

    bid.status = 'won';

    return record;
  }

  /**
   * Get pooling metrics
   */
  getMetrics(): PoolingMetrics {
    const analyzed = Array.from(this.analyzedGrants.values());
    const poolable = analyzed.filter(g => g.isPoolable);
    const submitted = Array.from(this.submittedBids.values());
    const won = Array.from(this.wonGrants.values());

    const totalRevenuePooled = won.reduce((sum, w) => sum + w.amountAwarded, 0);
    const avgTeamSize = this.formedTeams.size > 0
      ? Array.from(this.formedTeams.values()).reduce((sum, t) => sum + (t.teamMembers.length + 1), 0) /
        this.formedTeams.size
      : 0;

    const skillsInDemand = this.analyzeSkillDemand(analyzed);

    return {
      totalGrantsAnalyzed: analyzed.length,
      poolableGrants: poolable.length,
      teamsFormed: this.formedTeams.size,
      bidsSubmitted: submitted.length,
      bidsWon: won.length,
      winRate: submitted.length > 0 ? (won.length / submitted.length) * 100 : 0,
      totalRevenuePooled,
      averageTeamSize: Math.round(avgTeamSize * 100) / 100,
      skillsInDemand,
    };
  }

  /**
   * Analyze which skills are most in demand
   */
  private analyzeSkillDemand(grants: PoolableGrant[]): string[] {
    const skillCount: Record<string, number> = {};

    grants.forEach(g => {
      g.grant.requirements.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });

    return Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill]) => skill);
  }

  /**
   * Export state
   */
  getState(): any {
    return {
      analyzedGrants: Array.from(this.analyzedGrants.values()),
      formedTeams: Array.from(this.formedTeams.values()),
      submittedBids: Array.from(this.submittedBids.values()),
      wonGrants: Array.from(this.wonGrants.values()),
      metrics: this.getMetrics(),
    };
  }
}

export { PoolDetector, TeamAssembly };

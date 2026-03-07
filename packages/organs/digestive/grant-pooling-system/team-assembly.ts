// GrantPoolingSystem - Team Assembly

import { Grant, AgentCapability, AgentTeam, PoolableGrant } from './types';

export class TeamAssembly {
  /**
   * Assemble optimal team for a grant
   */
  assembleTeam(grant: Grant, availableAgents: AgentCapability[], teamSize: number): AgentTeam {
    // 1. Find lead agent (highest success rate + capacity)
    const leadAgent = this.selectLeadAgent(grant, availableAgents);

    // 2. Find team members to fill skill gaps
    const teamMembers = this.selectTeamMembers(grant, availableAgents, leadAgent, teamSize - 1);

    // 3. Calculate team metrics
    const allMembers = [leadAgent, ...teamMembers];
    const skillsCovered = this.calculateCoveredSkills(grant, allMembers);
    const skillsGaps = this.calculateSkillGaps(grant, skillsCovered);
    const proposalStrength = this.estimateProposalStrength(grant, allMembers);
    const totalCapacity = allMembers.reduce((sum, a) => sum + a.capacity, 0) / allMembers.length;
    const pooledBudget = allMembers.reduce((sum, a) => sum + a.availableFunds, 0);

    return {
      id: `team_${Date.now()}`,
      grantId: grant.id,
      leadAgent,
      teamMembers,
      skillsCovered,
      skillsGaps,
      estimatedProposalStrength: proposalStrength,
      totalTeamCapacity: Math.round(totalCapacity),
      pooledBudget,
    };
  }

  /**
   * Select lead agent
   */
  private selectLeadAgent(grant: Grant, agents: AgentCapability[]): AgentCapability {
    // Score agents
    const scored = agents
      .filter(a => a.capacity < 80) // Not too busy
      .map(a => ({
        agent: a,
        score: this.scoreAgent(a, grant),
      }))
      .sort((a, b) => b.score - a.score);

    return scored.length > 0 ? scored[0].agent : agents[0];
  }

  /**
   * Select team members
   */
  private selectTeamMembers(
    grant: Grant,
    agents: AgentCapability[],
    leadAgent: AgentCapability,
    memberCount: number
  ): AgentCapability[] {
    const remaining = agents.filter(a => a.agentId !== leadAgent.agentId);

    const scored = remaining
      .filter(a => a.capacity < 80)
      .map(a => ({
        agent: a,
        score: this.scoreAgent(a, grant),
      }))
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, memberCount).map(s => s.agent);
  }

  /**
   * Score agent fit for grant
   */
  private scoreAgent(agent: AgentCapability, grant: Grant): number {
    let score = 0;

    // Skill match (50%)
    const matchedSkills = agent.skills.filter(s => grant.requirements.includes(s)).length;
    const skillScore = (matchedSkills / Math.max(grant.requirements.length, 1)) * 100;
    score += skillScore * 0.5;

    // Success rate (30%)
    score += agent.successRate * 0.3;

    // Capacity (20%)
    const capacityScore = (100 - agent.capacity) * 1; // More capacity = better
    score += capacityScore * 0.2;

    return score;
  }

  /**
   * Calculate which skills are covered by team
   */
  private calculateCoveredSkills(grant: Grant, team: AgentCapability[]): string[] {
    const allTeamSkills = new Set<string>();
    team.forEach(a => a.skills.forEach(s => allTeamSkills.add(s)));

    return grant.requirements.filter(req => allTeamSkills.has(req));
  }

  /**
   * Calculate skill gaps
   */
  private calculateSkillGaps(grant: Grant, coveredSkills: string[]): string[] {
    return grant.requirements.filter(req => !coveredSkills.includes(req));
  }

  /**
   * Estimate proposal strength (0-100)
   */
  private estimateProposalStrength(grant: Grant, team: AgentCapability[]): number {
    let strength = 0;

    // Team experience (40%)
    const avgExperience = team.reduce((sum, a) => sum + a.experience, 0) / team.length;
    strength += Math.min(100, (avgExperience / 20) * 100) * 0.4; // Max 20 years = 100

    // Team success rate (30%)
    const avgSuccessRate = team.reduce((sum, a) => sum + a.successRate, 0) / team.length;
    strength += avgSuccessRate * 0.3;

    // Skill coverage (20%)
    const skillCoverageRate = (team.length / 4) * 100; // Assuming 4-agent team is ideal
    strength += Math.min(100, skillCoverageRate) * 0.2;

    // Team size bonus (10%)
    const teamSizeBonus = team.length >= 3 ? 10 : team.length === 2 ? 5 : 0;
    strength += teamSizeBonus * 0.1;

    return Math.round(strength * 100) / 100;
  }

  /**
   * Get team summary
   */
  getTeamSummary(team: AgentTeam): string {
    const members = [team.leadAgent, ...team.teamMembers];
    const memberNames = members.map(m => m.name).join(', ');

    return `
Team for: ${team.grantId}
Lead: ${team.leadAgent.name}
Members: ${memberNames} (${members.length} total)
Skills Covered: ${team.skillsCovered.join(', ')}
Skill Gaps: ${team.skillsGaps.length > 0 ? team.skillsGaps.join(', ') : 'None'}
Proposal Strength: ${team.estimatedProposalStrength}%
Pooled Budget: $${team.pooledBudget}
    `.trim();
  }
}

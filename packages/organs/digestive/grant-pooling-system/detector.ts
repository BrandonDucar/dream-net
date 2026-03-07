// GrantPoolingSystem - Pool Detector

import { Grant, PoolableGrant, PoolingConfig } from './types';

export class PoolDetector {
  private config: PoolingConfig;

  constructor(config: PoolingConfig) {
    this.config = config;
  }

  /**
   * Analyze if grant is poolable (suitable for multi-agent bid)
   */
  analyzeGrant(grant: Grant): PoolableGrant {
    const poolabilityScore = this.calculatePoolability(grant);
    const isPoolable = poolabilityScore.score > 60;

    return {
      grant,
      isPoolable,
      reason: poolabilityScore.reason,
      estimatedTeamSize: this.estimateTeamSize(grant),
      skillGapsToFill: this.identifySkillGaps(grant),
    };
  }

  /**
   * Calculate poolability score
   */
  private calculatePoolability(grant: Grant): { score: number; reason: string } {
    let score = 0;
    const factors: string[] = [];

    // Factor 1: Amount (50% weight)
    if (grant.amount > 500000) {
      score += 50;
      factors.push('Large grant suitable for pooling');
    } else if (grant.amount > 250000) {
      score += 30;
      factors.push('Medium grant - pooling beneficial');
    }

    // Factor 2: Multi-contractor allowed (30% weight)
    if (grant.isMultiContractor) {
      score += 30;
      factors.push('Multi-contractor format');
    }

    // Factor 3: Complexity (20% weight)
    const skillCount = grant.requirements.length;
    if (skillCount > 5) {
      score += 20;
      factors.push(`Complex requirements (${skillCount} skills)`);
    } else if (skillCount > 3) {
      score += 10;
    }

    const reason = factors.join('; ');
    return { score: Math.min(100, score), reason };
  }

  /**
   * Estimate optimal team size
   */
  private estimateTeamSize(grant: Grant): number {
    const skillCount = grant.requirements.length;

    if (skillCount <= 2) return 1;
    if (skillCount <= 4) return 2;
    if (skillCount <= 6) return 3;
    if (skillCount <= 8) return 4;
    return Math.min(5, this.config.maxTeamSize);
  }

  /**
   * Identify skill gaps
   */
  private identifySkillGaps(grant: Grant): string[] {
    // In production, would query agent database to see which skills are rare
    return grant.requirements.slice(Math.max(0, grant.requirements.length - 2));
  }

  /**
   * Batch analyze multiple grants
   */
  analyzeGrantBatch(grants: Grant[]): {
    poolable: PoolableGrant[];
    soloOnly: PoolableGrant[];
  } {
    const results = grants.map(g => this.analyzeGrant(g));

    return {
      poolable: results.filter(r => r.isPoolable),
      soloOnly: results.filter(r => !r.isPoolable),
    };
  }
}

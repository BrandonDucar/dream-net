/**
 * Opportunity Finder
 * Identify opportunities from company analyses
 */

import type { CompanyAnalysis, Opportunity } from "./types";
import { SpiderWebCore } from "@dreamnet/spider-web-core";

export class OpportunityFinder {
  private opportunities: Map<string, Opportunity[]> = new Map();

  /**
   * Find opportunities from company analyses in a vertical
   */
  async findOpportunities(
    vertical: string,
    analyses: CompanyAnalysis[]
  ): Promise<Opportunity[]> {
    const allOpportunities: Opportunity[] = [];

    try {
      // 1. Aggregate opportunities from all analyses
      for (const analysis of analyses) {
        allOpportunities.push(...analysis.opportunities);
      }

      // 2. Identify cross-company patterns
      const patternOpportunities = this.findPatternOpportunities(analyses);
      allOpportunities.push(...patternOpportunities);

      // 3. Identify market-wide opportunities
      const marketOpportunities = this.findMarketOpportunities(vertical, analyses);
      allOpportunities.push(...marketOpportunities);

      // 4. Prioritize opportunities
      const prioritized = this.prioritizeOpportunities(allOpportunities);

      // Store opportunities by vertical
      this.opportunities.set(vertical, prioritized);

      // Emit opportunities found fly (non-blocking)
      try {
        SpiderWebCore.createFly(
          "competitive-intelligence",
          "opportunity-finder",
          {
            vertical,
            opportunitiesFound: prioritized.length,
            highPriority: prioritized.filter(o => o.priority === "high").length,
          },
          "medium",
          false
        );
      } catch (error) {
        // SpiderWebCore not available, continue without error
      }

      return prioritized;
    } catch (error: any) {
      console.error(`[OpportunityFinder] Error finding opportunities for ${vertical}:`, error.message);
      return [];
    }
  }

  /**
   * Find pattern-based opportunities (common across multiple companies)
   */
  private findPatternOpportunities(analyses: CompanyAnalysis[]): Opportunity[] {
    const opportunities: Opportunity[] = [];

    // Find common missing features across companies
    const missingFeatureCounts = new Map<string, number>();
    for (const analysis of analyses) {
      for (const feature of analysis.missingFeatures) {
        missingFeatureCounts.set(feature, (missingFeatureCounts.get(feature) || 0) + 1);
      }
    }

    // If multiple companies are missing the same feature, it's a high-value opportunity
    for (const [feature, count] of missingFeatureCounts.entries()) {
      if (count >= 2) {
        opportunities.push({
          id: `opp-pattern-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          type: "feature",
          title: `Universal ${feature} gap`,
          description: `${count} competitors lack ${feature}, high-value opportunity`,
          priority: "high",
          effort: "medium",
          impact: "high",
          source: "pattern-analysis",
        });
      }
    }

    // Find common weaknesses
    const weaknessCounts = new Map<string, number>();
    for (const analysis of analyses) {
      for (const weakness of analysis.weaknesses) {
        weaknessCounts.set(weakness, (weaknessCounts.get(weakness) || 0) + 1);
      }
    }

    for (const [weakness, count] of weaknessCounts.entries()) {
      if (count >= 2) {
        opportunities.push({
          id: `opp-weakness-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          type: "user-pain-point",
          title: `Address ${weakness} pain point`,
          description: `${count} competitors share ${weakness} weakness, opportunity to solve`,
          priority: count >= 3 ? "high" : "medium",
          effort: "medium",
          impact: "high",
          source: "pattern-analysis",
        });
      }
    }

    return opportunities;
  }

  /**
   * Find market-wide opportunities
   */
  private findMarketOpportunities(
    vertical: string,
    analyses: CompanyAnalysis[]
  ): Opportunity[] {
    const opportunities: Opportunity[] = [];

    // Analyze market trends
    const avgRevenue = analyses
      .filter(a => a.revenue)
      .reduce((sum, a) => sum + (a.revenue || 0), 0) / analyses.length;

    const avgGrowth = analyses
      .filter(a => a.growthRate)
      .reduce((sum, a) => sum + (a.growthRate || 0), 0) / analyses.length;

    // If market is growing, opportunity to enter
    if (avgGrowth && avgGrowth > 20) {
      opportunities.push({
        id: `opp-market-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        type: "market",
        title: `High-growth ${vertical} market`,
        description: `Market growing at ${avgGrowth.toFixed(1)}%, opportunity to capture market share`,
        priority: "high",
        effort: "high",
        impact: "high",
        source: "market-analysis",
      });
    }

    // If market is fragmented (many small players), opportunity to consolidate
    if (analyses.length > 5 && avgRevenue && avgRevenue < 10000000) {
      opportunities.push({
        id: `opp-consolidation-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        type: "market",
        title: `Fragmented ${vertical} market`,
        description: `Market is fragmented with many small players, opportunity to consolidate`,
        priority: "medium",
        effort: "high",
        impact: "high",
        source: "market-analysis",
      });
    }

    return opportunities;
  }

  /**
   * Prioritize opportunities by impact and effort
   */
  private prioritizeOpportunities(opportunities: Opportunity[]): Opportunity[] {
    return opportunities.sort((a, b) => {
      // Priority order: high > medium > low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by impact
      const impactOrder = { high: 3, medium: 2, low: 1 };
      const impactDiff = impactOrder[b.impact] - impactOrder[a.impact];
      if (impactDiff !== 0) return impactDiff;

      // Finally by effort (lower effort = higher priority)
      const effortOrder = { low: 3, medium: 2, high: 1 };
      return effortOrder[b.effort] - effortOrder[a.effort];
    });
  }

  /**
   * Get opportunities for a vertical
   */
  getOpportunities(vertical: string): Opportunity[] {
    return this.opportunities.get(vertical) || [];
  }

  /**
   * Get all opportunities
   */
  getAllOpportunities(): Opportunity[] {
    return Array.from(this.opportunities.values()).flat();
  }
}


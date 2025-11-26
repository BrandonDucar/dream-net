/**
 * Roadmap Generator
 * Generate innovation roadmap from opportunities
 */

import type { Opportunity } from "./types";
import { SpiderWebCore } from "@dreamnet/spider-web-core";

export interface InnovationRoadmap {
  id: string;
  vertical: string;
  generatedAt: number;
  prioritizedFeatures: Array<{
    feature: string;
    rationale: string;
    priority: "low" | "medium" | "high" | "critical";
    effort: "low" | "medium" | "high";
    impact: "low" | "medium" | "high";
    timeline: string;
  }>;
  technologyAdoption: Array<{
    technology: string;
    rationale: string;
    timeline: string;
  }>;
  marketEntryStrategy: string;
  differentiationStrategy: string;
}

export class RoadmapGenerator {
  private roadmaps: Map<string, InnovationRoadmap> = new Map();

  /**
   * Generate innovation roadmap from opportunities
   */
  async generateRoadmap(
    vertical: string,
    opportunities: Opportunity[]
  ): Promise<InnovationRoadmap> {
    const roadmap: InnovationRoadmap = {
      id: `roadmap-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      vertical,
      generatedAt: Date.now(),
      prioritizedFeatures: [],
      technologyAdoption: [],
      marketEntryStrategy: "",
      differentiationStrategy: "",
    };

    try {
      // 1. Prioritize features from opportunities
      roadmap.prioritizedFeatures = this.prioritizeFeatures(opportunities);

      // 2. Identify technology adoption opportunities
      roadmap.technologyAdoption = this.identifyTechnologyAdoption(opportunities);

      // 3. Generate market entry strategy
      roadmap.marketEntryStrategy = this.generateMarketEntryStrategy(vertical, opportunities);

      // 4. Generate differentiation strategy
      roadmap.differentiationStrategy = this.generateDifferentiationStrategy(opportunities);

      // Store roadmap
      this.roadmaps.set(vertical, roadmap);

      // Emit roadmap generation fly (non-blocking)
      try {
        SpiderWebCore.createFly(
          "competitive-intelligence",
          "roadmap-generator",
          {
            vertical,
            roadmapId: roadmap.id,
            featuresPrioritized: roadmap.prioritizedFeatures.length,
            technologiesIdentified: roadmap.technologyAdoption.length,
          },
          "medium",
          false
        );
      } catch (error) {
        // SpiderWebCore not available, continue without error
      }

      return roadmap;
    } catch (error: any) {
      console.error(`[RoadmapGenerator] Error generating roadmap for ${vertical}:`, error.message);
      
      try {
        SpiderWebCore.createFly(
          "competitive-intelligence",
          "roadmap-generator",
          {
            vertical,
            roadmapGenerated: false,
            error: error.message,
          },
          "high",
          false
        );
      } catch (flyError) {
        // SpiderWebCore not available, continue without error
      }

      return roadmap;
    }
  }

  /**
   * Prioritize features from opportunities
   */
  private prioritizeFeatures(opportunities: Opportunity[]): InnovationRoadmap["prioritizedFeatures"] {
    const features: InnovationRoadmap["prioritizedFeatures"] = [];

    // Group opportunities by type
    const featureOpportunities = opportunities.filter(o => o.type === "feature");
    const techOpportunities = opportunities.filter(o => o.type === "technology");

    // Add feature opportunities
    for (const opp of featureOpportunities) {
      features.push({
        feature: opp.title,
        rationale: opp.description,
        priority: opp.priority,
        effort: opp.effort,
        impact: opp.impact,
        timeline: this.estimateTimeline(opp.effort, opp.impact),
      });
    }

    // Add technology opportunities as technology adoption
    for (const opp of techOpportunities) {
      features.push({
        feature: opp.title,
        rationale: opp.description,
        priority: opp.priority,
        effort: opp.effort,
        impact: opp.impact,
        timeline: this.estimateTimeline(opp.effort, opp.impact),
      });
    }

    // Sort by priority
    return features.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Identify technology adoption opportunities
   */
  private identifyTechnologyAdoption(opportunities: Opportunity[]): InnovationRoadmap["technologyAdoption"] {
    const technologies: InnovationRoadmap["technologyAdoption"] = [];

    const techOpportunities = opportunities.filter(o => o.type === "technology");
    for (const opp of techOpportunities) {
      technologies.push({
        technology: opp.title,
        rationale: opp.description,
        timeline: this.estimateTimeline(opp.effort, opp.impact),
      });
    }

    return technologies;
  }

  /**
   * Generate market entry strategy
   */
  private generateMarketEntryStrategy(vertical: string, opportunities: Opportunity[]): string {
    const marketOpportunities = opportunities.filter(o => o.type === "market");
    
    if (marketOpportunities.length > 0) {
      return `Enter ${vertical} market by addressing ${marketOpportunities.length} identified market opportunities. Focus on high-growth segments and underserved niches.`;
    }

    return `Enter ${vertical} market through differentiated feature set and superior technology stack. Target early adopters and build from there.`;
  }

  /**
   * Generate differentiation strategy
   */
  private generateDifferentiationStrategy(opportunities: Opportunity[]): string {
    const featureGaps = opportunities.filter(o => o.type === "feature");
    const painPoints = opportunities.filter(o => o.type === "user-pain-point");

    const strategies: string[] = [];

    if (featureGaps.length > 0) {
      strategies.push(`Differentiate through ${featureGaps.length} unique features that competitors lack.`);
    }

    if (painPoints.length > 0) {
      strategies.push(`Solve ${painPoints.length} key pain points that competitors fail to address.`);
    }

    if (strategies.length === 0) {
      return "Differentiate through superior user experience, faster innovation cycles, and better technology stack.";
    }

    return strategies.join(" ");
  }

  /**
   * Estimate timeline based on effort and impact
   */
  private estimateTimeline(effort: Opportunity["effort"], impact: Opportunity["impact"]): string {
    // High impact, low effort = quick win (1-2 months)
    if (impact === "high" && effort === "low") {
      return "1-2 months";
    }

    // High impact, medium effort = important project (3-6 months)
    if (impact === "high" && effort === "medium") {
      return "3-6 months";
    }

    // High impact, high effort = major initiative (6-12 months)
    if (impact === "high" && effort === "high") {
      return "6-12 months";
    }

    // Medium impact = medium timeline
    if (impact === "medium") {
      return effort === "low" ? "1-3 months" : effort === "medium" ? "3-6 months" : "6-9 months";
    }

    // Low impact = lower priority
    return "6-12 months";
  }

  /**
   * Get roadmap for a vertical
   */
  getRoadmap(vertical: string): InnovationRoadmap | undefined {
    return this.roadmaps.get(vertical);
  }

  /**
   * Get all roadmaps
   */
  getAllRoadmaps(): InnovationRoadmap[] {
    return Array.from(this.roadmaps.values());
  }
}


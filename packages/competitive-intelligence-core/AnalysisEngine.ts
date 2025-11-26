/**
 * Analysis Engine
 * Product features, technology stack, market position, financial health analysis
 */

import type { Company, CompanyAnalysis, Opportunity } from "./types";
import { SpiderWebCore } from "@dreamnet/spider-web-core";

export class AnalysisEngine {
  private analyses: Map<string, CompanyAnalysis> = new Map();

  /**
   * Analyze a company based on research data
   */
  async analyzeCompany(company: Company, researchData?: any): Promise<CompanyAnalysis> {
    const analysis: CompanyAnalysis = {
      companyId: company.id,
      analyzedAt: Date.now(),
      products: [],
      features: [],
      missingFeatures: [],
      technologies: [],
      infrastructure: [],
      competitors: [],
      patents: 0,
      newProducts: [],
      acquisitions: [],
      partnerships: [],
      pivots: [],
      weaknesses: [],
      gaps: [],
      roadmaps: [],
      announcements: [],
      hiringTrends: [],
      opportunities: [],
    };

    try {
      // 1. Analyze product features from website/research
      if (researchData?.description) {
        const features = this.extractFeatures(researchData.description);
        analysis.features = features;
      }

      // 2. Analyze technology stack (from website, job postings, etc.)
      const techStack = this.analyzeTechnologyStack(company, researchData);
      analysis.technologies = techStack.technologies;
      analysis.infrastructure = techStack.infrastructure;

      // 3. Analyze market position
      const marketPosition = this.analyzeMarketPosition(company, researchData);
      analysis.marketShare = marketPosition.marketShare;
      analysis.growthRate = marketPosition.growthRate;
      analysis.competitors = marketPosition.competitors;

      // 4. Analyze financial health
      if (company.revenue || company.marketCap) {
        analysis.revenue = company.revenue;
        analysis.profitability = this.calculateProfitability(company);
        analysis.funding = company.marketCap; // Simplified
      }

      // 5. Identify weaknesses and gaps
      const weaknesses = this.identifyWeaknesses(company, analysis);
      analysis.weaknesses = weaknesses.weaknesses;
      analysis.gaps = weaknesses.gaps;
      analysis.missingFeatures = weaknesses.missingFeatures;

      // 6. Identify opportunities
      const opportunities = this.identifyOpportunities(analysis);
      analysis.opportunities = opportunities;

      // Store analysis
      this.analyses.set(company.id, analysis);

      // Emit analysis completion fly (non-blocking)
      try {
        SpiderWebCore.createFly(
          "competitive-intelligence",
          "analysis-engine",
          {
            companyId: company.id,
            companyName: company.name,
            analysisCompleted: true,
            opportunitiesFound: opportunities.length,
            weaknessesFound: weaknesses.weaknesses.length,
          },
          "medium",
          false
        );
      } catch (error) {
        // SpiderWebCore not available, continue without error
      }

      return analysis;
    } catch (error: any) {
      console.error(`[AnalysisEngine] Error analyzing company ${company.name}:`, error.message);
      
      try {
        SpiderWebCore.createFly(
          "competitive-intelligence",
          "analysis-engine",
          {
            companyId: company.id,
            companyName: company.name,
            analysisCompleted: false,
            error: error.message,
          },
          "high",
          false
        );
      } catch (flyError) {
        // SpiderWebCore not available, continue without error
      }

      return analysis;
    }
  }

  /**
   * Extract features from company description
   */
  private extractFeatures(description: string): string[] {
    // Simplified feature extraction (in production would use NLP)
    const features: string[] = [];
    const featureKeywords = [
      "api", "sdk", "dashboard", "analytics", "automation", "integration",
      "real-time", "scalable", "secure", "cloud", "mobile", "web",
      "ai", "machine learning", "blockchain", "crypto", "payment",
    ];

    const lowerDesc = description.toLowerCase();
    for (const keyword of featureKeywords) {
      if (lowerDesc.includes(keyword)) {
        features.push(keyword);
      }
    }

    return features;
  }

  /**
   * Analyze technology stack
   */
  private analyzeTechnologyStack(company: Company, researchData?: any): {
    technologies: string[];
    infrastructure: string[];
  } {
    const technologies: string[] = [];
    const infrastructure: string[] = [];

    // In production, this would analyze:
    // - Job postings for tech stack
    // - GitHub repositories
    // - Stack Overflow mentions
    // - Technology blog posts

    // For now, infer from company description/vertical
    if (company.description) {
      const desc = company.description.toLowerCase();
      
      if (desc.includes("blockchain") || desc.includes("crypto")) {
        technologies.push("blockchain", "web3", "smart-contracts");
      }
      if (desc.includes("ai") || desc.includes("machine learning")) {
        technologies.push("ai", "ml", "neural-networks");
      }
      if (desc.includes("cloud")) {
        infrastructure.push("cloud", "aws", "azure", "gcp");
      }
    }

    return { technologies, infrastructure };
  }

  /**
   * Analyze market position
   */
  private analyzeMarketPosition(company: Company, researchData?: any): {
    marketShare?: number;
    growthRate?: number;
    competitors: string[];
  } {
    // In production, this would:
    // - Analyze market research reports
    // - Compare with competitors
    // - Calculate market share from revenue data
    // - Track growth trends

    return {
      competitors: [], // Would be populated from market research
    };
  }

  /**
   * Calculate profitability (simplified)
   */
  private calculateProfitability(company: Company): number | undefined {
    // In production, would calculate from financial statements
    // For now, return undefined
    return undefined;
  }

  /**
   * Identify weaknesses and gaps
   */
  private identifyWeaknesses(company: Company, analysis: CompanyAnalysis): {
    weaknesses: string[];
    gaps: string[];
    missingFeatures: string[];
  } {
    const weaknesses: string[] = [];
    const gaps: string[] = [];
    const missingFeatures: string[] = [];

    // Compare with DreamNet capabilities
    const dreamNetFeatures = [
      "multi-agent-system",
      "biomimetic-architecture",
      "blockchain-integration",
      "real-time-data-collection",
      "competitive-intelligence",
      "browser-automation",
      "market-data-spikes",
    ];

    // Find missing features
    for (const feature of dreamNetFeatures) {
      if (!analysis.features.some(f => f.toLowerCase().includes(feature))) {
        missingFeatures.push(feature);
      }
    }

    // Identify gaps based on analysis
    if (analysis.technologies.length === 0) {
      gaps.push("technology-stack-unknown");
    }
    if (!analysis.revenue && !analysis.funding) {
      gaps.push("financial-data-unavailable");
    }
    if (analysis.competitors.length === 0) {
      gaps.push("market-position-unclear");
    }

    return { weaknesses, gaps, missingFeatures };
  }

  /**
   * Identify opportunities from analysis
   */
  private identifyOpportunities(analysis: CompanyAnalysis): Opportunity[] {
    const opportunities: Opportunity[] = [];

    // 1. Feature gap opportunities
    for (const missingFeature of analysis.missingFeatures) {
      opportunities.push({
        id: `opp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        type: "feature",
        title: `Add ${missingFeature} capability`,
        description: `Competitor lacks ${missingFeature}, opportunity to differentiate`,
        priority: "high",
        effort: "medium",
        impact: "high",
        source: analysis.companyId,
      });
    }

    // 2. Technology opportunities
    if (analysis.technologies.length < 5) {
      opportunities.push({
        id: `opp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        type: "technology",
        title: "Modern technology stack advantage",
        description: "Competitor has limited tech stack, opportunity to leverage modern technologies",
        priority: "medium",
        effort: "low",
        impact: "medium",
        source: analysis.companyId,
      });
    }

    // 3. Market segment opportunities
    if (analysis.marketShare && analysis.marketShare < 10) {
      opportunities.push({
        id: `opp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        type: "market",
        title: "Underserved market segment",
        description: "Competitor has small market share, opportunity to capture market",
        priority: "high",
        effort: "high",
        impact: "high",
        source: analysis.companyId,
      });
    }

    return opportunities;
  }

  /**
   * Get analysis for a company
   */
  getAnalysis(companyId: string): CompanyAnalysis | undefined {
    return this.analyses.get(companyId);
  }

  /**
   * Get all analyses
   */
  getAllAnalyses(): CompanyAnalysis[] {
    return Array.from(this.analyses.values());
  }
}


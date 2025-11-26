/**
 * Competitive Intelligence Core
 * Research agent, analysis engine, opportunity finder, and roadmap generator
 */

export type { Company, CompanyAnalysis, Opportunity, ResearchTask } from "./types";
export type { InnovationRoadmap } from "./RoadmapGenerator";

export { ResearchAgent } from "./ResearchAgent";
export { AnalysisEngine } from "./AnalysisEngine";
export { OpportunityFinder } from "./OpportunityFinder";
export { RoadmapGenerator } from "./RoadmapGenerator";

import { ResearchAgent } from "./ResearchAgent";
import { AnalysisEngine } from "./AnalysisEngine";
import { OpportunityFinder } from "./OpportunityFinder";
import { RoadmapGenerator } from "./RoadmapGenerator";
import type { Company, CompanyAnalysis, Opportunity } from "./types";
import type { InnovationRoadmap } from "./RoadmapGenerator";

export class CompetitiveIntelligenceCore {
  private researchAgent: ResearchAgent;
  private analysisEngine: AnalysisEngine;
  private opportunityFinder: OpportunityFinder;
  private roadmapGenerator: RoadmapGenerator;
  private companies: Map<string, Company> = new Map();

  constructor() {
    this.researchAgent = new ResearchAgent();
    this.analysisEngine = new AnalysisEngine();
    this.opportunityFinder = new OpportunityFinder();
    this.roadmapGenerator = new RoadmapGenerator();
  }

  /**
   * Add or update a company
   */
  addCompany(company: Company): void {
    this.companies.set(company.id, company);
  }

  /**
   * Get a company
   */
  getCompany(companyId: string): Company | undefined {
    return this.companies.get(companyId);
  }

  /**
   * Research a company
   */
  async researchCompany(companyId: string): Promise<Partial<Company>> {
    const company = this.companies.get(companyId);
    if (!company) {
      throw new Error(`Company ${companyId} not found`);
    }

    return await this.researchAgent.researchCompany(company);
  }

  /**
   * Analyze a company
   */
  async analyzeCompany(companyId: string): Promise<CompanyAnalysis | null> {
    const company = this.companies.get(companyId);
    if (!company) {
      throw new Error(`Company ${companyId} not found`);
    }

    // Get research data from cache, or use company description as fallback
    let researchData = this.researchAgent.getResearchCache(`${companyId}:social`);
    if (!researchData && company.description) {
      researchData = { description: company.description };
    }

    return await this.analysisEngine.analyzeCompany(company, researchData);
  }

  /**
   * Find opportunities in a vertical
   */
  async findOpportunities(vertical: string): Promise<Opportunity[]> {
    // Get all companies in this vertical
    const companies = Array.from(this.companies.values()).filter(c => c.vertical === vertical);

    // Analyze all companies
    const analyses: CompanyAnalysis[] = [];
    for (const company of companies) {
      const analysis = await this.analyzeCompany(company.id);
      if (analysis) {
        analyses.push(analysis);
      }
    }

    // Find opportunities from analyses
    return await this.opportunityFinder.findOpportunities(vertical, analyses);
  }

  /**
   * Generate innovation roadmap for a vertical
   */
  async generateRoadmap(vertical: string): Promise<InnovationRoadmap> {
    // Find opportunities first
    const opportunities = await this.findOpportunities(vertical);

    // Generate roadmap from opportunities
    return await this.roadmapGenerator.generateRoadmap(vertical, opportunities);
  }

  /**
   * Get all companies
   */
  getAllCompanies(): Company[] {
    return Array.from(this.companies.values());
  }

  /**
   * Get companies by vertical
   */
  getCompaniesByVertical(vertical: string): Company[] {
    return Array.from(this.companies.values()).filter(c => c.vertical === vertical);
  }
}

export default CompetitiveIntelligenceCore;


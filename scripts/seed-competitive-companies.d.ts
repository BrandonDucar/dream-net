/**
 * Seed Competitive Intelligence Core with all companies to research
 * This populates the database with companies across all verticals
 */
import { CompetitiveIntelligenceCore } from "@dreamnet/competitive-intelligence-core";
import type { Company } from "@dreamnet/competitive-intelligence-core";
declare const COMPANIES: Company[];
declare function seedCompanies(): Promise<CompetitiveIntelligenceCore>;
export { seedCompanies, COMPANIES };

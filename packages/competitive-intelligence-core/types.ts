/**
 * Competitive Intelligence Core Types
 */

export interface Company {
  id: string;
  name: string;
  vertical: string;
  website: string;
  description: string;
  founded?: number;
  headquarters?: string;
  employees?: number;
  revenue?: number;
  marketCap?: number;
  status: "active" | "researching" | "analyzed";
  lastUpdated: number;
}

export interface CompanyAnalysis {
  companyId: string;
  analyzedAt: number;
  
  // Product Features
  products: string[];
  features: string[];
  missingFeatures: string[];
  
  // Technology Stack
  technologies: string[];
  infrastructure: string[];
  
  // Market Position
  marketShare?: number;
  growthRate?: number;
  competitors: string[];
  
  // Financial Health
  revenue?: number;
  profitability?: number;
  funding?: number;
  fundingRounds?: number;
  
  // Innovation Pipeline
  patents: number;
  rndSpending?: number;
  newProducts: string[];
  
  // Strategic Direction
  acquisitions: string[];
  partnerships: string[];
  pivots: string[];
  
  // Weaknesses
  weaknesses: string[];
  gaps: string[];
  
  // Future Plans
  roadmaps: string[];
  announcements: string[];
  hiringTrends: string[];
  
  // Opportunities
  opportunities: Opportunity[];
}

export interface Opportunity {
  id: string;
  type: "feature" | "technology" | "market" | "pricing" | "user-pain-point";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  impact: "high" | "medium" | "low";
  source: string; // Which company/analysis this came from
}

export interface ResearchTask {
  id: string;
  companyId: string;
  type: "web-scrape" | "patent-search" | "financial-analysis" | "social-monitor" | "news-aggregate";
  status: "pending" | "in-progress" | "completed" | "failed";
  priority: "high" | "medium" | "low";
  createdAt: number;
  completedAt?: number;
  result?: any;
  error?: string;
}


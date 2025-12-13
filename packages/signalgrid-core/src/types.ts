/**
 * SignalGrid Core Types
 * 
 * Intent-driven routing system with geo/SEO awareness
 */

// ============================================================================
// Intent Types
// ============================================================================

export type IntentDomain = 
  | 'content'
  | 'ai_training'
  | 'defi'
  | 'gaming'
  | 'nft'
  | 'social'
  | 'governance'
  | 'infrastructure'
  | 'other';

export type IntentStatus = 
  | 'pending'
  | 'routing'
  | 'assigned'
  | 'in_progress'
  | 'reviewing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface GeoRegion {
  code: string; // ISO country code or region identifier
  name: string;
  language: string; // ISO language code
  timezone?: string;
}

export interface SEOKeywords {
  primary: string[];
  longTail: string[];
  questionPhrases: string[];
  semanticClusters: string[];
}

export interface GeoSEOMetadata {
  regions: GeoRegion[];
  keywords: SEOKeywords;
  targetPersonas?: string[];
  searchIntent?: 'informational' | 'commercial' | 'navigational' | 'transactional';
  contentType?: 'blog' | 'product' | 'social' | 'documentation' | 'other';
}

export interface Intent {
  id: string;
  creatorId: string; // Wallet address or agent ID
  domain: IntentDomain;
  title: string;
  description: string;
  requirements: string[];
  
  // Geo + SEO
  geoSEO: GeoSEOMetadata;
  
  // Routing constraints
  trustTier?: 'public' | 'verified' | 'premium';
  maxCost?: string; // In SHEEP tokens
  deadline?: number; // Unix timestamp
  
  // Output specs
  expectedOutputs: number;
  outputFormat?: 'json' | 'text' | 'markdown' | 'structured';
  qualityThreshold?: number; // 0-1
  
  // Lifecycle
  status: IntentStatus;
  createdAt: number;
  updatedAt: number;
  assignedSolverIds?: string[];
  completedOutputs?: number;
  
  // Metadata
  tags?: string[];
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

// ============================================================================
// Solver Types
// ============================================================================

export type SolverType = 'llm' | 'human' | 'hybrid' | 'specialized';

export interface SolverCapabilities {
  domains: IntentDomain[];
  regions: string[]; // ISO country codes
  languages: string[]; // ISO language codes
  outputFormats: string[];
  maxConcurrentJobs?: number;
}

export interface SolverReputation {
  totalJobs: number;
  completedJobs: number;
  averageQuality: number; // 0-1
  averageLatency: number; // milliseconds
  searchImpactScore?: number; // Based on SearchImpactTracer
  lastUpdated: number;
}

export interface SolverProfile {
  id: string;
  type: SolverType;
  name: string;
  description?: string;
  
  capabilities: SolverCapabilities;
  reputation: SolverReputation;
  
  // Pricing
  basePricePerUnit: string; // SHEEP tokens
  geoSEOPremium?: number; // Multiplier for geo/SEO jobs
  
  // Status
  isActive: boolean;
  currentLoad: number; // 0-1, current jobs / max concurrent
  healthStatus: 'healthy' | 'degraded' | 'offline';
  
  // Metadata
  registeredAt: number;
  lastSeenAt: number;
  metadata?: Record<string, any>;
}

// ============================================================================
// Job Types
// ============================================================================

export type JobStatus = 
  | 'queued'
  | 'assigned'
  | 'processing'
  | 'reviewing'
  | 'approved'
  | 'rejected'
  | 'completed';

export interface Job {
  id: string;
  intentId: string;
  solverId: string;
  
  // Assignment
  assignedAt: number;
  startedAt?: number;
  completedAt?: number;
  
  // Work
  input: any; // Specific work unit from intent
  output?: any;
  status: JobStatus;
  
  // Quality
  qualityScore?: number; // 0-1
  reviewerId?: string;
  reviewNotes?: string;
  
  // Payment
  paymentAmount?: string; // SHEEP tokens
  paidAt?: number;
  
  // Search impact (populated later)
  searchImpact?: {
    publishedAt?: number;
    trafficCount?: number;
    conversionCount?: number;
    revenueShare?: string;
  };
}

  // Metadata
  retryCount: number;
  errorMessage?: string;
}

// ============================================================================
// Routing Types
// ============================================================================

export interface RoutingMatch {
  solverId: string;
  score: number; // 0-1, match quality
  reasons: string[]; // Why this solver matches
  estimatedCost: string;
  estimatedLatency: number; // milliseconds
}

export interface RoutingResult {
  intentId: string;
  matches: RoutingMatch[];
  selectedSolvers: string[];
  routingMetadata: {
    routedAt: number;
    routingStrategy: string;
    totalCandidates: number;
  };
}

// ============================================================================
// Search Impact Types
// ============================================================================

export interface SearchImpactMetrics {
  jobId: string;
  intentId: string;
  solverId: string;
  
  // Publishing
  publishedAt?: number;
  publishedUrl?: string;
  platform?: string;
  
  // Traffic
  impressions?: number;
  clicks?: number;
  ctr?: number; // Click-through rate
  
  // Conversions
  conversions?: number;
  conversionRate?: number;
  revenue?: string; // In USD or native token
  
  // Attribution
  keywordClusters?: string[];
  topPerformingRegions?: string[];
  
  // Calculated
  searchImpactScore: number; // 0-1, composite score
  lastUpdated: number;
}

// ============================================================================
// SignalGrid State Types
// ============================================================================

export interface SignalGridState {
  intents: {
    total: number;
    byStatus: Record<IntentStatus, number>;
    byDomain: Record<IntentDomain, number>;
  };
  solvers: {
    total: number;
    active: number;
    byType: Record<SolverType, number>;
    byRegion: Record<string, number>;
  };
  jobs: {
    total: number;
    byStatus: Record<JobStatus, number>;
    averageLatency: number;
    averageQuality: number;
  };
  demandSupplyGaps: {
    domain: IntentDomain;
    region: string;
    demand: number;
    supply: number;
    gap: number;
  }[];
  topAlphaPockets: {
    domain: IntentDomain;
    region: string;
    opportunityScore: number;
    reason: string;
  }[];
  timestamp: number;
}

// ============================================================================
// Agent Payload Types
// ============================================================================

export interface IntentGridRouterPayload {
  intent: Intent;
  mode?: 'route' | 'validate' | 'classify';
}

export interface GeoSEOAnnotatorPayload {
  intent: Partial<Intent>;
  mode?: 'annotate' | 'rewrite' | 'validate';
}

export interface SolverMeshOrchestratorPayload {
  intentId: string;
  mode?: 'assign' | 'retry' | 'rebalance';
  solverIds?: string[];
}

export interface ResultNormalizerPayload {
  jobId: string;
  rawOutput: any;
  intentId: string;
}

export interface SearchImpactTracerPayload {
  jobId: string;
  publishedUrl?: string;
  metrics?: Partial<SearchImpactMetrics>;
}

export interface GeoComplianceGuardianPayload {
  intent: Intent;
  mode?: 'check' | 'enforce' | 'flag';
}

export interface CitadelLiaisonPayload {
  mode?: 'snapshot' | 'summary' | 'alerts';
}


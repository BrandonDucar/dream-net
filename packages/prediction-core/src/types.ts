/**
 * Prediction Kernel - Core Domain Types
 * 
 * Pure TypeScript domain layer with no external dependencies.
 * These types define the core prediction market domain model.
 */

/**
 * Unique identifier for a prediction market
 */
export type PredictionMarketId = string;

/**
 * Possible outcomes for a prediction
 */
export type PredictionOutcome = 'yes' | 'no' | 'multiple' | 'numeric';

/**
 * Market metadata (off-chain)
 */
export interface PredictionMarketMeta {
  id: PredictionMarketId;
  title: string;
  description: string;
  creatorAgentId: string;
  createdAt: Date;
  resolutionDeadline: Date;
  outcomeType: PredictionOutcome;
  tags?: string[];
  sourceSignals?: string[]; // What signals led to this market
}

/**
 * Market state (on-chain + off-chain)
 */
export interface PredictionMarketState {
  marketId: PredictionMarketId;
  meta: PredictionMarketMeta;
  
  // Staking pools
  yesPool: bigint;      // Total staked on "yes"
  noPool: bigint;       // Total staked on "no"
  totalStaked: bigint;
  
  // Resolution
  resolved: boolean;
  resolvedAt?: Date;
  actualOutcome?: PredictionOutcome;
  resolverAgentId?: string;
  
  // Performance tracking
  impliedOdds?: {
    yes: number;  // 0-1 probability
    no: number;   // 0-1 probability
  };
}

/**
 * Agent's decision/prediction
 */
export interface PredictionDecision {
  decisionId: string;
  marketId: PredictionMarketId;
  agentId: string;
  outcome: PredictionOutcome;
  stakeAmount: bigint;  // Amount staked
  confidence: number;    // 0-1 confidence score
  reasoning?: string;   // Why agent made this decision
  createdAt: Date;
  latentSessionId?: string; // Link to latent collaboration
}

/**
 * Performance snapshot for an agent
 */
export interface PredictionPerformanceSnapshot {
  agentId: string;
  snapshotAt: Date;
  
  // Metrics
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;  // correctPredictions / totalPredictions
  
  // Financial
  totalStaked: bigint;
  totalWinnings: bigint;
  netProfit: bigint;  // winnings - staked
  
  // Confidence calibration
  avgConfidence: number;
  confidenceAccuracy: number; // How well confidence matches actual accuracy
  
  // Recent performance
  recentAccuracy: number;  // Last 10 predictions
  trend: 'improving' | 'declining' | 'stable';
}



/**
 * DreamNet Control Core Types
 * Global kill-switch and per-cluster rate limiting
 */

export type ClusterId = 
  | "wolf-pack"
  | "orca-pack"
  | "whale-pack"
  | "octopus-executor"
  | "spider-web"
  | "jaggy-core"
  | "webhook-nervous"
  | "shield-core"
  | "api-keeper"
  | "ai-seo"
  | "dream-state"
  | "star-bridge"
  | "all"; // Special cluster ID for global kill-switch

// Tier types moved to tierConfig.ts
// Import from @dreamnet/dreamnet-control-core/tierConfig

export interface ClusterRateLimit {
  clusterId: ClusterId;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  enabled: boolean;
}

export interface KillSwitchState {
  globalKillSwitch: boolean; // Master kill-switch for all agents
  clusterStates: Record<ClusterId, {
    enabled: boolean;
    reason?: string;
    disabledAt?: number;
    disabledBy?: string;
  }>;
  lastUpdatedAt: number;
}

export interface ControlConfig {
  killSwitch: KillSwitchState;
  rateLimits: ClusterRateLimit[];
  circuitBreakers: Record<ClusterId, {
    tripped: boolean;
    tripCount: number;
    lastTripAt?: number;
    autoResetAfter?: number; // ms
  }>;
  tierConfigs: Record<import("./tierConfig").TierId, import("./tierConfig").TierConfig>;
}

export interface ControlContext {
  clusterId: ClusterId;
  operation: string;
  traceId?: string;
  idempotencyKey?: string;
  // Tier information is passed via callerTierId and callerTier in checkOperation
  apiKeyId?: string; // API key ID if authenticated
  walletAddress?: string; // Wallet address if authenticated
}

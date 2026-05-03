export type Brand<K, T> = K & { __brand: T };

export type TierId = 'SEED' | 'BUILDER' | 'OPERATOR' | 'GOD_MODE';
export type OfficeId = string; // Placeholder for now
export type CabinetId = string; // Placeholder for now
export type PortId = string;
export type ClusterId = 
  | "WOLF_PACK"
  | "OCTOPUS"
  | "SPIDER_WEB"
  | "JAGGY"
  | "SHIELD_CORE"
  | "WEBHOOK_NERVOUS_SYSTEM"
  | "ORCA_PACK"
  | "WHALE_PACK"
  | "API_KEEPER"
  | "AI_SEO"
  | "DREAM_STATE"
  | "STAR_BRIDGE"
  | "TRAVEL_FLEET";


export type CitizenId = string;

export interface DreamPassport {
    citizenId: CitizenId;
    walletAddresses: string[];
    displayName?: string;
    reputationScore?: number;
    tierId: TierId;
    officeIds: OfficeId[];
    cabinetIds: CabinetId[];
    status: PassportStatus;
    createdAt?: string;
    updatedAt?: string;
}

export type PassportStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED' | 'PENDING';

export interface CallerIdentity {
    source: 'apiKey' | 'wallet' | 'unknown';
    tierId: TierId;
    tier?: any;
    isGodVault: boolean;
    apiKeyId?: string;
    walletAddress?: string;
    passport?: DreamPassport;
    officeIds?: OfficeId[];
    cabinetIds?: CabinetId[];
}

export type OperationalEventType =
  | "health_check_failed"
  | "health_check_recovered"
  | "incident_created"
  | "incident_resolved"
  | "audit_event"
  | "rate_limit_exceeded"
  | "rate_limit_reset"
  | "circuit_breaker_tripped"
  | "circuit_breaker_reset"
  | "cost_threshold_exceeded"
  | "cost_budget_alert"
  | "auto_scaling_decision"
  | "auto_scaling_applied"
  | "scheduled_task_executed"
  | "scheduled_task_failed"
  | "kill_switch_enabled"
  | "kill_switch_disabled"
  | "cluster_enabled"
  | "cluster_disabled";

export interface OperationalEvent {
  type: OperationalEventType;
  clusterId?: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

export interface CostSummary {
  clusterId: string;
  totalCost: number;
  costToday: number;
  costThisWeek: number;
  costThisMonth: number;
  currency: string;
  recordCount: number;
  lastUpdatedAt: number;
}

export interface CostRecord {
  id: string;
  clusterId: string;
  provider: string;
  operation: string;
  cost: number;
  currency: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

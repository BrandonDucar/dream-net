/**
 * Shared Core Types
 * 
 * Top-level type definitions to prevent circular dependencies between:
 * - dreamnet-control-core
 * - port-governor
 * - agent-gateway
 */

/**
 * Access Tier identifiers
 */
export type TierId = "SEED" | "BUILDER" | "OPERATOR" | "GOD_MODE";

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
    | "STAR_BRIDGE";

/**
 * Port identifiers
 */
export type PortId =
    | "ENVKEEPER_PORT"
    | "APIKEEPER_PORT"
    | "VERCEL_PORT"
    | "AGENT_GATEWAY"
    | string;

export type PortDirection = "ingress" | "egress" | "bidirectional";

export interface PortLimits {
    maxRequestsPerMinute: number;
    maxRequestsPerHour?: number;
    maxConcurrentRequests?: number;
    costBudgetPerMinute?: number;
}

export interface PortProfile {
    id: PortId;
    name: string;
    description?: string;
    direction: PortDirection;
    allowedTiers: TierId[];
    requiredOfficeIds?: string[];
    requiredCabinetIds?: string[];
    limits: PortLimits;
    priorityLane: 0 | 1 | 2 | 3 | 4 | 5;
    defaultSampleRate: number;
    clusterId?: string;
}

export type OfficeId = string;
export type CabinetId = string;
export type CitizenId = string;

export type PassportStatus = "active" | "suspended" | "exiled" | "probation";

export interface DreamPassport {
    citizenId: CitizenId;
    displayName: string;
    walletAddresses: string[];
    tierId: TierId;
    status: PassportStatus;
    reputationScore: number;
    officeIds: OfficeId[];
    cabinetIds: CabinetId[];
    createdAt: string;
    updatedAt: string;
}

export interface CallerIdentity {
    citizenId?: CitizenId;
    passport?: DreamPassport;
    tierId?: TierId;
    officeIds?: OfficeId[];
    cabinetIds?: CabinetId[];
    isGodVault?: boolean;
    apiKeyId?: string;
    walletAddress?: string;
}

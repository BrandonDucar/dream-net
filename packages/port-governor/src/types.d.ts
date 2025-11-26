/**
 * Port Governor Types
 * Governed ports with roles, limits, and access control
 */
import type { TierId } from "../../dreamnet-control-core/tierConfig";
import type { OfficeId, CabinetId } from "../../dream-state-core/types";
export type PortId = "ENVKEEPER_PORT" | "APIKEEPER_PORT" | "VERCEL_PORT" | "CLOUD_RUN_PORT" | "AGENT_GATEWAY" | string;
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
    requiredOfficeIds?: OfficeId[];
    requiredCabinetIds?: CabinetId[];
    limits: PortLimits;
    priorityLane: 0 | 1 | 2 | 3 | 4 | 5;
    defaultSampleRate: number;
    clusterId?: string;
}
export interface PortGovernorContext {
    portId: PortId;
    tierId: TierId;
    officeIds?: OfficeId[];
    cabinetIds?: CabinetId[];
    traceId?: string;
}

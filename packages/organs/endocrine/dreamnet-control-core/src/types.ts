
import type { Request } from "express";
import type { CallerIdentity, DreamPassport, TierId, ClusterId as SharedClusterId } from "@dreamnet/types";

export type ClusterId = SharedClusterId;

export interface RequestWithIdentity extends Request {
    traceId?: string;
    callerIdentity?: CallerIdentity;
    dreamPassport?: DreamPassport;
    clusterId?: ClusterId;
}

export interface ClusterRateLimit {
    clusterId: ClusterId;
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
    enabled: boolean;
}

export interface KillSwitchState {
    globalKillSwitch: boolean;
    clusterStates: Record<string, { enabled: boolean; reason?: string; disabledBy?: string; disabledAt?: number }>;
    lastUpdatedAt: number;
}

export interface ControlConfig {
    killSwitch: KillSwitchState;
    rateLimits: ClusterRateLimit[];
    circuitBreakers: Record<string, any>;
    tierConfigs: Record<string, any>;
}

export interface ControlContext {
    traceId: string;
    clusterId: ClusterId;
    callerTierId?: TierId;
}

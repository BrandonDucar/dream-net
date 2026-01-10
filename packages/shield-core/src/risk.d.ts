/**
 * Shield Core Risk Profile
 * Tracks risk per caller (API key/wallet/citizen) for adaptive decisions
 */
import type { TierId } from "@dreamnet/dreamnet-control-core/tierConfig";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export interface CallerRiskProfile {
    callerId: string;
    tierId: TierId;
    lastUpdatedAt: string;
    score: number;
    level: RiskLevel;
    recentFailures: number;
    recentHighRiskUses: number;
    lastToolId?: string;
    lastPortId?: string;
}
export declare function getRiskProfile(callerId: string): CallerRiskProfile | undefined;
export declare function updateRiskProfile(params: {
    callerId: string;
    tierId: TierId;
    baseDelta: number;
    isFailure?: boolean;
    isHighRiskTool?: boolean;
    portId?: string;
    toolId?: string;
}): CallerRiskProfile;
export declare function listRiskProfiles(): CallerRiskProfile[];
export declare function getRiskProfilesByLevel(level: RiskLevel): CallerRiskProfile[];
//# sourceMappingURL=risk.d.ts.map
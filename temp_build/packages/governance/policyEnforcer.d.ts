import type { ActorContext, CapabilityType, ScopeType } from "./types";
export interface PolicyCheckResult {
    allowed: boolean;
    requiresQuorum: boolean;
    quorumTypes: string[];
    reversible: boolean;
    reason?: string;
    policyId?: string;
}
/**
 * Check if an actor can perform a capability in a scope
 */
export declare function checkPolicy(actor: ActorContext, capability: CapabilityType, scope: ScopeType): PolicyCheckResult;
/**
 * Request quorum approval for a policy action
 */
export declare function requestQuorumApproval(policyId: string, actor: ActorContext, capability: CapabilityType, scope: ScopeType, quorumTypes: string[]): {
    policyId: string;
    status: "pending" | "approved" | "rejected";
};
/**
 * Express middleware for policy enforcement
 */
export declare function policyMiddleware(capability: CapabilityType, scope: ScopeType): (req: any, res: any, next: any) => Promise<any>;

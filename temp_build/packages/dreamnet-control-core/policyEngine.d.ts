/**
 * Policy Engine - Extensible Policy Evaluation
 *
 * Evaluates policies based on context and returns allow/deny decisions with extra flags.
 *
 * This is a stub that can be extended with:
 * - Risk scoring
 * - Cost budgets
 * - Integration health checks
 * - Time-based policies
 * - Geographic restrictions
 * - Custom business rules
 *
 * The policy engine is called inside controlCoreMiddleware before final allow/deny.
 * It can override or augment the base Control Core decisions.
 *
 * @module @dreamnet/dreamnet-control-core/policyEngine
 */
import type { ClusterId } from "./clusters";
import type { TierId } from "./tierConfig";
import type { CallerIdentity } from "./identityResolver";
export interface PolicyContext {
    /** Trace ID for request tracking */
    traceId: string;
    /** Caller identity (tier, source, isGodVault) */
    callerIdentity?: CallerIdentity;
    /** Cluster ID (if route is clustered) */
    clusterId?: ClusterId;
    /** Route identifier (method + path) */
    routeId: string;
    /** Base decision from Control Core (before policy evaluation) */
    baseDecision: "allow" | "deny";
    /** Reason for base decision (if denied) */
    baseReason?: string;
    /** Additional context */
    context?: {
        tierId?: TierId;
        isGodVault?: boolean;
        effectiveRateLimit?: number;
        remainingRateLimit?: number;
        requiredFeatureFlag?: string;
        clusterEnabled?: boolean;
        globalKillSwitchEnabled?: boolean;
        [key: string]: any;
    };
}
export interface PolicyResult {
    /** Final decision: allow or deny */
    allowed: boolean;
    /** Reason for decision (if denied) */
    reason?: string;
    /** Extra flags for downstream processing */
    extraFlags?: {
        /** Risk score (0-100, higher = more risky) */
        riskScore?: number;
        /** Cost estimate for this operation */
        estimatedCost?: number;
        /** Integration health status */
        integrationHealth?: "healthy" | "degraded" | "down";
        /** Whether this operation should be logged/audited */
        requiresAudit?: boolean;
        /** Custom flags */
        [key: string]: any;
    };
}
declare class PolicyEngine {
    /**
     * Evaluate policy based on context
     *
     * @param context - Policy evaluation context
     * @returns Policy result with allow/deny decision and extra flags
     *
     * @example
     * ```typescript
     * const result = policyEngine.evaluate({
     *   traceId: "abc123",
     *   callerIdentity: identity,
     *   clusterId: "WOLF_PACK",
     *   routeId: "POST /api/wolf-pack/run-job",
     *   baseDecision: "allow",
     * });
     *
     * if (!result.allowed) {
     *   // Policy denied
     * }
     * ```
     */
    evaluate(context: PolicyContext): PolicyResult;
    /**
     * Calculate risk score (stub)
     *
     * TODO: Implement real risk scoring based on:
     * - Tier level (higher tier = lower risk)
     * - Cluster sensitivity (Shield Core = higher risk)
     * - Route sensitivity (nuclear operations = higher risk)
     * - Historical patterns
     * - Time of day
     * - Geographic location
     *
     * @param tierId - Tier identifier
     * @param clusterId - Cluster identifier
     * @param routeId - Route identifier
     * @returns Risk score (0-100, higher = more risky)
     */
    private calculateRiskScore;
    /**
     * Estimate cost for operation (stub)
     *
     * TODO: Implement real cost estimation based on:
     * - Cluster cost per request
     * - Route cost multipliers
     * - Tier cost modifiers
     * - Historical cost data
     *
     * @param clusterId - Cluster identifier
     * @param routeId - Route identifier
     * @returns Estimated cost in USD
     */
    private estimateCost;
    /**
     * Check integration health (stub)
     *
     * TODO: Implement real health checks:
     * - Check cluster status
     * - Check dependent services
     * - Check recent error rates
     * - Check circuit breaker status
     *
     * @param clusterId - Cluster identifier
     * @returns Integration health status
     */
    private checkIntegrationHealth;
}
export declare const policyEngine: PolicyEngine;
/**
 * Evaluate policy based on context
 *
 * @param context - Policy evaluation context
 * @returns Policy result with allow/deny decision and extra flags
 */
export declare function evaluatePolicy(context: PolicyContext): PolicyResult;
export {};

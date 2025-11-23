/**
 * Control Core Middleware
 *
 * Enforces cluster-level access control, rate limits, and feature flags.
 *
 * HOW CLUSTERS WORK:
 * - Clusters are biomimetic "organs" - specialized systems within DreamNet
 * - Each cluster has a config (CLUSTERS) defining:
 *   - enabled: Can be disabled per-cluster
 *   - defaultMaxRequestsPerMinute: Cluster-level rate limit
 *   - requiredFeatureFlag: Tier feature flag required to access
 *
 * HOW TIER + CLUSTER INTERACT:
 * - Tier defines maxRequestsPerMinute (user-level limit)
 * - Cluster defines defaultMaxRequestsPerMinute (cluster-level limit)
 * - Effective limit = Math.min(tierLimit, clusterLimit)
 * - Feature flags: Tier must have cluster.requiredFeatureFlag enabled
 * - God Vault bypasses all restrictions (except logging)
 *
 * HOW TO ATTACH A ROUTE TO A CLUSTER:
 * ```typescript
 * import { withCluster } from "@dreamnet/dreamnet-control-core/controlCoreMiddleware";
 *
 * app.post("/api/wolf-pack/run-job",
 *   withCluster("WOLF_PACK"),
 *   wolfPackRunJobHandler
 * );
 * ```
 *
 * Or manually:
 * ```typescript
 * router.post("/api/wolf-pack/run-job", (req, res, next) => {
 *   req.clusterId = "WOLF_PACK";
 *   next();
 * }, controlCoreMiddleware, handler);
 * ```
 *
 * EVENT FABRIC & POLICY ENGINE:
 * - All decisions are emitted to eventFabric for observability
 * - Policy engine evaluates context before final allow/deny
 * - Policy engine can add extraFlags (risk score, cost, health, audit flags)
 *
 * @module @dreamnet/dreamnet-control-core/controlCoreMiddleware
 */
import type { Request, Response, NextFunction } from "express";
import type { ClusterId } from "./clusters";
import type { RequestWithIdentity } from "./identityResolver";
import type { OfficeId, CabinetId } from "../dream-state-core/types";
/**
 * Set global kill-switch state
 *
 * @param enabled - Whether kill-switch is enabled
 */
export declare function setGlobalKillSwitch(enabled: boolean): void;
/**
 * Get global kill-switch state
 *
 * @returns true if kill-switch is enabled
 */
export declare function isGlobalKillSwitchEnabled(): boolean;
export declare function controlCoreMiddleware(req: RequestWithIdentity, res: Response, next: NextFunction): void;
/**
 * Helper to attach cluster ID to request
 *
 * Usage:
 * ```typescript
 * app.post("/api/wolf-pack/run-job",
 *   withCluster("WOLF_PACK"),
 *   controlCoreMiddleware,
 *   wolfPackRunJobHandler
 * );
 * ```
 *
 * @param clusterId - Cluster identifier
 * @returns Express middleware that attaches clusterId to request
 */
export declare function withCluster(clusterId: ClusterId): (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Governance options for route protection
 */
export interface GovernanceOptions {
    clusterId: ClusterId;
    requiredOfficeId?: OfficeId;
    requiredCabinetId?: CabinetId;
}
/**
 * Helper to attach governance requirements to request
 *
 * Usage:
 * ```typescript
 * app.post("/api/shield/adjust-phase",
 *   withGovernance({
 *     clusterId: "SHIELD_CORE",
 *     requiredOfficeId: "SHIELD_COMMANDER"
 *   }),
 *   controlCoreMiddleware,
 *   shieldAdjustHandler
 * );
 * ```
 *
 * @param options - Governance options (clusterId, requiredOfficeId, requiredCabinetId)
 * @returns Express middleware that attaches governance requirements to request
 */
export declare function withGovernance(options: GovernanceOptions): (req: Request, _res: Response, next: NextFunction) => void;

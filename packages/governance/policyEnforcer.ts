import type { ActorContext, CapabilityType, ScopeType } from "./types";
import { findMatchingRule, requiresQuorum, isReversible } from "./policyTable";
import { quorumEngine } from "./quorumEngine";

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
export function checkPolicy(
  actor: ActorContext,
  capability: CapabilityType,
  scope: ScopeType
): PolicyCheckResult {
  const rule = findMatchingRule(actor, capability, scope);

  if (!rule) {
    // No rule found - default deny for safety
    return {
      allowed: false,
      requiresQuorum: false,
      quorumTypes: [],
      reversible: false,
      reason: "No policy rule found for this action",
    };
  }

  // Check conditions if any
  if (rule.conditions) {
    const conditionMet = evaluateConditions(rule.conditions, actor);
    if (!conditionMet) {
      return {
        allowed: false,
        requiresQuorum: false,
        quorumTypes: [],
        reversible: isReversible(rule),
        reason: "Policy conditions not met",
      };
    }
  }

  const needsQuorum = requiresQuorum(rule);

  return {
    allowed: !needsQuorum, // If no quorum needed, allow immediately
    requiresQuorum: needsQuorum,
    quorumTypes: rule.review_quorum,
    reversible: isReversible(rule),
    policyId: `${rule.actor}-${rule.capability}-${rule.scope}`,
  };
}

/**
 * Request quorum approval for a policy action
 */
export function requestQuorumApproval(
  policyId: string,
  actor: ActorContext,
  capability: CapabilityType,
  scope: ScopeType,
  quorumTypes: string[]
): { policyId: string; status: "pending" | "approved" | "rejected" } {
  const rule = findMatchingRule(actor, capability, scope);
  if (!rule) {
    throw new Error(`No policy rule found for ${capability} in ${scope}`);
  }

  const threshold = rule.min_approvals || Math.ceil(quorumTypes.length / 2);
  const decision = quorumEngine.getDecision(policyId);

  if (decision && decision.result !== "pending") {
    return {
      policyId,
      status: decision.result === "approved" ? "approved" : "rejected",
    };
  }

  // Create initial pending decision
  quorumEngine.vote(policyId, actor, "approve", quorumTypes as any, threshold);

  return {
    policyId,
    status: "pending",
  };
}

/**
 * Evaluate policy conditions against actor context
 */
function evaluateConditions(conditions: Record<string, unknown>, actor: ActorContext): boolean {
  for (const [key, value] of Object.entries(conditions)) {
    switch (key) {
      case "minTrustScore":
        if ((actor.trustScore || 0) < (value as number)) return false;
        break;
      case "minStakedTokens":
        if ((actor.stakedTokens || 0) < (value as number)) return false;
        break;
      case "minCompletedDreams":
        if ((actor.completedDreams || 0) < (value as number)) return false;
        break;
      case "requiredBadges":
        const required = value as string[];
        const hasAll = required.every((badge) => actor.badges?.includes(badge));
        if (!hasAll) return false;
        break;
      default:
        // Unknown condition - fail safe
        return false;
    }
  }
  return true;
}

/**
 * Express middleware for policy enforcement
 */
export function policyMiddleware(capability: CapabilityType, scope: ScopeType) {
  return async (req: any, res: any, next: any) => {
    const actor: ActorContext = {
      actorId: req.user?.walletAddress || req.headers["x-actor-id"] || "anonymous",
      actorType: req.user?.isAdmin ? "admin" : "wallet",
      walletAddress: req.user?.walletAddress,
      trustScore: req.user?.trustScore,
      stakedTokens: req.user?.stakedTokens,
      completedDreams: req.user?.completedDreams,
      badges: req.user?.badges,
    };

    const check = checkPolicy(actor, capability, scope);

    if (!check.allowed) {
      if (check.requiresQuorum) {
        // Return pending status, require quorum approval
        return res.status(202).json({
          status: "pending_quorum",
          policyId: check.policyId,
          quorumTypes: check.quorumTypes,
          message: "Action requires quorum approval",
        });
      }

      return res.status(403).json({
        error: "Policy violation",
        reason: check.reason,
      });
    }

    // Policy allows - continue
    req.policyCheck = check;
    next();
  };
}


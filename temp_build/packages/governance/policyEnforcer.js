"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPolicy = checkPolicy;
exports.requestQuorumApproval = requestQuorumApproval;
exports.policyMiddleware = policyMiddleware;
const policyTable_1 = require("./policyTable");
const quorumEngine_1 = require("./quorumEngine");
/**
 * Check if an actor can perform a capability in a scope
 */
function checkPolicy(actor, capability, scope) {
    const rule = (0, policyTable_1.findMatchingRule)(actor, capability, scope);
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
                reversible: (0, policyTable_1.isReversible)(rule),
                reason: "Policy conditions not met",
            };
        }
    }
    const needsQuorum = (0, policyTable_1.requiresQuorum)(rule);
    return {
        allowed: !needsQuorum, // If no quorum needed, allow immediately
        requiresQuorum: needsQuorum,
        quorumTypes: rule.review_quorum,
        reversible: (0, policyTable_1.isReversible)(rule),
        policyId: `${rule.actor}-${rule.capability}-${rule.scope}`,
    };
}
/**
 * Request quorum approval for a policy action
 */
function requestQuorumApproval(policyId, actor, capability, scope, quorumTypes) {
    const rule = (0, policyTable_1.findMatchingRule)(actor, capability, scope);
    if (!rule) {
        throw new Error(`No policy rule found for ${capability} in ${scope}`);
    }
    const threshold = rule.min_approvals || Math.ceil(quorumTypes.length / 2);
    const decision = quorumEngine_1.quorumEngine.getDecision(policyId);
    if (decision && decision.result !== "pending") {
        return {
            policyId,
            status: decision.result === "approved" ? "approved" : "rejected",
        };
    }
    // Create initial pending decision
    quorumEngine_1.quorumEngine.vote(policyId, actor, "approve", quorumTypes, threshold);
    return {
        policyId,
        status: "pending",
    };
}
/**
 * Evaluate policy conditions against actor context
 */
function evaluateConditions(conditions, actor) {
    for (const [key, value] of Object.entries(conditions)) {
        switch (key) {
            case "minTrustScore":
                if ((actor.trustScore || 0) < value)
                    return false;
                break;
            case "minStakedTokens":
                if ((actor.stakedTokens || 0) < value)
                    return false;
                break;
            case "minCompletedDreams":
                if ((actor.completedDreams || 0) < value)
                    return false;
                break;
            case "requiredBadges":
                const required = value;
                const hasAll = required.every((badge) => actor.badges?.includes(badge));
                if (!hasAll)
                    return false;
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
function policyMiddleware(capability, scope) {
    return async (req, res, next) => {
        const actor = {
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

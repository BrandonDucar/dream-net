"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPolicyTable = loadPolicyTable;
exports.findMatchingRule = findMatchingRule;
exports.requiresQuorum = requiresQuorum;
exports.isReversible = isReversible;
exports.getMinApprovals = getMinApprovals;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const js_yaml_1 = require("js-yaml");
const zod_1 = require("zod");
const PolicyRuleSchema = zod_1.z.object({
    actor: zod_1.z.enum(["agent", "wallet", "system", "admin"]),
    capability: zod_1.z.enum(["publish", "remix", "monetize", "archive", "deploy", "modify_schema", "manage_keys", "payout"]),
    scope: zod_1.z.enum(["global", "dream", "agent", "token", "infrastructure"]),
    reversible: zod_1.z.boolean(),
    review_quorum: zod_1.z.array(zod_1.z.enum(["tech", "creator", "safety", "admin"])),
    min_approvals: zod_1.z.number().optional(),
    conditions: zod_1.z.record(zod_1.z.unknown()).optional(),
});
const PolicyTableSchema = zod_1.z.object({
    version: zod_1.z.string(),
    rules: zod_1.z.array(PolicyRuleSchema),
});
const DEFAULT_POLICY_PATH = (0, node_path_1.join)(process.cwd(), "policy", "ecosystem-policy.yaml");
const FALLBACK_POLICY = {
    version: "1.0.0",
    rules: [
        {
            actor: "wallet",
            capability: "publish",
            scope: "dream",
            reversible: true,
            review_quorum: [],
        },
        {
            actor: "wallet",
            capability: "remix",
            scope: "dream",
            reversible: true,
            review_quorum: [],
        },
        {
            actor: "admin",
            capability: "deploy",
            scope: "infrastructure",
            reversible: false,
            review_quorum: ["tech", "safety"],
            min_approvals: 2,
        },
        {
            actor: "admin",
            capability: "modify_schema",
            scope: "infrastructure",
            reversible: false,
            review_quorum: ["tech", "safety"],
            min_approvals: 2,
        },
        {
            actor: "admin",
            capability: "manage_keys",
            scope: "infrastructure",
            reversible: false,
            review_quorum: ["tech", "safety", "admin"],
            min_approvals: 3,
        },
        {
            actor: "admin",
            capability: "payout",
            scope: "token",
            reversible: false,
            review_quorum: ["creator", "safety"],
            min_approvals: 2,
        },
    ],
};
let cachedPolicy = null;
let lastLoadTime = 0;
const CACHE_TTL = 60000; // 1 minute
function loadPolicyTable(path) {
    const policyPath = path || DEFAULT_POLICY_PATH;
    const now = Date.now();
    // Return cached policy if still valid
    if (cachedPolicy && now - lastLoadTime < CACHE_TTL) {
        return cachedPolicy;
    }
    // Try to load from file
    if ((0, node_fs_1.existsSync)(policyPath)) {
        try {
            const content = (0, node_fs_1.readFileSync)(policyPath, "utf-8");
            const parsed = (0, js_yaml_1.load)(content);
            const validated = PolicyTableSchema.parse(parsed);
            cachedPolicy = validated;
            lastLoadTime = now;
            return validated;
        }
        catch (error) {
            console.warn(`[Governance] Failed to load policy from ${policyPath}, using fallback:`, error);
        }
    }
    // Return fallback policy
    cachedPolicy = FALLBACK_POLICY;
    lastLoadTime = now;
    return FALLBACK_POLICY;
}
function findMatchingRule(actor, capability, scope, policyTable) {
    const policy = policyTable || loadPolicyTable();
    // Find matching rule (most specific first)
    const matches = policy.rules.filter((rule) => (rule.actor === actor.actorType || rule.actor === "system") &&
        rule.capability === capability &&
        rule.scope === scope);
    if (matches.length === 0) {
        return null;
    }
    // Return first match (could enhance with priority scoring)
    return matches[0];
}
function requiresQuorum(rule) {
    return rule.review_quorum.length > 0;
}
function isReversible(rule) {
    return rule.reversible;
}
function getMinApprovals(rule, quorumType) {
    if (rule.min_approvals) {
        return rule.min_approvals;
    }
    // Default: require majority of quorum size
    const quorumSize = rule.review_quorum.length;
    return Math.ceil(quorumSize / 2);
}

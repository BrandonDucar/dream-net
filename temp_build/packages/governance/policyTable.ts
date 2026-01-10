import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import { z } from "zod";
import type { PolicyTable, PolicyRule, ActorContext, CapabilityType, ScopeType } from "./types";

const PolicyRuleSchema = z.object({
  actor: z.enum(["agent", "wallet", "system", "admin"]),
  capability: z.enum(["publish", "remix", "monetize", "archive", "deploy", "modify_schema", "manage_keys", "payout"]),
  scope: z.enum(["global", "dream", "agent", "token", "infrastructure"]),
  reversible: z.boolean(),
  review_quorum: z.array(z.enum(["tech", "creator", "safety", "admin"])),
  min_approvals: z.number().optional(),
  conditions: z.record(z.unknown()).optional(),
});

const PolicyTableSchema = z.object({
  version: z.string(),
  rules: z.array(PolicyRuleSchema),
});

const DEFAULT_POLICY_PATH = join(process.cwd(), "policy", "ecosystem-policy.yaml");
const FALLBACK_POLICY: PolicyTable = {
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

let cachedPolicy: PolicyTable | null = null;
let lastLoadTime: number = 0;
const CACHE_TTL = 60000; // 1 minute

export function loadPolicyTable(path?: string): PolicyTable {
  const policyPath = path || DEFAULT_POLICY_PATH;
  const now = Date.now();

  // Return cached policy if still valid
  if (cachedPolicy && now - lastLoadTime < CACHE_TTL) {
    return cachedPolicy;
  }

  // Try to load from file
  if (existsSync(policyPath)) {
    try {
      const content = readFileSync(policyPath, "utf-8");
      const parsed = load(content) as any;
      const validated = PolicyTableSchema.parse(parsed);
      cachedPolicy = validated;
      lastLoadTime = now;
      return validated;
    } catch (error) {
      console.warn(`[Governance] Failed to load policy from ${policyPath}, using fallback:`, error);
    }
  }

  // Return fallback policy
  cachedPolicy = FALLBACK_POLICY;
  lastLoadTime = now;
  return FALLBACK_POLICY;
}

export function findMatchingRule(
  actor: ActorContext,
  capability: CapabilityType,
  scope: ScopeType,
  policyTable?: PolicyTable
): PolicyRule | null {
  const policy = policyTable || loadPolicyTable();

  // Find matching rule (most specific first)
  const matches = policy.rules.filter(
    (rule) =>
      (rule.actor === actor.actorType || rule.actor === "system") &&
      rule.capability === capability &&
      rule.scope === scope
  );

  if (matches.length === 0) {
    return null;
  }

  // Return first match (could enhance with priority scoring)
  return matches[0];
}

export function requiresQuorum(rule: PolicyRule): boolean {
  return rule.review_quorum.length > 0;
}

export function isReversible(rule: PolicyRule): boolean {
  return rule.reversible;
}

export function getMinApprovals(rule: PolicyRule, quorumType: string): number {
  if (rule.min_approvals) {
    return rule.min_approvals;
  }
  // Default: require majority of quorum size
  const quorumSize = rule.review_quorum.length;
  return Math.ceil(quorumSize / 2);
}


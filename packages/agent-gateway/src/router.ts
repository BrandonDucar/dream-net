/**
 * Agent Gateway Intent Router
 * Resolves intents to tools and checks permissions
 */

import type { RequestWithIdentity } from "@dreamnet/dreamnet-control-core/identityResolver";
import { getToolConfig, type ToolId } from "./tools";

export interface AgentGatewayRequestBody {
  intent: string;
  tools?: string[];
  constraints?: {
    maxLatencyMs?: number;
    maxCostUsd?: number;
    maxTokens?: number;
    riskCeiling?: "low" | "medium" | "high";
  };
  payload?: Record<string, unknown>;
}

// ToolExecutionResult moved to executor.ts

export interface IntentResolution {
  tool?: ToolId;
  reason?: string;
}

/**
 * Resolve intent string to a tool ID
 * Simple mapping for now; can get smarter later with NLP/LLM routing
 */
export function resolveIntentToTool(body: AgentGatewayRequestBody): IntentResolution {
  const { intent } = body;

  if (!intent || typeof intent !== "string") {
    return { reason: "INTENT_REQUIRED" };
  }

  // Direct tool ID match (e.g., "env.get", "api.listKeys")
  if (intent.startsWith("env.")) {
    return { tool: intent as ToolId };
  }
  if (intent.startsWith("api.")) {
    return { tool: intent as ToolId };
  }
  if (intent.startsWith("vercel.")) {
    return { tool: intent as ToolId };
  }
  if (intent === "ping" || intent === "diagnostics.ping") {
    return { tool: "diagnostics.ping" };
  }

  // Natural language patterns (can be expanded)
  const lowerIntent = intent.toLowerCase();
  
  if (lowerIntent.includes("env") && (lowerIntent.includes("get") || lowerIntent.includes("read"))) {
    return { tool: "env.get" };
  }
  if (lowerIntent.includes("env") && (lowerIntent.includes("set") || lowerIntent.includes("update") || lowerIntent.includes("create"))) {
    return { tool: "env.set" };
  }
  if (lowerIntent.includes("env") && (lowerIntent.includes("delete") || lowerIntent.includes("remove"))) {
    return { tool: "env.delete" };
  }
  if (lowerIntent.includes("api") && (lowerIntent.includes("key") || lowerIntent.includes("list"))) {
    return { tool: "api.listKeys" };
  }
  if (lowerIntent.includes("api") && (lowerIntent.includes("rotate") || lowerIntent.includes("refresh"))) {
    return { tool: "api.rotateKey" };
  }
  if (lowerIntent.includes("vercel") && (lowerIntent.includes("deploy") || lowerIntent.includes("publish"))) {
    return { tool: "vercel.deploy" };
  }
  if (lowerIntent.includes("vercel") && (lowerIntent.includes("list") || lowerIntent.includes("projects"))) {
    return { tool: "vercel.listProjects" };
  }
  if (lowerIntent.includes("ping") || lowerIntent.includes("health") || lowerIntent.includes("status")) {
    return { tool: "diagnostics.ping" };
  }

  return {
    reason: "NO_MATCHING_TOOL",
  };
}

/**
 * Check if caller is allowed to use a tool
 */
export function isToolAllowedForCaller(
  toolId: ToolId,
  req: RequestWithIdentity
): { allowed: boolean; reason?: string } {
  const cfg = getToolConfig(toolId);
  if (!cfg) return { allowed: false, reason: "UNKNOWN_TOOL" };

  const caller = req.callerIdentity;
  if (!caller) return { allowed: false, reason: "NO_IDENTITY" };

  // God Vault bypasses all checks
  if (caller.isGodVault) {
    return { allowed: true };
  }

  // Tier check (simple string ordering)
  const order = ["SEED", "BUILDER", "OPERATOR", "GOD_MODE"] as const;
  const idxCaller = order.indexOf(caller.tierId);
  const idxMin = order.indexOf(cfg.minTier);
  if (idxCaller < idxMin) {
    return { allowed: false, reason: "TIER_TOO_LOW" };
  }

  // Office check
  if (cfg.requiredOfficeIds && cfg.requiredOfficeIds.length > 0) {
    const off = caller.officeIds ?? [];
    const has = off.some((o: string) => cfg.requiredOfficeIds!.includes(o));
    if (!has) {
      return { allowed: false, reason: "OFFICE_REQUIRED" };
    }
  }

  // Cabinet check
  if (cfg.requiredCabinetIds && cfg.requiredCabinetIds.length > 0) {
    const cabs = caller.cabinetIds ?? [];
    const has = cabs.some((c: string) => cfg.requiredCabinetIds!.includes(c));
    if (!has) {
      return { allowed: false, reason: "CABINET_REQUIRED" };
    }
  }

  return { allowed: true };
}


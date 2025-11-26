/**
 * GPT Category to DreamNet Cluster/Kind Mappers
 */

import type { ClusterId } from "@dreamnet/dreamnet-control-core/clusters";
import type { AgentKind } from "@dreamnet/agent-registry-core/types";

export function mapCategoryToCluster(category: string): ClusterId | undefined {
  const clusterMap: Record<string, ClusterId> = {
    "Core": "CORE",
    "Atlas": "ATLAS",
    "Aegis": "SHIELD_CORE",
    "Travel & Commerce": "TRAVEL_COMMERCE",
    "Creative": "CREATIVE",
    "Commerce": "COMMERCE",
    "Sentinel": "SENTINEL",
    "Experimental": "EXPERIMENTAL",
    "Automation": "AUTOMATION",
    "OmniBridge": "OMNIBRIDGE",
    "Production": "PRODUCTION",
    "Compliance & Tokenization": "COMPLIANCE",
    "Compliance & Analytics": "COMPLIANCE",
    "Compliance & Marketing": "COMPLIANCE",
    "DreamOps": "DREAM_OPS",
    "Evolution": "EVOLUTION",
    "Growth": "GROWTH",
    "Infra": "INFRA",
    "Memory": "MEMORY",
    "Security": "SHIELD_CORE",
    "Web3": "WEB3",
    "Luxury Design": "CREATIVE",
  };

  return clusterMap[category];
}

export function mapCategoryToKind(category: string): AgentKind {
  const kindMap: Record<string, AgentKind> = {
    "Core": "infra",
    "Atlas": "other", // AI/research - using "other" as closest match
    "Aegis": "other", // Security - using "other" as closest match
    "Travel & Commerce": "other", // Commerce - using "other" as closest match
    "Creative": "other", // Creative - using "other" as closest match
    "Commerce": "other", // Commerce - using "other" as closest match
    "Sentinel": "other", // Security - using "other" as closest match
    "Experimental": "other", // Research - using "other" as closest match
    "Automation": "infra",
    "OmniBridge": "infra",
    "Production": "infra",
    "Compliance & Tokenization": "governance",
    "Compliance & Analytics": "governance",
    "Compliance & Marketing": "governance",
    "DreamOps": "infra",
    "Evolution": "other", // Research - using "other" as closest match
    "Growth": "other", // Marketing - using "other" as closest match
    "Infra": "infra",
    "Memory": "infra",
    "Security": "other", // Security - using "other" as closest match
    "Web3": "other", // Web3 - using "other" as closest match
    "Luxury Design": "other", // Creative - using "other" as closest match
  };

  return kindMap[category] || "other";
}

export function determineTier(gpt: { category: string; status: string }): "architect" | "operator" | "citizen" {
  // Core GPTs get architect tier
  if (gpt.category === "Core") {
    return "architect";
  }

  // Active GPTs get operator tier
  if (gpt.status === "Active") {
    return "operator";
  }

  // Draft GPTs get citizen tier
  if (gpt.status === "Draft") {
    return "citizen";
  }

  // Default to operator
  return "operator";
}

export function determineFlags(gpt: { category: string; status: string }): string[] {
  const flags: string[] = ["agent", "gpt", "custom"];

  if (gpt.status === "Active") {
    flags.push("active");
  } else if (gpt.status === "Draft") {
    flags.push("draft");
  }

  // Add category as flag
  const categoryFlag = gpt.category.toLowerCase().replace(/\s+/g, "-");
  flags.push(categoryFlag);

  return flags;
}

export function cleanGPTId(name: string): string {
  // Convert GPT name to clean ID
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


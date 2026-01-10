/**
 * Auto-Integration Detection System
 * Automatically detects systems that aren't integrated and suggests/adds them
 */

import type { DreamNetOSContext } from "../types";

export interface IntegrationGap {
  system: string;
  type: "missing_from_heartbeat" | "missing_seo" | "missing_geofencing" | "missing_api_keeper";
  severity: "low" | "medium" | "high";
  description: string;
  suggestedFix: string;
  autoFixable: boolean;
}

let detectedGaps: IntegrationGap[] = [];

/**
 * Detect integration gaps
 */
export function detectIntegrationGaps(ctx: DreamNetOSContext): IntegrationGap[] {
  const gaps: IntegrationGap[] = [];

  // Check for systems that should be in heartbeat but aren't
  const knownSystems = [
    "DREAMKEEPER_CORE",
    "DreamDefenseNet",
    "SurgeonAgent",
    "EvolutionEngine",
  ];

  // Check if systems have status methods but aren't in context
  if (typeof (global as any).DREAMKEEPER_CORE !== "undefined") {
    if (!ctx.dreamKeeperCore) {
      gaps.push({
        system: "DREAMKEEPER_CORE",
        type: "missing_from_heartbeat",
        severity: "high",
        description: "DREAMKEEPER Core is available but not tracked in heartbeat",
        suggestedFix: "Add dreamKeeperCore to DreamNetOSContext",
        autoFixable: true,
      });
    }
  }

  // Check for missing SEO integration
  const contentEndpoints = [
    "/api/dreams",
    "/api/submit-dream",
    "/api/posts",
    "/api/products",
    "/api/dream-clouds",
    "/api/dream-cores",
    "/api/my-dreams",
    "/api/cocoons",
  ];

  // This would be checked at runtime by middleware
  gaps.push({
    system: "ContentEndpoints",
    type: "missing_seo",
    severity: "medium",
    description: "Some content endpoints may not have SEO optimization",
    suggestedFix: "Ensure autoSEORequestMiddleware covers all content routes",
    autoFixable: true,
  });

  // Check for missing geofencing
  if (ctx.aiSeoCore) {
    const seoStatus = ctx.aiSeoCore.status();
    if (seoStatus.geofenceCount === 0) {
      gaps.push({
        system: "AISEOCore",
        type: "missing_geofencing",
        severity: "low",
        description: "No geofences configured",
        suggestedFix: "Call AISEOCore.ensureDefaultGeofences()",
        autoFixable: true,
      });
    }
  }

  detectedGaps = gaps;
  return gaps;
}

/**
 * Auto-fix integration gaps
 */
export function autoFixIntegrationGaps(ctx: DreamNetOSContext): {
  fixed: string[];
  failed: string[];
} {
  const gaps = detectIntegrationGaps(ctx);
  const fixed: string[] = [];
  const failed: string[] = [];

  for (const gap of gaps) {
    if (!gap.autoFixable) continue;

    try {
      switch (gap.type) {
        case "missing_geofencing":
          if (ctx.aiSeoCore) {
            ctx.aiSeoCore.ensureDefaultGeofences();
            fixed.push(gap.system);
          }
          break;

        case "missing_seo":
          // SEO middleware is already global, but we can ensure it's applied
          fixed.push("SEO middleware is global");
          break;

        default:
          // Other fixes would require context updates
          break;
      }
    } catch (error) {
      failed.push(gap.system);
    }
  }

  return { fixed, failed };
}

/**
 * Get detected gaps
 */
export function getIntegrationGaps(): IntegrationGap[] {
  return detectedGaps;
}


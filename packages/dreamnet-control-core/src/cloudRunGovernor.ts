/**
 * Cloud Run Governor
 * Specialized governor for Cloud Run lifecycle management
 * Integrates with Budget Control Service and Conduit Governor
 * 
 * Controls:
 * - Deployment frequency (via Conduit Governor)
 * - Scaling operations (minInstances/maxInstances)
 * - Keep-alive settings (prevent scale-to-zero)
 * - Daily cost budgets
 */

import { BudgetControlService } from "../../../server/services/BudgetControlService.js";
import { evaluateConduit } from "./conduitGovernor.js";
import type { PortId } from "../../port-governor/src/types.js";
import type { ClusterId } from "../clusters.js";
import type { ToolId } from "../../agent-gateway/src/tools.js";

export interface CloudRunGovernorDecision {
  allowed: boolean;
  reason?: string;
  minInstances?: number;
  maxInstances?: number;
  estimatedCost?: number;
  budgetRemaining?: number;
}

export interface CloudRunScaleRequest {
  serviceName: string;
  minInstances?: number;
  maxInstances?: number;
  reason?: string;
}

export interface CloudRunDeployRequest {
  serviceName: string;
  image: string;
  minInstances?: number;
  maxInstances?: number;
  memory?: string;
  cpu?: string;
  envVars?: Record<string, string>;
}

/**
 * Evaluate if a Cloud Run operation should be allowed
 * Checks:
 * 1. Conduit Governor (rate limits)
 * 2. Budget Control Service (cost limits)
 * 3. Keep-alive budget (if setting minInstances > 0)
 */
export function evaluateCloudRunOperation(
  operation: "deploy" | "scale" | "update" | "setKeepAlive",
  portId: PortId,
  clusterId: ClusterId,
  toolId: ToolId,
  request: CloudRunScaleRequest | CloudRunDeployRequest
): CloudRunGovernorDecision {
  // 1. Check Conduit Governor (rate limits)
  const conduitDecision = evaluateConduit(portId, clusterId, toolId);
  if (!conduitDecision.allowed) {
    return {
      allowed: false,
      reason: conduitDecision.reason || "CONDUIT_BLOCKED",
    };
  }

  // 2. Check Budget Control Service
  const budgetProvider = "cloudrun";
  const estimatedCost = estimateCloudRunCost(operation, request);
  
  try {
    BudgetControlService.requireBudget(budgetProvider, estimatedCost);
  } catch (error: any) {
    const status = BudgetControlService.getBudgetStatus(budgetProvider);
    return {
      allowed: false,
      reason: "BUDGET_EXCEEDED",
      estimatedCost,
      budgetRemaining: status.remaining,
    };
  }

  // 3. Special check for keep-alive (minInstances > 0)
  if (operation === "setKeepAlive" || (request as CloudRunScaleRequest).minInstances) {
    const minInstances = (request as CloudRunScaleRequest).minInstances || 1;
    if (minInstances > 0) {
      // Keep-alive costs ~$10-30/month per instance
      const monthlyCost = minInstances * 20; // Conservative estimate
      const dailyCost = monthlyCost / 30;
      
      const keepAliveBudget = BudgetControlService.getBudgetStatus("cloudrun-keepalive");
      if (keepAliveBudget.remaining < dailyCost) {
        return {
          allowed: false,
          reason: "KEEPALIVE_BUDGET_EXCEEDED",
          estimatedCost: dailyCost,
          budgetRemaining: keepAliveBudget.remaining,
        };
      }
    }
  }

  // All checks passed
  return {
    allowed: true,
    minInstances: (request as CloudRunScaleRequest).minInstances,
    maxInstances: (request as CloudRunScaleRequest).maxInstances,
    estimatedCost,
  };
}

/**
 * Estimate cost for a Cloud Run operation
 */
function estimateCloudRunCost(
  operation: "deploy" | "scale" | "update" | "setKeepAlive",
  request: CloudRunScaleRequest | CloudRunDeployRequest
): number {
  switch (operation) {
    case "deploy":
      return 0.05; // Deployment API call cost
    case "scale":
      return 0.01; // Scaling operation cost
    case "update":
      return 0.02; // Update operation cost
    case "setKeepAlive":
      // If setting minInstances > 0, estimate monthly cost
      const minInstances = (request as CloudRunScaleRequest).minInstances || 0;
      if (minInstances > 0) {
        const monthlyCost = minInstances * 20; // ~$20/month per instance
        return monthlyCost / 30; // Daily cost
      }
      return 0.01; // Just the API call
    default:
      return 0.01;
  }
}

/**
 * Record Cloud Run operation cost
 */
export function recordCloudRunCost(
  operation: "deploy" | "scale" | "update" | "setKeepAlive",
  request: CloudRunScaleRequest | CloudRunDeployRequest
): void {
  const budgetProvider = "cloudrun";
  const cost = estimateCloudRunCost(operation, request);
  BudgetControlService.recordUsage(budgetProvider, cost);

  // Also record keep-alive cost separately if applicable
  if (operation === "setKeepAlive" || (request as CloudRunScaleRequest).minInstances) {
    const minInstances = (request as CloudRunScaleRequest).minInstances || 0;
    if (minInstances > 0) {
      const monthlyCost = minInstances * 20;
      const dailyCost = monthlyCost / 30;
      BudgetControlService.recordUsage("cloudrun-keepalive", dailyCost);
    }
  }
}

/**
 * Get Cloud Run budget status
 */
export function getCloudRunBudgetStatus(): {
  cloudrun: any;
  keepalive: any;
} {
  return {
    cloudrun: BudgetControlService.getBudgetStatus("cloudrun"),
    keepalive: BudgetControlService.getBudgetStatus("cloudrun-keepalive"),
  };
}


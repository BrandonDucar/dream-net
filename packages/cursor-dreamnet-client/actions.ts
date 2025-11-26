/**
 * Autonomous Action System
 * 
 * Provides safe execution of actions with approval workflows and safety checks.
 * Integrates with DreamNet's Control Core, Policy Engine, and Governance systems.
 */

import { CursorDreamNetClient } from "./index.js";
import type { DreamNetAgent } from "@dreamnet/dreamnet-agent-client";

// Define governance types locally (to avoid rootDir issues)
export type ActorType = "agent" | "wallet" | "system" | "admin";
export type CapabilityType = "publish" | "remix" | "monetize" | "archive" | "deploy" | "modify_schema" | "manage_keys" | "payout";
export type ScopeType = "global" | "dream" | "agent" | "token" | "infrastructure";

export interface ActorContext {
  actorId: string;
  actorType: ActorType;
  walletAddress?: string;
  trustScore?: number;
  stakedTokens?: number;
  completedDreams?: number;
  badges?: string[];
}

export interface ActionRequest {
  /** Action identifier (e.g., "deploy", "kill_switch", "update_config") */
  actionId: string;

  /** Action type/category */
  actionType: "read" | "write" | "delete" | "execute" | "system";

  /** Target resource or agent */
  target: string;

  /** Action parameters */
  params: Record<string, unknown>;

  /** Optional description */
  description?: string;

  /** Optional trace ID for tracking */
  traceId?: string;

  /** Optional metadata */
  meta?: Record<string, unknown>;
}

export interface ActionSafetyCheck {
  /** Whether the action is safe to execute */
  safe: boolean;

  /** Risk score (0-100, higher = more risky) */
  riskScore: number;

  /** Whether approval is required */
  requiresApproval: boolean;

  /** Approval types needed (if requiresApproval) */
  approvalTypes?: string[];

  /** Safety reasons (if not safe) */
  reasons?: string[];

  /** Warnings (if safe but risky) */
  warnings?: string[];

  /** Estimated cost */
  estimatedCost?: number;

  /** Whether audit is required */
  requiresAudit?: boolean;
}

export interface ActionApproval {
  /** Approval ID */
  approvalId: string;

  /** Action request */
  request: ActionRequest;

  /** Safety check result */
  safetyCheck: ActionSafetyCheck;

  /** Approval status */
  status: "pending" | "approved" | "rejected" | "expired";

  /** Approvals received */
  approvals: Array<{
    approver: string;
    type: string;
    timestamp: Date;
    comment?: string;
  }>;

  /** Rejections received */
  rejections: Array<{
    rejector: string;
    reason: string;
    timestamp: Date;
  }>;

  /** Created timestamp */
  createdAt: Date;

  /** Expires at (if applicable) */
  expiresAt?: Date;
}

export interface ActionResult {
  /** Whether the action was executed */
  executed: boolean;

  /** Action request */
  request: ActionRequest;

  /** Safety check result */
  safetyCheck: ActionSafetyCheck;

  /** Approval (if required) */
  approval?: ActionApproval;

  /** Execution result */
  result?: {
    success: boolean;
    data?: any;
    error?: string;
    duration?: number;
  };

  /** Execution timestamp */
  executedAt?: Date;

  /** Trace ID */
  traceId: string;
}

export interface ActionWorkflow {
  /** Workflow ID */
  workflowId: string;

  /** Workflow steps */
  steps: Array<{
    stepId: string;
    action: ActionRequest;
    waitFor?: string[]; // Step IDs to wait for
    condition?: (results: Record<string, ActionResult>) => boolean;
  }>;

  /** Whether steps run in parallel */
  parallel: boolean;

  /** Workflow status */
  status: "pending" | "running" | "completed" | "failed" | "cancelled";

  /** Results for each step */
  results: Record<string, ActionResult>;
}

export class CursorActionSystem {
  private client: CursorDreamNetClient;
  private agent: DreamNetAgent;
  private pendingApprovals: Map<string, ActionApproval> = new Map();

  constructor(client: CursorDreamNetClient) {
    this.client = client;
    this.agent = client.getAgent();
  }

  /**
   * Validate API key (helper method)
   */
  async validateApiKey(): Promise<boolean> {
    try {
      await this.client.isHealthy();
      return true;
    } catch {
      return false;
    }
  }

  // ============================================================================
  // Safety Checks
  // ============================================================================

  /**
   * Check if an action is safe to execute.
   * Integrates with Control Core and Policy Engine.
   */
  async checkSafety(request: ActionRequest): Promise<ActionSafetyCheck> {
    const traceId = request.traceId || `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Check Control Core (kill-switches, rate limits, circuit breakers)
      const controlCheck = await this.checkControlCore(request);
      if (!controlCheck.allowed) {
        return {
          safe: false,
          riskScore: 100,
          requiresApproval: false,
          reasons: [controlCheck.reason || "Control Core blocked action"],
        };
      }

      // Check Policy Engine (risk scoring, cost estimation)
      const policyCheck = await this.checkPolicy(request);
      
      // Determine if approval is required
      const requiresApproval = policyCheck.riskScore > 50 || 
                               request.actionType === "delete" || 
                               request.actionType === "system" ||
                               (policyCheck.requiresAudit && policyCheck.riskScore > 30);

      // Determine approval types needed
      const approvalTypes: string[] = [];
      if (policyCheck.riskScore > 70) {
        approvalTypes.push("operator", "governance");
      } else if (policyCheck.riskScore > 50) {
        approvalTypes.push("operator");
      }
      if (request.actionType === "system") {
        approvalTypes.push("system_admin");
      }

      return {
        safe: policyCheck.allowed && controlCheck.allowed,
        riskScore: policyCheck.riskScore || 0,
        requiresApproval: requiresApproval || false,
        approvalTypes: approvalTypes.length > 0 ? approvalTypes : undefined,
        reasons: !policyCheck.allowed ? [policyCheck.reason || "Policy denied"] : undefined,
        warnings: policyCheck.riskScore > 30 ? [`High risk score: ${policyCheck.riskScore}`] : undefined,
        estimatedCost: policyCheck.estimatedCost,
        requiresAudit: policyCheck.requiresAudit,
      };
    } catch (error: any) {
      return {
        safe: false,
        riskScore: 100,
        requiresApproval: false,
        reasons: [`Safety check failed: ${error.message}`],
      };
    }
  }

  /**
   * Check Control Core (kill-switches, rate limits, circuit breakers)
   */
  private async checkControlCore(request: ActionRequest): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    try {
      // Check global kill-switch
      const systemState = await this.client.getSystemState();
      if (systemState?.controlCore?.globalKillSwitch) {
        return {
          allowed: false,
          reason: "Global kill-switch is enabled",
        };
      }

      // Check cluster state (if applicable)
      const clusterId = this.getClusterId(request);
      if (clusterId && systemState?.controlCore?.clusterStates?.[clusterId] === false) {
        return {
          allowed: false,
          reason: `Cluster ${clusterId} is disabled`,
        };
      }

      // Check circuit breaker (if applicable)
      if (clusterId && systemState?.controlCore?.circuitBreakers?.[clusterId]) {
        return {
          allowed: false,
          reason: `Circuit breaker tripped for ${clusterId}`,
        };
      }

      return { allowed: true };
    } catch (error: any) {
      // If we can't check, default to allowing (but log warning)
      console.warn("[ActionSystem] Control Core check failed, allowing:", error.message);
      return { allowed: true };
    }
  }

  /**
   * Check Policy Engine (risk scoring, cost estimation)
   */
  private async checkPolicy(request: ActionRequest): Promise<{
    allowed: boolean;
    riskScore: number;
    reason?: string;
    estimatedCost?: number;
    requiresAudit?: boolean;
  }> {
    try {
      // Call Policy Engine API (if available)
      const response = await (this.agent as any).request("POST", "/api/control-core/policy/check", {
        traceId: request.traceId,
        routeId: `${request.actionType.toUpperCase()} ${request.target}`,
        clusterId: this.getClusterId(request),
        actionId: request.actionId,
        actionType: request.actionType,
        params: request.params,
      });

      if (response && response.result) {
        return {
          allowed: response.result.allowed !== false,
          riskScore: response.result.extraFlags?.riskScore || 0,
          reason: response.result.reason,
          estimatedCost: response.result.extraFlags?.estimatedCost,
          requiresAudit: response.result.extraFlags?.requiresAudit,
        };
      }

      // Fallback: Basic risk scoring
      let riskScore = 0;
      if (request.actionType === "delete") riskScore += 40;
      if (request.actionType === "system") riskScore += 60;
      if (request.actionType === "write") riskScore += 20;
      if (request.target.includes("kill-switch") || request.target.includes("nuclear")) {
        riskScore += 50;
      }

      return {
        allowed: true,
        riskScore,
        requiresAudit: riskScore > 50,
      };
    } catch (error: any) {
      // If Policy Engine is not available, use basic scoring
      console.warn("[ActionSystem] Policy Engine check failed, using basic scoring:", error.message);
      let riskScore = 0;
      if (request.actionType === "delete") riskScore += 40;
      if (request.actionType === "system") riskScore += 60;
      
      return {
        allowed: true,
        riskScore,
        requiresAudit: riskScore > 50,
      };
    }
  }

  /**
   * Get cluster ID from action request
   */
  private getClusterId(request: ActionRequest): string | undefined {
    // Map targets to cluster IDs
    if (request.target.includes("wolf-pack") || request.target.includes("wolf_pack")) {
      return "WOLF_PACK";
    }
    if (request.target.includes("shield") || request.target.includes("shield_core")) {
      return "SHIELD_CORE";
    }
    if (request.target.includes("dream-state") || request.target.includes("dream_state")) {
      return "DREAM_STATE";
    }
    if (request.target.includes("deploy") || request.target.includes("deploy_keeper")) {
      return "DEPLOY_KEEPER";
    }
    return undefined;
  }

  // ============================================================================
  // Approval Workflows
  // ============================================================================

  /**
   * Request approval for an action.
   * Returns an approval object that can be polled for status.
   */
  async requestApproval(request: ActionRequest): Promise<ActionApproval> {
    const safetyCheck = await this.checkSafety(request);

    if (!safetyCheck.requiresApproval) {
      throw new Error("Action does not require approval");
    }

    const approvalId = `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const approval: ActionApproval = {
      approvalId,
      request,
      safetyCheck,
      status: "pending",
      approvals: [],
      rejections: [],
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    this.pendingApprovals.set(approvalId, approval);

    // Submit approval request to governance system (if available)
    try {
      const response = await (this.agent as any).request("POST", "/api/governance/approval/request", {
        approvalId,
        request,
        safetyCheck,
        approvalTypes: safetyCheck.approvalTypes,
      });

      if (response && response.approvalId) {
        approval.approvalId = response.approvalId;
      }
    } catch (error: any) {
      console.warn("[ActionSystem] Governance approval request failed:", error.message);
      // Continue with local approval tracking
    }

    return approval;
  }

  /**
   * Get approval status.
   */
  async getApprovalStatus(approvalId: string): Promise<ActionApproval | null> {
    // Check local cache first
    const localApproval = this.pendingApprovals.get(approvalId);
    if (localApproval) {
      // Try to refresh from server
      try {
        const response = await (this.agent as any).request("GET", `/api/governance/approval/${approvalId}`);
        if (response && response.approval) {
          return response.approval;
        }
      } catch (error: any) {
        // Use local cache if server unavailable
      }
      return localApproval;
    }

    // Try to fetch from server
    try {
      const response = await (this.agent as any).request("GET", `/api/governance/approval/${approvalId}`);
      if (response && response.approval) {
        return response.approval;
      }
    } catch (error: any) {
      console.warn("[ActionSystem] Failed to fetch approval:", error.message);
    }

    return null;
  }

  /**
   * Wait for approval (polling).
   */
  async waitForApproval(
    approvalId: string,
    options?: {
      timeout?: number; // milliseconds
      interval?: number; // milliseconds
    }
  ): Promise<ActionApproval> {
    const timeout = options?.timeout || 300000; // 5 minutes default
    const interval = options?.interval || 5000; // 5 seconds default
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const approval = await this.getApprovalStatus(approvalId);
      if (!approval) {
        throw new Error(`Approval ${approvalId} not found`);
      }

      if (approval.status !== "pending") {
        return approval;
      }

      // Check expiration
      if (approval.expiresAt && new Date(approval.expiresAt) < new Date()) {
        approval.status = "expired";
        return approval;
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`Approval timeout after ${timeout}ms`);
  }

  // ============================================================================
  // Action Execution
  // ============================================================================

  /**
   * Execute an action with safety checks and approval workflow.
   */
  async executeAction(request: ActionRequest, options?: {
    autoApprove?: boolean; // Auto-approve if safe (use with caution)
    skipApproval?: boolean; // Skip approval even if required (use with caution)
    timeout?: number; // Execution timeout
  }): Promise<ActionResult> {
    const traceId = request.traceId || `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    request.traceId = traceId;

    const startTime = Date.now();

    // Safety check
    const safetyCheck = await this.checkSafety(request);

    if (!safetyCheck.safe) {
      return {
        executed: false,
        request,
        safetyCheck,
        result: {
          success: false,
          error: `Action not safe: ${safetyCheck.reasons?.join(", ")}`,
        },
        traceId,
      };
    }

    // Approval workflow
    let approval: ActionApproval | undefined;
    if (safetyCheck.requiresApproval && !options?.skipApproval) {
      if (options?.autoApprove && safetyCheck.riskScore < 50) {
        // Auto-approve low-risk actions
        approval = {
          approvalId: `auto-${traceId}`,
          request,
          safetyCheck,
          status: "approved",
          approvals: [{ approver: "auto", type: "auto", timestamp: new Date() }],
          rejections: [],
          createdAt: new Date(),
        };
      } else {
        // Request approval
        approval = await this.requestApproval(request);
        const finalApproval = await this.waitForApproval(approval.approvalId, {
          timeout: options?.timeout,
        });

        if (finalApproval.status !== "approved") {
          return {
            executed: false,
            request,
            safetyCheck,
            approval: finalApproval,
            result: {
              success: false,
              error: `Approval ${finalApproval.status}: ${finalApproval.rejections.map(r => r.reason).join(", ")}`,
            },
            traceId,
          };
        }

        approval = finalApproval;
      }
    }

    // Execute action
    try {
      const executionStart = Date.now();
      const result = await this.executeActionInternal(request, options?.timeout);
      const duration = Date.now() - executionStart;

      // Log to audit (if required)
      if (safetyCheck.requiresAudit) {
        await this.logAudit(request, result, safetyCheck, approval);
      }

      return {
        executed: true,
        request,
        safetyCheck,
        approval,
        result: {
          success: result.success !== false,
          data: result.data,
          error: result.error,
          duration,
        },
        executedAt: new Date(),
        traceId,
      };
    } catch (error: any) {
      return {
        executed: false,
        request,
        safetyCheck,
        approval,
        result: {
          success: false,
          error: error.message,
          duration: Date.now() - startTime,
        },
        traceId,
      };
    }
  }

  /**
   * Execute action internally (actual execution).
   */
  private async executeActionInternal(
    request: ActionRequest,
    timeout?: number
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    // Map action to API endpoint
    const endpoint = this.getActionEndpoint(request);
    const method = this.getActionMethod(request);

    try {
      // Note: DreamNetAgent.request doesn't support AbortController directly
      // We'll rely on the agent's built-in timeout
      const response = await (this.agent as any).request(method, endpoint, request.params);

      return {
        success: response.success !== false,
        data: response.data || response,
        error: response.error,
      };
    } catch (error: any) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Action timeout",
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get API endpoint for action.
   */
  private getActionEndpoint(request: ActionRequest): string {
    // Map action IDs to endpoints
    const actionMap: Record<string, string> = {
      deploy: `/api/deploy-keeper/deploy`,
      kill_switch: `/api/control-core/kill-switch`,
      update_config: `/api/control-core/config`,
      query_agent: `/api/agent/${request.target}/query`,
      trigger_action: `/api/agent/${request.target}/action`,
    };

    return actionMap[request.actionId] || `/api/action/${request.actionId}`;
  }

  /**
   * Get HTTP method for action.
   */
  private getActionMethod(request: ActionRequest): "GET" | "POST" | "PUT" | "PATCH" | "DELETE" {
    if (request.actionType === "read") return "GET";
    if (request.actionType === "delete") return "DELETE";
    if (request.actionType === "write" || request.actionType === "execute") return "POST";
    return "POST";
  }

  /**
   * Log action to audit system.
   */
  private async logAudit(
    request: ActionRequest,
    result: { success: boolean; data?: any; error?: string },
    safetyCheck: ActionSafetyCheck,
    approval?: ActionApproval
  ): Promise<void> {
    try {
      await this.client.getMemory().logCursorAction("action_executed", {
        actionId: request.actionId,
        actionType: request.actionType,
        target: request.target,
        success: result.success,
        riskScore: safetyCheck.riskScore,
        approvalId: approval?.approvalId,
        traceId: request.traceId,
      });
    } catch (error: any) {
      console.warn("[ActionSystem] Audit logging failed:", error.message);
    }
  }

  // ============================================================================
  // Workflow Execution
  // ============================================================================

  /**
   * Execute a workflow of actions.
   */
  async executeWorkflow(workflow: ActionWorkflow): Promise<ActionWorkflow> {
    workflow.status = "running";

    if (workflow.parallel) {
      // Execute all steps in parallel
      const stepPromises = workflow.steps.map(async (step) => {
        const result = await this.executeAction(step.action);
        workflow.results[step.stepId] = result;
        return { stepId: step.stepId, result };
      });

      await Promise.all(stepPromises);
    } else {
      // Execute steps sequentially
      for (const step of workflow.steps) {
        // Wait for dependencies
        if (step.waitFor) {
          for (const depStepId of step.waitFor) {
            const depResult = workflow.results[depStepId];
            if (!depResult || !depResult.executed) {
              workflow.status = "failed";
              return workflow;
            }
          }
        }

        // Check condition
        if (step.condition && !step.condition(workflow.results)) {
          workflow.status = "failed";
          return workflow;
        }

        // Execute step
        const result = await this.executeAction(step.action);
        workflow.results[step.stepId] = result;

        if (!result.executed || !result.result?.success) {
          workflow.status = "failed";
          return workflow;
        }
      }
    }

    workflow.status = "completed";
    return workflow;
  }
}

/**
 * Get action system instance (helper to avoid circular dependencies)
 */
export function getActionSystem(client: CursorDreamNetClient): CursorActionSystem {
  return new CursorActionSystem(client);
}


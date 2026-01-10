/**
 * Agent Gateway Tool Executor
 * Executes tools by calling underlying DreamNet organs
 */

import type { RequestWithIdentity } from "@dreamnet/dreamnet-control-core/identityResolver";
import type { ToolId } from "./tools";
import { getToolConfig } from "./tools";
import { recordAgentActivity } from "./activity";
import { evaluateConduit, getConduitConfig, recordConduitFailure } from "@dreamnet/dreamnet-control-core/conduitGovernor";
import { getConduitConfig as getConduitConfigFromRegistry } from "@dreamnet/dreamnet-control-core/conduits";
import { addDeadLetterRecord } from "@dreamnet/dreamnet-control-core/deadLetter";
import type { PortId } from "@dreamnet/port-governor/types";
import type { ClusterId } from "@dreamnet/dreamnet-control-core/clusters";

/**
 * Emit Nerve event for tool execution
 */
async function emitToolExecutionEvent(
  toolId: ToolId,
  ok: boolean,
  req: RequestWithIdentity,
  latencyMs?: number,
  error?: string,
  isTimeout?: boolean
): Promise<void> {
  try {
    const { NERVE_BUS } = await import("@dreamnet/nerve/bus");
    const { createNerveEvent } = await import("@dreamnet/nerve/factory");
    const toolConfig = getToolConfig(toolId);
    const risk = toolConfig?.riskLevel ?? "medium";

    // Calculate risk score from risk level
    const riskScore =
      risk === "low"
        ? 0.2
        : risk === "medium"
        ? 0.5
        : risk === "high"
        ? 0.8
        : 0.95;

    const event = createNerveEvent({
      channelId: ok && !isTimeout ? "HTTP_REQUEST" : "SHIELD_EVENT",
      kind: ok && !isTimeout ? "REQUEST_DECISION" : "THREAT_DETECTED",
      priority: ok && !isTimeout ? 3 : 5, // Higher priority for failures/timeouts
      context: {
        traceId: req.traceId,
        clusterId: toolConfig?.clusterId,
        tierId: req.callerIdentity?.tierId,
        citizenId: req.callerIdentity?.passport?.citizenId,
        officeIds: req.callerIdentity?.officeIds,
        cabinetIds: req.callerIdentity?.cabinetIds,
        costEstimate: toolConfig?.cost?.estimatedDollarCost,
        riskScore,
      },
      payload: {
        integration: "agent_gateway",
        action: "tool_executed",
        toolId,
        portId: toolConfig?.portId,
        conduitId: (req as any).conduitId,
        ok,
        error: !ok ? error : undefined,
        reason: isTimeout ? "TIMEOUT" : !ok ? "FAILURE" : undefined,
        latencyMs,
        riskLevel: risk,
      },
      defaultSampleRate: ok ? 0.2 : 1.0, // Always sample failures
    });

    NERVE_BUS.publish(event);
  } catch (error) {
    // Nerve not available, continue
  }
}

export interface ToolExecutionResult {
  toolId: ToolId;
  ok: boolean;
  error?: string;
  data?: unknown;
  latencyMs?: number;
}

/**
 * Execute a tool by calling the underlying DreamNet organ
 */
export interface ToolExecutionContext {
  toolId: ToolId;
  caller: RequestWithIdentity["callerIdentity"];
  // optional future: per-caller budgets, etc.
}

export async function executeTool(
  toolId: ToolId,
  payload: Record<string, unknown>,
  req: RequestWithIdentity
): Promise<ToolExecutionResult> {
  const startTime = Date.now();
  const toolConfig = getToolConfig(toolId);
  const caller = req.callerIdentity;

  if (!toolConfig) {
    return {
      toolId,
      ok: false,
      error: "UNKNOWN_TOOL",
    };
  }

  // Basic risk guard: forbid high/critical tools at lower tiers unless GodVault
  const risk = toolConfig.riskLevel ?? "medium";
  if (!caller?.isGodVault) {
    if (risk === "critical" && caller?.tierId !== "GOD_MODE") {
      return {
        toolId,
        ok: false,
        error: "RISK_TOO_HIGH_FOR_TIER",
        data: {
          riskLevel: risk,
          tierId: caller?.tierId,
          requiredTier: "GOD_MODE",
        },
      };
    }
  }

  // TODO: In future, enforce per-caller cost budgets using toolConfig.cost

  // Conduit evaluation (per-line enforcement)
  const portId = ((req as any).portId ?? "AGENT_GATEWAY") as PortId;
  const clusterId = toolConfig.clusterId as ClusterId;
  const conduitDecision = evaluateConduit(portId, clusterId, toolId);

  if (!conduitDecision.allowed) {
    return {
      toolId,
      ok: false,
      error: conduitDecision.reason ?? "CONDUIT_BLOCKED",
      data: {
        conduitId: conduitDecision.conduitId,
        portId,
        clusterId,
      },
    };
  }

  // Get conduit config for timeout check
  const conduitConfig = conduitDecision.conduitId
    ? getConduitConfigFromRegistry(portId, clusterId, toolId)
    : undefined;
  const timeoutMs = conduitConfig?.budgets.maxExecutionTimeMs;

  // Track execution start for timeout detection
  const executionStartTime = Date.now();

  try {
    let result: ToolExecutionResult;

    // Route to appropriate executor based on tool ID
    // Wrap in timeout if conduit has maxExecutionTimeMs
    let executionPromise: Promise<ToolExecutionResult>;
    
    if (toolId.startsWith("env.")) {
      executionPromise = executeEnvTool(toolId, payload, req);
    } else if (toolId.startsWith("api.")) {
      executionPromise = executeApiTool(toolId, payload, req);
    } else if (toolId.startsWith("vercel.")) {
      executionPromise = executeVercelTool(toolId, payload, req);
    } else if (toolId === "diagnostics.ping") {
      executionPromise = executeDiagnosticsTool(toolId, payload, req);
    } else {
      executionPromise = Promise.resolve({
        toolId,
        ok: false,
        error: "TOOL_NOT_IMPLEMENTED",
        latencyMs: Date.now() - startTime,
      });
    }

    // Apply timeout if configured
    if (timeoutMs && timeoutMs > 0) {
      const timeoutPromise = new Promise<ToolExecutionResult>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`TIMEOUT: Tool execution exceeded ${timeoutMs}ms`));
        }, timeoutMs);
      });

      result = await Promise.race([executionPromise, timeoutPromise]);
    } else {
      result = await executionPromise;
    }

    // Check if execution exceeded timeout (race condition check)
    const executionTime = Date.now() - executionStartTime;
    if (timeoutMs && executionTime > timeoutMs) {
      result = {
        toolId,
        ok: false,
        error: "TIMEOUT",
        data: {
          timeoutMs,
          executionTimeMs: executionTime,
          conduitId: conduitDecision.conduitId,
        },
        latencyMs: executionTime,
      };
    }

    // Handle timeout or failure - add to dead-letter if critical conduit
    const isTimeout = result.error === "TIMEOUT" || (result.error && result.error.includes("TIMEOUT"));
    const isCriticalConduit = conduitConfig && conduitConfig.priorityLane >= 4;

    // Record failure/timeout in conduit usage metrics
    if (!result.ok && conduitDecision.conduitId) {
      recordConduitFailure(
        conduitDecision.conduitId,
        result.error || "UNKNOWN_ERROR",
        isTimeout
      );
    }

    if ((!result.ok || isTimeout) && isCriticalConduit && conduitDecision.conduitId) {
      addDeadLetterRecord({
        conduitId: conduitDecision.conduitId,
        traceId: req.traceId || "unknown",
        toolId,
        portId,
        clusterId,
        error: result.error || "UNKNOWN_ERROR",
        errorType: isTimeout ? "TIMEOUT" : "FAILURE",
        citizenId: caller?.passport?.citizenId,
        tierId: caller?.tierId,
      });
    }

    // Emit Nerve event for tool execution (with timeout/threat detection)
    await emitToolExecutionEvent(
      toolId,
      result.ok && !isTimeout,
      req,
      result.latencyMs,
      result.error,
      !!isTimeout
    );

    // Attach conduit ID to request for downstream use
    (req as any).conduitId = conduitDecision.conduitId;

    // Record activity for DreamScope
    recordAgentActivity({
      toolId,
      intent: (payload as any).intent || toolId,
      citizenId: caller?.passport?.citizenId,
      tierId: caller?.tierId,
      ok: result.ok && !isTimeout,
      latencyMs: result.latencyMs,
      riskLevel: toolConfig.riskLevel,
      error: result.error,
      portId: toolConfig.portId,
      conduitId: conduitDecision.conduitId,
    });

    return result;
  } catch (error: any) {
    const isTimeout = error.message && error.message.includes("TIMEOUT");
    const result: ToolExecutionResult = {
      toolId,
      ok: false,
      error: isTimeout ? "TIMEOUT" : error.message || "EXECUTION_ERROR",
      latencyMs: Date.now() - startTime,
    };

    // Add to dead-letter if critical conduit
    const conduitConfig = conduitDecision.conduitId
      ? getConduitConfigFromRegistry(portId, clusterId, toolId)
      : undefined;
    const isCriticalConduit = conduitConfig && conduitConfig.priorityLane >= 4;

    // Record failure/timeout in conduit usage metrics
    if (conduitDecision.conduitId) {
      recordConduitFailure(
        conduitDecision.conduitId,
        result.error || "UNKNOWN_ERROR",
        isTimeout
      );
    }

    if (isCriticalConduit && conduitDecision.conduitId) {
      addDeadLetterRecord({
        conduitId: conduitDecision.conduitId,
        traceId: req.traceId || "unknown",
        toolId,
        portId,
        clusterId,
        error: result.error || "UNKNOWN_ERROR",
        errorType: isTimeout ? "TIMEOUT" : "ERROR",
        citizenId: caller?.passport?.citizenId,
        tierId: caller?.tierId,
      });
    }

    // Emit failure event (with threat detection for timeouts)
    await emitToolExecutionEvent(toolId, false, req, result.latencyMs, result.error, isTimeout);

    return result;
  }
}

/**
 * Execute Env Keeper tools
 */
async function executeEnvTool(
  toolId: ToolId,
  payload: Record<string, unknown>,
  req: RequestWithIdentity
): Promise<ToolExecutionResult> {
  const startTime = Date.now();

  try {
    const { EnvKeeperCore } = await import("@dreamnet/env-keeper-core");

    if (toolId === "env.get") {
      const key = payload.key as string;
      if (!key) {
        return {
          toolId,
          ok: false,
          error: "KEY_REQUIRED",
        };
      }

      const envVar = EnvKeeperCore.get(key, false); // Don't decrypt for security
      if (!envVar) {
        return {
          toolId,
          ok: false,
          error: "ENV_VAR_NOT_FOUND",
          data: { key },
        };
      }

      return {
        toolId,
        ok: true,
        data: {
          key: envVar.key,
          category: envVar.category,
          isSecret: envVar.isSecret,
          value: envVar.isSecret ? "[ENCRYPTED]" : envVar.value,
          description: envVar.description,
          environments: envVar.environments,
          createdAt: envVar.createdAt,
          updatedAt: envVar.updatedAt,
        },
        latencyMs: Date.now() - startTime,
      };
    }

    if (toolId === "env.set") {
      const key = payload.key as string;
      const value = payload.value as string;
      const category = payload.category as string;
      const isSecret = payload.isSecret as boolean | undefined;
      const description = payload.description as string | undefined;
      const environments = payload.environments as string[] | undefined;

      if (!key || value === undefined) {
        return {
          toolId,
          ok: false,
          error: "KEY_AND_VALUE_REQUIRED",
        };
      }

      const envVar = EnvKeeperCore.set(key, value, {
        category,
        isSecret,
        description,
        environments,
      });

      return {
        toolId,
        ok: true,
        data: {
          key: envVar.key,
          category: envVar.category,
          isSecret: envVar.isSecret,
          value: envVar.isSecret ? "[ENCRYPTED]" : envVar.value,
          description: envVar.description,
          environments: envVar.environments,
          createdAt: envVar.createdAt,
          updatedAt: envVar.updatedAt,
        },
        latencyMs: Date.now() - startTime,
      };
    }

    if (toolId === "env.delete") {
      const key = payload.key as string;
      if (!key) {
        return {
          toolId,
          ok: false,
          error: "KEY_REQUIRED",
        };
      }

      const deleted = EnvKeeperCore.delete(key);
      if (!deleted) {
        return {
          toolId,
          ok: false,
          error: "ENV_VAR_NOT_FOUND",
          data: { key },
        };
      }

      return {
        toolId,
        ok: true,
        data: {
          key,
          deleted: true,
        },
        latencyMs: Date.now() - startTime,
      };
    }

    return {
      toolId,
      ok: false,
      error: "UNKNOWN_ENV_TOOL",
    };
  } catch (error: any) {
    return {
      toolId,
      ok: false,
      error: error.message || "ENV_KEEPER_ERROR",
      latencyMs: Date.now() - startTime,
    };
  }
}

/**
 * Execute API Keeper tools
 */
async function executeApiTool(
  toolId: ToolId,
  payload: Record<string, unknown>,
  req: RequestWithIdentity
): Promise<ToolExecutionResult> {
  const startTime = Date.now();

  try {
    const { APIKeeperCore } = await import("@dreamnet/api-keeper-core");

    if (toolId === "api.listKeys") {
      const keys = APIKeeperCore.listKeys();
      
      // Return summary (no raw keys)
      const summary = keys.map((key) => ({
        id: key.id,
        providerId: key.providerId,
        name: key.name,
        status: key.status,
        usageCount: key.usageCount,
        usageThisMonth: key.usageThisMonth,
        costThisMonth: key.costThisMonth,
        createdAt: key.createdAt,
        lastUsedAt: key.lastUsedAt,
        expiresAt: key.expiresAt,
      }));

      return {
        toolId,
        ok: true,
        data: {
          keys: summary,
          count: keys.length,
        },
        latencyMs: Date.now() - startTime,
      };
    }

    if (toolId === "api.rotateKey") {
      const keyId = payload.keyId as string;
      if (!keyId) {
        return {
          toolId,
          ok: false,
          error: "KEY_ID_REQUIRED",
        };
      }

      // TODO: Implement actual key rotation logic
      // For now, return a placeholder
      return {
        toolId,
        ok: false,
        error: "KEY_ROTATION_NOT_IMPLEMENTED",
        data: {
          message: "Key rotation will be implemented in a future update",
          keyId,
        },
        latencyMs: Date.now() - startTime,
      };
    }

    return {
      toolId,
      ok: false,
      error: "UNKNOWN_API_TOOL",
    };
  } catch (error: any) {
    return {
      toolId,
      ok: false,
      error: error.message || "API_KEEPER_ERROR",
      latencyMs: Date.now() - startTime,
    };
  }
}

/**
 * Execute Vercel Agent tools
 */
async function executeVercelTool(
  toolId: ToolId,
  payload: Record<string, unknown>,
  req: RequestWithIdentity
): Promise<ToolExecutionResult> {
  const startTime = Date.now();

  try {
    const { DreamNetVercelAgent } = await import("@dreamnet/dreamnet-vercel-agent");

    if (toolId === "vercel.listProjects") {
      const projects = await DreamNetVercelAgent.listProjects();

      return {
        toolId,
        ok: true,
        data: {
          projects: projects.map((p) => ({
            id: p.id,
            name: p.name,
            // Add other safe fields as needed
          })),
          count: projects.length,
        },
        latencyMs: Date.now() - startTime,
      };
    }

    if (toolId === "vercel.deploy") {
      const projectName = payload.projectName as string;
      const targetDomain = payload.targetDomain as string | undefined;

      if (!projectName) {
        return {
          toolId,
          ok: false,
          error: "PROJECT_NAME_REQUIRED",
        };
      }

      // Get project to verify it exists
      const project = await DreamNetVercelAgent.getProject(projectName);
      if (!project) {
        return {
          toolId,
          ok: false,
          error: "PROJECT_NOT_FOUND",
          data: { projectName },
        };
      }

      // For now, return project info and indicate deploy would be triggered
      // Actual deploy logic can be added when Vercel Agent has deploy method
      return {
        toolId,
        ok: true,
        data: {
          message: "Deploy operation prepared (actual deploy will be implemented)",
          project: {
            id: project.id,
            name: project.name,
            accountId: project.accountId,
            latestDeployment: project.latestDeployment,
          },
          targetDomain: targetDomain || "dreamnet.ink",
          status: "prepared",
          note: "Vercel deploy API integration pending",
        },
        latencyMs: Date.now() - startTime,
      };
    }

    return {
      toolId,
      ok: false,
      error: "UNKNOWN_VERCEL_TOOL",
    };
  } catch (error: any) {
    return {
      toolId,
      ok: false,
      error: error.message || "VERCEL_AGENT_ERROR",
      latencyMs: Date.now() - startTime,
    };
  }
}

/**
 * Execute diagnostics tools
 */
async function executeDiagnosticsTool(
  toolId: ToolId,
  payload: Record<string, unknown>,
  req: RequestWithIdentity
): Promise<ToolExecutionResult> {
  const startTime = Date.now();

  try {
    // Simple ping - return system status
    return {
      toolId,
      ok: true,
      data: {
        message: "DreamNet core is online",
        timestamp: new Date().toISOString(),
        caller: {
          tierId: req.callerIdentity?.tierId,
          citizenId: req.callerIdentity?.passport?.citizenId,
        },
      },
      latencyMs: Date.now() - startTime,
    };
  } catch (error: any) {
    return {
      toolId,
      ok: false,
      error: error.message || "DIAGNOSTICS_ERROR",
      latencyMs: Date.now() - startTime,
    };
  }
}


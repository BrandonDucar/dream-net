/**
 * Agent Gateway
 * High-bandwidth, AI-native ingress for ChatGPT, Cursor, Replit agents, and other DreamNet-integrated AIs
 * Upgraded with intent router and tool registry
 */

import { Router, Response } from "express";
import { withPort } from "../../packages/port-governor/src/withPort";
import { withGovernance } from "../../packages/dreamnet-control-core/controlCoreMiddleware";
import type { RequestWithIdentity } from "../../packages/dreamnet-control-core/identityResolver";
import {
  resolveIntentToTool,
  isToolAllowedForCaller,
  type AgentGatewayRequestBody,
} from "../../packages/agent-gateway/src/router";
import { getToolConfig, listTools } from "../../packages/agent-gateway/src/tools";
import { executeTool } from "../../packages/agent-gateway/src/executor";

const router = Router();

/**
 * GET /api/agent/gateway/tools
 * List all available tools (filtered by caller permissions)
 */
router.get(
  "/agent/gateway/tools",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "API_KEEPER" }),
  async (req: RequestWithIdentity, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const traceId = r.traceId || "unknown";
      const callerIdentity = r.callerIdentity;

      const allTools = listTools();
      const availableTools = [];

      // Filter tools by caller permissions
      for (const tool of allTools) {
        const { allowed } = isToolAllowedForCaller(tool.id, r);
        if (allowed) {
          availableTools.push({
            id: tool.id,
            label: tool.label,
            description: tool.description,
            clusterId: tool.clusterId,
            portId: tool.portId,
            minTier: tool.minTier,
          });
        }
      }

      return res.json({
        success: true,
        traceId,
        citizenId: callerIdentity?.passport?.citizenId,
        tierId: callerIdentity?.tierId,
        tools: availableTools,
        totalTools: allTools.length,
        availableTools: availableTools.length,
        message: "Available tools filtered by your permissions",
      });
    } catch (error: any) {
      res.status(500).json({
        error: "GATEWAY_ERROR",
        message: error.message,
        traceId: req.traceId || "unknown",
      });
    }
  }
);

/**
 * POST /api/agent/gateway
 * Agent Gateway endpoint - single AI-native entry point for ChatGPT, Cursor, Replit agents
 * Routes intents to tools via Tool Registry
 */
router.post(
  "/agent/gateway",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "API_KEEPER" }),
  async (req: RequestWithIdentity, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const body = req.body as AgentGatewayRequestBody | undefined;
      const traceId = r.traceId || "unknown";
      const callerIdentity = r.callerIdentity;

      // Validation
      if (!body?.intent || typeof body.intent !== "string") {
        return res.status(400).json({
          traceId,
          error: "INTENT_REQUIRED",
          message: "Intent is required and must be a string",
        });
      }

      // 1) Resolve intent → tool
      const resolution = resolveIntentToTool(body);
      if (!resolution.tool) {
        return res.status(400).json({
          traceId,
          error: "NO_MATCHING_TOOL",
          reason: resolution.reason,
          intent: body.intent,
          message: "Could not resolve intent to a known tool. Use tool IDs like 'env.get', 'api.listKeys', 'vercel.deploy', or natural language.",
        });
      }

      const toolId = resolution.tool;
      const toolConfig = getToolConfig(toolId);

      if (!toolConfig) {
        return res.status(404).json({
          traceId,
          error: "UNKNOWN_TOOL",
          toolId,
          message: `Tool ${toolId} not found in registry`,
        });
      }

      // 2) Governance / policy check
      const { allowed, reason } = isToolAllowedForCaller(toolId, r);
      if (!allowed) {
        return res.status(403).json({
          traceId,
          error: "TOOL_NOT_ALLOWED",
          toolId,
          reason,
          toolConfig: {
            id: toolConfig.id,
            label: toolConfig.label,
            minTier: toolConfig.minTier,
            requiredOfficeIds: toolConfig.requiredOfficeIds,
            requiredCabinetIds: toolConfig.requiredCabinetIds,
          },
          caller: {
            tierId: callerIdentity?.tierId,
            officeIds: callerIdentity?.officeIds ?? [],
            cabinetIds: callerIdentity?.cabinetIds ?? [],
            isGodVault: callerIdentity?.isGodVault ?? false,
          },
          message: `Access denied: ${reason}. Required: tier ${toolConfig.minTier} or higher${toolConfig.requiredOfficeIds?.length ? `, office: ${toolConfig.requiredOfficeIds.join(" or ")}` : ""}${toolConfig.requiredCabinetIds?.length ? `, cabinet: ${toolConfig.requiredCabinetIds.join(" or ")}` : ""}`,
        });
      }

      // 3) Execute tool
      const executionResult = await executeTool(toolId, body.payload || {}, r);

      if (!executionResult.ok) {
        return res.status(400).json({
          traceId,
          error: "TOOL_EXECUTION_FAILED",
          toolId,
          executionError: executionResult.error,
          data: executionResult.data,
        });
      }

      // 4) Return execution result
      return res.json({
        traceId,
        citizenId: callerIdentity?.passport?.citizenId,
        tierId: callerIdentity?.tierId,
        officeIds: callerIdentity?.officeIds ?? [],
        cabinetIds: callerIdentity?.cabinetIds ?? [],
        intent: body.intent,
        toolId,
        toolConfig: {
          id: toolConfig.id,
          label: toolConfig.label,
          description: toolConfig.description,
          clusterId: toolConfig.clusterId,
          portId: toolConfig.portId,
          minTier: toolConfig.minTier,
        },
        constraints: body.constraints ?? {},
        payload: body.payload ?? {},
        result: {
          ok: executionResult.ok,
          data: executionResult.data,
          latencyMs: executionResult.latencyMs,
        },
        message: "Tool executed successfully",
        status: "completed",
      });
    } catch (error: any) {
      res.status(500).json({
        error: "GATEWAY_ERROR",
        message: error.message,
        traceId: req.traceId || "unknown",
      });
    }
  }
);

export default router;


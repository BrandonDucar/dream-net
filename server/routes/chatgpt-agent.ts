/**
 * ChatGPT Agent Mode Interface
 * Natural language interface for ChatGPT to interact with DreamNet
 */

import { Router, Request, Response } from "express";
import { requireApiKey } from "../middleware/apiKeyAuth";
import { DreamNetVercelAgent } from "@dreamnet/dreamnet-vercel-agent";
import { DreamNetOSCore } from "@dreamnet/dreamnet-os-core";
import { APIKeeperCore } from "@dreamnet/api-keeper-core";
import { withPort } from "@dreamnet/port-governor/withPort";
import { withGovernance } from "@dreamnet/dreamnet-control-core/controlCoreMiddleware";
import type { RequestWithIdentity } from "@dreamnet/dreamnet-control-core/identityResolver";

const router = Router();

/**
 * GET /api/chatgpt-agent/context
 * Provides ChatGPT with context about DreamNet's capabilities
 */
router.get("/context", requireApiKey, async (req: Request, res: Response) => {
  try {
    const context = {
      system: "DreamNet",
      description: "A biomimetic digital organism with autonomous agents and systems",
      capabilities: {
        deployment: {
          description: "Manage Vercel deployments and projects",
          endpoints: [
            "GET /api/vercel/projects - List all projects",
            "GET /api/vercel/project/:name - Get specific project",
            "GET /api/vercel/analyze - Analyze cleanup opportunities",
            "POST /api/vercel/cleanup/auto - Auto-cleanup projects",
          ],
          examples: [
            "List all Vercel projects",
            "Show me the dreamnet.ink project",
            "Analyze Vercel projects for cleanup",
            "Clean up duplicate projects",
          ],
        },
        monitoring: {
          description: "Monitor DreamNet system status and health",
          endpoints: [
            "GET /api/heartbeat - Full system status",
            "GET /api/system/state - System state",
            "GET /api/system/spider - Spider Web status",
            "GET /api/system/shields - Shield Core status",
          ],
          examples: [
            "What's DreamNet's current status?",
            "Show me system health",
            "Check Shield Core threats",
            "What's happening in Spider Web?",
          ],
        },
        dreams: {
          description: "Manage dreams (user-submitted content)",
          endpoints: [
            "GET /api/dreams - List dreams",
            "GET /api/dreams/:id - Get specific dream",
            "POST /api/dreams - Create dream",
          ],
          examples: [
            "List all dreams",
            "Show me dream #123",
            "Create a new dream",
          ],
        },
        wolfPack: {
          description: "Wolf Pack funding system - lead discovery and outreach",
          endpoints: [
            "GET /api/wolf-pack/opportunities - List opportunities",
            "POST /api/wolf-pack/discover - Discover new leads",
            "POST /api/wolf-pack/hunt - Start a hunt",
          ],
          examples: [
            "What funding opportunities are available?",
            "Discover new leads",
            "Start a funding hunt",
          ],
        },
        shield: {
          description: "Shield Core - security and threat detection",
          endpoints: [
            "GET /api/shield/status - Shield status",
            "GET /api/shield/threats - Recent threats",
            "POST /api/shield/detect - Detect threat",
          ],
          examples: [
            "Show me Shield Core status",
            "What threats have been detected?",
            "Check for security threats",
          ],
        },
      },
      baseUrl: process.env.DREAMNET_BASE_URL || "https://dreamnet.ink",
      authentication: {
        method: "API Key",
        header: "Authorization: Bearer YOUR_API_KEY",
        alternateHeader: "X-API-Key: YOUR_API_KEY",
      },
    };

    res.json({
      success: true,
      context,
      message: "Use this context to understand DreamNet's capabilities",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/chatgpt-agent/chat
 * Natural language interface - ChatGPT sends a message, DreamNet responds with actions
 * Routes through AGENT_GATEWAY port
 */
router.post(
  "/chat",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "API_KEEPER" }),
  async (req: RequestWithIdentity, res: Response) => {
    try {
    const { message, context } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required",
        suggestion: "Send a natural language message like 'Show me DreamNet status' or 'List Vercel projects'",
      });
    }

    const lowerMessage = message.toLowerCase();
    const response: any = {
      message,
      understood: true,
      actions: [],
      data: null,
      suggestions: [],
    };

    // Parse intent and execute actions
    if (lowerMessage.includes("vercel") || lowerMessage.includes("deploy") || lowerMessage.includes("project")) {
      // Vercel-related queries
      if (lowerMessage.includes("list") || lowerMessage.includes("show") || lowerMessage.includes("all")) {
        try {
          const projects = await DreamNetVercelAgent.analyzeCleanup();
          response.actions.push({
            type: "vercel_list_projects",
            endpoint: "GET /api/vercel/projects",
            description: "List all Vercel projects",
          });
          response.data = {
            projectsFound: projects.length,
            message: `Found ${projects.length} potential cleanup actions. Use GET /api/vercel/projects to see all projects.`,
          };
          response.suggestions.push("Try: GET /api/vercel/projects to see all projects");
        } catch (error: any) {
          response.data = {
            error: error.message,
            suggestion: "Make sure VERCEL_TOKEN is configured",
          };
        }
      } else if (lowerMessage.includes("cleanup") || lowerMessage.includes("clean") || lowerMessage.includes("duplicate")) {
        response.actions.push({
          type: "vercel_analyze_cleanup",
          endpoint: "GET /api/vercel/analyze",
          description: "Analyze Vercel projects for cleanup opportunities",
        });
        response.data = {
          message: "Use GET /api/vercel/analyze?targetDomain=dreamnet.ink to analyze cleanup opportunities",
        };
        response.suggestions.push("Try: GET /api/vercel/analyze?targetDomain=dreamnet.ink");
      } else if (lowerMessage.includes("dreamnet.ink") || lowerMessage.includes("dreamnet")) {
        response.actions.push({
          type: "vercel_get_project",
          endpoint: "GET /api/vercel/project/dreamnet.ink",
          description: "Get dreamnet.ink project details",
        });
        response.data = {
          message: "Use GET /api/vercel/project/dreamnet.ink to get project details",
        };
        response.suggestions.push("Try: GET /api/vercel/project/dreamnet.ink");
      }
    } else if (lowerMessage.includes("status") || lowerMessage.includes("health") || lowerMessage.includes("how")) {
      // Status queries
      response.actions.push({
        type: "get_status",
        endpoint: "GET /api/heartbeat",
        description: "Get DreamNet system status",
      });
      response.data = {
        message: "Use GET /api/heartbeat to get full system status",
      };
      response.suggestions.push("Try: GET /api/heartbeat");
    } else if (lowerMessage.includes("shield") || lowerMessage.includes("security") || lowerMessage.includes("threat")) {
      // Shield Core queries
      response.actions.push({
        type: "get_shield_status",
        endpoint: "GET /api/shield/status",
        description: "Get Shield Core status",
      });
      response.data = {
        message: "Use GET /api/shield/status to get Shield Core status",
      };
      response.suggestions.push("Try: GET /api/shield/status or GET /api/shield/threats");
    } else if (lowerMessage.includes("wolf") || lowerMessage.includes("pack") || lowerMessage.includes("funding") || lowerMessage.includes("lead")) {
      // Wolf Pack queries
      response.actions.push({
        type: "get_wolf_pack_status",
        endpoint: "GET /api/wolf-pack/opportunities",
        description: "Get Wolf Pack opportunities",
      });
      response.data = {
        message: "Use GET /api/wolf-pack/opportunities to see funding opportunities",
      };
      response.suggestions.push("Try: GET /api/wolf-pack/opportunities");
    } else if (lowerMessage.includes("dream")) {
      // Dream queries
      response.actions.push({
        type: "list_dreams",
        endpoint: "GET /api/dreams",
        description: "List all dreams",
      });
      response.data = {
        message: "Use GET /api/dreams to list all dreams",
      };
      response.suggestions.push("Try: GET /api/dreams");
    } else {
      // Unknown query
      response.understood = false;
      response.data = {
        message: "I didn't understand that. Here are some things I can help with:",
        capabilities: [
          "Vercel deployment management",
          "System status monitoring",
          "Shield Core security",
          "Wolf Pack funding",
          "Dream management",
        ],
      };
      response.suggestions.push("Try: 'Show me DreamNet status' or 'List Vercel projects'");
    }

      res.json({
        success: true,
        ...response,
      });
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        suggestion: "Check the API documentation at /api/chatgpt-agent/context",
      });
    }
  }
);

/**
 * POST /api/chatgpt-agent/execute
 * Execute a specific action (for ChatGPT to call after understanding intent)
 * Routes through AGENT_GATEWAY port
 */
router.post(
  "/execute",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "API_KEEPER" }),
  async (req: RequestWithIdentity, res: Response) => {
    try {
    const { action, params } = req.body;

    if (!action) {
      return res.status(400).json({
        error: "Action is required",
        availableActions: [
          "vercel_list_projects",
          "vercel_get_project",
          "vercel_analyze_cleanup",
          "vercel_cleanup",
          "get_status",
          "get_shield_status",
          "get_wolf_pack_status",
          "list_dreams",
        ],
      });
    }

    let result: any = {};

    switch (action) {
      case "vercel_list_projects":
        // Redirect to actual endpoint
        result = {
          redirect: "/api/vercel/projects",
          message: "Call GET /api/vercel/projects to list projects",
        };
        break;

      case "vercel_get_project":
        const projectName = params?.name || "dreamnet.ink";
        result = {
          redirect: `/api/vercel/project/${projectName}`,
          message: `Call GET /api/vercel/project/${projectName} to get project details`,
        };
        break;

      case "vercel_analyze_cleanup":
        const targetDomain = params?.targetDomain || "dreamnet.ink";
        result = {
          redirect: `/api/vercel/analyze?targetDomain=${targetDomain}`,
          message: `Call GET /api/vercel/analyze?targetDomain=${targetDomain} to analyze cleanup`,
        };
        break;

      case "get_status":
        result = {
          redirect: "/api/heartbeat",
          message: "Call GET /api/heartbeat to get system status",
        };
        break;

      case "get_shield_status":
        result = {
          redirect: "/api/shield/status",
          message: "Call GET /api/shield/status to get Shield Core status",
        };
        break;

      case "get_wolf_pack_status":
        result = {
          redirect: "/api/wolf-pack/opportunities",
          message: "Call GET /api/wolf-pack/opportunities to get Wolf Pack status",
        };
        break;

      case "list_dreams":
        result = {
          redirect: "/api/dreams",
          message: "Call GET /api/dreams to list dreams",
        };
        break;

      default:
        return res.status(400).json({
          error: `Unknown action: ${action}`,
          availableActions: [
            "vercel_list_projects",
            "vercel_get_project",
            "vercel_analyze_cleanup",
            "get_status",
            "get_shield_status",
            "get_wolf_pack_status",
            "list_dreams",
          ],
        });
    }

      res.json({
        success: true,
        action,
        result,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * GET /api/chatgpt-agent/quick-start
 * Quick start guide for ChatGPT
 */
router.get("/quick-start", requireApiKey, async (req: Request, res: Response) => {
  const guide = {
    title: "ChatGPT Agent Mode - DreamNet Quick Start",
    steps: [
      {
        step: 1,
        action: "Get context",
        endpoint: "GET /api/chatgpt-agent/context",
        description: "Learn what DreamNet can do",
      },
      {
        step: 2,
        action: "Chat with DreamNet",
        endpoint: "POST /api/chatgpt-agent/chat",
        body: { message: "Show me DreamNet status" },
        description: "Use natural language to interact",
      },
      {
        step: 3,
        action: "Execute actions",
        endpoint: "POST /api/chatgpt-agent/execute",
        body: { action: "get_status" },
        description: "Execute specific actions",
      },
    ],
    examples: [
      {
        message: "Show me DreamNet status",
        expectedResponse: "Returns actions to call GET /api/heartbeat",
      },
      {
        message: "List all Vercel projects",
        expectedResponse: "Returns actions to call GET /api/vercel/projects",
      },
      {
        message: "Analyze Vercel projects for cleanup",
        expectedResponse: "Returns actions to call GET /api/vercel/analyze",
      },
      {
        message: "What threats has Shield Core detected?",
        expectedResponse: "Returns actions to call GET /api/shield/threats",
      },
    ],
    tips: [
      "Always start with GET /api/chatgpt-agent/context to understand capabilities",
      "Use POST /api/chatgpt-agent/chat for natural language queries",
      "Then call the actual endpoints returned in the 'actions' array",
      "We have direct Vercel integration - better than ChatGPT's built-in connector!",
    ],
  };

  res.json({
    success: true,
    guide,
  });
});

export default router;


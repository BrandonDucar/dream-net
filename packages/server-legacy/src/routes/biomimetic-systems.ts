import { Router } from "express";
import { swarmCoordinator } from "../swarm-coordinator";
import { connectorBotV1 } from "../routes/ConnectorBot";

export function createBiomimeticSystemsRouter(): Router {
  const router = Router();

  // SWARM COORDINATOR ROUTES
  // GET /api/biomimetic/swarm/status - Get swarm status
  router.get("/biomimetic/swarm/status", async (req, res) => {
    try {
      const status = swarmCoordinator.getSwarmStatus();
      res.json({ ok: true, status });
    } catch (error) {
      console.error("Failed to get swarm status:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // POST /api/biomimetic/swarm/execute - Execute swarm operation
  router.post("/biomimetic/swarm/execute", async (req, res) => {
    try {
      const { type, params } = req.body;
      if (!type) {
        return res.status(400).json({ ok: false, error: "Operation type is required" });
      }
      
      const operationId = await swarmCoordinator.executeSwarmOperation(type, params || {});
      res.json({ ok: true, operationId });
    } catch (error) {
      console.error("Failed to execute swarm operation:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // CONNECTOR BOT ROUTES
  // POST /api/biomimetic/connector/route - Route a task
  router.post("/biomimetic/connector/route", async (req, res) => {
    try {
      const { currentState, goal, availableBots, walletData, urgency, complexity } = req.body;
      
      if (!currentState || !goal) {
        return res.status(400).json({ ok: false, error: "currentState and goal are required" });
      }
      
      const decision = await connectorBotV1.routeTask({
        currentState,
        goal,
        availableBots: availableBots || [],
        walletData,
        urgency,
        complexity,
      });
      
      res.json({ ok: true, decision });
    } catch (error) {
      console.error("Failed to route task:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // GET /api/biomimetic/connector/capabilities - Get connector bot capabilities
  router.get("/biomimetic/connector/capabilities", (req, res) => {
    try {
      const capabilities = connectorBotV1.getCapabilities();
      const botCapabilities = connectorBotV1.getBotCapabilities();
      const routingPatterns = connectorBotV1.getRoutingPatterns();
      
      res.json({
        ok: true,
        version: connectorBotV1.getVersion(),
        capabilities,
        botCapabilities,
        routingPatterns,
      });
    } catch (error) {
      console.error("Failed to get connector capabilities:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // NANO BOTS ROUTES (delegated to existing nano routes)
  // GET /api/biomimetic/nano/status - Get nano status
  router.get("/biomimetic/nano/status", async (req, res) => {
    try {
      // This will be handled by the existing nano routes
      // For now, return a placeholder
      res.json({
        ok: true,
        status: "active",
        message: "Nano bots are active. Use /api/nano/status for detailed status.",
        endpoint: "/api/nano/status",
      });
    } catch (error) {
      console.error("Failed to get nano status:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // GET /api/biomimetic/systems - List all biomimetic systems
  router.get("/biomimetic/systems", (req, res) => {
    try {
      const systems = [
        {
          id: "swarm",
          name: "Swarm (Ants & Bees)",
          description: "Distributed foraging, division of labor, adaptive routing",
          status: "active",
          endpoints: ["/api/biomimetic/swarm/status", "/api/biomimetic/swarm/execute"],
          ui: "/biomimetic/swarm",
        },
        {
          id: "connector",
          name: "Connector Bot",
          description: "Intelligent task routing and bot orchestration",
          status: "active",
          endpoints: ["/api/biomimetic/connector/route", "/api/biomimetic/connector/capabilities"],
          ui: "/biomimetic/connector",
        },
        {
          id: "nano",
          name: "Nano Bots",
          description: "Micro-agents for image generation and processing",
          status: "active",
          endpoints: ["/api/nano/status", "/api/nano/generate"],
          ui: "/biomimetic/nano",
        },
        {
          id: "snail",
          name: "Dream Snail Trail",
          description: "Know-all win-all privacy layer with verifiable provenance",
          status: "active",
          endpoints: ["/api/snail/trail", "/api/snail/privacy", "/api/snail/insights"],
          ui: "/snail",
        },
        {
          id: "octopus",
          name: "Octopus Brain & Arms",
          description: "Central brain with semi-autonomous arms",
          status: "documented",
          endpoints: [],
          ui: null,
        },
        {
          id: "chameleon",
          name: "Chameleon Skin",
          description: "Adaptive skins, protocol negotiation",
          status: "documented",
          endpoints: [],
          ui: null,
        },
        {
          id: "wolf-pack",
          name: "Wolf Pack",
          description: "Coordinated hunts and pincer moves",
          status: "active",
          endpoints: ["/api/wolf-pack/status", "/api/wolf-pack/discover"],
          ui: "/wolf-pack",
        },
        {
          id: "falcon-eye",
          name: "Falcon Eye",
          description: "Long-range scanning and telemetry",
          status: "active",
          endpoints: ["/api/mesh/status"],
          ui: "/mesh",
        },
        {
          id: "zen-garden",
          name: "Zen Garden",
          description: "Wellness and engagement loops",
          status: "documented",
          endpoints: [],
          ui: null,
        },
        {
          id: "dream-clouds",
          name: "Dream Clouds",
          description: "Thematic clusters (DeSci, DeFi, gaming, memes)",
          status: "active",
          endpoints: ["/api/dream-clouds"],
          ui: "/dream-clouds",
        },
        {
          id: "magnetic-rail",
          name: "Magnetic Rail Train",
          description: "Stage-gated pipelines with explicit checkpoints",
          status: "active",
          endpoints: [],
          ui: null,
        },
        {
          id: "triple-helix",
          name: "Triple Helix Armor",
          description: "Immune system and defense spikes",
          status: "documented",
          endpoints: [],
          ui: null,
        },
      ];
      
      res.json({ ok: true, systems, count: systems.length });
    } catch (error) {
      console.error("Failed to list biomimetic systems:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  return router;
}


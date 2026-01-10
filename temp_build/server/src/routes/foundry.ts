import { Router } from "express";
import { agentFoundry } from "../foundry/AgentFoundry";
import { instantMesh } from "../mesh/InstantMesh";

export function createFoundryRouter(): Router {
  const router = Router();

  // GET /api/foundry/templates - Get all templates
  router.get("/foundry/templates", async (req, res) => {
    try {
      const templates = agentFoundry.getTemplates();
      res.json({ ok: true, templates });
    } catch (error) {
      console.error("Failed to get templates:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/foundry/templates/:slug - Get specific template
  router.get("/foundry/templates/:slug", async (req, res) => {
    try {
      const template = agentFoundry.getTemplate(req.params.slug);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json({ ok: true, template });
    } catch (error) {
      console.error("Failed to get template:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/foundry/build - Request agent build (from any agent)
  router.post("/foundry/build", async (req, res) => {
    try {
      const { requestedBy, agentName, templateSlug, capabilities, traits, parentAgents } = req.body;
      if (!requestedBy || !agentName) {
        return res.status(400).json({ error: "requestedBy and agentName are required" });
      }

      // Request build through foundry
      agentFoundry.requestBuild(requestedBy, agentName, {
        templateSlug,
        capabilities,
        traits,
        parentAgents,
      });

      res.json({
        ok: true,
        message: "Agent build requested",
        requestedBy,
        agentName,
      });
    } catch (error) {
      console.error("Failed to request build:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/foundry/build-direct - Build agent directly (bypasses mesh)
  router.post("/foundry/build-direct", async (req, res) => {
    try {
      const { requestedBy, agentName, templateSlug, capabilities, traits, parentAgents } = req.body;
      if (!requestedBy || !agentName) {
        return res.status(400).json({ error: "requestedBy and agentName are required" });
      }

      const build = await agentFoundry.buildAgent({
        requestedBy,
        agentName,
        templateSlug,
        capabilities,
        traits,
        parentAgents,
      });

      res.json({ ok: true, build });
    } catch (error) {
      console.error("Failed to build agent:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/foundry/builds - Get all builds
  router.get("/foundry/builds", async (req, res) => {
    try {
      const { requestedBy } = req.query;
      const builds = agentFoundry.getBuilds(requestedBy as string | undefined);
      res.json({ ok: true, builds, count: builds.length });
    } catch (error) {
      console.error("Failed to get builds:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/foundry/builds/:id - Get specific build
  router.get("/foundry/builds/:id", async (req, res) => {
    try {
      const build = agentFoundry.getBuild(req.params.id);
      if (!build) {
        return res.status(404).json({ error: "Build not found" });
      }
      res.json({ ok: true, build });
    } catch (error) {
      console.error("Failed to get build:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/foundry/hybrid/build - Build agent from hybrid
  router.post("/foundry/hybrid/build", async (req, res) => {
    try {
      const { hybridId, agentName, templateSlug } = req.body;
      if (!hybridId || !agentName) {
        return res.status(400).json({ error: "hybridId and agentName are required" });
      }

      // Get hybrid
      const hybrids = instantMesh.getHybrids();
      const hybrid = hybrids.find((h) => h.id === hybridId);
      if (!hybrid) {
        return res.status(404).json({ error: "Hybrid not found" });
      }

      // Request build from hybrid
      agentFoundry.requestBuild(hybrid.id, agentName, {
        templateSlug,
        capabilities: hybrid.capabilities,
        traits: hybrid.traits,
        parentAgents: hybrid.parentAgents,
      });

      res.json({
        ok: true,
        message: "Agent build requested from hybrid",
        hybrid: hybrid.name,
        agentName,
      });
    } catch (error) {
      console.error("Failed to build from hybrid:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}


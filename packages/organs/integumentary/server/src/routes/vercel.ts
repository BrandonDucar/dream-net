/**
 * Vercel Agent API Routes
 * Manage Vercel deployments and clean up old projects
 */

import { Router, Request, Response } from "express";
import { withGovernance } from "@dreamnet/dreamnet-control-core";
import type { RequestWithIdentity } from "@dreamnet/dreamnet-control-core/identityResolver";
import { withPort } from "@dreamnet/port-governor";
import { NERVE_BUS, createNerveEvent } from "@dreamnet/nerve";
import { EnvKeeperCore } from "@dreamnet/env-keeper-core";
import { APIKeeperCore } from "@dreamnet/api-keeper-core";
import { DreamNetVercelAgent } from "@dreamnet/dreamnet-vercel-agent";
import { recordDeployEvent } from "@dreamnet/dreamnet-vercel-agent/summary";

const router: Router = Router();

// GET /api/vercel/status - Get Vercel agent status
router.get("/status", async (req, res) => {
  try {
    const status = await DreamNetVercelAgent.status();
    res.json({
      success: true,
      status,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/vercel/projects - List all projects
router.get("/projects", async (req, res) => {
  try {
    const projects = await DreamNetVercelAgent.listProjects();
    res.json({
      success: true,
      projects,
      count: projects.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/vercel/project/:name - Get project by name
router.get("/project/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const project = await DreamNetVercelAgent.getProject(name);
    if (project) {
      res.json({
        success: true,
        project,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/vercel/analyze - Analyze cleanup opportunities (dry-run)
router.get("/analyze", async (req, res) => {
  try {
    const targetDomain = req.query.domain as string || "dreamnet.ink";
    const actions = await DreamNetVercelAgent.analyzeCleanup(targetDomain);
    res.json({
      success: true,
      actions,
      count: actions.length,
      dryRun: true,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/vercel/cleanup - Execute cleanup (dry-run by default) (governed port)
router.post(
  "/cleanup",
  withPort ? withPort("VERCEL_PORT") : ((req: any, res: any, next: any) => next()),
  withGovernance({ clusterId: "DEPLOYKEEPER_CORE" as any }),
  async (req: RequestWithIdentity, res: Response) => {
    try {
      const { actions, dryRun = true } = req.body;
      const traceId = req.traceId || "unknown";
      const callerIdentity = req.callerIdentity;

      if (!actions || !Array.isArray(actions)) {
        return res.status(400).json({
          error: "Actions array required",
        });
      }

      const result = await DreamNetVercelAgent.executeCleanup(actions, dryRun);

      // Record deploy event
      recordDeployEvent("ok");

      // Emit Nerve event for cleanup operations
      try {
        const event = createNerveEvent({
          channelId: "INTEGRATION_EVENT",
          kind: "INTEGRATION_STATUS",
          priority: 5,
          context: {
            traceId,
            clusterId: "DEPLOYKEEPER_CORE" as any,
            tierId: callerIdentity?.tierId,
            citizenId: callerIdentity?.passport?.citizenId,
            officeIds: callerIdentity?.officeIds,
            cabinetIds: callerIdentity?.cabinetIds,
          },
          payload: {
            integration: "vercel",
            action: "cleanup_executed",
            dryRun,
            actionsCount: actions.length,
            status: "ok",
          },
          defaultSampleRate: 1.0,
        });
        NERVE_BUS.publish(event);
      } catch (error) {
        // Nerve not available, continue
      }

      res.json({
        success: true,
        result,
        dryRun,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// POST /api/vercel/cleanup/auto - Auto-analyze and execute cleanup (governed port)
router.post(
  "/cleanup/auto",
  withPort ? withPort("VERCEL_PORT") : ((req: any, res: any, next: any) => next()),
  withGovernance({ clusterId: "DEPLOYKEEPER_CORE" as any }),
  async (req: RequestWithIdentity, res: Response) => {
    try {
      const { targetDomain = "dreamnet.ink", dryRun = true } = req.body;
      const traceId = req.traceId || "unknown";
      const callerIdentity = req.callerIdentity;

      // Preflight: Check required credentials
      const vercelToken = EnvKeeperCore.get("VERCEL_TOKEN");
      if (!vercelToken || !vercelToken.value) {
        return res.status(409).json({
          error: "MISSING_DEPLOY_CREDENTIALS",
          message: "VERCEL_TOKEN not found in Env Keeper",
          traceId,
        });
      }

      // Analyze cleanup opportunities
      const actions = await DreamNetVercelAgent.analyzeCleanup(targetDomain);

      // Execute cleanup
      const result = await DreamNetVercelAgent.executeCleanup(actions, dryRun);

      // Record deploy event
      recordDeployEvent("ok");

      // Emit Nerve event
      try {
        const event = createNerveEvent({
          channelId: "INTEGRATION_EVENT",
          kind: "INTEGRATION_STATUS",
          priority: 5,
          context: {
            traceId,
            clusterId: "DEPLOYKEEPER_CORE" as any,
            tierId: callerIdentity?.tierId,
            citizenId: callerIdentity?.passport?.citizenId,
            officeIds: callerIdentity?.officeIds,
            cabinetIds: callerIdentity?.cabinetIds,
          },
          payload: {
            integration: "vercel",
            action: "cleanup_auto_executed",
            targetDomain,
            dryRun,
            actionsFound: actions.length,
            status: "ok",
          },
          defaultSampleRate: 1.0,
        });
        NERVE_BUS.publish(event);
      } catch (error) {
        // Nerve not available, continue
      }

      res.json({
        success: true,
        actionsFound: actions.length,
        result,
        dryRun,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;


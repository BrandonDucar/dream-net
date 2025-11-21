/**
 * Env Keeper API Routes
 * Manage environment variables through unified interface
 */

import { Router, Request, Response } from "express";
import { requireAuth, requireAdmin } from "../siwe-auth";
import { EnvKeeperCore } from "../../packages/env-keeper-core";
import { withPort } from "../../packages/port-governor/src/withPort";
import { withGovernance } from "../../packages/dreamnet-control-core/controlCoreMiddleware";
import { NERVE_BUS } from "../../packages/nerve/src/bus";
import { createNerveEvent } from "../../packages/nerve/src/factory";
import type { RequestWithIdentity } from "../../packages/dreamnet-control-core/identityResolver";

const router = Router();

/**
 * GET /api/env-keeper/status
 * Get Env Keeper status
 */
router.get("/status", requireAuth, async (req: Request, res: Response) => {
  try {
    const status = EnvKeeperCore.status();
    res.json({ success: true, status });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/env-keeper/list
 * List all environment variables (values masked for secrets)
 */
router.get("/list", requireAuth, async (req: Request, res: Response) => {
  try {
    const vars = EnvKeeperCore.list(false); // Don't decrypt for listing
    
    // Mask secret values
    const masked = vars.map((v) => ({
      ...v,
      value: v.isSecret ? "[ENCRYPTED]" : v.value,
    }));

    res.json({ success: true, variables: masked, count: masked.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/env-keeper/get/:key
 * Get specific environment variable (decrypted if authorized)
 */
router.get("/get/:key", requireAuth, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { decrypt } = req.query;
    const isAdmin = (req as any).user?.isAdmin;
    
    const envVar = EnvKeeperCore.get(key, decrypt === "true" && isAdmin);
    
    if (!envVar) {
      return res.status(404).json({ error: "Environment variable not found" });
    }

    // Mask secret values unless admin and decrypt=true
    const response = {
      ...envVar,
      value: envVar.isSecret && (!isAdmin || decrypt !== "true") ? "[ENCRYPTED]" : envVar.value,
    };

    res.json({ success: true, variable: response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/env-keeper/set
 * Set environment variable (governed port)
 */
router.post(
  "/set",
  withPort("ENVKEEPER_PORT"),
  withGovernance({ clusterId: "ENVKEEPER_CORE" }),
  async (req: RequestWithIdentity, res: Response) => {
    try {
      const { key, value, category, isSecret, description, environments } = req.body;
      const traceId = req.traceId || "unknown";
      const callerIdentity = req.callerIdentity;

      if (!key || value === undefined) {
        return res.status(400).json({ error: "key and value are required" });
      }

      const envVar = EnvKeeperCore.set(key, value, {
        category,
        isSecret,
        description,
        environments,
      });

      // Emit Nerve event for secret mutations (EnvKeeperCore.set already emits, but we add context)
      if (envVar.isSecret) {
        try {
          const event = createNerveEvent({
            channelId: "DREAMSTATE_EVENT",
            kind: "DREAMSTATE_DECISION",
            priority: 5,
            context: {
              traceId,
              clusterId: "ENVKEEPER_CORE" as any,
              tierId: callerIdentity?.tierId,
              citizenId: callerIdentity?.passport?.citizenId,
              officeIds: callerIdentity?.officeIds,
              cabinetIds: callerIdentity?.cabinetIds,
            },
            payload: {
              action: "ENV_SECRET_MUTATION",
              key: envVar.key,
              sensitivity: "secret",
            },
            defaultSampleRate: 1.0,
          });
          NERVE_BUS.publish(event);
        } catch (error) {
          // Nerve not available, continue
        }
      }

      res.json({
        success: true,
        variable: {
          ...envVar,
          value: envVar.isSecret ? "[ENCRYPTED]" : envVar.value,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * DELETE /api/env-keeper/delete/:key
 * Delete environment variable (governed port)
 */
router.delete(
  "/delete/:key",
  withPort("ENVKEEPER_PORT"),
  withGovernance({ clusterId: "ENVKEEPER_CORE" }),
  async (req: RequestWithIdentity, res: Response) => {
    try {
      const { key } = req.params;
      const traceId = req.traceId || "unknown";
      const callerIdentity = req.callerIdentity;
      
      const deleted = EnvKeeperCore.delete(key);

      // Emit Nerve event for secret deletions (EnvKeeperCore.delete already emits, but we add context)
      if (deleted) {
        try {
          const { getEnvDescriptor } = require("../../packages/env-keeper-core/logic/envClassifier");
          const descriptor = getEnvDescriptor(key);
          if (descriptor && descriptor.sensitivity === "secret") {
            const event = createNerveEvent({
              channelId: "DREAMSTATE_EVENT",
              kind: "DREAMSTATE_DECISION",
              priority: 5,
              context: {
                traceId,
                clusterId: "ENVKEEPER_CORE" as any,
                tierId: callerIdentity?.tierId,
                citizenId: callerIdentity?.passport?.citizenId,
                officeIds: callerIdentity?.officeIds,
                cabinetIds: callerIdentity?.cabinetIds,
              },
              payload: {
                action: "ENV_SECRET_DELETION",
                key,
                sensitivity: "secret",
              },
              defaultSampleRate: 1.0,
            });
            NERVE_BUS.publish(event);
          }
        } catch (error) {
          // Nerve not available, continue
        }
      }

      if (deleted) {
        res.json({ success: true, message: "Environment variable deleted" });
      } else {
        res.status(404).json({ error: "Environment variable not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * POST /api/env-keeper/sync
 * Sync environment variables from all sources (governed port)
 */
router.post(
  "/sync",
  withPort("ENVKEEPER_PORT"),
  withGovernance({ clusterId: "ENVKEEPER_CORE" }),
  async (req: RequestWithIdentity, res: Response) => {
    try {
      const discovered = await EnvKeeperCore.sync();
      res.json({
        success: true,
        message: `Synced ${discovered.length} environment variable(s)`,
        count: discovered.length,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * GET /api/env-keeper/generate-env
 * Generate .env file content
 */
router.get("/generate-env", requireAuth, async (req: Request, res: Response) => {
  try {
    const { environment, includeComments } = req.query;
    const content = EnvKeeperCore.generateEnvFile(
      environment as string,
      includeComments !== "false"
    );

    res.setHeader("Content-Type", "text/plain");
    res.send(content);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/env-keeper/export
 * Export environment variables as JSON
 */
router.get("/export", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { decrypt } = req.query;
    const exportData = EnvKeeperCore.export(decrypt === "true");

    res.json({ success: true, ...exportData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/env-keeper/sync-sources
 * Get sync sources status
 */
router.get("/sync-sources", requireAuth, async (req: Request, res: Response) => {
  try {
    const sources = EnvKeeperCore.getSyncSources();
    res.json({ success: true, sources });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


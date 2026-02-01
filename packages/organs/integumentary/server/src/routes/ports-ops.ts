/**
 * Ports Ops Panel
 * Exposes port health + Env/API/Vercel ops for DreamScope/Civic Panel
 */

import { Router, Request, Response } from "express";
import { requireAdmin } from "../siwe-auth";
import { PORT_PROFILES } from "@dreamnet/port-governor";
import { NERVE_BUS } from "@dreamnet/nerve";
import { EnvKeeperCore, getDescriptorsBySensitivity } from "@dreamnet/env-keeper-core";
import { APIKeeperCore, getApiKeeperSummary } from "@dreamnet/api-keeper-core";
import { DreamNetVercelAgent, getVercelAgentSummary } from "@dreamnet/dreamnet-vercel-agent";
import type { RequestWithIdentity } from "@dreamnet/dreamnet-control-core";

const router = Router();

/**
 * GET /api/ports/ops
 * Get Ports Ops Panel summary (admin-only)
 * Shows port definitions, Env Keeper, API Keeper, Vercel Agent, and Nerve Fabric stats
 */
router.get("/ports/ops", requireAdmin, async (req: Request, res: Response) => {
  try {
    const r = req as RequestWithIdentity;
    const traceId = r.traceId || "unknown";

    // Port definitions
    const ports = Object.values(PORT_PROFILES).map((p) => ({
      id: p.id,
      name: p.name,
      label: p.name,
      description: p.description,
      direction: p.direction,
      allowedTiers: p.allowedTiers,
      requiredOfficeIds: p.requiredOfficeIds ?? [],
      requiredCabinetIds: p.requiredCabinetIds ?? [],
      priorityLane: p.priorityLane,
      limits: p.limits,
      defaultSampleRate: p.defaultSampleRate,
      clusterId: p.clusterId,
    }));

    // Env Keeper summary (no values, just counts)
    try {
      const secretDescriptors = getDescriptorsBySensitivity("secret");
      const internalDescriptors = getDescriptorsBySensitivity("internal");
      const publicDescriptors = getDescriptorsBySensitivity("public");

      const envSummary = {
        total: secretDescriptors.length + internalDescriptors.length + publicDescriptors.length,
        secretCount: secretDescriptors.length,
        internalCount: internalDescriptors.length,
        publicCount: publicDescriptors.length,
      };

      // API Keeper summary
      const apiKeeper = getApiKeeperSummary();

      // Vercel Agent summary
      const vercelAgent = await getVercelAgentSummary();

      // Nerve Fabric stats
      const nerveStats = NERVE_BUS.getStats();

      return res.json({
        success: true,
        traceId,
        ports,
        envKeeper: envSummary,
        apiKeeper,
        vercelAgent,
        nerveStats,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      // If Env Keeper not initialized, return partial data
      return res.json({
        success: true,
        traceId,
        ports,
        envKeeper: {
          total: 0,
          secretCount: 0,
          internalCount: 0,
          publicCount: 0,
          error: "Env Keeper not initialized",
        },
        apiKeeper: getApiKeeperSummary(),
        vercelAgent: await getVercelAgentSummary(),
        nerveStats: NERVE_BUS.getStats(),
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error: any) {
    res.status(500).json({
      error: "PORTS_OPS_ERROR",
      message: error.message,
      traceId: (req as RequestWithIdentity).traceId || "unknown",
    });
  }
});

export default router;


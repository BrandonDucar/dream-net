/**
 * Debug Summary Endpoint
 * Admin-only endpoint to see Env Keeper, API Keeper, and Vercel Agent summaries
 */

import { Router, Request, Response } from "express";
import { requireAdmin } from "../siwe-auth";
import { EnvKeeperCore, getDescriptorsBySensitivity } from "@dreamnet/env-keeper-core";
import { APIKeeperCore } from "@dreamnet/api-keeper-core";
import { DreamNetVercelAgent } from "@dreamnet/dreamnet-vercel-agent";

const router = Router();

/**
 * GET /api/debug-summary
 * Get summary of Env Keeper, API Keeper, and Vercel Agent (admin-only)
 */
router.get("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    // Env Keeper Summary
    const envStatus = EnvKeeperCore.status();
    const secretDescriptors = getDescriptorsBySensitivity("secret");
    const internalDescriptors = getDescriptorsBySensitivity("internal");
    const publicDescriptors = getDescriptorsBySensitivity("public");

    // API Keeper Summary
    const apiStatus = APIKeeperCore.status();
    const apiKeys = APIKeeperCore.listKeys();
    const keysByProvider: Record<string, number> = {};
    for (const key of apiKeys) {
      keysByProvider[key.providerId] = (keysByProvider[key.providerId] || 0) + 1;
    }

    // Vercel Agent Summary
    let vercelStatus;
    try {
      vercelStatus = await DreamNetVercelAgent.status();
    } catch (error) {
      vercelStatus = { initialized: false, error: (error as Error).message };
    }

    res.json({
      success: true,
      envKeeper: {
        totalVars: envStatus.totalVars,
        secretsCount: envStatus.secretsCount,
        internalCount: internalDescriptors.length,
        publicCount: publicDescriptors.length,
        categories: envStatus.categories,
        lastSyncAt: envStatus.lastSyncAt,
      },
      apiKeeper: {
        providerCount: apiStatus.providerCount,
        activeProviderCount: apiStatus.activeProviderCount,
        keyCount: apiStatus.keyCount,
        activeKeyCount: apiStatus.activeKeyCount,
        keysByProvider, // Counts only, no raw keys
        costToday: apiStatus.costToday,
        costThisMonth: apiStatus.costThisMonth,
      },
      vercelAgent: {
        initialized: vercelStatus.initialized,
        projectsFound: vercelStatus.projectsFound || 0,
        deploymentsFound: vercelStatus.deploymentsFound || 0,
        lastSyncAt: vercelStatus.lastSyncAt || null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


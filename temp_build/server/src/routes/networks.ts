/**
 * Networks API
 * Exposes network blueprint information and bootstrap status
 */

import { Router, Request, Response } from "express";
import type { RequestWithIdentity } from "../../packages/dreamnet-control-core/identityResolver";
import { listBlueprints, getBlueprint } from "../../packages/network-blueprints/src/index";
import { withPort } from "../../packages/port-governor/src/withPort";
import { withGovernance } from "../../packages/dreamnet-control-core/controlCoreMiddleware";

const router = Router();

/**
 * GET /api/networks/blueprints
 * List all registered network blueprints
 */
router.get(
  "/networks/blueprints",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "CIVIC_PANEL_CORE" }),
  async (req: Request, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const traceId = r.traceId || "unknown";

      const blueprints = listBlueprints();

      return res.json({
        success: true,
        traceId,
        count: blueprints.length,
        blueprints: blueprints.map((bp) => ({
          id: bp.id,
          label: bp.label,
          slug: bp.slug,
          primaryDomain: bp.primaryDomain,
          description: bp.description,
          version: bp.version,
        })),
      });
    } catch (error: any) {
      res.status(500).json({
        error: "NETWORKS_ERROR",
        message: error.message,
        traceId: (req as RequestWithIdentity).traceId || "unknown",
      });
    }
  }
);

/**
 * GET /api/networks/active
 * Get the currently active network blueprint
 */
router.get(
  "/networks/active",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "CIVIC_PANEL_CORE" }),
  async (req: Request, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const traceId = r.traceId || "unknown";

      const blueprints = listBlueprints();
      const active = blueprints.find((bp) => bp.id === "DREAMNET_CORE") ?? blueprints[0];

      return res.json({
        success: true,
        traceId,
        active: active
          ? {
              id: active.id,
              label: active.label,
              slug: active.slug,
              primaryDomain: active.primaryDomain,
              description: active.description,
              version: active.version,
            }
          : null,
      });
    } catch (error: any) {
      res.status(500).json({
        error: "NETWORKS_ERROR",
        message: error.message,
        traceId: (req as RequestWithIdentity).traceId || "unknown",
      });
    }
  }
);

/**
 * GET /api/networks/blueprint/:id
 * Get a specific blueprint by ID
 */
router.get(
  "/networks/blueprint/:id",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "CIVIC_PANEL_CORE" }),
  async (req: Request, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const traceId = r.traceId || "unknown";
      const blueprintId = req.params.id;

      const blueprint = getBlueprint(blueprintId);

      if (!blueprint) {
        return res.status(404).json({
          error: "BLUEPRINT_NOT_FOUND",
          traceId,
          blueprintId,
        });
      }

      return res.json({
        success: true,
        traceId,
        blueprint: {
          id: blueprint.id,
          label: blueprint.label,
          slug: blueprint.slug,
          primaryDomain: blueprint.primaryDomain,
          description: blueprint.description,
          version: blueprint.version,
          citizens: blueprint.citizens?.length || 0,
          agents: blueprint.agents?.length || 0,
          dreams: blueprint.dreams?.length || 0,
          ports: blueprint.ports?.length || 0,
          conduits: blueprint.conduits?.length || 0,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        error: "NETWORKS_ERROR",
        message: error.message,
        traceId: (req as RequestWithIdentity).traceId || "unknown",
      });
    }
  }
);

export default router;


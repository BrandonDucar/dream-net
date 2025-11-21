/**
 * Discovery API
 * Exposes network discovery and mapping endpoints
 */

import { Router, Request, Response } from "express";
import type { RequestWithIdentity } from "../../packages/dreamnet-control-core/identityResolver";
import { listEntriesByType } from "../../packages/directory/src/registry";
import { withPort } from "../../packages/port-governor/src/withPort";
import { withGovernance } from "../../packages/dreamnet-control-core/controlCoreMiddleware";

const router = Router();

/**
 * GET /api/discovery/map
 * Get a discovery map of all entities (nodes + edges)
 */
router.get(
  "/discovery/map",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "CIVIC_PANEL_CORE" }),
  async (req: Request, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const traceId = r.traceId || "unknown";

      // Get all entity types
      const nodes = listEntriesByType("node");
      const ports = listEntriesByType("port");
      const conduits = listEntriesByType("conduit");
      const citizens = listEntriesByType("citizen");
      const agents = listEntriesByType("agent");
      const dreams = listEntriesByType("dream");

      // Build edges from conduits (port -> cluster -> tool)
      const edges = conduits.map((conduit) => ({
        id: `edge-${conduit.conduitId}`,
        source: conduit.portId,
        target: conduit.clusterId,
        type: "conduit",
        label: conduit.label,
        metadata: {
          toolId: conduit.toolId,
          conduitId: conduit.conduitId,
        },
      }));

      // Build nodes from all entities
      const allNodes = [
        ...nodes.map((n) => ({
          id: n.nodeId,
          type: "node",
          label: n.label,
          clusterId: (n as any).clusterId,
        })),
        ...ports.map((p) => ({
          id: p.portId,
          type: "port",
          label: p.label,
        })),
        ...citizens.map((c) => ({
          id: c.citizenId,
          type: "citizen",
          label: c.label,
        })),
        ...agents.map((a) => ({
          id: (a as any).agentId,
          type: "agent",
          label: a.label,
          clusterId: (a as any).clusterId,
        })),
        ...dreams.map((d) => ({
          id: (d as any).dreamId,
          type: "dream",
          label: d.label,
          status: (d as any).status,
        })),
      ];

      return res.json({
        success: true,
        traceId,
        nodes: allNodes,
        edges,
        stats: {
          nodes: nodes.length,
          ports: ports.length,
          conduits: conduits.length,
          citizens: citizens.length,
          agents: agents.length,
          dreams: dreams.length,
          totalEntities: allNodes.length,
          totalEdges: edges.length,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        error: "DISCOVERY_ERROR",
        message: error.message,
        traceId: (req as RequestWithIdentity).traceId || "unknown",
      });
    }
  }
);

export default router;


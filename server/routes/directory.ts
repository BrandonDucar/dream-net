/**
 * Directory API
 * Exposes lookup and listing APIs for DreamNet entities
 */

import { Router, Request, Response } from "express";
import type { RequestWithIdentity } from "@dreamnet/dreamnet-control-core/identityResolver";
import {
  getEntry,
  listEntriesByType,
  listAllEntries,
  searchEntries,
} from "@dreamnet/directory/registry";
import { withPort } from "@dreamnet/port-governor/withPort";
import { withGovernance } from "@dreamnet/dreamnet-control-core/controlCoreMiddleware";

const router = Router();

/**
 * GET /api/directory/entity/:id
 * Get a specific directory entry by ID
 */
router.get(
  "/directory/entity/:id",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "CIVIC_PANEL_CORE" }),
  async (req: Request, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const id = req.params.id;
      const entry = getEntry(id);

      if (!entry) {
        return res.status(404).json({
          traceId: r.traceId,
          error: "NOT_FOUND",
          id,
        });
      }

      return res.json({
        success: true,
        traceId: r.traceId,
        entry,
      });
    } catch (error: any) {
      res.status(500).json({
        error: "DIRECTORY_ERROR",
        message: error.message,
        traceId: (req as RequestWithIdentity).traceId || "unknown",
      });
    }
  }
);

/**
 * GET /api/directory/citizens
 * List all citizens
 */
router.get(
  "/directory/citizens",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "CIVIC_PANEL_CORE" }),
  async (req: Request, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const entries = listEntriesByType("citizen");

      return res.json({
        success: true,
        traceId: r.traceId,
        count: entries.length,
        citizens: entries,
      });
    } catch (error: any) {
      res.status(500).json({
        error: "DIRECTORY_ERROR",
        message: error.message,
        traceId: (req as RequestWithIdentity).traceId || "unknown",
      });
    }
  }
);

/**
 * GET /api/directory/agents
 * List all agents
 */
router.get(
  "/directory/agents",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "CIVIC_PANEL_CORE" }),
  async (req: Request, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const entries = listEntriesByType("agent");

      return res.json({
        success: true,
        traceId: r.traceId,
        count: entries.length,
        agents: entries,
      });
    } catch (error: any) {
      res.status(500).json({
        error: "DIRECTORY_ERROR",
        message: error.message,
        traceId: (req as RequestWithIdentity).traceId || "unknown",
      });
    }
  }
);

/**
 * GET /api/directory/dreams
 * List all dreams
 */
router.get(
  "/directory/dreams",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "CIVIC_PANEL_CORE" }),
  async (req: Request, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const entries = listEntriesByType("dream");

      return res.json({
        success: true,
        traceId: r.traceId,
        count: entries.length,
        dreams: entries,
      });
    } catch (error: any) {
      res.status(500).json({
        error: "DIRECTORY_ERROR",
        message: error.message,
        traceId: (req as RequestWithIdentity).traceId || "unknown",
      });
    }
  }
);

/**
 * GET /api/directory/nodes
 * List all nodes
 */
router.get(
  "/directory/nodes",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "CIVIC_PANEL_CORE" }),
  async (req: Request, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const entries = listEntriesByType("node");

      return res.json({
        success: true,
        traceId: r.traceId,
        count: entries.length,
        nodes: entries,
      });
    } catch (error: any) {
      res.status(500).json({
        error: "DIRECTORY_ERROR",
        message: error.message,
        traceId: (req as RequestWithIdentity).traceId || "unknown",
      });
    }
  }
);

/**
 * GET /api/directory/ports
 * List all ports
 */
router.get(
  "/directory/ports",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "CIVIC_PANEL_CORE" }),
  async (req: Request, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const entries = listEntriesByType("port");

      return res.json({
        success: true,
        traceId: r.traceId,
        count: entries.length,
        ports: entries,
      });
    } catch (error: any) {
      res.status(500).json({
        error: "DIRECTORY_ERROR",
        message: error.message,
        traceId: (req as RequestWithIdentity).traceId || "unknown",
      });
    }
  }
);

/**
 * GET /api/directory/conduits
 * List all conduits
 */
router.get(
  "/directory/conduits",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "CIVIC_PANEL_CORE" }),
  async (req: Request, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const entries = listEntriesByType("conduit");

      return res.json({
        success: true,
        traceId: r.traceId,
        count: entries.length,
        conduits: entries,
      });
    } catch (error: any) {
      res.status(500).json({
        error: "DIRECTORY_ERROR",
        message: error.message,
        traceId: (req as RequestWithIdentity).traceId || "unknown",
      });
    }
  }
);

/**
 * GET /api/directory/search
 * Search all directory entries by query string
 */
router.get(
  "/directory/search",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "CIVIC_PANEL_CORE" }),
  async (req: Request, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const query = req.query.q as string | undefined;

      if (!query) {
        return res.status(400).json({
          error: "QUERY_REQUIRED",
          message: "Query parameter 'q' is required",
          traceId: r.traceId,
        });
      }

      const entries = searchEntries(query);

      return res.json({
        success: true,
        traceId: r.traceId,
        query,
        count: entries.length,
        results: entries,
      });
    } catch (error: any) {
      res.status(500).json({
        error: "DIRECTORY_ERROR",
        message: error.message,
        traceId: (req as RequestWithIdentity).traceId || "unknown",
      });
    }
  }
);

/**
 * GET /api/directory/all
 * List all directory entries
 */
router.get(
  "/directory/all",
  withPort("AGENT_GATEWAY"),
  withGovernance({ clusterId: "CIVIC_PANEL_CORE", requiredOfficeIds: ["FOUNDER"] }),
  async (req: Request, res: Response) => {
    try {
      const r = req as RequestWithIdentity;
      const entries = listAllEntries();

      return res.json({
        success: true,
        traceId: r.traceId,
        count: entries.length,
        entries,
      });
    } catch (error: any) {
      res.status(500).json({
        error: "DIRECTORY_ERROR",
        message: error.message,
        traceId: (req as RequestWithIdentity).traceId || "unknown",
      });
    }
  }
);

export default router;

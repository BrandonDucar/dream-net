/**
 * Audit API Routes
 */

import { Router } from "express";
import { DreamNetAuditCore } from "@dreamnet/dreamnet-audit-core";
import { createPassportGate } from "../middleware/passportGate";

const router = Router();

// GET /api/audit - Query audit logs (requires operator tier)
router.get("/", createPassportGate("operator"), (req, res) => {
  try {
    const query = {
      userId: req.query.userId as string | undefined,
      walletAddress: req.query.walletAddress as string | undefined,
      action: req.query.action as any,
      clusterId: req.query.clusterId as string | undefined,
      startTime: req.query.startTime ? parseInt(req.query.startTime as string) : undefined,
      endTime: req.query.endTime ? parseInt(req.query.endTime as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
    };

    const logs = DreamNetAuditCore.queryLogs(query);
    res.json({ success: true, logs, count: logs.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/audit/stats - Get audit statistics (requires operator tier)
router.get("/stats", createPassportGate("operator"), (req, res) => {
  try {
    const stats = DreamNetAuditCore.getStats();
    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/audit/export - Export audit logs (requires architect tier)
router.post("/export", createPassportGate("architect"), (req, res) => {
  try {
    const query = req.body.query;
    const logs = DreamNetAuditCore.exportLogs(query);
    
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="audit-${Date.now()}.json"`);
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


/**
 * Heartbeat API Routes
 * Phase 1 - Eyes: Unified view of DreamNet's status
 */

import express from "express";
import DreamNetOSCore from "../../packages/dreamnet-os-core";
import DreamStateCore from "../../packages/dream-state-core";
import SpiderWebCore from "../../packages/spider-web-core";
import ShieldCore from "../../packages/shield-core";
import WolfPack from "../../packages/wolf-pack";
import DreamNetControlCore from "../../packages/dreamnet-control-core";

const router = express.Router();

// GET /api/heartbeat - Get unified DreamNet status (Phase 1 - Eyes)
router.get("/", (req, res) => {
  try {
    const osStatus = DreamNetOSCore.status();
    const stats = DreamNetOSCore.getHealthStats();
    const activeAlerts = DreamNetOSCore.getActiveAlerts();
    const trends = DreamNetOSCore.detectTrends();

    // Get status from all major systems
    const dreamState = DreamStateCore.status();
    const spiderWeb = SpiderWebCore.status();
    const shield = ShieldCore.status();
    const wolfPack = WolfPack.status();
    const control = DreamNetControlCore.getConfig();

    // Try to get Whale/Orca Pack status (may not exist yet)
    let whalePack: any = null;
    let orcaPack: any = null;
    try {
      const { WhalePackCore } = require("../../packages/whale-pack-core");
      whalePack = WhalePackCore?.status?.() || null;
    } catch (e) {
      // Whale Pack not available
    }
    try {
      const { OrcaPackCore } = require("../../packages/orca-pack-core");
      orcaPack = OrcaPackCore?.status?.() || null;
    } catch (e) {
      // Orca Pack not available
    }

    res.json({
      success: true,
      timestamp: Date.now(),
      heartbeat: {
        lastRunAt: osStatus.lastRunAt,
        snapshot: osStatus.snapshot,
        stats,
        activeAlerts: activeAlerts.length,
        trends: trends.length,
      },
      // Phase 1 - Eyes: All major system statuses
      dreamState: {
        passportCount: dreamState.passportCount,
        departmentCount: dreamState.departmentCount,
        proposalCount: dreamState.proposalCount,
        recentActionCount: dreamState.recentActionCount,
        lastRunAt: dreamState.lastRunAt,
      },
      spiderWeb: {
        threadCount: spiderWeb.threadCount,
        activeThreadCount: spiderWeb.activeThreadCount,
        flyCount: spiderWeb.flyCount,
        sensorCount: spiderWeb.sensorCount,
        lastRunAt: spiderWeb.lastRunAt,
      },
      shield: {
        status: shield.status,
        layerCount: shield.layerCount,
        activeThreats: shield.activeThreats,
        neutralizedThreats: shield.neutralizedThreats,
        spikesFired: shield.spikesFired,
        lastRunAt: shield.lastRunAt,
      },
      packs: {
        wolf: {
          activeTargets: wolfPack.activeTargets,
          totalStrikes: wolfPack.totalStrikes,
          lastStrikeAt: wolfPack.lastStrikeAt,
        },
        whale: whalePack ? {
          status: whalePack.status || "unknown",
          metrics: whalePack.metrics || {},
        } : null,
        orca: orcaPack ? {
          status: orcaPack.status || "unknown",
          metrics: orcaPack.metrics || {},
        } : null,
      },
      control: {
        globalKillSwitch: control.killSwitch.globalKillSwitch,
        clusterStates: Object.keys(control.killSwitch.clusterStates).length,
        rateLimits: control.rateLimits.length,
        circuitBreakers: Object.keys(control.circuitBreakers).length,
        lastUpdatedAt: control.killSwitch.lastUpdatedAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/heartbeat/snapshot - Get current snapshot
router.get("/snapshot", (req, res) => {
  try {
    const snapshot = DreamNetOSCore.getSnapshot();
    res.json({ success: true, snapshot });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/heartbeat/alerts - Get alerts
router.get("/alerts", (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const activeOnly = req.query.active === "true";

    if (activeOnly) {
      const alerts = DreamNetOSCore.getActiveAlerts();
      res.json({ success: true, alerts, count: alerts.length });
    } else {
      const alerts = DreamNetOSCore.getRecentAlerts(limit);
      res.json({ success: true, alerts, count: alerts.length });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/heartbeat/alerts/:id/resolve - Resolve an alert
router.post("/alerts/:id/resolve", (req, res) => {
  try {
    const resolved = DreamNetOSCore.resolveAlert(req.params.id);
    if (resolved) {
      res.json({ success: true, message: "Alert resolved" });
    } else {
      res.status(404).json({ error: "Alert not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/heartbeat/trends - Get health trends
router.get("/trends", (req, res) => {
  try {
    const trends = DreamNetOSCore.detectTrends();
    res.json({ success: true, trends, count: trends.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/heartbeat/history - Get health history
router.get("/history", (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const history = DreamNetOSCore.getHealthHistory(limit);
    res.json({ success: true, history, count: history.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/heartbeat/stats - Get health statistics
router.get("/stats", (req, res) => {
  try {
    const stats = DreamNetOSCore.getHealthStats();
    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/heartbeat/recovery - Get recovery actions
router.get("/recovery", (req, res) => {
  try {
    const snapshot = DreamNetOSCore.getSnapshot();
    const actions = DreamNetOSCore.generateRecoveryActions(snapshot.subsystems);
    res.json({ success: true, actions, count: actions.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/heartbeat/integration-gaps - Get integration gaps
router.get("/integration-gaps", (req, res) => {
  try {
    // This would need context, but for now return detected gaps
    const gaps = DreamNetOSCore.getIntegrationGaps();
    res.json({ success: true, gaps, count: gaps.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


/**
 * Control Plane API Routes
 * Global kill-switch and per-cluster rate limiting
 */

import express from "express";
import { DreamNetControlCore } from "@dreamnet/dreamnet-control-core";
import type { ClusterId } from "@dreamnet/dreamnet-control-core";
import { createPassportGate } from "../middleware/passportGate";

const router = express.Router();

// GET /api/control - Get full control config (requires operator tier)
router.get("/", createPassportGate("operator"), (req, res) => {
  try {
    const config = DreamNetControlCore.getConfig();
    res.json({
      success: true,
      config,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/control/kill-switch - Get kill-switch state
router.get("/kill-switch", (req, res) => {
  try {
    const state = DreamNetControlCore.getKillSwitchState();
    res.json({
      success: true,
      killSwitch: state,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/control/kill-switch/enable - Enable global kill-switch (requires architect tier)
router.post("/kill-switch/enable", createPassportGate("architect"), (req, res) => {
  try {
    const { reason, disabledBy } = req.body;
    DreamNetControlCore.enableGlobalKillSwitch(reason, disabledBy);
    res.json({
      success: true,
      message: "Global kill-switch enabled",
      state: DreamNetControlCore.getKillSwitchState(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/control/kill-switch/disable - Disable global kill-switch (requires architect tier)
router.post("/kill-switch/disable", createPassportGate("architect"), (req, res) => {
  try {
    const { reason } = req.body;
    DreamNetControlCore.disableGlobalKillSwitch(reason);
    res.json({
      success: true,
      message: "Global kill-switch disabled",
      state: DreamNetControlCore.getKillSwitchState(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/control/cluster/:clusterId/enable - Enable cluster
router.post("/cluster/:clusterId/enable", (req, res) => {
  try {
    const clusterId = req.params.clusterId as ClusterId;
    const { reason } = req.body;
    DreamNetControlCore.enableCluster(clusterId, reason);
    res.json({
      success: true,
      message: `Cluster ${clusterId} enabled`,
      clusterId,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/control/cluster/:clusterId/disable - Disable cluster
router.post("/cluster/:clusterId/disable", (req, res) => {
  try {
    const clusterId = req.params.clusterId as ClusterId;
    const { reason, disabledBy } = req.body;
    DreamNetControlCore.disableCluster(clusterId, reason, disabledBy);
    res.json({
      success: true,
      message: `Cluster ${clusterId} disabled`,
      clusterId,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/control/cluster/:clusterId/rate-limit - Get cluster rate limit
router.get("/cluster/:clusterId/rate-limit", (req, res) => {
  try {
    const clusterId = req.params.clusterId as ClusterId;
    const limit = DreamNetControlCore.getRateLimit(clusterId);
    const check = DreamNetControlCore.checkRateLimit(clusterId);
    res.json({
      success: true,
      clusterId,
      limit,
      current: check,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/control/cluster/:clusterId/rate-limit - Set cluster rate limit
router.post("/cluster/:clusterId/rate-limit", (req, res) => {
  try {
    const clusterId = req.params.clusterId as ClusterId;
    const { requestsPerMinute, requestsPerHour, requestsPerDay, enabled } = req.body;
    
    DreamNetControlCore.setRateLimit({
      clusterId,
      requestsPerMinute: requestsPerMinute || 60,
      requestsPerHour: requestsPerHour || 1000,
      requestsPerDay: requestsPerDay || 10000,
      enabled: enabled !== false,
    });
    
    res.json({
      success: true,
      message: `Rate limit updated for ${clusterId}`,
      limit: DreamNetControlCore.getRateLimit(clusterId),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/control/cluster/:clusterId/circuit-breaker/trip - Trip circuit breaker
router.post("/cluster/:clusterId/circuit-breaker/trip", (req, res) => {
  try {
    const clusterId = req.params.clusterId as ClusterId;
    const { autoResetAfter } = req.body;
    DreamNetControlCore.tripCircuitBreaker(clusterId, autoResetAfter);
    res.json({
      success: true,
      message: `Circuit breaker tripped for ${clusterId}`,
      clusterId,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/control/cluster/:clusterId/circuit-breaker/reset - Reset circuit breaker
router.post("/cluster/:clusterId/circuit-breaker/reset", (req, res) => {
  try {
    const clusterId = req.params.clusterId as ClusterId;
    DreamNetControlCore.resetCircuitBreaker(clusterId);
    res.json({
      success: true,
      message: `Circuit breaker reset for ${clusterId}`,
      clusterId,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


/**
 * Jaggy API Routes
 * The Silent Sentinel's interface
 * Works alone, answers to few
 */

import express from "express";
import { withPort } from "@dreamnet/port-governor";
import { withGovernance } from "@dreamnet/dreamnet-control-core";
import { registerWithJaggy, queryJaggy, JaggyStatus } from "@dreamnet/jaggy-core";

const router = express.Router();

// GET /api/jaggy - Get Jaggy's status (authorized only)
router.get("/", (req, res) => {
  try {
    const status = queryJaggy.status(); // Changed from JaggyCore.status()
    res.json({
      success: true,
      jaggy: status,
      message: "🐱 Jaggy is watching...",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/jaggy/hunts - Get active hunts
router.get("/hunts", (req, res) => {
  try {
    const hunts = JaggyCore.getActiveHunts();
    res.json({ success: true, hunts, count: hunts.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/jaggy/territories - Get territories Jaggy watches
router.get("/territories", (req, res) => {
  try {
    const territories = JaggyCore.getTerritories();
    res.json({ success: true, territories, count: territories.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/jaggy/memories - Get Jaggy's memories
router.get("/memories", (req, res) => {
  try {
    const memories = JaggyCore.getMemories();
    res.json({ success: true, memories, count: memories.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/jaggy/alerts - Get alerts (authorized only)
router.get("/alerts", (req, res) => {
  try {
    // Check authorization (Jaggy answers to few)
    const authorized = req.headers["x-jaggy-authorized"] === "true" ||
      req.headers["x-admin"] === "true";

    const alerts = JaggyCore.getAlerts(authorized);
    res.json({ success: true, alerts, count: alerts.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/jaggy/prowl - Make Jaggy prowl territories
router.post("/prowl", (req, res) => {
  try {
    JaggyCore.prowlTerritories();
    res.json({ success: true, message: "🐱 Jaggy is prowling..." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/jaggy/fame - Increase Jaggy's Base fame
router.post("/fame", (req, res) => {
  try {
    const amount = parseFloat(req.body.amount) || 1;
    JaggyCore.increaseFame(amount);
    const status = JaggyCore.status();
    res.json({
      success: true,
      message: `👑 Jaggy's Base fame increased!`,
      baseFame: status.baseFame,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


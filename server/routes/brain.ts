/**
 * 🧠 DreamNet Super Brain Routes
 * 
 * API endpoints for:
 * - Querying the Brain (for AI assistants like Cursor)
 * - Getting Brain status
 * - Getting Drive Engine status
 * - Manual event injection (for testing)
 */

import { Router } from "express";
import { brainIntegration } from "../core/BrainIntegration";
import { superBrain } from "../core/SuperBrain";
import { driveEngine } from "../core/DriveEngine";
import type { StarbridgeEvent } from "../starbridge/types";

export function createBrainRouter(): Router {
  const router = Router();

  // GET /api/brain/status - Get Brain status
  router.get("/brain/status", async (_req, res) => {
    try {
      const status = brainIntegration.getStatus();
      res.status(200).json({ success: true, status });
    } catch (error: any) {
      console.error("Failed to get Brain status:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/brain/query - Query the Brain (for AI assistants)
  router.post("/brain/query", async (req, res) => {
    try {
      const { question, context } = req.body;

      if (!question) {
        return res.status(400).json({ success: false, error: "question is required" });
      }

      const response = await brainIntegration.queryBrain(question, context);
      res.status(200).json({ success: true, response });
    } catch (error: any) {
      console.error("Failed to query Brain:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // GET /api/brain/drive - Get Drive Engine status
  router.get("/brain/drive", async (_req, res) => {
    try {
      const driveStatus = driveEngine.getDriveStatus();
      res.status(200).json({ success: true, driveStatus });
    } catch (error: any) {
      console.error("Failed to get Drive Engine status:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/brain/event - Manually inject event (for testing)
  router.post("/brain/event", async (req, res) => {
    try {
      const event: StarbridgeEvent = req.body;

      if (!event.type || !event.source) {
        return res.status(400).json({ success: false, error: "event.type and event.source are required" });
      }

      brainIntegration.addEventToBrain(event);
      res.status(200).json({ success: true, message: "Event added to Brain" });
    } catch (error: any) {
      console.error("Failed to add event to Brain:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/brain/initialize - Initialize Brain integration
  router.post("/brain/initialize", async (_req, res) => {
    try {
      await brainIntegration.initialize();
      res.status(200).json({ success: true, message: "Brain integration initialized" });
    } catch (error: any) {
      console.error("Failed to initialize Brain integration:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
}


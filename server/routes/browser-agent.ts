/**
 * Browser Agent API Routes
 * Serves browser screenshots and provides mission management endpoints
 */

import { Router, Request, Response } from "express";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export function createBrowserAgentRouter(): Router {
  const router = Router();

  /**
   * GET /api/browser-screenshots/:screenshotId.png
   * Serve browser screenshots
   */
  router.get("/browser-screenshots/:screenshotId", async (req: Request, res: Response) => {
    try {
      const { screenshotId } = req.params;
      const screenshotDir = process.env.BROWSER_SCREENSHOT_DIR || "storage/browser-screenshots";
      const screenshotPath = join(screenshotDir, `${screenshotId}.png`);

      if (!existsSync(screenshotPath)) {
        return res.status(404).send("Screenshot not found");
      }

      const imageBuffer = await readFile(screenshotPath);
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
      res.send(imageBuffer);
    } catch (error: any) {
      console.error("[BrowserAgentRouter] Error serving screenshot:", error);
      res.status(500).send("Error serving screenshot");
    }
  });

  /**
   * GET /api/browser-agent/status
   * Get browser agent core status
   */
  router.get("/browser-agent/status", (req: Request, res: Response) => {
    try {
      const { BrowserAgentCore } = require("@dreamnet/browser-agent-core");
      const browserCore = new BrowserAgentCore();
      const activeMissions = browserCore.listActiveMissions();

      res.json({
        status: "active",
        activeMissions: activeMissions.length,
        missions: activeMissions.map(m => ({
          missionId: m.missionId,
          agentId: m.agentId,
          description: m.description,
          status: m.status,
          currentStep: m.currentStep,
          maxSteps: m.maxSteps,
        })),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}


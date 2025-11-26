import { Router, Request, Response } from "express";
import { readFile } from "fs/promises";
import { join } from "path";

const router = Router();

interface SunriseReport {
  timestamp: string;
  services: Array<{
    name: string;
    status: "ok" | "degraded" | "down";
    version: string;
    latency_ms: number;
    kpis: {
      new_users_24h: number;
      events_24h: number;
      errors_24h: number;
    };
    last_block: number;
    error?: string;
  }>;
  summary: {
    total_services: number;
    healthy: number;
    degraded: number;
    down: number;
  };
}

// Store latest report in memory (in production, use database)
let latestReport: SunriseReport | null = null;

/**
 * GET /api/sunrise-report/latest
 * Get the latest Sunrise Report
 */
router.get("/latest", async (req: Request, res: Response) => {
  try {
    if (!latestReport) {
      return res.status(404).json({
        error: "No report available yet",
        message: "Run the heartbeat script to generate a report"
      });
    }
    
    res.json(latestReport);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/sunrise-report
 * Store a new Sunrise Report (called by heartbeat script)
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const report: SunriseReport = req.body;
    
    // Validate report structure
    if (!report.timestamp || !report.services || !report.summary) {
      return res.status(400).json({ error: "Invalid report format" });
    }
    
    latestReport = report;
    
    // TODO: Store in database for historical tracking
    
    res.json({ 
      success: true, 
      message: "Report stored",
      timestamp: report.timestamp 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/sunrise-report/text
 * Get the latest report as plain text (for Telegram/Discord)
 */
router.get("/text", async (req: Request, res: Response) => {
  try {
    if (!latestReport) {
      return res.status(404).send("No report available yet");
    }
    
    const lines = [
      `🌅 DreamNet Sunrise Report — ${latestReport.timestamp}`,
      "----------------------------------------------"
    ];
    
    for (const service of latestReport.services) {
      const tag = service.status === "ok" ? "✅" : service.status === "degraded" ? "⚠️" : "❌";
      lines.push(
        `${tag} ${service.name} v${service.version} ${service.status} • ${service.latency_ms}ms • new:${service.kpis.new_users_24h} ev:${service.kpis.events_24h} err:${service.kpis.errors_24h} • block:${service.last_block}`
      );
    }
    
    lines.push("");
    lines.push(`Summary: ${latestReport.summary.healthy} healthy, ${latestReport.summary.degraded} degraded, ${latestReport.summary.down} down`);
    
    res.setHeader("Content-Type", "text/plain");
    res.send(lines.join("\n"));
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

export default router;


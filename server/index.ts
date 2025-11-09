
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { dreamScoreEngine } from "./dream-score-engine";
import { triggerArchiveNow } from "./archive-scheduler";
import { seedDreams } from "./seed-dreams";
import { seedSystemHeartbeat } from "./starbridge";
import { bootstrapRail } from "./magnetic-rail/scheduler";
import { bootstrapWormhole } from "./wormhole/dispatcher";
import { runTrustMigrations } from "./trust/migrations";
import "./jobs/vectorRollup";
import "./jobs/reputation";
import "./jobs/watchdog";
import { pool } from "./db";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Edict endpoint for Atlas to communicate with LUCID
app.post("/api/edict", (req, res) => {
  const { edict } = req.body;
  // In a real scenario, this would trigger an event for the LUCID agent.
  // For now, we log it to the server console to show the bridge is working.
  log(`🏛️ [EDICT RECEIVED] via Atlas: "${edict}"`);
  res.json({ status: "acknowledged", edict });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

  // Health endpoint and cron endpoints
  app.get("/api/health", async (_req, res) => {
    let dbStatus = "unknown";
    try {
      await pool.query("select 1");
      dbStatus = "connected";
    } catch (error) {
      dbStatus = error instanceof Error ? `error: ${error.message}` : "error";
    }

    res.json({
      ok: true,
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA || "",
      db: dbStatus,
      timestamp: new Date().toISOString(),
    });
  });

  const requireAgentKey = (req: any, res: any, next: any) => {
    const agentKey = req.headers["x-agent-key"];
    const allowedKey = process.env.AGENT_API_KEY;
    if (!agentKey || agentKey !== allowedKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const allowlist = process.env.IP_ALLOWLIST ? process.env.IP_ALLOWLIST.split(",") : [];
    if (allowlist.length > 0) {
      const forwarded = req.headers["x-forwarded-for"];
      const clientIp = Array.isArray(forwarded) ? forwarded[0] : (forwarded ? forwarded.split(",")[0] : req.socket.remoteAddress);
      if (clientIp && !allowlist.includes(clientIp as string)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    }
    return next();
  };

  app.post("/api/cron/score", requireAgentKey, async (_req, res) => {
    await dreamScoreEngine.updateAllDreamScores();
    res.json({ success: true });
  });

  app.post("/api/cron/archive", requireAgentKey, async (_req, res) => {
    await triggerArchiveNow();
    res.json({ success: true });
  });
(async () => {
  const server = await registerRoutes(app);
  await runTrustMigrations().catch((err) => console.error("[Trust] Failed to run migrations:", err));
  await seedSystemHeartbeat().catch((err) => console.error("[StarBridge] Failed to seed system heartbeat:", err));
  bootstrapRail();
  bootstrapWormhole();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);

      // Seed dreams on startup
      seedDreams().catch((err) => console.error("Failed to seed dreams:", err));
    }
  );
})();

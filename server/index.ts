import express, { type Express, type Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { setupVite, serveStatic, log } from "./vite";
import { legacyRequire } from "./legacy/loader";
import { startMesh } from "./mesh";
import { createMeshRouter } from "./mesh/router";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/mesh", createMeshRouter());

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

// Public health endpoint used by Railway and other platforms for liveness checks
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "dreamnet-api",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

(async () => {
  const legacyRoutesModule = legacyRequire<{ registerRoutes?: (app: Express) => Promise<Server> }>("routes");

  if (!legacyRoutesModule?.registerRoutes) {
    throw new Error("Legacy routes module not available. Cannot start DreamNet server.");
  }

  const server = await legacyRoutesModule.registerRoutes(app);

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
  const host = "0.0.0.0";

  // Start the HTTP server. Do not pass unsupported options like `reusePort` which
  // can cause listen() to throw on some platforms or Node versions.
  server.listen(port, host, () => {
    log(`serving on port ${port}`);

    const legacySeedModule = legacyRequire<{ seedDreams?: () => Promise<void> }>("seed-dreams");
    legacySeedModule?.seedDreams?.().catch((err) => console.error("Failed to seed dreams:", err));

    const legacyDreamScoreEngine = legacyRequire<{ startScheduledScoring?: () => void }>("dream-score-engine");
    legacyDreamScoreEngine?.startScheduledScoring?.();

    if (process.env.MESH_AUTOSTART !== "false") {
      startMesh().catch((error) =>
        console.error("Failed to start DreamNet mesh:", (error as Error).message),
      );
    }
  });
})();

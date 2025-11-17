import express, { type Express, type Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { setupVite, serveStatic, log } from "./vite";
import { legacyRequire } from "./legacy/loader";
import { createMeshRouter } from "./mesh/router";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Public health endpoint used by Railway and other platforms for liveness checks
// Registered early to ensure it's always available, even if subsystems fail to start
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "dreamnet-api",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

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

    // Optional subsystems - only start when INIT_SUBSYSTEMS === "true"
    // This allows the server to start in resource-constrained environments (like Railway)
    // without attempting to initialize heavyweight background processes
    const shouldInitSubsystems = process.env.INIT_SUBSYSTEMS === "true";
    
    if (shouldInitSubsystems) {
      log("INIT_SUBSYSTEMS=true, starting optional subsystems...");
      
      // Dynamically import and start mesh subsystem
      import("./mesh").then(({ startMesh }) => {
        if (process.env.MESH_AUTOSTART !== "false") {
          startMesh().catch((error) =>
            console.error("Failed to start DreamNet mesh:", (error as Error).message),
          );
        }
      }).catch((error) => {
        console.error("Failed to load mesh module:", (error as Error).message);
      });

      // Dynamically import and run seed dreams
      const legacySeedModule = legacyRequire<{ seedDreams?: () => Promise<void> }>("seed-dreams");
      legacySeedModule?.seedDreams?.().catch((err) => console.error("Failed to seed dreams:", err));

      // Dynamically import and start scheduled scoring
      const legacyDreamScoreEngine = legacyRequire<{ startScheduledScoring?: () => void }>("dream-score-engine");
      legacyDreamScoreEngine?.startScheduledScoring?.();
    } else {
      log("INIT_SUBSYSTEMS not set to 'true', skipping optional subsystems (seedDreams, scoring, mesh)");
    }
  });
})();


import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

// A more expressive logging function for the server
export function log(message: string, source = "express") {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  let emoji = "⚙️"; // Default emoji
  if (source.toLowerCase().includes("vite")) emoji = "⚡";
  if (source.toLowerCase().includes("express")) emoji = "🌐";
  if (message.toLowerCase().includes("serving")) emoji = "🚀";
  if (message.toLowerCase().includes("error")) emoji = "🔥";
  if (message.toLowerCase().includes("edict")) emoji = "🏛️";


  console.log(`${emoji} [${formattedTime}] [${source.toUpperCase()}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  log("Vite development server starting up...", "Vite");
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        log(`FATAL VITE ERROR: ${msg}`, "Vite");
        viteLogger.error(msg, options);
        process.exit(1);
      },
      warn: (msg, options) => {
        log(`Warning: ${msg}`, "Vite");
        viteLogger.warn(msg, options);
      },
      info: (msg, options) => {
        // Suppress the default info messages for a cleaner log
        if (msg.includes('transformed') || msg.includes('page reload')) return;
        log(msg, "Vite");
      }
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith('/api')) return next(); // Skip API routes

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
  log("Vite middleware installed.", "Vite");
}

export function serveStatic(app: Express) {
  log("Serving static files from public directory...", "Express");
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    const errorMsg = `Build directory not found at ${distPath}. Please run 'npm run build' first.`
    log(errorMsg, "Express");
    throw new Error(errorMsg);
  }

  app.use(express.static(distPath));

  // Fallback to index.html for single-page applications
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
  log("Static file serving configured.", "Express");
}

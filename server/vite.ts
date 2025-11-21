import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import { nanoid } from "nanoid";
import { pathToFileURL } from "url";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const viteConfigPath = path.resolve(process.cwd(), "vite.config.ts");
  if (!fs.existsSync(viteConfigPath)) {
    log(`Skipping Vite middleware; missing ${viteConfigPath}`, "vite");
    return;
  }

  const viteModule = (await import(pathToFileURL(viteConfigPath).href)) as { default?: any };
  const viteConfig = viteModule.default ?? viteModule;

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
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        process.cwd(),
        "client",
        "index.html",
      );

      if (!fs.existsSync(clientTemplate)) {
        throw new Error(`Client template missing at ${clientTemplate}`);
      }

      // always reload the index.html file from disk incase it changes
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
}

export function serveStatic(app: Express) {
  // In production, serve built frontend from client/dist
  // Use process.cwd() instead of import.meta.dirname for compiled JS compatibility
  const distPath = path.resolve(process.cwd(), "client", "dist");
  
  // Fallback to server/public if client/dist doesn't exist
  const fallbackPath = path.resolve(process.cwd(), "server", "public");

  const staticPath = fs.existsSync(distPath) ? distPath : fallbackPath;

  if (!fs.existsSync(staticPath)) {
    log(`Warning: Static directory not found at ${staticPath}, serving API only`, "vite");
    return;
  }

  log(`Serving static files from ${staticPath}`, "vite");
  app.use(express.static(staticPath));

  // fall through to index.html if the file doesn't exist (SPA routing)
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(staticPath, "index.html"));
  });
}

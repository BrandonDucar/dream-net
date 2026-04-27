import { Express, Router } from 'express';
import { readdirSync } from 'fs';
import { createServer } from 'http';
import path from 'path';

/**
 * Dynamically registers all routes in the current directory.
 */
export const registerRoutes = async (app: Express) => {
  const server = createServer(app);
  const routesDir = __dirname;

  // Get all files in the routes directory
  const files = readdirSync(routesDir);

  for (const file of files) {
    // Skip the index file itself
    if (file === 'index.ts' || file.endsWith('.map')) {
      continue;
    }

    const routePath = path.join(routesDir, file);

    try {
      const { default: router } = await import(routePath);

      if (router instanceof Router) {
        const routeName = file.replace('.ts', '').replace('.js', '');
        app.use(`/api/${routeName}`, router);
        console.log(`✅ [Routes] Registered /api/${routeName}`);
      } else {
        console.warn(`⚠️ [Routes] No router exported from ${file}, skipping.`);
      }
    } catch (error: any) {
      console.error(
        `❌ [Routes] Failed to load route from ${file}: ${error.message}`
      );
    }
  }

  return server;
};

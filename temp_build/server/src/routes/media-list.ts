import { Router } from "express";
import { readdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { existsSync } from "node:fs";

export function createMediaListRouter(): Router {
  const router = Router();

  // GET /api/media/list - List all uploaded media files
  router.get("/media/list", async (req, res) => {
    try {
      const getMediaRoot = (): string => {
        if (process.env.MEDIA_ROOT) {
          if (process.env.MEDIA_ROOT.startsWith("/") || process.env.MEDIA_ROOT.match(/^[A-Z]:/)) {
            return process.env.MEDIA_ROOT;
          }
          return join(process.cwd(), process.env.MEDIA_ROOT);
        }
        const projectRoot = process.cwd();
        if (projectRoot.includes("OneDrive") || projectRoot.includes("Documents")) {
          const parentDir = dirname(projectRoot);
          return join(parentDir, "dream-net-media");
        }
        return join(projectRoot, "media");
      };

      const mediaRoot = getMediaRoot();
      const result: {
        mediaRoot: string;
        exists: boolean;
        directories: Record<string, {
          exists: boolean;
          fileCount: number;
          files: Array<{
            name: string;
            size: number;
            sizeMB: string;
            modified: string;
          }>;
        }>;
      } = {
        mediaRoot,
        exists: existsSync(mediaRoot),
        directories: {},
      };

      if (result.exists) {
        const dirs = ["original", "thumb_320", "web_1080"];
        
        for (const dir of dirs) {
          const dirPath = join(mediaRoot, dir);
          const dirExists = existsSync(dirPath);
          
          result.directories[dir] = {
            exists: dirExists,
            fileCount: 0,
            files: [],
          };

          if (dirExists) {
            try {
              const files = await readdir(dirPath);
              result.directories[dir].fileCount = files.length;

              for (const file of files.slice(0, 50)) { // Limit to first 50
                try {
                  const filePath = join(dirPath, file);
                  const stats = await stat(filePath);
                  result.directories[dir].files.push({
                    name: file,
                    size: stats.size,
                    sizeMB: (stats.size / 1024 / 1024).toFixed(2),
                    modified: stats.mtime.toISOString(),
                  });
                } catch (err) {
                  // Skip files we can't stat
                }
              }
            } catch (err) {
              console.error(`Error reading ${dir}:`, err);
            }
          }
        }
      }

      res.json({ ok: true, ...result });
    } catch (error) {
      console.error("Failed to list media:", error);
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  return router;
}


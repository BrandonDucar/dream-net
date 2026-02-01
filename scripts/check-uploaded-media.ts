/**
 * Check what media files have been uploaded
 */

import dotenv from "dotenv";
import path from "node:path";

// Load environment variables
dotenv.config();
dotenv.config({ path: path.join(process.cwd(), ".env") });

import { db } from "../packages/organs/integumentary/server/src/db.js";
import { mediaAssets } from "../packages/organs/skeletal/shared/schema.js";
import { readFile, rename, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";

async function checkMedia() {
  console.log("🔍 Checking uploaded media files...\n");

  // Check database
  try {
    const allMedia = await db.select().from(mediaAssets).limit(100);
    console.log(`📊 Found ${allMedia.length} media assets in database:\n`);

    if (allMedia.length === 0) {
      console.log("❌ No media files found in database.");
      console.log("   This means either:");
      console.log("   - No files have been uploaded yet");
      console.log("   - Uploads failed");
      console.log("   - Database connection issue\n");
    } else {
      for (const media of allMedia) {
        console.log(`📁 ${media.title || media.id}`);
        console.log(`   ID: ${media.id}`);
        console.log(`   Type: ${media.type}`);
        console.log(`   Source: ${media.source}`);
        console.log(`   File Path: ${media.file_path}`);
        console.log(`   Size: ${(media.size_bytes / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Created: ${media.created_at}`);

        // Check if file exists
        const fileExists = existsSync(media.file_path);
        console.log(`   File Exists: ${fileExists ? "✅" : "❌"}`);

        if (!fileExists) {
          // Try to find it in alternative locations
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
          const fileName = media.file_path.split(/[/\\]/).pop();
          const altPath = join(mediaRoot, "original", fileName || "");
          const altExists = existsSync(altPath);
          console.log(`   Alternative Path: ${altPath}`);
          console.log(`   Alternative Exists: ${altExists ? "✅" : "❌"}`);
        }

        console.log("");
      }
    }
  } catch (error) {
    console.error("❌ Error querying database:", error);
  }

  // Check file system
  console.log("\n🔍 Checking file system for media directories...\n");

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
  console.log(`📂 Media Root: ${mediaRoot}`);
  console.log(`   Exists: ${existsSync(mediaRoot) ? "✅" : "❌"}`);

  if (existsSync(mediaRoot)) {
    try {
      const { readdir } = await import("node:fs/promises");
      const dirs = await readdir(mediaRoot);
      console.log(`   Subdirectories: ${dirs.join(", ")}`);

      for (const dir of dirs) {
        const dirPath = join(mediaRoot, dir);
        const files = await readdir(dirPath);
        console.log(`   ${dir}/: ${files.length} files`);
      }
    } catch (err) {
      console.log(`   Error reading directory: ${err}`);
    }
  }
}

async function restoreRootImages() {
  console.log("\n🧹 Restoring root images to media-vault...\n");

  const rootImages = [
    "05159841-3041-40ad-bfff-954223e24489_1761033493669.jpg",
    "083a9e23-fa6c-4cd2-8466-fe6cad4a54c1_1761033490037.jpg",
    "90eb5dbb-8b2f-4fb7-8e10-0c34e10e5ba9_1761033497418.jpg"
  ];

  const projectRoot = process.cwd();
  // TARGET: C:\dev\dream-net-media (outside project root to avoid git lock)
  const mediaRoot = process.env.MEDIA_ROOT || join(dirname(projectRoot), "dream-net-media");
  const targetDir = join(mediaRoot, "original");

  console.log(`📡 Vault Target: ${targetDir}`);

  if (!existsSync(targetDir)) {
    console.log(`📁 Creating missing vault directory: ${targetDir}`);
    await mkdir(targetDir, { recursive: true });
  }

  for (const imgName of rootImages) {
    const sourcePath = join(projectRoot, imgName);
    const targetPath = join(targetDir, imgName);

    if (existsSync(sourcePath)) {
      console.log(`📦 Moving ${imgName} to ${targetPath}`);
      try {
        await rename(sourcePath, targetPath);
        console.log(` ✅ Moved successfully.`);
      } catch (err) {
        console.error(` ❌ Failed to move ${imgName}:`, err);
      }
    } else {
      console.log(` 🛰️ ${imgName} not found in root (possibly already moved).`);
    }
  }
}

async function run() {
  await checkMedia();
  await restoreRootImages();
}

run().catch(console.error);


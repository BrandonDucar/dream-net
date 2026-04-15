/**
 * Check what media files have been uploaded
 */

import { db } from "../server/db";
import { mediaAssets } from "../shared/schema";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";

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

checkMedia().catch(console.error);


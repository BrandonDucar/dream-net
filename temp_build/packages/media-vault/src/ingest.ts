import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname, extname, basename } from "node:path";
import { existsSync } from "node:fs";
import sharp from "sharp";
import type { IngestOptions, MediaAsset } from "./types";
import { getMediaByHash, createMediaAsset } from "./db";
import { extractTagsFromFilename, extractTagsFromPrompt, normalizeEntity } from "./vocab";
import { randomUUID } from "node:crypto";

// Use absolute path outside of iCloud-synced directories
// Default to project root's media folder, but allow override via env
const getMediaRoot = (): string => {
  if (process.env.MEDIA_ROOT) {
    // If absolute path provided, use it
    if (process.env.MEDIA_ROOT.startsWith("/") || process.env.MEDIA_ROOT.match(/^[A-Z]:/)) {
      return process.env.MEDIA_ROOT;
    }
    // Relative path - resolve from project root
    return join(process.cwd(), process.env.MEDIA_ROOT);
  }
  
  // Default: Use project root's media directory (not in Documents/OneDrive)
  // This prevents iCloud sync on Mac
  const projectRoot = process.cwd();
  // Check if we're in a synced directory (OneDrive/Documents)
  if (projectRoot.includes("OneDrive") || projectRoot.includes("Documents")) {
    // Use a sibling directory or system temp
    const parentDir = dirname(projectRoot);
    return join(parentDir, "dream-net-media");
  }
  
  // Otherwise use ./media in project root
  return join(projectRoot, "media");
};

const MEDIA_ROOT = getMediaRoot();
const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50MB

async function ensureDir(path: string): Promise<void> {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }
}

async function computeHash(buffer: Buffer): Promise<string> {
  return createHash("sha256").update(buffer).digest("hex");
}

async function extractImageMetadata(buffer: Buffer): Promise<{ width: number; height: number; duration_ms: number }> {
  try {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width ?? 0,
      height: metadata.height ?? 0,
      duration_ms: 0,
    };
  } catch {
    return { width: 0, height: 0, duration_ms: 0 };
  }
}

async function generateThumbnail(buffer: Buffer, outputPath: string, size: number = 320): Promise<void> {
  await sharp(buffer)
    .resize(size, size, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(outputPath);
}

async function generateWebVersion(buffer: Buffer, outputPath: string, maxSize: number = 1080): Promise<void> {
  const ext = extname(outputPath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    await sharp(buffer)
      .resize(maxSize, maxSize, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toFile(outputPath);
  } else {
    // For videos, we'd need ffmpeg - for now, just copy
    await writeFile(outputPath, buffer);
  }
}

async function downloadFromUrl(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function generateCaption(title: string, tags: string[], prompt?: string): string {
  // Generate a short caption (<120 chars for X)
  if (prompt) {
    // Use first sentence of prompt if available
    const firstSentence = prompt.split(/[.!?]/)[0].trim();
    if (firstSentence.length <= 120) {
      return firstSentence;
    }
    return firstSentence.substring(0, 117) + "...";
  }
  
  // Fallback to title + key tags
  const keyTags = tags.slice(0, 3).join(", ");
  const caption = `${title}${keyTags ? ` - ${keyTags}` : ""}`;
  return caption.length > 120 ? caption.substring(0, 117) + "..." : caption;
}

export async function ingestFromFile(
  file: Buffer,
  filename: string,
  options: IngestOptions,
): Promise<MediaAsset> {
  // Check size
  if (file.length > MAX_UPLOAD_SIZE) {
    throw new Error(`File too large: ${file.length} bytes (max ${MAX_UPLOAD_SIZE})`);
  }

  // Compute hash and check for duplicates
  const hash = await computeHash(file);
  const existing = await getMediaByHash(hash);
  if (existing) {
    return existing; // Deduplicate
  }

  // Determine type from extension
  const ext = extname(filename).toLowerCase();
  const type: MediaAsset["type"] = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext) ? "image" : "video";

  // Extract metadata
  const metadata = type === "image" ? await extractImageMetadata(file) : { width: 0, height: 0, duration_ms: 0 };

  // Generate file paths
  const assetId = randomUUID();
  const originalDir = join(MEDIA_ROOT, "original");
  const thumbDir = join(MEDIA_ROOT, "thumb_320");
  const webDir = join(MEDIA_ROOT, "web_1080");

  await ensureDir(originalDir);
  await ensureDir(thumbDir);
  await ensureDir(webDir);

  const originalPath = join(originalDir, `${assetId}${ext}`);
  const thumbPath = join(thumbDir, `${assetId}.jpg`);
  const webPath = join(webDir, `${assetId}${ext === ".gif" ? ".gif" : ".jpg"}`);

  // Save original
  await writeFile(originalPath, file);

  // Generate derivatives
  if (type === "image") {
    await generateThumbnail(file, thumbPath);
    await generateWebVersion(file, webPath);
  } else {
    // For videos, we'd need ffmpeg - for now, just copy
    await writeFile(thumbPath, file); // Placeholder
    await writeFile(webPath, file);
  }

  // Extract tags and entities
  const filenameTags = extractTagsFromFilename(filename);
  const promptTags = options.prompt ? extractTagsFromPrompt(options.prompt) : [];
  const allTags = [...new Set([...filenameTags, ...promptTags, ...(options.tags ?? [])])];

  const entities = normalizeEntity(`${filename} ${options.prompt ?? ""} ${options.title ?? ""}`);

  // Generate caption
  const caption = generateCaption(options.title ?? filename, allTags, options.prompt);

  // Create media asset
  const asset = await createMediaAsset({
    type,
    title: options.title ?? basename(filename, ext),
    source: options.source,
    file_path: originalPath,
    hash,
    width: metadata.width,
    height: metadata.height,
    duration_ms: metadata.duration_ms,
    size_bytes: file.length,
    tags: allTags,
    entities,
    credits: {
      prompt: options.prompt,
      model: options.model,
    },
    caption,
    rights: options.rights ?? "unknown",
    rating: options.rating ?? "C",
    collections: options.collections ?? [],
    usage: {
      posts: 0,
      downloads: 0,
      last_used_at: null,
    },
  });

  return asset;
}

export async function ingestFromUrl(url: string, options: IngestOptions): Promise<MediaAsset> {
  const buffer = await downloadFromUrl(url);
  const filename = new URL(url).pathname.split("/").pop() || "download";
  return ingestFromFile(buffer, filename, options);
}


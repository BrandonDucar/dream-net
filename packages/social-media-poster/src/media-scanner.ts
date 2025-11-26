/**
 * Media Scanner
 * Scans local directories for images, videos, and other media files
 * Prepares them for upload to social media platforms
 */

import { readdir, stat, readFile } from "fs/promises";
import { join, extname, basename } from "path";
import { createHash } from "crypto";

export interface MediaFile {
  path: string;
  name: string;
  type: "image" | "video" | "audio" | "document";
  extension: string;
  size: number;
  mimeType: string;
  hash: string; // MD5 hash for deduplication
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface MediaScanOptions {
  directories: string[]; // Directories to scan
  extensions?: string[]; // File extensions to include (default: all media)
  maxFileSize?: number; // Max file size in bytes (default: 100MB)
  recursive?: boolean; // Scan subdirectories (default: true)
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico"];
const VIDEO_EXTENSIONS = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv", ".wmv", ".m4v", ".mpg", ".mpeg"];
const AUDIO_EXTENSIONS = [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a", ".wma"];
const DOCUMENT_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt", ".md"];

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
  ".mkv": "video/x-matroska",
  ".webm": "video/webm",
  ".flv": "video/x-flv",
  ".wmv": "video/x-ms-wmv",
  ".m4v": "video/x-m4v",
  ".mpg": "video/mpeg",
  ".mpeg": "video/mpeg",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".flac": "audio/flac",
  ".aac": "audio/aac",
  ".ogg": "audio/ogg",
  ".m4a": "audio/mp4",
  ".wma": "audio/x-ms-wma",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".txt": "text/plain",
  ".md": "text/markdown",
};

export class MediaScanner {
  private scannedFiles: Map<string, MediaFile> = new Map(); // Hash -> MediaFile

  /**
   * Scan directories for media files
   */
  async scan(options: MediaScanOptions): Promise<MediaFile[]> {
    const allFiles: MediaFile[] = [];
    const defaultExtensions = [
      ...IMAGE_EXTENSIONS,
      ...VIDEO_EXTENSIONS,
      ...AUDIO_EXTENSIONS,
      ...DOCUMENT_EXTENSIONS,
    ];
    const extensions = options.extensions || defaultExtensions;
    const maxSize = options.maxFileSize || 100 * 1024 * 1024; // 100MB default
    const recursive = options.recursive !== false;

    for (const directory of options.directories) {
      const files = await this.scanDirectory(directory, extensions, maxSize, recursive);
      allFiles.push(...files);
    }

    // Deduplicate by hash
    for (const file of allFiles) {
      if (!this.scannedFiles.has(file.hash)) {
        this.scannedFiles.set(file.hash, file);
      }
    }

    return Array.from(this.scannedFiles.values());
  }

  private async scanDirectory(
    directory: string,
    extensions: string[],
    maxSize: number,
    recursive: boolean
  ): Promise<MediaFile[]> {
    const files: MediaFile[] = [];

    try {
      const entries = await readdir(directory, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(directory, entry.name);

        if (entry.isDirectory() && recursive) {
          // Recursively scan subdirectory
          const subFiles = await this.scanDirectory(fullPath, extensions, maxSize, recursive);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          const ext = extname(entry.name).toLowerCase();
          if (extensions.includes(ext)) {
            try {
              const stats = await stat(fullPath);
              if (stats.size <= maxSize) {
                const mediaFile = await this.createMediaFile(fullPath, stats);
                if (mediaFile) {
                  files.push(mediaFile);
                }
              }
            } catch (error) {
              console.warn(`[MediaScanner] Failed to process ${fullPath}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.warn(`[MediaScanner] Failed to scan directory ${directory}:`, error);
    }

    return files;
  }

  private async createMediaFile(path: string, stats: any): Promise<MediaFile | null> {
    try {
      const ext = extname(path).toLowerCase();
      const name = basename(path);
      
      // Determine type
      let type: MediaFile["type"];
      if (IMAGE_EXTENSIONS.includes(ext)) {
        type = "image";
      } else if (VIDEO_EXTENSIONS.includes(ext)) {
        type = "video";
      } else if (AUDIO_EXTENSIONS.includes(ext)) {
        type = "audio";
      } else if (DOCUMENT_EXTENSIONS.includes(ext)) {
        type = "document";
      } else {
        return null; // Unknown type
      }

      // Calculate hash (for deduplication)
      const fileBuffer = await readFile(path);
      const hash = createHash("md5").update(fileBuffer).digest("hex");

      return {
        path,
        name,
        type,
        extension: ext,
        size: stats.size,
        mimeType: MIME_TYPES[ext] || "application/octet-stream",
        hash,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };
    } catch (error) {
      console.warn(`[MediaScanner] Failed to create media file for ${path}:`, error);
      return null;
    }
  }

  /**
   * Get all scanned files
   */
  getAllFiles(): MediaFile[] {
    return Array.from(this.scannedFiles.values());
  }

  /**
   * Get files by type
   */
  getFilesByType(type: MediaFile["type"]): MediaFile[] {
    return Array.from(this.scannedFiles.values()).filter((file) => file.type === type);
  }

  /**
   * Get files by extension
   */
  getFilesByExtension(extension: string): MediaFile[] {
    const ext = extension.toLowerCase();
    return Array.from(this.scannedFiles.values()).filter((file) => file.extension === ext);
  }

  /**
   * Clear scanned files cache
   */
  clear(): void {
    this.scannedFiles.clear();
  }
}


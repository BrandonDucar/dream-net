/**
 * Media Aggregator
 * Aggregates media from multiple sources:
 * - Dropbox
 * - OneDrive
 * - iCloud Photos (via local export)
 * - Local directories
 * - Social media platforms (Instagram, Farcaster, etc.)
 * - Twilio (MMS/media)
 */

import { MediaScanner, type MediaFile } from "./media-scanner";
import { DropboxMediaAccess, type DropboxFile } from "./platforms/dropbox";
import { OneDriveMediaAccess, type OneDriveFile } from "./platforms/onedrive";
import { readFile } from "fs/promises";
import { existsSync } from "fs";

export interface MediaSource {
  type: "dropbox" | "onedrive" | "icloud" | "local" | "instagram" | "farcaster" | "twilio";
  config: any;
  path?: string; // For local/icloud
}

export interface AggregatedMedia {
  source: string;
  type: MediaFile["type"];
  name: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  mimeType: string;
  metadata?: Record<string, any>;
}

export class MediaAggregator {
  private scanner: MediaScanner;
  private sources: MediaSource[] = [];

  constructor() {
    this.scanner = new MediaScanner();
  }

  /**
   * Add a media source
   */
  addSource(source: MediaSource): void {
    this.sources.push(source);
  }

  /**
   * Aggregate media from all sources
   */
  async aggregateMedia(limit?: number): Promise<AggregatedMedia[]> {
    const allMedia: AggregatedMedia[] = [];

    for (const source of this.sources) {
      try {
        let media: AggregatedMedia[] = [];

        switch (source.type) {
          case "dropbox":
            media = await this.aggregateFromDropbox(source);
            break;
          case "onedrive":
            media = await this.aggregateFromOneDrive(source);
            break;
          case "icloud":
          case "local":
            media = await this.aggregateFromLocal(source);
            break;
          case "instagram":
            media = await this.aggregateFromInstagram(source);
            break;
          case "farcaster":
            media = await this.aggregateFromFarcaster(source);
            break;
          case "twilio":
            media = await this.aggregateFromTwilio(source);
            break;
        }

        allMedia.push(...media);
      } catch (error: any) {
        console.warn(`[MediaAggregator] Failed to aggregate from ${source.type}:`, error.message);
      }
    }

    // Sort by modified date (newest first)
    allMedia.sort((a, b) => {
      const aDate = a.metadata?.modifiedAt ? new Date(a.metadata.modifiedAt).getTime() : 0;
      const bDate = b.metadata?.modifiedAt ? new Date(b.metadata.modifiedAt).getTime() : 0;
      return bDate - aDate;
    });

    return limit ? allMedia.slice(0, limit) : allMedia;
  }

  private async aggregateFromDropbox(source: MediaSource): Promise<AggregatedMedia[]> {
    const dropbox = new DropboxMediaAccess({ accessToken: source.config.accessToken });
    const files = await dropbox.listMediaFiles(source.path);

    return files.map((file) => ({
      source: `dropbox:${file.path}`,
      type: file.mimeType.startsWith("image/") ? "image" : "video",
      name: file.name,
      url: file.downloadUrl || file.path,
      thumbnailUrl: file.thumbnailUrl,
      size: file.size,
      mimeType: file.mimeType,
      metadata: {
        id: file.id,
        modifiedAt: file.modifiedAt.toISOString(),
      },
    }));
  }

  private async aggregateFromOneDrive(source: MediaSource): Promise<AggregatedMedia[]> {
    const onedrive = new OneDriveMediaAccess({ accessToken: source.config.accessToken });
    const files = await onedrive.listMediaFiles(source.path);

    return files.map((file) => ({
      source: `onedrive:${file.path}`,
      type: file.mimeType.startsWith("image/") ? "image" : "video",
      name: file.name,
      url: file.downloadUrl || file.path,
      thumbnailUrl: file.thumbnailUrl,
      size: file.size,
      mimeType: file.mimeType,
      metadata: {
        id: file.id,
        modifiedAt: file.modifiedAt.toISOString(),
      },
    }));
  }

  private async aggregateFromLocal(source: MediaSource): Promise<AggregatedMedia[]> {
    if (!source.path || !existsSync(source.path)) {
      return [];
    }

    const files = await this.scanner.scan({
      directories: [source.path],
      recursive: true,
    });

    return files.map((file) => ({
      source: `local:${file.path}`,
      type: file.type,
      name: file.name,
      url: file.path,
      size: file.size,
      mimeType: file.mimeType,
      metadata: {
        hash: file.hash,
        modifiedAt: file.modifiedAt?.toISOString(),
      },
    }));
  }

  private async aggregateFromInstagram(source: MediaSource): Promise<AggregatedMedia[]> {
    // Placeholder - would need Instagram Graph API
    // Instagram API allows fetching user's own media
    console.warn("[MediaAggregator] Instagram aggregation not yet implemented");
    return [];
  }

  private async aggregateFromFarcaster(source: MediaSource): Promise<AggregatedMedia[]> {
    // Placeholder - would need Farcaster API
    // Farcaster stores media on IPFS or other decentralized storage
    console.warn("[MediaAggregator] Farcaster aggregation not yet implemented");
    return [];
  }

  private async aggregateFromTwilio(source: MediaSource): Promise<AggregatedMedia[]> {
    // Placeholder - would need Twilio MMS API
    // Twilio can receive MMS with media attachments
    console.warn("[MediaAggregator] Twilio media aggregation not yet implemented");
    return [];
  }

  /**
   * Auto-configure from environment variables
   */
  autoConfigure(): void {
    // Dropbox
    if (process.env.DROPBOX_ACCESS_TOKEN) {
      this.addSource({
        type: "dropbox",
        config: { accessToken: process.env.DROPBOX_ACCESS_TOKEN },
        path: process.env.DROPBOX_MEDIA_PATH,
      });
    }

    // OneDrive
    if (process.env.ONEDRIVE_ACCESS_TOKEN) {
      this.addSource({
        type: "onedrive",
        config: { accessToken: process.env.ONEDRIVE_ACCESS_TOKEN },
        path: process.env.ONEDRIVE_MEDIA_PATH,
      });
    }

    // iCloud Photos (via local export)
    if (process.env.ICLOUD_PHOTOS_EXPORT_PATH) {
      this.addSource({
        type: "icloud",
        config: {},
        path: process.env.ICLOUD_PHOTOS_EXPORT_PATH,
      });
    }

    // Local media directories
    const localPaths = [
      process.env.MEDIA_ROOT,
      process.env.LOCAL_MEDIA_PATH,
      "./media",
      "~/Pictures",
      "~/Downloads",
    ].filter(Boolean) as string[];

    for (const path of localPaths) {
      if (existsSync(path)) {
        this.addSource({
          type: "local",
          config: {},
          path,
        });
      }
    }
  }
}


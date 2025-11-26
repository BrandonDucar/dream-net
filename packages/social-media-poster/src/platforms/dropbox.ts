/**
 * Dropbox Platform Integration
 * Access photos and media from Dropbox
 */

import axios from "axios";

export interface DropboxConfig {
  accessToken: string;
}

export interface DropboxFile {
  id: string;
  name: string;
  path: string;
  size: number;
  mimeType: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
  modifiedAt: Date;
}

export class DropboxMediaAccess {
  private config: DropboxConfig;
  private baseUrl = "https://api.dropboxapi.com";

  constructor(config: DropboxConfig) {
    this.config = config;
  }

  /**
   * List all media files in Dropbox
   */
  async listMediaFiles(path: string = "", extensions?: string[]): Promise<DropboxFile[]> {
    const defaultExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".mov", ".avi", ".mkv"];
    const targetExtensions = extensions || defaultExtensions;

    try {
      const response = await axios.post(
        `${this.baseUrl}/2/files/list_folder`,
        {
          path: path || "",
          recursive: true,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const files: DropboxFile[] = [];

      for (const entry of response.data.entries) {
        if (entry[".tag"] === "file") {
          const ext = entry.name.substring(entry.name.lastIndexOf(".")).toLowerCase();
          if (targetExtensions.includes(ext)) {
            files.push({
              id: entry.id,
              name: entry.name,
              path: entry.path_lower,
              size: entry.size,
              mimeType: this.getMimeType(ext),
              modifiedAt: new Date(entry.server_modified),
            });
          }
        }
      }

      // Get download URLs and thumbnails
      for (const file of files) {
        try {
          // Get download URL
          const downloadResponse = await axios.post(
            `${this.baseUrl}/2/files/get_temporary_link`,
            { path: file.path },
            {
              headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          file.downloadUrl = downloadResponse.data.link;

          // Get thumbnail if it's an image
          if (file.mimeType.startsWith("image/")) {
            const thumbResponse = await axios.post(
              `${this.baseUrl}/2/files/get_thumbnail_v2`,
              {
                resource: { ".tag": "path", path: file.path },
                format: "jpeg",
                size: "w640h480",
              },
              {
                headers: {
                  Authorization: `Bearer ${this.config.accessToken}`,
                  "Content-Type": "application/json",
                },
                responseType: "arraybuffer",
              }
            );
            // Convert to data URL
            const base64 = Buffer.from(thumbResponse.data).toString("base64");
            file.thumbnailUrl = `data:image/jpeg;base64,${base64}`;
          }
        } catch (error) {
          console.warn(`[Dropbox] Failed to get URL for ${file.path}:`, error);
        }
      }

      return files;
    } catch (error: any) {
      throw new Error(`Failed to list Dropbox files: ${error.message}`);
    }
  }

  /**
   * Download a file from Dropbox
   */
  async downloadFile(path: string): Promise<Buffer> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/2/files/download`,
        null,
        {
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            "Dropbox-API-Arg": JSON.stringify({ path }),
          },
          responseType: "arraybuffer",
        }
      );

      return Buffer.from(response.data);
    } catch (error: any) {
      throw new Error(`Failed to download file from Dropbox: ${error.message}`);
    }
  }

  private getMimeType(ext: string): string {
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".mp4": "video/mp4",
      ".mov": "video/quicktime",
      ".avi": "video/x-msvideo",
      ".mkv": "video/x-matroska",
    };
    return mimeTypes[ext.toLowerCase()] || "application/octet-stream";
  }
}


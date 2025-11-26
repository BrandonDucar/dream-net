/**
 * OneDrive Platform Integration
 * Access photos and media from OneDrive
 */

import axios from "axios";

export interface OneDriveConfig {
  accessToken: string;
}

export interface OneDriveFile {
  id: string;
  name: string;
  path: string;
  size: number;
  mimeType: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
  modifiedAt: Date;
}

export class OneDriveMediaAccess {
  private config: OneDriveConfig;
  private baseUrl = "https://graph.microsoft.com/v1.0";

  constructor(config: OneDriveConfig) {
    this.config = config;
  }

  /**
   * List all media files in OneDrive
   */
  async listMediaFiles(path: string = "", extensions?: string[]): Promise<OneDriveFile[]> {
    const defaultExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".mov", ".avi", ".mkv"];
    const targetExtensions = extensions || defaultExtensions;

    try {
      const drivePath = path ? `/me/drive/root:/${path}:/children` : "/me/drive/root/children";
      
      const response = await axios.get(
        `${this.baseUrl}${drivePath}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
          },
          params: {
            $expand: "thumbnails",
            $filter: "file ne null",
          },
        }
      );

      const files: OneDriveFile[] = [];

      for (const item of response.data.value) {
        if (item.file) {
          const ext = item.name.substring(item.name.lastIndexOf(".")).toLowerCase();
          if (targetExtensions.includes(ext)) {
            files.push({
              id: item.id,
              name: item.name,
              path: item.parentReference?.path || item.webUrl || "",
              size: item.size,
              mimeType: item.file.mimeType,
              thumbnailUrl: item.thumbnails?.[0]?.medium?.url,
              downloadUrl: item["@microsoft.graph.downloadUrl"],
              modifiedAt: new Date(item.lastModifiedDateTime),
            });
          }
        }
      }

      // Recursively get files from subfolders
      for (const item of response.data.value) {
        if (item.folder && path) {
          const subFiles = await this.listMediaFiles(`${path}/${item.name}`, extensions);
          files.push(...subFiles);
        }
      }

      return files;
    } catch (error: any) {
      throw new Error(`Failed to list OneDrive files: ${error.message}`);
    }
  }

  /**
   * Download a file from OneDrive
   */
  async downloadFile(id: string): Promise<Buffer> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/me/drive/items/${id}/content`,
        {
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
          },
          responseType: "arraybuffer",
        }
      );

      return Buffer.from(response.data);
    } catch (error: any) {
      throw new Error(`Failed to download file from OneDrive: ${error.message}`);
    }
  }
}


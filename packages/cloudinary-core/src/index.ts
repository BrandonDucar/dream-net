/**
 * Cloudinary Integration Core
 * Image and media management for DreamNet
 */

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  publicId?: string;
  overwrite?: boolean;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  transformation?: string;
  tags?: string[];
}

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export class CloudinaryClient {
  private cloudName: string;
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;

  constructor(config: CloudinaryConfig) {
    this.cloudName = config.cloudName;
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.baseUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}`;
  }

  /**
   * Upload a file to Cloudinary
   */
  async upload(file: Buffer | string, options: CloudinaryUploadOptions = {}): Promise<CloudinaryUploadResponse> {
    const formData = new FormData();
    
    if (typeof file === 'string') {
      formData.append('file', file);
    } else {
      formData.append('file', new Blob([file]));
    }
    
    formData.append('api_key', this.apiKey);
    formData.append('timestamp', String(Date.now()));
    
    if (options.folder) formData.append('folder', options.folder);
    if (options.publicId) formData.append('public_id', options.publicId);
    if (options.overwrite) formData.append('overwrite', 'true');
    if (options.resourceType) formData.append('resource_type', options.resourceType);
    if (options.transformation) formData.append('transformation', options.transformation);
    if (options.tags) {
      options.tags.forEach(tag => formData.append('tags[]', tag));
    }

    // Generate signature
    const signature = this.generateSignature(formData);
    formData.append('signature', signature);

    const response = await fetch(`${this.baseUrl}/${options.resourceType || 'image'}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudinary API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  /**
   * Generate image URL with transformations
   */
  url(publicId: string, options?: {
    transformation?: string;
    format?: string;
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
  }): string {
    let url = `https://res.cloudinary.com/${this.cloudName}/image/upload`;
    
    if (options?.transformation) {
      url += `/${options.transformation}`;
    } else {
      const transforms: string[] = [];
      if (options?.width) transforms.push(`w_${options.width}`);
      if (options?.height) transforms.push(`h_${options.height}`);
      if (options?.crop) transforms.push(`c_${options.crop}`);
      if (options?.quality) transforms.push(`q_${options.quality}`);
      if (transforms.length > 0) {
        url += `/${transforms.join(',')}`;
      }
    }
    
    url += `/${publicId}`;
    
    if (options?.format) {
      url += `.${options.format}`;
    }
    
    return url;
  }

  /**
   * Delete an asset
   */
  async destroy(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<void> {
    const timestamp = Date.now();
    const signature = this.generateSignature({
      public_id: publicId,
      timestamp: String(timestamp),
    });

    const params = new URLSearchParams({
      public_id: publicId,
      timestamp: String(timestamp),
      signature,
      api_key: this.apiKey,
    });

    const response = await fetch(`${this.baseUrl}/${resourceType}/destroy?${params.toString()}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudinary API error: ${response.status} ${error}`);
    }
  }

  private generateSignature(params: Record<string, string> | FormData): string {
    // Simple signature generation - in production, use crypto
    const sorted = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    
    // Note: In production, use proper crypto library for HMAC-SHA1
    return sorted + this.apiSecret;
  }
}

export function createCloudinaryClient(): CloudinaryClient | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('[Cloudinary] ⚠️  CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET not set');
    return null;
  }

  return new CloudinaryClient({ cloudName, apiKey, apiSecret });
}

let _cloudinaryClient: CloudinaryClient | null = null;

export function getCloudinaryClient(): CloudinaryClient | null {
  if (!_cloudinaryClient) {
    _cloudinaryClient = createCloudinaryClient();
  }
  return _cloudinaryClient;
}


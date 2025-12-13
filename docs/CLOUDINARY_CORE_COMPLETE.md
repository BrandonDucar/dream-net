# Cloudinary Core - Complete Documentation

**Package**: `@dreamnet/cloudinary-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Cloudinary Core provides **image and media management** for DreamNet using Cloudinary's cloud-based media management platform. It enables image upload, transformation, optimization, and deletion capabilities.

### Key Features

- **Image Upload**: Upload images, videos, and raw files
- **Transformations**: On-the-fly image transformations (resize, crop, quality)
- **URL Generation**: Generate optimized image URLs with transformations
- **Asset Management**: Delete assets and manage public IDs
- **Tagging**: Tag assets for organization
- **Folder Organization**: Organize assets in folders

---

## Architecture

### How It Works

```
File Upload → CloudinaryClient → Cloudinary API → Asset Storage → Optimized URL
```

1. **Client Initialization**: Creates Cloudinary client with credentials
2. **File Upload**: Uploads file with options (folder, tags, transformations)
3. **Signature Generation**: Generates secure signature for API calls
4. **Asset Storage**: Cloudinary stores and optimizes asset
5. **URL Generation**: Returns optimized URLs with transformations

### Why This Design

- **Performance**: Cloudinary's CDN provides fast image delivery
- **Optimization**: Automatic image optimization and format conversion
- **Transformations**: On-the-fly transformations without re-uploading
- **Scalability**: Handles millions of assets efficiently

---

## API Reference

### Types

```typescript
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
```

### Classes

#### `CloudinaryClient`

Main client for interacting with Cloudinary API.

**Constructor**:
```typescript
constructor(config: CloudinaryConfig)
```

**Methods**:

- **`upload(file: Buffer | string, options?: CloudinaryUploadOptions): Promise<CloudinaryUploadResponse>`**
  - Upload a file to Cloudinary
  - Supports Buffer or file path string
  - Returns upload response with URLs and metadata

- **`url(publicId: string, options?: { transformation?: string; format?: string; width?: number; height?: number; crop?: string; quality?: number }): string`**
  - Generate image URL with transformations
  - Supports on-the-fly transformations

- **`destroy(publicId: string, resourceType?: 'image' | 'video' | 'raw'): Promise<void>`**
  - Delete an asset from Cloudinary

### Functions

#### `createCloudinaryClient(): CloudinaryClient | null`

Creates a Cloudinary client from environment variables. Returns `null` if credentials not set.

**Environment Variables**:
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

#### `getCloudinaryClient(): CloudinaryClient | null`

Gets or creates a singleton Cloudinary client instance.

---

## Integration Points

### Consumes

- **Cloudinary API**: Media management service
- **Environment Variables**: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Produces

- **Asset URLs**: Optimized image/video URLs
- **Upload Responses**: Asset metadata and URLs

---

## Usage Examples

### Upload Image

```typescript
import { getCloudinaryClient } from "@dreamnet/cloudinary-core";
import fs from "fs";

const client = getCloudinaryClient();
if (!client) {
  throw new Error("Cloudinary client not configured");
}

// Upload from file path
const result = await client.upload("./image.jpg", {
  folder: "dreams",
  tags: ["dream", "art"],
  resourceType: "image",
});

console.log("Public ID:", result.public_id);
console.log("URL:", result.secure_url);
```

### Upload with Transformations

```typescript
const result = await client.upload("./image.jpg", {
  folder: "dreams",
  transformation: "w_800,h_600,c_fill,q_auto",
  tags: ["optimized"],
});
```

### Generate Transformed URL

```typescript
// Generate URL with transformations
const url = client.url("dreams/image", {
  width: 800,
  height: 600,
  crop: "fill",
  quality: 80,
  format: "webp",
});

console.log("Optimized URL:", url);
```

### Upload Video

```typescript
const result = await client.upload("./video.mp4", {
  folder: "videos",
  resourceType: "video",
  tags: ["video", "content"],
});
```

### Delete Asset

```typescript
await client.destroy("dreams/image", "image");
```

### Create Client Manually

```typescript
import { CloudinaryClient } from "@dreamnet/cloudinary-core";

const client = new CloudinaryClient({
  cloudName: "your-cloud-name",
  apiKey: "your-api-key",
  apiSecret: "your-api-secret",
});

const result = await client.upload("./image.jpg");
```

---

## Best Practices

1. **Folder Organization**: Use folders to organize assets
2. **Tagging**: Tag assets for easy searching and filtering
3. **Transformations**: Use on-the-fly transformations instead of storing multiple sizes
4. **Format Optimization**: Use `format: "webp"` or `format: "auto"` for better compression
5. **Public IDs**: Use meaningful public IDs for easier management
6. **Error Handling**: Always handle upload errors gracefully

---

## Security Considerations

- **API Secrets**: Store API secrets securely in environment variables
- **Signatures**: Signatures are generated for secure API calls
- **Access Control**: Configure Cloudinary access controls appropriately
- **Rate Limiting**: Be aware of Cloudinary rate limits
- **File Validation**: Validate file types and sizes before upload

---

## Related Systems

- **Media Vault**: Media asset management
- **Dream Vault**: Content storage
- **Card Forge Pro**: Card image generation

---

**Status**: ✅ Implemented  
**Next**: Add more advanced transformations and video processing


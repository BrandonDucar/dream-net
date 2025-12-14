# Contentful Core - Complete Documentation

**Package**: `@dreamnet/contentful-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Contentful Core provides **headless CMS integration** for DreamNet using Contentful's content management platform. It enables fetching entries, assets, and preview content from Contentful spaces.

### Key Features

- **Entry Management**: Fetch entries by content type or ID
- **Asset Management**: Fetch assets and asset metadata
- **Query Support**: Filter and query entries with parameters
- **Preview API**: Access draft/unpublished content via preview API
- **Environment Support**: Support for multiple environments (master, staging, etc.)

---

## Architecture

### How It Works

```
Contentful Space → ContentfulClient → Contentful API → Content Entries/Assets
```

1. **Client Initialization**: Creates Contentful client with space ID and access token
2. **API Request**: Makes authenticated requests to Contentful API
3. **Content Fetching**: Retrieves entries or assets
4. **Response Processing**: Returns formatted content data

### Why This Design

- **Headless CMS**: Decouples content management from presentation
- **API-First**: RESTful API for content access
- **Multi-Environment**: Support for staging and production environments
- **Preview Support**: Access draft content before publishing

---

## API Reference

### Types

```typescript
export interface ContentfulConfig {
  spaceId: string;
  accessToken: string;
  environment?: string;
  previewToken?: string;
}
```

### Classes

#### `ContentfulClient`

Main client for interacting with Contentful API.

**Constructor**:
```typescript
constructor(config: ContentfulConfig)
```

**Methods**:

- **`getEntries(contentType?: string, query?: Record<string, any>): Promise<any>`**
  - Fetch entries from Contentful
  - Optional content type filter
  - Optional query parameters for filtering

- **`getEntry(entryId: string): Promise<any>`**
  - Get a specific entry by ID
  - Returns entry with all fields

- **`getAssets(query?: Record<string, any>): Promise<any>`**
  - Get assets from Contentful
  - Optional query parameters for filtering

- **`getAsset(assetId: string): Promise<any>`**
  - Get a specific asset by ID
  - Returns asset metadata and URLs

- **`previewEntry(entryId: string): Promise<any>`**
  - Preview draft/unpublished entry
  - Requires preview token configuration

### Functions

#### `createContentfulClient(): ContentfulClient | null`

Creates a Contentful client from environment variables. Returns `null` if credentials not set.

**Environment Variables**:
- `CONTENTFUL_SPACE_ID`: Contentful space ID
- `CONTENTFUL_ACCESS_TOKEN`: Contentful access token
- `CONTENTFUL_ENVIRONMENT`: Contentful environment (default: "master")
- `CONTENTFUL_PREVIEW_TOKEN`: Contentful preview token (optional)

#### `getContentfulClient(): ContentfulClient | null`

Gets or creates a singleton Contentful client instance.

---

## Integration Points

### Consumes

- **Contentful API**: Content management service
- **Environment Variables**: `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`, `CONTENTFUL_ENVIRONMENT`, `CONTENTFUL_PREVIEW_TOKEN`

### Produces

- **Content Entries**: Structured content from Contentful
- **Assets**: Media assets and metadata

---

## Usage Examples

### Get All Entries

```typescript
import { getContentfulClient } from "@dreamnet/contentful-core";

const client = getContentfulClient();
if (!client) {
  throw new Error("Contentful client not configured");
}

const entries = await client.getEntries();
console.log("Total entries:", entries.total);
entries.items.forEach(entry => {
  console.log("Entry:", entry.sys.id, entry.fields);
});
```

### Get Entries by Content Type

```typescript
const blogPosts = await client.getEntries("blogPost", {
  limit: 10,
  order: "-sys.createdAt",
});

blogPosts.items.forEach(post => {
  console.log("Title:", post.fields.title);
  console.log("Content:", post.fields.content);
});
```

### Get Specific Entry

```typescript
const entry = await client.getEntry("entry-id-123");
console.log("Entry:", entry.fields);
```

### Query Entries

```typescript
const featuredPosts = await client.getEntries("blogPost", {
  "fields.featured": true,
  limit: 5,
});
```

### Get Assets

```typescript
const assets = await client.getAssets({
  limit: 20,
  mimetype: "image/jpeg",
});

assets.items.forEach(asset => {
  console.log("Asset URL:", asset.fields.file.url);
});
```

### Get Specific Asset

```typescript
const asset = await client.getAsset("asset-id-456");
console.log("Asset URL:", asset.fields.file.url);
console.log("Asset Title:", asset.fields.title);
```

### Preview Entry

```typescript
// Preview draft/unpublished content
const draftEntry = await client.previewEntry("entry-id-123");
console.log("Draft content:", draftEntry.fields);
```

### Create Client Manually

```typescript
import { ContentfulClient } from "@dreamnet/contentful-core";

const client = new ContentfulClient({
  spaceId: "your-space-id",
  accessToken: "your-access-token",
  environment: "master",
  previewToken: "your-preview-token", // Optional
});

const entries = await client.getEntries("blogPost");
```

---

## Best Practices

1. **Environment Variables**: Use environment variables for credentials
2. **Error Handling**: Always handle API errors gracefully
3. **Caching**: Cache entries/assets to reduce API calls
4. **Query Optimization**: Use specific queries instead of fetching all entries
5. **Preview Token**: Use preview token for draft content in development
6. **Content Types**: Use content types for structured content management

---

## Security Considerations

- **Access Tokens**: Store access tokens securely in environment variables
- **Preview Tokens**: Use preview tokens only in development/staging
- **Rate Limiting**: Be aware of Contentful API rate limits
- **Content Validation**: Validate content before using in production

---

## Related Systems

- **Dream Vault**: Content storage
- **Media Vault**: Media asset management
- **Algolia Core**: Content search indexing

---

**Status**: ✅ Implemented  
**Next**: Add content creation/update/delete operations


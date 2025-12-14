# Algolia Core - Complete Documentation

**Package**: `@dreamnet/algolia-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Algolia Core provides **fast, relevant search** for DreamNet content using Algolia's search-as-a-service platform. It enables full-text search, filtering, highlighting, and indexing capabilities for DreamNet's content ecosystem.

### Key Features

- **Full-Text Search**: Fast, typo-tolerant search across indexed content
- **Filtering**: Advanced filtering capabilities for refined results
- **Highlighting**: Automatic highlighting of matched terms
- **Index Management**: Add, update, and delete objects in Algolia indexes
- **Pagination**: Built-in pagination support
- **Performance**: Sub-millisecond search response times

---

## Architecture

### How It Works

```
DreamNet Content → AlgoliaClient → Algolia API → Search Results
```

1. **Client Initialization**: Creates Algolia client with app ID and API key
2. **Index Operations**: Add, update, delete objects in indexes
3. **Search Queries**: Execute search queries with filters and options
4. **Response Processing**: Returns formatted search results with metadata

### Why This Design

- **Performance**: Algolia provides sub-millisecond search times
- **Scalability**: Handles millions of documents efficiently
- **Relevance**: Advanced ranking and relevance tuning
- **Developer Experience**: Simple API for complex search needs

---

## API Reference

### Types

```typescript
export interface AlgoliaConfig {
  appId: string;
  apiKey: string;
  indexName?: string;
}

export interface AlgoliaSearchOptions {
  query: string;
  filters?: string;
  hitsPerPage?: number;
  page?: number;
  attributesToRetrieve?: string[];
  attributesToHighlight?: string[];
}

export interface AlgoliaSearchResponse<T = any> {
  hits: T[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS: number;
}
```

### Classes

#### `AlgoliaClient`

Main client for interacting with Algolia API.

**Constructor**:
```typescript
constructor(config: AlgoliaConfig)
```

**Methods**:

- **`search<T>(indexName: string, options: AlgoliaSearchOptions): Promise<AlgoliaSearchResponse<T>>`**
  - Execute a search query on an index
  - Returns paginated results with metadata

- **`addObject<T>(indexName: string, object: T, objectID?: string): Promise<{ objectID: string }>`**
  - Add or update an object in an index
  - If `objectID` provided, updates existing object; otherwise creates new

- **`deleteObject(indexName: string, objectID: string): Promise<void>`**
  - Delete an object from an index

### Functions

#### `createAlgoliaClient(): AlgoliaClient | null`

Creates an Algolia client from environment variables. Returns `null` if credentials not set.

**Environment Variables**:
- `ALGOLIA_APP_ID`: Algolia application ID
- `ALGOLIA_API_KEY`: Algolia API key

#### `getAlgoliaClient(): AlgoliaClient | null`

Gets or creates a singleton Algolia client instance.

---

## Integration Points

### Consumes

- **Algolia API**: Search service provider
- **Environment Variables**: `ALGOLIA_APP_ID`, `ALGOLIA_API_KEY`

### Produces

- **Search Results**: Formatted search responses
- **Index Updates**: Object additions, updates, deletions

---

## Usage Examples

### Basic Search

```typescript
import { getAlgoliaClient } from "@dreamnet/algolia-core";

const client = getAlgoliaClient();
if (!client) {
  throw new Error("Algolia client not configured");
}

const results = await client.search("dreams", {
  query: "blockchain",
  hitsPerPage: 20,
  page: 0,
});

console.log(`Found ${results.nbHits} results`);
results.hits.forEach(hit => {
  console.log(hit);
});
```

### Search with Filters

```typescript
const results = await client.search("dreams", {
  query: "NFT",
  filters: "category:art AND status:published",
  hitsPerPage: 10,
  attributesToRetrieve: ["title", "description", "author"],
  attributesToHighlight: ["title", "description"],
});
```

### Add Object to Index

```typescript
const object = {
  objectID: "dream-123",
  title: "My Dream",
  description: "A description",
  category: "art",
  status: "published",
  createdAt: Date.now(),
};

const result = await client.addObject("dreams", object, "dream-123");
console.log("Object ID:", result.objectID);
```

### Update Object

```typescript
const updated = {
  objectID: "dream-123",
  title: "Updated Dream Title",
  status: "archived",
};

await client.addObject("dreams", updated, "dream-123");
```

### Delete Object

```typescript
await client.deleteObject("dreams", "dream-123");
```

### Create Client Manually

```typescript
import { AlgoliaClient } from "@dreamnet/algolia-core";

const client = new AlgoliaClient({
  appId: "YOUR_APP_ID",
  apiKey: "YOUR_API_KEY",
});

const results = await client.search("my-index", {
  query: "search term",
});
```

---

## Best Practices

1. **Index Naming**: Use consistent index naming conventions
2. **Object IDs**: Use meaningful, unique object IDs
3. **Attributes**: Only index searchable attributes
4. **Filters**: Use filters for structured data queries
5. **Pagination**: Use `hitsPerPage` and `page` for large result sets
6. **Highlighting**: Use `attributesToHighlight` for better UX
7. **Error Handling**: Always handle API errors gracefully

---

## Security Considerations

- **API Keys**: Store API keys securely in environment variables
- **Read-Only Keys**: Use read-only API keys for search operations
- **Index Permissions**: Configure index-level permissions appropriately
- **Rate Limiting**: Be aware of Algolia rate limits
- **Data Privacy**: Don't index sensitive data without encryption

---

## Related Systems

- **Dream Vault**: Content storage and indexing
- **Media Vault**: Media asset search
- **Social Hub**: Social content search
- **Neural Mesh**: Vector search alternative

---

**Status**: ✅ Implemented  
**Next**: Add more advanced search features (facet filtering, sorting, etc.)


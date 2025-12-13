# Media Jellyfin - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Media Jellyfin provides **media server integration** for DreamNet's OTT Streaming vertical. It integrates with Jellyfin self-hosted media server for media library management, streaming, and content organization, enabling users to manage and stream their media collections.

---

## Key Features

### Media Management
- Library management
- Media item retrieval
- Streaming support
- Content organization

### API Integration
- Jellyfin API integration
- Authentication support
- Media operations
- Error handling

---

## Architecture

### Components

1. **Jellyfin Media Server** (`JellyfinMediaServer.ts`)
   - API client wrapper
   - Media operations
   - Authentication management

---

## API Reference

### Initialization

#### `new JellyfinMediaServer(config: JellyfinConfig): JellyfinMediaServer`
Creates Jellyfin media server client instance.

**Example**:
```typescript
import { JellyfinMediaServer } from '@dreamnet/media-jellyfin';

const server = new JellyfinMediaServer({
  serverUrl: 'https://jellyfin.example.com',
  apiKey: process.env.JELLYFIN_API_KEY,
});

await server.authenticate();
```

### Authentication

#### `authenticate(): Promise<{ success: boolean; error?: string }>`
Authenticates with Jellyfin server.

**Example**:
```typescript
const result = await server.authenticate();
if (result.success) {
  console.log('Authenticated successfully');
}
```

### Library Operations

#### `getLibraries(): Promise<JellyfinLibrary[]>`
Gets list of libraries.

**Example**:
```typescript
const libraries = await server.getLibraries();
libraries.forEach(library => {
  console.log(`${library.name}: ${library.type}`);
});
```

### Media Operations

#### `getMediaItems(libraryId: string, limit?: number): Promise<JellyfinMediaItem[]>`
Gets media items from library.

**Example**:
```typescript
const items = await server.getMediaItems('library-id', 50);
items.forEach(item => {
  console.log(`${item.name}: ${item.type}`);
});
```

---

## Data Models

### JellyfinConfig

```typescript
interface JellyfinConfig {
  serverUrl: string;
  apiKey?: string;
  username?: string;
  password?: string;
  userId?: string;
}
```

### JellyfinMediaItem

```typescript
interface JellyfinMediaItem {
  id: string;
  name: string;
  type: "Movie" | "Series" | "Episode" | "Music" | "AudioBook" | "Book";
  path?: string;
  imageUrl?: string;
  overview?: string;
  year?: number;
  runtime?: number;
  genres?: string[];
}
```

### JellyfinLibrary

```typescript
interface JellyfinLibrary {
  id: string;
  name: string;
  type: "movies" | "tvshows" | "music" | "books";
  itemCount?: number;
}
```

---

## Media Types

### Movies
Feature films and movies.

### Series
TV series and shows.

### Episodes
Individual TV episodes.

### Music
Music tracks and albums.

### AudioBooks
Audiobook content.

### Books
E-book content.

---

## Integration Points

### DreamNet Systems
- **OTT Streaming Vertical**: Media streaming
- **Media Vault**: Media storage
- **Social Hub Core**: Media sharing
- **DreamNet Video Brand Core**: Video branding

---

## Usage Examples

### Get Libraries and Media

```typescript
const server = new JellyfinMediaServer({
  serverUrl: 'https://jellyfin.example.com',
  apiKey: process.env.JELLYFIN_API_KEY,
});

await server.authenticate();

const libraries = await server.getLibraries();
const items = await server.getMediaItems(libraries[0].id);
```

---

## Best Practices

1. **Media Management**
   - Organize libraries properly
   - Use appropriate media types
   - Cache media metadata
   - Handle streaming properly

2. **API Management**
   - Secure API keys
   - Handle authentication
   - Monitor usage
   - Cache responses

---

## Security Considerations

1. **API Security**
   - Secure API keys
   - Use HTTPS
   - Validate authentication
   - Monitor access

2. **Content Security**
   - Control access to media
   - Validate media content
   - Secure streaming URLs
   - Monitor usage

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27


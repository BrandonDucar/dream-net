# Media PeerTube - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Media PeerTube provides **P2P streaming integration** for DreamNet's OTT Streaming vertical. It integrates with PeerTube P2P streaming patterns for decentralized video hosting, enabling self-hosted video platforms with P2P distribution.

---

## Key Features

### Video Operations
- Video retrieval
- Channel management
- P2P streaming
- Video metadata

### API Integration
- PeerTube API integration
- Self-hosted instance support
- P2P URL generation
- Error handling

---

## Architecture

### Components

1. **PeerTube Client** (`PeerTubeClient.ts`)
   - API client wrapper
   - Video operations
   - Channel operations

---

## API Reference

### Initialization

#### `new PeerTubeClient(config: PeerTubeConfig): PeerTubeClient`
Creates PeerTube client instance.

**Example**:
```typescript
import { PeerTubeClient } from '@dreamnet/media-peertube';

const client = new PeerTubeClient({
  instanceUrl: 'https://peertube.example.com',
  apiKey: process.env.PEERTUBE_API_KEY,
});
```

### Video Operations

#### `getVideos(limit?: number): Promise<PeerTubeVideo[]>`
Gets list of videos.

**Example**:
```typescript
const videos = await client.getVideos(20);
videos.forEach(video => {
  console.log(`${video.name}: ${video.duration}s`);
});
```

#### `getVideo(videoId: string): Promise<PeerTubeVideo | null>`
Gets video by ID.

**Example**:
```typescript
const video = await client.getVideo('video-id');
if (video) {
  console.log(`Streaming URL: ${video.streamingUrl}`);
  console.log(`P2P URL: ${video.p2pUrl}`);
}
```

### Channel Operations

#### `getChannels(limit?: number): Promise<PeerTubeChannel[]>`
Gets list of channels.

**Example**:
```typescript
const channels = await client.getChannels(20);
channels.forEach(channel => {
  console.log(`${channel.displayName}: ${channel.videoCount} videos`);
});
```

---

## Data Models

### PeerTubeConfig

```typescript
interface PeerTubeConfig {
  instanceUrl: string;
  apiKey?: string;
}
```

### PeerTubeVideo

```typescript
interface PeerTubeVideo {
  id: string;
  uuid: string;
  name: string;
  description?: string;
  duration: number;
  thumbnailUrl?: string;
  streamingUrl?: string;
  p2pUrl?: string;
  views: number;
  likes: number;
  publishedAt: string;
  channel: {
    id: string;
    name: string;
    displayName: string;
  };
}
```

### PeerTubeChannel

```typescript
interface PeerTubeChannel {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  videoCount: number;
  followerCount: number;
}
```

---

## P2P Streaming

### Benefits
- Decentralized distribution
- Reduced server load
- Scalable architecture
- Self-hosted control

### Implementation
- Tracker URLs
- P2P protocol support
- Client-side P2P
- Fallback streaming

---

## Integration Points

### DreamNet Systems
- **OTT Streaming Vertical**: Video streaming
- **Media Vault**: Video storage
- **Social Hub Core**: Video sharing
- **DreamNet Video Brand Core**: Video branding

---

## Usage Examples

### Get Videos

```typescript
const client = new PeerTubeClient({
  instanceUrl: 'https://peertube.example.com',
});

const videos = await client.getVideos(20);
const video = videos[0];

console.log(`Streaming: ${video.streamingUrl}`);
console.log(`P2P: ${video.p2pUrl}`);
```

---

## Best Practices

1. **Video Management**
   - Cache video metadata
   - Handle P2P fallback
   - Monitor streaming
   - Optimize delivery

2. **API Management**
   - Secure API keys
   - Handle rate limits
   - Monitor usage
   - Cache responses

---

## Security Considerations

1. **API Security**
   - Secure API keys
   - Validate inputs
   - Control access
   - Monitor usage

2. **Content Security**
   - Validate video content
   - Check copyright compliance
   - Secure streaming URLs
   - Control distribution

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27


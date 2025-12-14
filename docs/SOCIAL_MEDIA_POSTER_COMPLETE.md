# Social Media Poster - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Social Media Poster provides **unified multi-platform social media posting** for DreamNet. It supports 15+ platforms including Twitter/X, Instagram, TikTok, Facebook, LinkedIn, YouTube, GitHub, Notion, Slack, Discord, Telegram, Farcaster, Base, Reddit, and more, with account management and OAuth support.

---

## Key Features

### Multi-Platform Support
- **Social Media**: Twitter/X, Instagram, TikTok, Facebook, LinkedIn, Threads, Reddit
- **Video**: YouTube, YouTube Shorts
- **Developer**: GitHub, Base
- **Communication**: Slack, Discord, Telegram, Notion
- **Web3**: Farcaster

### Account Management
- Multiple account support
- OAuth integration
- Token refresh
- Personal vs. DreamNet accounts

### Media Support
- Image posting
- Video posting
- Media scanning
- Cloud storage integration (Dropbox, OneDrive, iCloud)

### Unified Interface
- Single API for all platforms
- Consistent error handling
- Status tracking
- Result reporting

---

## Architecture

### Components

1. **Social Media Poster** (`SocialMediaPoster.ts`)
   - Main poster class
   - Account management
   - Platform routing
   - Unified interface

2. **Platform Clients**
   - TwitterPoster
   - InstagramPoster
   - FacebookPoster
   - LinkedInPoster
   - TikTokPoster
   - YouTubePoster
   - GitHubPoster
   - NotionPoster
   - SlackPoster
   - DiscordPoster

3. **Media Scanner** (`src/media-scanner.ts`)
   - Media file scanning
   - Format detection
   - Metadata extraction

4. **Media Aggregator** (`src/media-aggregator.ts`)
   - Cloud storage access
   - Media aggregation
   - Source tracking

---

## API Reference

### Initialization

#### `new SocialMediaPoster(): SocialMediaPoster`
Creates Social Media Poster instance.

**Example**:
```typescript
import { SocialMediaPoster } from '@dreamnet/social-media-poster';

const poster = new SocialMediaPoster();
```

### Posting

#### `post(post: SocialPost, account?: SocialAccount): Promise<PostResult>`
Posts to a platform.

**Example**:
```typescript
const result = await poster.post({
  content: 'Hello from DreamNet!',
  platform: 'twitter',
  hashtags: ['dreamnet', 'web3'],
  mediaUrls: ['https://example.com/image.jpg'],
});

if (result.success) {
  console.log(`Posted: ${result.postUrl}`);
} else {
  console.error(`Error: ${result.error}`);
}
```

### Account Management

#### `addAccount(account: SocialAccount): void`
Adds a social media account.

**Example**:
```typescript
poster.addAccount({
  platform: 'twitter',
  accountId: 'dreamnet',
  username: 'dreamnet',
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  refreshToken: process.env.TWITTER_REFRESH_TOKEN,
  isPersonal: false,
});
```

---

## Data Models

### SocialPost

```typescript
interface SocialPost {
  content: string;
  mediaUrls?: string[];
  hashtags?: string[];
  platform: SocialPlatform;
}
```

### SocialAccount

```typescript
interface SocialAccount {
  platform: SocialPlatform;
  accountId: string;
  username: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  isPersonal?: boolean;
}
```

### PostResult

```typescript
interface PostResult {
  success: boolean;
  postId?: string;
  postUrl?: string;
  error?: string;
}
```

### SocialPlatform

```typescript
type SocialPlatform =
  | "twitter" | "instagram" | "facebook" | "linkedin"
  | "tiktok" | "threads" | "youtube" | "github"
  | "notion" | "slack" | "discord" | "telegram"
  | "farcaster" | "base" | "reddit";
```

---

## Platform-Specific Features

### Twitter/X
- Text posts
- Image posts
- Thread support
- Media uploads

### Instagram
- Photo posts
- Video posts
- Stories (via API)
- Reels

### TikTok
- Video posts
- Captions
- Hashtags
- Sound selection

### YouTube
- Video uploads
- Descriptions
- Thumbnails
- Playlists

### GitHub
- Gist creation
- Issue comments
- Repository updates

---

## Media Support

### Media Scanner
- File format detection
- Metadata extraction
- Size validation
- Format conversion

### Media Aggregator
- Dropbox integration
- OneDrive integration
- iCloud Photos integration
- Social media media access

### Cloud Storage
- DropboxMediaAccess
- OneDriveMediaAccess
- iCloudPhotosAccess

---

## Integration Points

### DreamNet Systems
- **Orca Pack Core**: Content posting
- **Whale Pack Core**: Commerce posting
- **Media Vault**: Media storage
- **Narrative Field**: Post logging

### External Systems
- **Platform APIs**: All social media platforms
- **OAuth Providers**: Authentication
- **Cloud Storage**: Media access

---

## Usage Examples

### Basic Post

```typescript
const result = await poster.post({
  content: 'Hello from DreamNet!',
  platform: 'twitter',
});
```

### Post with Media

```typescript
const result = await poster.post({
  content: 'Check out this image!',
  platform: 'instagram',
  mediaUrls: ['https://example.com/image.jpg'],
  hashtags: ['dreamnet', 'web3'],
});
```

### Post to Multiple Platforms

```typescript
const platforms = ['twitter', 'linkedin', 'facebook'];
for (const platform of platforms) {
  await poster.post({
    content: 'Cross-platform post!',
    platform: platform as SocialPlatform,
  });
}
```

---

## Best Practices

1. **Account Management**
   - Use OAuth for personal accounts
   - Refresh tokens regularly
   - Monitor token expiration
   - Handle errors gracefully

2. **Posting**
   - Validate content before posting
   - Check media formats
   - Use appropriate hashtags
   - Monitor post status

3. **Media**
   - Optimize media sizes
   - Use supported formats
   - Validate media URLs
   - Handle upload errors

---

## Security Considerations

1. **Authentication**
   - Protect access tokens
   - Use OAuth securely
   - Rotate tokens regularly
   - Monitor access

2. **Content Security**
   - Validate content
   - Sanitize inputs
   - Check media safety
   - Audit posts

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27


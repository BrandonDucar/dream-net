# Media Vault - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Media Vault provides a **comprehensive media management system** for DreamNet. It handles image and video ingestion, storage, metadata extraction, tagging, and post queue management.

---

## Key Features

### Media Ingestion
- File upload ingestion
- URL-based ingestion
- Automatic deduplication (hash-based)
- Metadata extraction
- Thumbnail generation
- Web-optimized versions

### Media Management
- Tag extraction from filenames
- Entity extraction from prompts
- Collection organization
- Rights management
- Rating system
- Usage tracking

### Post Queue
- Social media post scheduling
- Multi-platform support (X, Base, IG)
- Engagement tracking
- Post status management

---

## Architecture

### Components

1. **Ingest Module** (`src/ingest.ts`)
   - File ingestion
   - URL ingestion
   - Hash computation
   - Metadata extraction
   - Derivative generation

2. **Database Module** (`src/db.ts`)
   - Media asset storage
   - Search functionality
   - Usage tracking
   - Post queue management

3. **Vocabulary Module** (`src/vocab.ts`)
   - Tag extraction
   - Entity normalization
   - Prompt parsing

---

## API Reference

### Media Ingestion

#### `ingestFromFile(file: Buffer, filename: string, options: IngestOptions): Promise<MediaAsset>`
Ingests media from file buffer.

**Example**:
```typescript
import { ingestFromFile } from '@dreamnet/media-vault';

const fileBuffer = await fs.readFile('image.jpg');
const asset = await ingestFromFile(fileBuffer, 'image.jpg', {
  source: 'camera',
  title: 'My Image',
  tags: ['photo', 'nature'],
  prompt: 'A beautiful landscape',
  model: 'camera',
  rights: 'owned',
  rating: 'A',
  collections: ['personal'],
});
```

#### `ingestFromUrl(url: string, options: IngestOptions): Promise<MediaAsset>`
Ingests media from URL.

### Media Search

#### `searchMedia(filters: SearchFilters, limit?: number, offset?: number): Promise<MediaAsset[]>`
Searches media assets.

**Example**:
```typescript
import { searchMedia } from '@dreamnet/media-vault';

const results = await searchMedia({
  q: 'landscape',
  type: 'image',
  tags: ['nature'],
  rating: 'A',
}, 20, 0);
```

#### `getPublicMedia(collection?: string, limit?: number, offset?: number): Promise<MediaAsset[]>`
Gets public media assets.

---

## Data Models

### MediaAsset

```typescript
interface MediaAsset {
  id: string;
  type: MediaType;
  title: string;
  source: MediaSource;
  file_path: string;
  string;
  hash: string;
  width: number;
  height: number;
  duration_ms: number;
  size_bytes: number;
  created_at: string;
  tags: string[];
  entities: string[];
  credits: {
    prompt?: string;
    model?: string;
  };
  caption: string;
  rights: MediaRights;
  rating: MediaRating;
  collections: string[];
  usage: {
    posts: number;
    downloads: number;
    last_used_at: string | null;
  };
}
```

### MediaType

```typescript
type MediaType = 'image' | 'video';
```

### MediaSource

```typescript
type MediaSource = 'grok' | 'sora' | 'camera' | 'other';
```

### MediaRights

```typescript
type MediaRights = 'owned' | 'licensed' | 'unknown';
```

### MediaRating

```typescript
type MediaRating = 'A' | 'B' | 'C';
```

### IngestOptions

```typescript
interface IngestOptions {
  file?: Buffer;
  url?: string;
  source: MediaSource;
  title?: string;
  tags?: string[];
  collections?: string[];
  prompt?: string;
  model?: string;
  rights?: MediaRights;
  rating?: MediaRating;
}
```

### SearchFilters

```typescript
interface SearchFilters {
  q?: string;
  tags?: string[];
  type?: MediaType;
  source?: MediaSource;
  collections?: string[];
  rating?: MediaRating;
  date_from?: string;
  date_to?: string;
}
```

---

## Media Processing

### Image Processing
- Thumbnail generation (320px)
- Web version generation (1080px)
- Metadata extraction (width, height)
- Format optimization

### Video Processing
- Placeholder for video processing
- Duration extraction
- Frame extraction (future)

### Deduplication
- SHA-256 hash computation
- Hash-based duplicate detection
- Automatic deduplication
- Storage optimization

---

## Tag & Entity Extraction

### Filename Tags
- Extract tags from filename
- Pattern-based extraction
- Common tag patterns

### Prompt Tags
- Extract tags from prompts
- AI-generated content tags
- Model-specific tags

### Entity Normalization
- Normalize entity names
- Entity extraction from text
- Entity linking

---

## Storage Structure

```
media/
├── original/     # Original files
├── thumb_320/    # 320px thumbnails
└── web_1080/     # 1080px web versions
```

### File Naming
- UUID-based file IDs
- Original extension preserved
- Thumbnails: `.jpg`
- Web versions: `.jpg` (or `.gif` for GIFs)

---

## Integration Points

### DreamNet Systems
- **Social Hub Core**: Media posts
- **Dream Vault**: Media assets
- **Identity Grid**: Media ownership

### External Systems
- **Cloud Storage**: Media storage
- **CDN**: Media delivery
- **Social Platforms**: Post publishing

---

## Usage Examples

### Ingest Image

```typescript
import { ingestFromFile } from '@dreamnet/media-vault';

const fileBuffer = await fs.readFile('photo.jpg');
const asset = await ingestFromFile(fileBuffer, 'photo.jpg', {
  source: 'camera',
  title: 'Sunset Photo',
  tags: ['sunset', 'nature', 'photography'],
  prompt: 'Beautiful sunset over mountains',
  rights: 'owned',
  rating: 'A',
  collections: ['photography'],
});

console.log(`Ingested: ${asset.id}`);
console.log(`Hash: ${asset.hash}`);
console.log(`Size: ${asset.size_bytes} bytes`);
```

### Search Media

```typescript
import { searchMedia } from '@dreamnet/media-vault';

const results = await searchMedia({
  q: 'sunset',
  type: 'image',
  tags: ['nature'],
  rating: 'A',
  date_from: '2025-01-01',
}, 20);

results.forEach(asset => {
  console.log(`${asset.title}: ${asset.file_path}`);
  console.log(`Tags: ${asset.tags.join(', ')}`);
});
```

### Get Public Media

```typescript
import { getPublicMedia } from '@dreamnet/media-vault';

const publicMedia = await getPublicMedia('photography', 50);
console.log(`Public media: ${publicMedia.length} items`);
```

---

## Best Practices

1. **Media Organization**
   - Use descriptive titles
   - Add relevant tags
   - Organize into collections
   - Set appropriate ratings

2. **Rights Management**
   - Set correct rights
   - Track licensing
   - Respect copyright
   - Document sources

3. **Metadata**
   - Include prompts when available
   - Document models used
   - Add captions
   - Track usage

4. **Storage**
   - Use appropriate storage location
   - Avoid iCloud-synced directories
   - Monitor storage usage
   - Clean up unused media

---

## Security Considerations

1. **File Validation**
   - Validate file types
   - Check file sizes
   - Scan for malware
   - Validate URLs

2. **Access Control**
   - Protect private media
   - Enforce rating restrictions
   - Audit access logs
   - Control collections

3. **Storage Security**
   - Secure storage location
   - Encrypt sensitive media
   - Backup media assets
   - Monitor storage

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27


# Media Vault + Indexer

The Media Vault is a comprehensive media management system integrated with DreamNet's Spore Engine and Operator Panel.

## Features

- **Ingestion**: Upload files or ingest from URLs with automatic deduplication (SHA256)
- **Auto-tagging**: Extracts tags from filenames and prompts
- **Entity Normalization**: Maps entities to controlled vocabulary (coin:gold-eagle, toy:labubu, etc.)
- **Derivatives**: Auto-generates thumbnails (320px) and web versions (1080px)
- **Spore Integration**: Creates Media Spores for every ingested asset
- **Post Queue**: Schedule posts to X, Base, or Instagram
- **Search**: Full-text search on title, caption, tags, and entities
- **Operator Panel**: Media tab with grid view, detail drawer, and queue management

## Architecture

### Package Structure

```
packages/media-vault/
  src/
    types.ts          # TypeScript interfaces
    db.ts             # Database operations (CRUD, search)
    ingest.ts         # File/URL ingestion, hash, metadata extraction
    vocab.ts          # Entity normalization, tag extraction, hashtag presets
    index.ts          # Public exports
```

### Database Schema

**media_assets**:
- `id`, `type`, `title`, `source`, `file_path`, `hash` (unique)
- `width`, `height`, `duration_ms`, `size_bytes`
- `tags[]`, `entities[]`, `credits{}`, `caption`, `rights`, `rating`
- `collections[]`, `usage{}` (posts, downloads, last_used_at)

**post_queue**:
- `id`, `media_id` (FK), `platform`, `status`
- `scheduled_at`, `caption`, `hashtags[]`
- `post_url`, `engagement{}` (likes, reposts, views)

## API Endpoints

### POST /api/media/ingest
Upload a file or ingest from URL.

**Request** (multipart/form-data):
- `file`: File buffer (optional if `url` provided)
- `url`: URL to download (optional if `file` provided)
- `source`: "grok" | "sora" | "camera" | "other"
- `title`: Optional title
- `tags[]`: Optional tags array
- `collections[]`: Optional collections array
- `prompt`: Optional prompt text
- `model`: Optional model name
- `rights`: "owned" | "licensed" | "unknown"
- `rating`: "A" | "B" | "C"

**Response**:
```json
{
  "ok": true,
  "asset": { ... }
}
```

**Rate Limit**: 10 requests per minute per IP

### GET /api/media/search
Search media assets.

**Query Parameters**:
- `q`: Full-text search query
- `tags`: Comma-separated tags
- `type`: "image" | "video"
- `source`: "grok" | "sora" | "camera" | "other"
- `collections`: Comma-separated collections
- `rating`: "A" | "B" | "C"
- `date_from`: ISO date string
- `date_to`: ISO date string
- `limit`: Number (default: 50)
- `offset`: Number (default: 0)

**Response**:
```json
{
  "ok": true,
  "results": [...],
  "count": 10
}
```

### GET /api/media/:id
Get a single media asset by ID.

### POST /api/posts/queue
Add a media asset to the post queue.

**Request**:
```json
{
  "media_id": "uuid",
  "platform": "x" | "base" | "ig",
  "caption": "Optional caption",
  "hashtags": ["#tag1", "#tag2"],
  "scheduled_at": "ISO date string (optional)"
}
```

### GET /api/posts/queue
Get post queue items.

**Query Parameters**:
- `status`: "draft" | "scheduled" | "posted" | "failed"
- `platform`: "x" | "base" | "ig"

### PUT /api/posts/queue/:id
Update a post queue item (status, post_url, engagement).

## Tagging & Hashtag Presets

### Tag Categories

**Goldbacks / Bullion**:
- Tags: `["goldbacks", "bullion", "coins", "silver", "gold", "krugerrand", "maple", "eagle"]`
- Hashtags: `#Gold #Silver #Bullion #Stackers #Coins #MapleLeaf #Krugerrand #GoldEagle #Au #Ag #DreamNet`

**Labubu**:
- Tags: `["labubu", "collectibles", "popmart", "toycartel", "instock"]`
- Hashtags: `#Labubu #PopMart #Collectibles #InStock #ToyCartel #DreamNet`

**Renders**:
- Tags: `["grok", "sora", "ai", "render", "network", "organism"]`
- Hashtags: `#Grok #Sora #AIArt #DreamNet #BaseCulture`

### Entity Normalization

Entities are normalized to controlled vocabulary:
- `coin:gold-eagle`, `coin:maple`, `coin:krugerrand`
- `token:btc`, `token:eth`, `token:base`
- `toy:labubu`, `toy:popmart`, `toy:cartel`
- `npc:tortoise`, `npc:predator`

## Operator Panel Integration

The Media tab in the Operator Panel provides:

1. **Media Grid**: 3-column grid showing thumbnails
2. **Search & Filters**: Full-text search, type filter, quick collection filters
3. **Detail Drawer**: Click any media to see:
   - Full-size preview
   - Title, caption, tags
   - "Add to Queue" buttons for X, Base, Instagram
4. **Post Queue Widget**: Shows upcoming posts by platform and status

## Spore Integration

When media is ingested, a Media Spore is automatically created with:
- Type: `media`
- Content: JSON with `mediaId`, `title`, `source`, `tags`, `collections`, `prompt`, `model`
- Metadata: `mediaId`, `tags`, `collections`, `source`

This allows HALO, Wormholes, and the Operator Panel to treat media like any other graftable asset.

## File Storage

Media files are stored in:
- `{MEDIA_ROOT}/original/` - Original files
- `{MEDIA_ROOT}/thumb_320/` - 320px thumbnails (JPEG)
- `{MEDIA_ROOT}/web_1080/` - 1080px web versions (JPEG)

Default `MEDIA_ROOT` is `./media` (configurable via `MEDIA_ROOT` env var).

## Usage Analytics

The `usage` field tracks:
- `posts`: Number of times the media has been posted
- `downloads`: Number of downloads
- `last_used_at`: ISO timestamp of last use

When a post is marked as "posted", the media's `usage.posts` is automatically incremented.

## Future Enhancements

- Video thumbnail generation (ffmpeg integration)
- AI-powered caption generation
- Batch upload
- Collection management UI
- Engagement analytics dashboard
- Auto-scheduling based on HALO insights


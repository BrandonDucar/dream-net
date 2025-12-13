# Contentful & Jamsocket Integration Setup

## 📝 Contentful Setup

Contentful is a headless CMS for managing content in DreamNet.

### Environment Variables

Add to your `.env` file:

```bash
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_ENVIRONMENT=master  # Optional, defaults to 'master'
CONTENTFUL_PREVIEW_TOKEN=your_preview_token  # Optional, for preview API
```

### Getting Your Credentials

1. **Sign up**: https://www.contentful.com/
2. **Create a space**: Go to your dashboard and create a new space
3. **Get Space ID**: Settings → General Settings → Space ID
4. **Create Access Token**: Settings → API → Content delivery / preview tokens → Create token

### Usage

```typescript
import { getContentfulClient } from '@dreamnet/contentful-core';

const contentful = getContentfulClient();

if (contentful) {
  // Get all entries
  const entries = await contentful.getEntries();
  
  // Get entries by content type
  const posts = await contentful.getEntries('blogPost');
  
  // Get specific entry
  const post = await contentful.getEntry('entry-id');
  
  // Get assets
  const assets = await contentful.getAssets();
}
```

### Netlify Setup

Add these environment variables to your Netlify site:
1. Go to: https://app.netlify.com/sites/dreamnet-hub/settings/env
2. Add:
   - `CONTENTFUL_SPACE_ID`
   - `CONTENTFUL_ACCESS_TOKEN`
   - `CONTENTFUL_ENVIRONMENT` (optional)
   - `CONTENTFUL_PREVIEW_TOKEN` (optional)

---

## 🎮 Jamsocket Setup

Jamsocket provides real-time session backends for collaborative features.

### Environment Variables

Add to your `.env` file:

```bash
JAMSOCKET_API_KEY=your_api_key
```

### Getting Your API Key

1. **Sign up**: https://jamsocket.com/
2. **Get API Key**: Dashboard → API Keys → Create new key

### Usage

```typescript
import { getJamsocketClient } from '@dreamnet/jamsocket-core';

const jamsocket = getJamsocketClient();

if (jamsocket) {
  // Create a room
  const room = await jamsocket.createRoom('my-backend', {
    env: { CUSTOM_VAR: 'value' },
  });
  
  // Get WebSocket URL
  const wsUrl = jamsocket.getWebSocketUrl(room.id);
  
  // List rooms
  const rooms = await jamsocket.listRooms();
  
  // Suspend/resume rooms
  await jamsocket.suspendRoom(room.id);
  await jamsocket.resumeRoom(room.id);
}
```

### Use Cases for DreamNet

- **Real-time agent collaboration**: Multiple agents working together
- **Collaborative dream editing**: Multiple users editing dreams simultaneously
- **Live agent status**: Real-time updates on agent activities
- **Multi-user sessions**: Shared dream exploration sessions

### Netlify Setup

Add `JAMSOCKET_API_KEY` to your Netlify environment variables:
1. Go to: https://app.netlify.com/sites/dreamnet-hub/settings/env
2. Add: `JAMSOCKET_API_KEY`

---

## 🧪 Testing

Run the integration test script:

```bash
pnpm tsx scripts/test-integrations.ts
```

This will:
- ✅ Verify Contentful connection
- ✅ Fetch sample entries
- ✅ Verify Jamsocket connection
- ✅ List backends and rooms

---

## 📦 Package Structure

```
packages/
├── contentful-core/
│   └── src/
│       └── index.ts  # Contentful client
└── jamsocket-core/
    └── src/
        └── index.ts  # Jamsocket client
```

Both packages are automatically initialized from environment variables and provide singleton instances via `getContentfulClient()` and `getJamsocketClient()`.


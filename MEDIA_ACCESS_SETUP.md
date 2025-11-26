# 📸 Media Access Setup - All Your Photos & Videos

## 🎯 What This Does

Scans and aggregates media from **ALL** your sources:
- ✅ **Dropbox** - All your photos/videos
- ✅ **OneDrive** - All your photos/videos  
- ✅ **iCloud Photos** - Via local export
- ✅ **Local directories** - Pictures, Downloads, etc.
- ✅ **Instagram** - Your posted media
- ✅ **Farcaster** - Your casts with media
- ✅ **Twilio MMS** - Media received via text

---

## 🚀 Quick Setup

### Step 1: Check What's Already Configured

```bash
tsx scripts/setup-media-sources.ts
```

This shows:
- ✅ What's already set up
- ❌ What's missing
- 📋 Setup instructions for each source

### Step 2: Add Missing Sources

**Easiest to start:**
1. **Local Media** - Just set `MEDIA_ROOT=~/Pictures`
2. **Dropbox** - Get access token (5 minutes)
3. **OneDrive** - Get access token (5 minutes)

### Step 3: Scan All Media

```bash
tsx scripts/scan-all-media.ts
```

This aggregates media from all configured sources!

---

## 📋 Setup Instructions

### 1. Dropbox (5 minutes)

1. Go to: https://www.dropbox.com/developers/apps
2. Create app → "Scoped access" → "Full Dropbox"
3. Generate access token
4. Add to `.env`:
   ```env
   DROPBOX_ACCESS_TOKEN=your_token_here
   DROPBOX_MEDIA_PATH=/Photos  # Optional: specific folder
   ```

### 2. OneDrive (5 minutes)

1. Go to: https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade
2. Register new application
3. Add API permissions: `Files.Read`, `Files.ReadWrite`
4. Generate OAuth2 token
5. Add to `.env`:
   ```env
   ONEDRIVE_ACCESS_TOKEN=your_token_here
   ONEDRIVE_MEDIA_PATH=/Pictures  # Optional
   ```

### 3. iCloud Photos (10 minutes)

**Option A - Export from Photos.app (Recommended):**
1. Open Photos.app on Mac
2. Select photos you want
3. File → Export → Export Photos
4. Choose location: `~/Pictures/DreamNet`
5. Add to `.env`:
   ```env
   ICLOUD_PHOTOS_EXPORT_PATH=~/Pictures/DreamNet
   ```

**Option B - Use iCloud Drive:**
1. Photos sync to iCloud Drive
2. Access via OneDrive integration (if synced)

### 4. Local Media (Instant)

Just set in `.env`:
```env
MEDIA_ROOT=~/Pictures
LOCAL_MEDIA_PATH=~/Downloads,~/Desktop
```

### 5. Twilio MMS (Already Set Up!)

You already have Twilio configured! ✅

Twilio can:
- Receive MMS with photos/videos
- Store media in Twilio's storage
- Fetch media via API

Just ensure these are in `.env`:
```env
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 6. Instagram (Use Existing Setup)

If you set up Instagram posting, you can also fetch your own media:
```env
INSTAGRAM_ACCESS_TOKEN=your_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_id
```

### 7. Farcaster (Use Existing Setup)

If you set up Farcaster, you can fetch your casts with media:
```env
FARCASTER_MNEMONIC=your_mnemonic
FARCASTER_FID=your_fid
```

---

## 🎯 How It Works

1. **MediaAggregator** scans all configured sources
2. **Deduplicates** by file hash
3. **Sorts** by date (newest first)
4. **Makes available** to Orca Pack for posting

---

## 💡 Usage in Code

```typescript
import { MediaAggregator } from "@dreamnet/social-media-poster";

const aggregator = new MediaAggregator();
aggregator.autoConfigure(); // Auto-configures from .env

const allMedia = await aggregator.aggregateMedia(50); // Get 50 most recent

// Use in posts
for (const media of allMedia) {
  if (media.type === "image") {
    // Post to Instagram, Twitter, etc.
  } else if (media.type === "video") {
    // Post to YouTube, TikTok, etc.
  }
}
```

---

## ✅ Next Steps

1. **Run setup script** to see what's configured
2. **Add missing sources** (start with local media)
3. **Scan all media** to see what's available
4. **Orca Pack** will automatically use this media for posts!

---

**You have tons of content - let's use it!** 🚀


# 📁 Media Storage Fix - iCloud Sync Issue

## Problem

Uploaded videos and media files were being saved to `./media` in your project directory, which is inside `OneDrive/Documents`. On Mac, this folder syncs to iCloud, causing all uploads to be synced to iCloud storage.

## Solution

Updated the media storage path to:
1. **Check if project is in a synced directory** (OneDrive/Documents)
2. **If yes**: Store media in a sibling directory outside the synced folder
3. **If no**: Use `./media` in project root as before

## Configuration

### Option 1: Environment Variable (Recommended)

Set `MEDIA_ROOT` environment variable to an absolute path outside iCloud:

```bash
# macOS - Use a directory outside Documents
export MEDIA_ROOT="/Users/yourusername/media/dreamnet"

# Windows - Use a directory outside OneDrive
export MEDIA_ROOT="C:\\Media\\dreamnet"
```

### Option 2: Default Behavior

If no `MEDIA_ROOT` is set:
- **If project is in OneDrive/Documents**: Media stored in `../dream-net-media` (sibling directory)
- **Otherwise**: Media stored in `./media` (project root)

## Where Files Are Stored

Media files are stored in:
```
MEDIA_ROOT/
  ├── original/     # Original uploaded files
  ├── thumb_320/    # 320px thumbnails
  └── web_1080/     # 1080px web versions
```

## Prevent iCloud Sync

To prevent iCloud from syncing the media directory:

### macOS
1. Open System Settings → Apple ID → iCloud → iCloud Drive → Options
2. Uncheck the folder containing your media, OR
3. Store media outside `~/Library/Mobile Documents/com~apple~CloudDocs/`

### Windows
1. OneDrive Settings → Account → Choose folders
2. Uncheck the folder containing your media, OR
3. Store media outside `C:\Users\YourName\OneDrive\`

## Quick Fix

Add to your `.env` file:
```env
MEDIA_ROOT=/path/to/media/storage
```

Or create a `.env.local` file in your project root with:
```env
MEDIA_ROOT=./media
```

This will keep media in the project directory (but still syncs if in OneDrive/Documents).

## Best Practice

Store media in a dedicated directory outside synced folders:
- `/Users/username/media/dreamnet` (macOS)
- `C:\Media\dreamnet` (Windows)
- `/var/media/dreamnet` (Linux/server)


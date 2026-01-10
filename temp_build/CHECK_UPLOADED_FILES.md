# 📁 Check Your Uploaded Files

## Quick Check

Visit this URL in your browser or use the API:
```
GET /api/media/list
```

This will show you:
- Where media files are stored
- How many files are in each directory
- File names, sizes, and modification dates

## The Issue

Your project is in:
```
C:\Users\brand\OneDrive\Documents\GitHub\dream-net
```

Since it's in `OneDrive/Documents`, any files saved to `./media` would sync to iCloud on Mac.

## The Fix

I've updated the code to:
1. **Detect if project is in OneDrive/Documents**
2. **Store media in a sibling directory** outside the synced folder:
   ```
   C:\Users\brand\dream-net-media\
   ```

## Check Your Files

### Option 1: API Endpoint
```bash
curl http://localhost:3000/api/media/list
```

### Option 2: Check File System
The media should be in:
- **If in OneDrive**: `C:\Users\brand\dream-net-media\`
- **If not in OneDrive**: `C:\Users\brand\OneDrive\Documents\GitHub\dream-net\media\`

### Option 3: Set Custom Location
Add to `.env`:
```env
MEDIA_ROOT=C:\Media\dreamnet
```

## What Happened to Your Uploads?

If you uploaded files before the fix:
1. They might be in `./media` in your project (syncing to iCloud)
2. They might have failed if the directory didn't exist
3. Check the database - the file paths are stored there

## Next Steps

1. **Check if files exist**: Use `/api/media/list` endpoint
2. **If files are in wrong location**: Move them to the new location
3. **Future uploads**: Will automatically go to the correct location


# Vercel Building Wrong Project - Root Directory Fix

## Problem Found

Vercel is building `apps/site` (old site) instead of `client/` (new mini-apps hub).

**Evidence:**
- Build log shows: `> @dreamnet/site@0.1.0 build`
- Output: `dist/index.html` (not `client/dist/index.html`)
- Build size: 539KB (old site) vs 3MB+ (new mini-apps hub)

## Root Cause

Vercel is detecting `apps/site` as the project because:
1. It's in the `apps/*` workspace
2. It has a `package.json` with a build script
3. Vercel auto-detects workspaces and builds the first one it finds

## Fix Applied

✅ **Deleted `apps/site/vercel.json`** - This prevents Vercel from treating it as a separate project.

## Additional Fix Needed

**You must set Root Directory in Vercel Dashboard:**

1. **Go to Vercel Dashboard**
2. **Project Settings** → **General**
3. **Root Directory**: Set to `client` (not `.` or empty)
4. **Save**

This forces Vercel to build from `client/` directory.

---

## Alternative: Rename apps/site

If Root Directory doesn't work, temporarily rename `apps/site`:

```bash
git mv apps/site apps/site-old
git commit -m "Rename apps/site to prevent Vercel detection"
git push
```

Then Vercel will only see `client/`.

---

## Verify Fix

After setting Root Directory to `client`:

1. **Redeploy** (or push a commit)
2. **Check build log** - Should show:
   ```
   > dreamops-launcher@0.0.0 build
   > vite build
   ```
   (Not `@dreamnet/site`)

3. **Check output** - Should be `client/dist/index.html`

4. **Check build size** - Should be 3MB+ (not 539KB)

---

## Current Status

- ✅ Deleted `apps/site/vercel.json`
- ⏳ **YOU NEED TO**: Set Root Directory = `client` in Vercel dashboard
- ⏳ Then redeploy

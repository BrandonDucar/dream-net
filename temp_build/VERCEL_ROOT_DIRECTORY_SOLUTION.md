# Vercel Root Directory Fix - Final Solution

## Problem

When Root Directory is set to `client`, Vercel says it doesn't exist.

**Why:** If Root Directory = `client`, Vercel changes its working directory to `client/`, but our `vercel.json` is at root and tries to `cd client`, which fails.

## Solution: Keep Root Directory at Root

**Set Root Directory to `.` (empty/dot) or leave it empty.**

Then `vercel.json` at root will work correctly:
- `buildCommand: "cd client && ..."` - works from root
- `outputDirectory: "client/dist"` - relative to root

---

## Steps

1. **Vercel Dashboard** → **Project Settings** → **General**
2. **Root Directory**: Set to `.` (dot) OR **leave empty**
3. **Save**

---

## Why This Works

- Root Directory = `.` means Vercel runs from repo root
- `vercel.json` at root can `cd client` successfully
- Output directory `client/dist` is relative to root
- Build command runs from root, changes to `client/`, builds, outputs to `client/dist`

---

## Alternative: Move vercel.json to client/

If you want Root Directory = `client`, you'd need to:

1. Move `vercel.json` to `client/vercel.json`
2. Update paths:
   ```json
   {
     "buildCommand": "pnpm install --frozen-lockfile --no-optional && pnpm build",
     "outputDirectory": "dist"
   }
   ```
   (Remove `cd client` since you're already in client/)

But **keeping root Directory = `.` is simpler** for monorepo.

---

## Current Config (Correct)

```json
{
  "buildCommand": "cd client && rm -rf dist node_modules/.vite && pnpm install --frozen-lockfile --no-optional && pnpm build",
  "outputDirectory": "client/dist"
}
```

This works when Root Directory = `.` (root).

---

## Action Required

**Set Root Directory back to `.` (or empty) in Vercel dashboard.**


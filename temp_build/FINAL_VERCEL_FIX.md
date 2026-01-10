# FINAL VERCEL FIX - The Real Problem

## What's Happening

Vercel is building `@dreamnet/site@0.1.0` from `apps/site-old/` instead of `dreamops-launcher` from `client/`.

**Error shows:**
```
> @dreamnet/site@0.1.0 build /vercel/path0
```

This means Vercel is:
1. NOT respecting `rootDirectory: "client"`
2. Finding `apps/site-old/package.json` first
3. Building the wrong project

---

## Root Cause

**Vercel is auto-detecting the project** and finding `apps/site-old` before `client/`.

When Vercel scans the repo, it finds multiple `package.json` files:
- `apps/site-old/package.json` → `@dreamnet/site`
- `client/package.json` → `dreamops-launcher`

Vercel picks the first one it finds or the one that matches some pattern.

---

## Solutions (In Order of Preference)

### Solution 1: Delete/Rename Old Site (BEST)

**In Vercel Dashboard:**
1. Go to Projects
2. Find "site" project
3. Delete it completely

**In Code:**
```bash
# Rename so Vercel can't find it
mv apps/site-old apps/_site-old-DISABLED
```

Then commit and push.

---

### Solution 2: Explicit Build Command (Just Updated)

Updated `vercel.json` to:
- **Build Command:** `cd client && pnpm install && pnpm run build`
- **Install Command:** `pnpm install --filter client... --no-frozen-lockfile --ignore-scripts`
- **Output Directory:** `client/dist`
- **NO rootDirectory** (let commands handle it)

**In Vercel Dashboard:**
- **Root Directory:** Leave BLANK (empty)
- **Build Command:** `cd client && pnpm install && pnpm run build`
- **Output Directory:** `client/dist`
- **Install Command:** `pnpm install --filter client... --no-frozen-lockfile --ignore-scripts`

---

### Solution 3: Use Vercel CLI from Client Directory

**Bypass dashboard entirely:**

```bash
# Install Vercel CLI
npm i -g vercel

# Go to client directory
cd client

# Link project (creates .vercel folder)
vercel link

# Deploy
vercel --prod
```

This creates a `.vercel` folder in `client/` that tells Vercel this IS the project root.

---

### Solution 4: Separate Repository (Last Resort)

Create a new repo with ONLY `client/` directory:
1. Create `dream-net-frontend` repo
2. Copy only `client/` directory
3. Deploy from new repo
4. No monorepo complexity

---

## Recommended Action Plan

1. **First:** Rename `apps/site-old` → `apps/_site-old-DISABLED`
2. **Second:** Update Vercel dashboard to match new `vercel.json` (no rootDirectory, explicit paths)
3. **Third:** If still fails, try Solution 3 (Vercel CLI from client/)
4. **Last Resort:** Solution 4 (separate repo)

---

## What I Just Changed

- Removed `rootDirectory` from `vercel.json`
- Made build command explicit: `cd client && pnpm install && pnpm run build`
- Updated install command to run from root
- Output directory: `client/dist`

**Now update Vercel dashboard to match!**


# Vercel Nuclear Option - Complete Reset

## The Problem

Vercel keeps building the wrong project (`@dreamnet/site` instead of `dreamops-launcher`) and can't find the `client/` directory.

**Root Cause:** Vercel project settings are cached/confused, or there's a `.vercel` folder overriding everything.

---

## Nuclear Option: Complete Reset

### Step 1: Delete Vercel Project
1. Go to https://vercel.com/dashboard
2. Find your project (the one connected to dreamnet.ink)
3. Settings → Delete Project
4. Confirm deletion

### Step 2: Create Fresh Project
1. Vercel Dashboard → New Project
2. Import: `BrandonDucar/dream-net`
3. **During setup, configure EXACTLY:**
   - **Framework Preset:** Other
   - **Root Directory:** `client`
   - **Build Command:** `pnpm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `cd .. && pnpm --filter client... install --no-frozen-lockfile --ignore-scripts`
4. Deploy

### Step 3: Add Domain
1. Settings → Domains
2. Add: `dreamnet.ink`
3. Configure DNS if needed

---

## Alternative: Use Vercel CLI (Bypass Dashboard)

This completely bypasses dashboard settings:

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Go to client directory
cd client

# 4. Link project (creates .vercel folder in client/)
vercel link
# - Select existing project OR create new
# - This creates .vercel/project.json that tells Vercel this IS the root

# 5. Deploy
vercel --prod
```

This creates a `.vercel/` folder in `client/` that makes Vercel treat `client/` as the project root, ignoring all monorepo complexity.

---

## Why This Works

**Vercel CLI approach:**
- Creates `.vercel/project.json` in `client/`
- Tells Vercel: "This directory IS the project"
- No `rootDirectory` needed
- No workspace filtering needed
- Just builds `client/` as if it's a standalone project

**Fresh project approach:**
- Clears all cached/confused settings
- Starts with clean slate
- Uses `vercel.json` correctly from the start

---

## Recommended: Try CLI First

It's faster and doesn't require deleting anything. If CLI works, we're done. If not, then do the nuclear reset.


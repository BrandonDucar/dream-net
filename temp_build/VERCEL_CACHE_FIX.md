# Vercel Serving Old Site - Cache Fix

## Problem

Build succeeds but Vercel is serving the old website.

## Possible Causes

1. **Vercel Cache** - Serving cached old build
2. **Wrong Project** - Multiple Vercel projects, wrong one deployed
3. **Output Directory** - Wrong output directory configured
4. **Build Output** - Build creating files but Vercel not finding them

## Fixes

### Fix 1: Clear Vercel Cache

**In Vercel Dashboard:**
1. Go to **Deployments**
2. Find latest deployment
3. Click **"..."** menu → **"Redeploy"**
4. Check **"Use existing Build Cache"** → **UNCHECK IT**
5. Redeploy

This forces a fresh build without cache.

---

### Fix 2: Verify Output Directory

**Check Vercel Dashboard:**
- Settings → Build & Development Settings
- **Output Directory**: Should be `client/dist`

**Verify build creates files:**
- Build should create `client/dist/index.html`
- Build should create `client/dist/assets/*.js`

---

### Fix 3: Check Multiple Projects

**You might have multiple Vercel projects:**

1. Go to Vercel Dashboard
2. Check **ALL projects**
3. Find which one has `dreamnet.ink` domain
4. Make sure you're deploying to the RIGHT project

**Common issue**: Old project still connected to domain!

---

### Fix 4: Force Fresh Build

**Add to vercel.json:**

```json
{
  "buildCommand": "cd client && rm -rf dist && pnpm install --frozen-lockfile --no-optional && pnpm build"
}
```

This clears dist before building.

---

### Fix 5: Check Domain Assignment

**Verify domain is on correct project:**

1. Dashboard → Project → Settings → Domains
2. Check `dreamnet.ink` is assigned to THIS project
3. If assigned to different project, remove it and add to correct one

---

## Quick Diagnostic

**Check what's actually deployed:**

1. Go to deployment URL (not custom domain)
2. Example: `https://dream-net-xxx.vercel.app`
3. Does THIS show old site or new site?

**If deployment URL shows new site but domain shows old:**
- Domain DNS issue
- Domain pointing to wrong project
- DNS cache

**If deployment URL also shows old site:**
- Build issue
- Wrong output directory
- Cache issue

---

## Nuclear Option: Fresh Deploy

1. **Delete old deployments** (optional)
2. **Disconnect and reconnect** GitHub repo
3. **Clear all build settings** in dashboard
4. **Let vercel.json handle everything**
5. **Redeploy**

---

## What to Check Now

1. ✅ Which Vercel project has `dreamnet.ink` domain?
2. ✅ What does deployment URL show (not custom domain)?
3. ✅ Is Output Directory = `client/dist`?
4. ✅ Did you clear cache on redeploy?

**Most likely**: Domain pointing to wrong project or cache issue!


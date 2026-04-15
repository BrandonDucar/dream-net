# Clear Cache - Old Site Still Showing

## Problem

Build is working correctly (3MB+ bundle), but old site (539KB) is still being served.

## Likely Causes

1. **Browser Cache** - Your browser cached the old site
2. **Vercel CDN Cache** - Vercel's edge cache serving old content
3. **DNS Cache** - DNS pointing to old deployment

## Fixes (Try in Order)

### Fix 1: Hard Refresh Browser

**Windows/Linux:**
- `Ctrl + Shift + R` or `Ctrl + F5`

**Mac:**
- `Cmd + Shift + R`

**Or:**
- Open DevTools (F12)
- Right-click refresh button → "Empty Cache and Hard Reload"

---

### Fix 2: Clear Vercel CDN Cache

**In Vercel Dashboard:**

1. Go to **Deployments**
2. Find **latest deployment** (the one that just built)
3. Click **"..."** menu → **"Promote to Production"**
   - This forces CDN to serve the new deployment

**OR:**

1. **Settings** → **Domains**
2. Click on `dreamnet.ink`
3. **"..."** → **"Clear Cache"** (if available)

---

### Fix 3: Check Deployment URL

**Test the deployment URL directly** (not custom domain):

1. Go to **Deployments** tab
2. Click on **latest deployment**
3. Copy the **deployment URL** (e.g., `https://dream-net-xxx.vercel.app`)
4. Open in **incognito/private window**

**Does deployment URL show new site?**
- ✅ **Yes** → Domain/DNS cache issue
- ❌ **No** → Build issue

---

### Fix 4: Force New Deployment

**Create a dummy commit to trigger fresh deploy:**

```bash
git commit --allow-empty -m "Force fresh deployment"
git push
```

This forces Vercel to rebuild and redeploy fresh.

---

### Fix 5: Check Domain Assignment

**Verify domain is on correct project:**

1. **Settings** → **Domains**
2. Check `dreamnet.ink` is assigned to **THIS project**
3. If assigned to different project → **Remove** and **Re-add**

---

## Quick Test

**Open in incognito window:**
- `https://dreamnet.ink`

If incognito shows new site → **Browser cache issue**
If incognito shows old site → **Vercel/CDN cache issue**

---

## Most Likely Fix

**Try Fix 2 first** (Promote to Production in Vercel dashboard).

This forces Vercel's CDN to serve the new deployment immediately.


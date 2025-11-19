# Clear Vercel Cache - Old Site Fix

## The Problem

Build succeeds but Vercel serves old website content.

## Most Likely: Cache or Wrong Project

### Quick Fix: Clear Cache on Redeploy

1. **Go to Vercel Dashboard**
2. **Deployments** tab
3. **Latest deployment** → Click **"..."** menu
4. **Redeploy**
5. **IMPORTANT**: **UNCHECK** "Use existing Build Cache"
6. **Redeploy**

This forces fresh build + fresh serve.

---

### Check: Which Project Has Your Domain?

**Critical Check:**

1. **Vercel Dashboard** → **All Projects**
2. **Find project with `dreamnet.ink` domain**
3. **Is it the RIGHT project?**

**Common Issue**: Old project still has domain assigned!

**Fix:**
- Remove domain from old project
- Add domain to new/correct project

---

### Check: Deployment URL vs Custom Domain

**Test this:**

1. **Deployment URL**: `https://dream-net-xxx.vercel.app` (from deployments tab)
   - Does THIS show new site or old site?

2. **Custom Domain**: `https://dreamnet.ink`
   - Does THIS show old site?

**If deployment URL = new, but domain = old:**
- Domain pointing to wrong project
- DNS cache
- CDN cache

**If both show old:**
- Build cache issue
- Wrong output directory

---

### Nuclear Option: Fresh Start

1. **Disconnect GitHub** from Vercel project
2. **Delete project** (or create new)
3. **Reconnect GitHub** repo
4. **Set domain** to new project
5. **Deploy fresh**

---

## What I Changed

Updated `vercel.json` to clear cache before build:

```json
{
  "buildCommand": "cd client && rm -rf dist node_modules/.vite && pnpm install --frozen-lockfile --no-optional && pnpm build"
}
```

This ensures fresh build every time.

---

## Next Steps

1. ✅ **Redeploy with cache disabled**
2. ✅ **Check which project has domain**
3. ✅ **Test deployment URL** (not custom domain)
4. ✅ **If still old**: Disconnect/reconnect project

**Most likely**: Domain assigned to wrong Vercel project!


# Vercel Dashboard Fix - Step by Step

## Goal
Fix Vercel to build the NEW DreamNet Hub (client/) instead of the old site (apps/site-old)

---

## Step 1: Open Vercel Dashboard
1. Go to: **https://vercel.com/dashboard**
2. Log in if needed
3. Find your project (should be named something like "dream-net" or "dreamnet")

---

## Step 2: Go to Project Settings
1. Click on your project name
2. Click **"Settings"** tab (top navigation)
3. You should see: General, Domains, Environment Variables, etc.

---

## Step 3: Fix General Settings
1. Click **"General"** in the left sidebar
2. Scroll down to **"Root Directory"**
3. **Set it to:** `client`
   - If it's blank or says something else, click "Edit" and type: `client`
4. Click **"Save"**

---

## Step 4: Fix Build & Development Settings
1. Still in Settings, click **"Build & Development Settings"** in left sidebar
2. You'll see several fields. Update these:

   **Framework Preset:**
   - Set to: **"Other"** (or leave blank)

   **Build Command:**
   - **Change to:** `pnpm run build`
   - (Currently might say `npm run build` or `vite build`)

   **Output Directory:**
   - **Set to:** `dist`
   - (Should already be this, but verify)

   **Install Command:**
   - **Set to:** `cd .. && pnpm --filter client... install --no-frozen-lockfile --ignore-scripts`
   - (This is important - it tells Vercel to only install client workspace)

3. Click **"Save"** at the bottom

---

## Step 5: Cancel Stuck Build (If Spinner Still Spinning)
1. Go to **"Deployments"** tab (top navigation)
2. Find the deployment with the spinning wheel
3. Click the **"..."** (three dots) menu on that deployment
4. Click **"Cancel"**
5. Confirm cancellation

---

## Step 6: Trigger New Deployment
You have two options:

**Option A: Redeploy Latest**
1. In Deployments tab
2. Find the most recent deployment (should be the one we just cancelled or a failed one)
3. Click **"..."** menu
4. Click **"Redeploy"**
5. Select **"Use existing Build Cache"** = OFF (to force fresh build)
6. Click **"Redeploy"**

**Option B: Push New Commit** (I can do this for you)
- I'll push an empty commit or small change to trigger auto-deploy

---

## Step 7: Verify Build Logs
1. After deployment starts, click on it to see logs
2. **Look for these in the logs:**
   - ✅ Should see: `> dreamops-launcher@0.0.0 build`
   - ✅ Should see: `pnpm` commands (not `npm`)
   - ✅ Should see: `vite build` running
   - ❌ Should NOT see: `@dreamnet/site@0.1.0`

---

## Step 8: Promote to Production (If Needed)
1. Once build completes successfully
2. Click on the deployment
3. Click **"..."** menu
4. Click **"Promote to Production"**
5. This makes it live at dreamnet.ink

---

## What Success Looks Like

✅ Build logs show:
```
> dreamops-launcher@0.0.0 build
> vite build
```

✅ Build completes in ~2-5 minutes

✅ Deployment shows "Ready" status

✅ dreamnet.ink shows the NEW Hub (with /hub routes, mini-apps catalog, etc.)

---

## If Something Goes Wrong

**Build still fails?**
- Check the build logs for specific errors
- Make sure Root Directory is exactly `client` (not `client/` or `/client`)
- Make sure Build Command is exactly `pnpm run build`

**Still building old site?**
- Double-check Root Directory is `client`
- Make sure you saved all settings
- Try cancelling and redeploying again

**Can't find settings?**
- Make sure you're in the correct project
- Look for "Settings" tab in top navigation
- If you see "Project Settings" that's the right place

---

## Quick Checklist

- [ ] Root Directory = `client`
- [ ] Build Command = `pnpm run build`
- [ ] Install Command = `cd .. && pnpm --filter client... install --no-frozen-lockfile --ignore-scripts`
- [ ] Output Directory = `dist`
- [ ] Cancelled stuck build
- [ ] Triggered new deployment
- [ ] Verified build logs show `dreamops-launcher`
- [ ] Promoted to production

---

**Tell me when you've completed these steps and I'll verify everything is working!**


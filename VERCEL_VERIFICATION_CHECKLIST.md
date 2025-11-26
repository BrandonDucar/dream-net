# Vercel Deployment Verification Checklist

## 🔍 Step-by-Step Verification Guide

### 1. Login to Vercel
- Go to: https://vercel.com/dashboard
- Login with your GitHub account

### 2. Navigate to Project
- Find project: **dream-net** (or check your project name)
- Click on the project

### 3. Check Domain Configuration ✅

**Go to: Settings → Domains**

Verify:
- [ ] `dreamnet.ink` is listed
- [ ] Status shows "Valid Configuration" or "Active"
- [ ] DNS records are configured correctly
- [ ] SSL certificate is active (should auto-provision)

**If domain is missing:**
1. Click "Add Domain"
2. Enter: `dreamnet.ink`
3. Follow DNS configuration instructions

---

### 4. Check Build Settings ✅

**Go to: Settings → General**

Verify:
- [ ] **Root Directory**: Should be empty (`.`) OR `client`
- [ ] **Framework Preset**: Should be `Other` or blank (not Next.js)

**Go to: Settings → Build & Development Settings**

Verify:
- [ ] **Build Command**: Should be empty (to use vercel.json) OR match:
  ```
  corepack enable && corepack prepare pnpm@10.21.0 --activate && cd client && pnpm install --include=optional && pnpm build
  ```
- [ ] **Output Directory**: Should be `client/dist`
- [ ] **Install Command**: Should be empty (to use vercel.json) OR match:
  ```
  corepack enable && corepack prepare pnpm@10.21.0 --activate && cd client && pnpm install --include=optional
  ```
- [ ] **Node.js Version**: Should be `24.x` (check if available, otherwise `22.x`)

**⚠️ IMPORTANT**: If dashboard settings differ from vercel.json, dashboard settings take precedence!

---

### 5. Check Environment Variables ✅

**Go to: Settings → Environment Variables**

Verify:
- [ ] `VITE_API_URL` = `https://api.dreamnet.ink`
- [ ] Any other required env vars are set

---

### 6. Check Latest Deployment ✅

**Go to: Deployments tab**

Check the latest deployment:
- [ ] Status: Should be "Ready" (green) or "Building"
- [ ] If failed, check build logs for errors
- [ ] Verify it's using pnpm (not npm)
- [ ] Verify Node version is 24.x (or 22.x)

**If deployment failed:**
1. Click on the failed deployment
2. Check "Build Logs" tab
3. Look for errors (especially rollup native module errors)
4. Check if pnpm was used

---

### 7. Trigger New Deployment ✅

**Option A: Automatic**
- Push a new commit to `main` branch
- Vercel will auto-deploy

**Option B: Manual**
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. **UNCHECK** "Use existing Build Cache"
5. Click "Redeploy"

---

### 8. Verify Build Process ✅

During build, check logs for:
- [ ] `corepack enable` runs
- [ ] `pnpm@10.21.0` is prepared
- [ ] `pnpm install --include=optional` runs
- [ ] Optional dependencies install (including `@rollup/rollup-linux-x64-gnu`)
- [ ] `pnpm build` runs successfully
- [ ] No "MODULE_NOT_FOUND" errors for rollup

---

### 9. Verify Deployment ✅

After successful build:
- [ ] Visit: https://dreamnet.ink
- [ ] Page loads correctly
- [ ] No console errors
- [ ] API calls work (if Railway backend is up)

---

## 🔧 Common Issues & Fixes

### Issue: Build using npm instead of pnpm
**Fix**: 
1. Clear dashboard Build Command (let vercel.json handle it)
2. Or explicitly set Build Command to use pnpm
3. Ensure `package-lock.json` is in `.vercelignore`

### Issue: Rollup native module not found
**Fix**:
1. Ensure `--include=optional` flag is used
2. Verify pnpm is being used (not npm)
3. Check that `@rollup/rollup-linux-x64-gnu` is in devDependencies

### Issue: Domain not assigned
**Fix**:
1. Go to Settings → Domains
2. Add `dreamnet.ink`
3. Configure DNS as instructed
4. Wait for SSL certificate (usually 1-2 minutes)

### Issue: Wrong Node version
**Fix**:
1. Check Settings → Build & Development Settings
2. Set Node.js Version to `24.x` (or highest available)
3. Or use GitHub Action to update via API

---

## ✅ Success Criteria

- [x] Domain `dreamnet.ink` is assigned and active
- [x] Build uses pnpm (not npm)
- [x] Build completes successfully
- [x] Rollup native module installs correctly
- [x] Site loads at https://dreamnet.ink
- [x] No build errors in logs

---

**After verification, share any issues found and I'll help fix them!**


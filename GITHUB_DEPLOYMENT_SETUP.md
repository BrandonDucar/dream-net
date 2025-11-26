# GitHub Deployment Setup Guide

## ✅ Ready for GitHub Integration

All configuration files are in place and ready for deployment via GitHub integration.

---

## Vercel Deployment via GitHub

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "Add deployment configs and integrations"
git push origin main
```

### Step 2: Connect to Vercel via GitHub
1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select `BrandonDucar/dream-net` repository
4. Vercel will auto-detect:
   - Framework: Other (from `vercel.json`)
   - Root Directory: `.` (root)
   - Build Command: `cd client && pnpm install && pnpm build`
   - Output Directory: `client/dist`
   - Install Command: `cd client && pnpm install`

### Step 3: Configure Environment Variables
In Vercel project settings, add:
```
VITE_API_URL=https://api.dreamnet.ink
```

### Step 4: Deploy
- Vercel will automatically deploy on every push to `main`
- Or click "Deploy" to deploy immediately

---

## Railway Deployment via GitHub

### Step 1: Connect to Railway
1. Go to: https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select `dream-net` repository

### Step 2: Railway Auto-Detection
Railway will automatically detect:
- `railway.json` - Build configuration
- `Procfile` - Start command: `web: node server/dist/index.js`
- Node.js version from `package.json`

### Step 3: Configure Environment Variables
In Railway project settings, add:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=your_neon_database_url
BASE_MAINNET_RPC_URL=https://mainnet.base.org
```

### Step 4: Deploy
- Railway will automatically build and deploy
- Check deployment logs in Railway dashboard

---

## Verification

### After Vercel Deployment:
- Visit: https://dreamnet.ink
- Should see: Landing page
- Check: Browser console for errors

### After Railway Deployment:
- Visit: https://api.dreamnet.ink/api/health
- Should see: `{"status":"ok"}`
- Check: API endpoints respond

---

## Auto-Deploy on Push

Both Vercel and Railway will automatically deploy when you push to `main` branch.

**To trigger deployment:**
```bash
git push origin main
```

---

## Current Status

✅ All configuration files ready
✅ Code ready for deployment
✅ GitHub integration ready
⏳ Waiting for GitHub push and platform connection


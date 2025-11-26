# Deployment Execution Guide

## Current Status

### Vercel Deployment
- ✅ Configuration files created and correct
- ⚠️ **Blocked**: Git author email permissions issue
- **Action Required**: Add `brandonducar123@gmail.com` to Vercel team or use different git author

### Railway Deployment
- ✅ Configuration files created (`railway.json`, `Procfile`)
- ✅ Ready to deploy

---

## Vercel Deployment Fix

### Issue
```
Error: Git author brandonducar123@gmail.com must have access to the team brandon's projects on Vercel to create deployments.
```

### Solutions

**Option 1: Add Email to Vercel Team (Recommended)**
1. Go to: https://vercel.com/teams/brandons-projects-91c5553e/settings/members
2. Add `brandonducar123@gmail.com` as a team member
3. Retry deployment: `vercel --prod --yes`

**Option 2: Use Different Git Author**
```bash
git config user.email "your-vercel-email@example.com"
git commit --amend --author="Your Name <your-vercel-email@example.com>"
vercel --prod --yes
```

**Option 3: Deploy via GitHub Integration**
1. Go to Vercel dashboard
2. Import project from GitHub
3. Vercel will auto-deploy on push

### Vercel Configuration (Already Done ✅)
- `vercel.json` - Complete build configuration
- `.vercelignore` - Excludes server dependencies
- `client/.npmrc` - Skips optional dependencies
- `client/package.json` - Node.js version constraint added

### After Fixing Permissions:
```bash
vercel --prod --yes
```

---

## Railway Deployment

### Prerequisites
- Railway account connected to GitHub
- Railway CLI installed (optional, can use dashboard)

### Deployment Steps

**Option 1: Via Railway Dashboard (Easiest)**
1. Go to: https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select `dream-net` repository
5. Railway will auto-detect `railway.json` and `Procfile`
6. Set environment variables (see below)
7. Deploy!

**Option 2: Via Railway CLI**
```bash
# Install Railway CLI (if not installed)
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

### Railway Configuration (Already Done ✅)
- `railway.json` - Build and start commands configured
- `Procfile` - Start command: `web: node server/dist/index.js`

### Environment Variables for Railway

**Required:**
```bash
NODE_ENV=production
PORT=3000
```

**Optional (but recommended):**
```bash
# Database
DATABASE_URL=your_neon_database_url

# API Keys
VERCEL_TOKEN=your_vercel_token
NAMEcheap_API_USER=your_namecheap_user
NAMEcheap_API_KEY=your_namecheap_key

# Blockchain
BASE_MAINNET_RPC_URL=https://mainnet.base.org
PRIVATE_KEY=your_deployer_private_key

# Features
INIT_SUBSYSTEMS=true
MESH_AUTOSTART=true
```

---

## Deployment Verification

### After Vercel Deployment:
1. Visit: https://dreamnet.ink
2. Should see: Landing page with mini-apps
3. Check: Browser console for errors
4. Test: Mini-apps load correctly

### After Railway Deployment:
1. Visit: https://api.dreamnet.ink/api/health
2. Should see: `{"status":"ok"}`
3. Check: API endpoints respond
4. Test: Full integration works

---

## Troubleshooting

### Vercel Build Fails
- Check: Node.js version (should be 22.x)
- Check: Build logs in Vercel dashboard
- Fix: Update `client/package.json` engines field

### Railway Build Fails
- Check: `railway.json` syntax
- Check: `Procfile` exists and is correct
- Check: Server builds locally first: `cd server && pnpm build`

### API Not Connecting
- Check: `VITE_API_URL` environment variable in Vercel
- Check: Railway service is running
- Check: CORS configuration in server

---

## Next Steps After Deployment

1. ✅ Verify both deployments work
2. ✅ Test API connectivity
3. ✅ Test mini-apps
4. ✅ Test wallet connections
5. ✅ Monitor for errors
6. ✅ Set up monitoring/alerts

---

## Quick Commands

```bash
# Vercel
vercel --prod --yes

# Railway (if CLI installed)
railway up

# Check deployments
vercel ls
railway status
```

---

**Status**: Configuration complete, waiting for Vercel permissions fix


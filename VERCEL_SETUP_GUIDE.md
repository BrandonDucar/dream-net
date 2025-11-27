# Vercel Project Setup Guide - Fresh Start

## Step 1: Import Repository

1. Go to: https://vercel.com/new
2. Select **BrandonDucar** from the GitHub namespace dropdown
3. Search for: `dream-net`
4. Click **Import** on `dream-net` repository

## Step 2: Configure Project Settings

After importing, you'll be on the project configuration page. Set these EXACT values:

### Project Name
- **Name**: `dreamnet` (or `client` - your choice)

### Framework Preset
- **Framework**: `Other` or leave blank (we're using custom build)

### Root Directory
- **Root Directory**: `client`
- ✅ **Enable**: "Include files outside the root directory in the Build Step"

### Build and Output Settings
- **Build Command**: `pnpm install && pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate`

### Node.js Version
- **Node.js Version**: `24.x`

### Environment Variables
Add these environment variables:
- **Key**: `VITE_API_URL`
- **Value**: `https://api.dreamnet.ink`

## Step 3: Domain Configuration

1. Go to **Settings** → **Domains**
2. Add domain: `dreamnet.ink`
3. Follow DNS configuration instructions

## Step 4: Deploy

Click **Deploy** and monitor the build logs.

## Expected Build Process

1. ✅ Install dependencies (`pnpm install`)
2. ✅ Build application (`pnpm build`)
3. ✅ Output to `client/dist/`
4. ✅ Deploy to `dreamnet.ink`

## Troubleshooting

If build fails:
- Check that `rootDirectory` is set to `client`
- Verify `pnpm-lock.yaml` exists at repo root
- Ensure Node.js version is 24.x
- Check build logs for specific errors


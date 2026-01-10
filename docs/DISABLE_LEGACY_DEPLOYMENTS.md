# Disabling Legacy Auto-Deployments

DreamNet now uses **Google Cloud Platform** as the primary deployment target. Legacy providers (Vercel, Railway) are causing failure notices because they're trying to auto-deploy.

## Quick Fix

### Vercel
1. Go to Vercel Dashboard → Project Settings
2. Disable "Auto Deploy" or delete the project
3. Or: Keep project but disable webhook in GitHub repo settings

### Railway
1. Go to Railway Dashboard → Project Settings
2. Disable "Auto Deploy" or delete the project
3. Or: Remove Railway webhook from GitHub

### GitHub Actions (if any)
1. Check `.github/workflows/` directory
2. Delete or disable any deployment workflows
3. Or: Add `[skip ci]` to commit messages to skip

## Files Created
- `.vercelignore` - Prevents Vercel from deploying
- `.railwayignore` - Prevents Railway from deploying

## Current Deployment Path
✅ **Google Cloud Run**: `pnpm deploy:gcp`
✅ **GKE Autopilot**: `pnpm deploy:gke`

Legacy deployments are no longer needed.


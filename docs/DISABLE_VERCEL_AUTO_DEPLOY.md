# Disabling Vercel Auto-Deployments

## Problem

GitHub Actions workflows were automatically deploying to Vercel on every push to `main`, causing failed runs since we're now using Google Cloud as the primary deployment target.

## Solution

### 1. GitHub Actions Workflow Disabled

The `.github/workflows/webpack.yml` workflow has been disabled:
- Removed automatic trigger on `push` to `main`
- Added `if: false` to prevent job execution
- Commented out Vercel deployment step

### 2. Disable Vercel Project Auto-Deploy (Recommended)

If you have a Vercel project connected to this GitHub repo, disable auto-deployments:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Git**
4. **Disconnect** the GitHub repository OR
5. **Disable** "Automatic deployments from Git"

### 3. Remove Vercel GitHub Secrets (Optional)

If you want to completely remove Vercel integration:

1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Delete these secrets (if they exist):
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

## Current Deployment Method

**Primary:** Google Cloud Run
```bash
pnpm deploy:gcp
```

**Legacy (manual only):** Vercel
```bash
pnpm deploy:vercel-legacy
```

## Verification

After disabling:
1. Push a commit to `main`
2. Check GitHub Actions - `webpack.yml` should not run automatically
3. Check Vercel Dashboard - no new deployments should trigger

## Re-enabling (If Needed)

If you need to re-enable Vercel deployments:

1. Uncomment the deployment step in `.github/workflows/webpack.yml`
2. Re-enable `push` trigger
3. Remove `if: false` condition
4. Ensure Vercel secrets are configured in GitHub


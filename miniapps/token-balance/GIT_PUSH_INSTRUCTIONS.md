# How to Push Token Balance Mini App to GitHub

## Problem
The files exist locally in `miniapps/token-balance/` but haven't been committed and pushed to GitHub yet. Vercel is showing a 404 error because it can't find the directory in your GitHub repository.

## Solution: Push Files to GitHub

Run these commands in your terminal from the project root (`C:\dev\dream-net`):

```bash
# 1. Add all files in the miniapps/token-balance directory
git add miniapps/token-balance

# 2. Commit the files
git commit -m "Add Token Balance Mini App for Vercel deployment"

# 3. Push to GitHub
git push origin main
```

## After Pushing

Once the files are pushed:
1. Vercel will automatically detect the new files
2. It will trigger a new deployment
3. The deployment should succeed and you'll get a live URL

## Verify Files Are in GitHub

After pushing, check:
- https://github.com/BrandonDucar/dream-net/tree/main/miniapps/token-balance

You should see all the files there.

## Check Vercel Deployment

After pushing, check:
- https://vercel.com/brandons-projects-91c5553e/dreamnet-token-balance/deployments

You should see a new deployment starting automatically.


# Vercel Node Version Update - Complete Setup

## ✅ What's Been Done

1. **Created API Script**: `scripts/update-vercel-node-simple.mjs`
   - Updates Vercel project Node.js version to 22.x via API
   - Project ID: `prj_LADFPSWMoSgaHBxsaANzl3iQipBK`

2. **Created GitHub Action**: `.github/workflows/update-vercel-node.yml`
   - Automatically runs on push to main
   - Uses `VERCEL_TOKEN` from GitHub secrets
   - Will update Node version automatically

3. **Updated Configuration**:
   - Root `package.json` engines set to `"node": "22.x"`
   - Client `package.json` engines set to `"node": ">=20.19.0 <=22.18.0"`
   - `.nvmrc` files created
   - Rollup native module added to dependencies

## 🚀 How It Works

### Automatic (GitHub Action)
- On next push, the GitHub Action will run
- It uses `VERCEL_TOKEN` from your GitHub secrets
- Automatically updates Vercel project to Node 22.x
- No manual intervention needed!

### Manual (If Needed)
If you want to run it manually:
```bash
$env:VERCEL_TOKEN = "your_token"
node scripts/update-vercel-node-simple.mjs
```

## 📋 Next Steps

1. **Verify GitHub Secret**: Make sure `VERCEL_TOKEN` is set in GitHub secrets
   - Go to: https://github.com/BrandonDucar/dream-net/settings/secrets/actions
   - Should have `VERCEL_TOKEN` secret

2. **Trigger Update**: 
   - The GitHub Action will run automatically on the next push
   - Or trigger manually: Actions → "Update Vercel Node Version" → Run workflow

3. **Verify**: After the action runs, check Vercel:
   - Go to project settings
   - Node.js Version should show **22.x**

## ✅ After Update

Once Node version is 22.x:
- ✅ Rollup native module will install correctly
- ✅ Build will succeed
- ✅ dreamnet.ink will deploy successfully

## Current Status

- ✅ Script created
- ✅ GitHub Action created  
- ✅ Configuration files updated
- ⏳ Waiting for GitHub Action to run (on next push or manual trigger)

**The GitHub Action will handle it automatically using your VERCEL_TOKEN secret!**

